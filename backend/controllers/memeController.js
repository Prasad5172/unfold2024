// controllers/memeController.js
const { Meme, User } = require('../models');
const aiService = require('../services/aiAgent');
const sequelize = require('../config/database');

const memeController = {
  async addMeme(req, res) {
    const t = await sequelize.transaction();
    try {
      const { user_id, token_address, token_id, ipfs_url } = req.body;
      
      // First check if user exists
      const user = await User.findByPk(user_id);
      if (!user) {
        throw new Error('User not found');
      }

      console.log('Predicting category for meme:', ipfs_url);
      const category = await aiService.predictCategory(ipfs_url);
      console.log('Predicted category:', category);

      // Create the meme with predicted category
      const meme = await Meme.create({
        user_id,
        token_address,
        token_id,
        category
      }, { transaction: t });

      await t.commit();
      res.status(201).json({
        ...meme.toJSON(),
        predicted_category: category
      });
    } catch (error) {
      await t.rollback();
      console.error('Error creating meme:', error);
      res.status(400).json({ error: error.message });
    }
  },

  async listUserMemes(req, res) {
    try {
      const { user_id } = req.params;
      const memes = await Meme.findAll({
        where: { user_id },
        include: [{
          model: User,
          attributes: ['name', 'wallet_address']
        }],
        order: [['createdAt', 'DESC']]
      });
      res.json(memes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async listMemesByCategory(req, res) {
    try {
      const { category } = req.params;
      const memes = await Meme.findAll({
        where: { category },
        include: [{
          model: User,
          attributes: ['name', 'wallet_address']
        }],
        order: [['createdAt', 'DESC']]
      });
      res.json(memes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = memeController;