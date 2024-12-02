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
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('regular_memes', 'dark_memes', 'celebrity_memes', 'political_memes', 'sexist_memes'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('registration', 'active', 'completed'),
    defaultValue: 'registration'
  },
  winner_user_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  registration_ends_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  battle_ends_at: {
    type: DataTypes.DATE,
    allowNull: false
  }
});

module.exports = Battle;