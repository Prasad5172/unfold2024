const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TrainingMeme = sequelize.define('TrainingMeme', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('regular_memes', 'dark_memes', 'celebrity_memes', 'political_memes'),
    allowNull: false
  }
});

module.exports = TrainingMeme;
