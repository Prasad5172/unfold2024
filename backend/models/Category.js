const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  battle_id: {
    type: DataTypes.STRING(66),
    unique: true,
    references: {
      model: 'Battles',
      key: 'battle_id'  // Changed from 'id' to 'battle_id'
    }
  },
  type: {
    type: DataTypes.ENUM('regular_memes', 'dark_memes', 'celebrity_memes', 'political_memes', 'sexist_memes'),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  user_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

module.exports = Category;