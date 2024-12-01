const { User } = require('../models');

const userController = {
  async checkWallet(req, res) {
    try {
      const { wallet_address } = req.params;
      const user = await User.findOne({ where: { wallet_address } });
      res.json({ exists: !!user, user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async register(req, res) {
    try {
      const { name, wallet_address, email } = req.body;
      const user = await User.create({ name, wallet_address, email });
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = userController;