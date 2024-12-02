// services/aiService.js
const OpenAI = require('openai');
const axios = require('axios');
const { BattleName } = require('../models');  // Add this import

class AIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async getIPFSImage(ipfsUrl) {
    try {
      // First get the metadata
      const metadataResponse = await axios.get(ipfsUrl);
      const metadata = metadataResponse.data;
      
      // Get image URL from metadata
      let imageUrl = metadata.image;
      if (imageUrl.startsWith('ipfs://')) {
        imageUrl = imageUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
      }

      // Get the image data
      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(imageResponse.data);
      return `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
    } catch (error) {
      console.error('Error fetching IPFS image:', error);
      throw error;
    }
  }

  async predictCategory(ipfsUrl) {
    try {
      const imageData = await this.getIPFSImage(ipfsUrl);

      const response = await this.openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "system",
            content: "You are an expert meme analyzer. Your task is to analyze meme images and categorize them into exactly one of these categories: 'regular_memes', 'dark_memes', 'celebrity_memes',  'sexist_memes' or 'political_memes'. Respond with ONLY the category name, nothing else."
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this meme and categorize it. Respond with ONLY the category name from the allowed list."
              },
              {
                type: "image",
                image_url: imageData
              }
            ]
          }
        ],
        max_tokens: 10
      });

      const category = response.choices[0].message.content.trim().toLowerCase();
      
      // Validate the category
      const validCategories = ['regular_memes', 'dark_memes', 'celebrity_memes', 'political_memes', 'sexist_memes'];
      if (!validCategories.includes(category)) {
        console.warn('Invalid category predicted:', category);
        return 'regular_memes';
      }

      return category;
    } catch (error) {
      console.error('AI Vision Error:', error);
      return 'regular_memes'; 
    }
  }

  async generateBattleName(category) {
    try {
      let isUnique = false;
      let battleName;
      let attempts = 0;
      const MAX_ATTEMPTS = 5;  // Add maximum attempts to prevent infinite loops
      
      while (!isUnique && attempts < MAX_ATTEMPTS) {
        attempts++;
        const response = await this.openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "Generate a creative, funny battle name based on the meme category. Keep it short and engaging, maximum 5 words. Make it unique and memorable."
            },
            {
              role: "user",
              content: `Generate a battle name for category: ${category} (Attempt ${attempts})`
            }
          ],
          max_tokens: 30
        });
  
        battleName = response.choices[0].message.content.trim();
  
        // Check if the battle name already exists
        const existingName = await BattleName.findOne({
          where: { name: battleName }
        });
  
        if (!existingName) {
          isUnique = true;
          // Store the new battle name
          await BattleName.create({
            name: battleName,
            category
          });
        }
      }
  
      // If we couldn't generate a unique name after MAX_ATTEMPTS, use timestamp
      if (!isUnique) {
        const timestamp = Date.now();
        battleName = `${category.toUpperCase()} BATTLE #${timestamp}`;
        await BattleName.create({
          name: battleName,
          category
        });
      }
  
      return battleName;
    } catch (error) {
      console.error('Name generation error:', error);
      const timestamp = Date.now();
      const fallbackName = `${category.toUpperCase()} BATTLE #${timestamp}`;
      
      // Store the fallback name
      await BattleName.create({
        name: fallbackName,
        category
      });
      
      return fallbackName;
    }
  }
}

module.exports = new AIService();