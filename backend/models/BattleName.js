const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BattleName = sequelize.define('BattleName', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  category: {
    type: DataTypes.ENUM('regular_memes', 'dark_memes', 'celebrity_memes', 'political_memes', 'sexist_memes'),
    allowNull: false
  },
  used_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = BattleName;