const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Battle = sequelize.define('Battle', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  battle_id: {
    type: DataTypes.STRING(66),
    allowNull: false,
    unique: true
  },
  winner_user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
});

module.exports = Battle;