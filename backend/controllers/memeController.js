const { Meme } = require('../models');

const memeController = {
  async getUserMemes(req, res) {
    try {
      const { user_id } = req.params;
      const memes = await Meme.findAll({ where: { user_id } });
      res.json(memes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async addMeme(req, res) {
    try {
      const { user_id, token_address, token_id, text } = req.body;
      const meme = await Meme.create({ user_id, token_address, token_id, text });
      res.status(201).json(meme);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = memeController;