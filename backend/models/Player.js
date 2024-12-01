const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Player = sequelize.define('Player', {
  battle_id: {
    type: DataTypes.STRING(66),
    primaryKey: true,
    references: {
      model: 'Battles',
      key: 'battle_id'  // Changed from 'id' to 'battle_id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  votes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  registered_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = Player;