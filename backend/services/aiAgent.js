const OpenAI = require('openai');
const { TrainingMeme } = require('../models');
require('dotenv').config();

class AIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async getSimilarTrainingMemes(text) {
    const trainingMemes = await TrainingMeme.findAll({
      order: sequelize.random(),
      limit: 20
    });

    return trainingMemes.map(meme => ({
      text: meme.text,
      category: meme.category
    }));
  }

  async predictCategory(memeText) {
    try {
      const trainingMemes = await this.getSimilarTrainingMemes(memeText);
      
      const prompt = `You are an AI expert in categorizing memes. Based on the following examples and categories, categorize the new meme text.

Categories:
- regular_memes: General humor, relatable content, everyday situations
- dark_memes: Dark humor, controversial topics
- celebrity_memes: Content about celebrities, pop culture
- political_memes: Political content, current affairs, politicians

Examples from our database:
${trainingMemes.map(meme => `Text: "${meme.text}"
Category: ${meme.category}`).join('\n\n')}

New meme text to categorize: "${memeText}"

Please respond with only one of these exact category names: regular_memes, dark_memes, celebrity_memes, political_memes
Base your decision on the text content, context, and patterns from the example memes above.`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a meme categorization expert. Respond only with the exact category name.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 20
      });

      const predictedCategory = response.choices[0].message.content.trim();
      
      // Validate the response is one of our categories
      const validCategories = ['regular_memes', 'dark_memes', 'celebrity_memes', 'political_memes'];
      if (!validCategories.includes(predictedCategory)) {
        throw new Error('Invalid category prediction');
      }

      return predictedCategory;
    } catch (error) {
      console.error('AI Prediction Error:', error);
      // Default to regular_memes if there's an error
      return 'regular_memes';
    }
  }
}

module.exports = new AIService();