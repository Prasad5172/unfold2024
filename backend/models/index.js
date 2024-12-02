const User = require('./User');
const Meme = require('./Meme');
const Battle = require('./Battle');
const Player = require('./Player');
const Category = require('./Category');
const BattleName = require('./BattleName');

// Define relationships
User.hasMany(Meme, { foreignKey: 'user_id' });
Meme.belongsTo(User, { foreignKey: 'user_id' });

Battle.belongsTo(User, { foreignKey: 'winner_user_id' });
User.hasMany(Battle, { foreignKey: 'winner_user_id' });

Battle.hasMany(Player, { foreignKey: 'battle_id', sourceKey: 'battle_id' });
Player.belongsTo(Battle, { foreignKey: 'battle_id', targetKey: 'battle_id' });

User.hasMany(Player, { foreignKey: 'user_id' });
Player.belongsTo(User, { foreignKey: 'user_id' });

Battle.hasOne(Category, { foreignKey: 'battle_id', sourceKey: 'battle_id' });
Category.belongsTo(Battle, { foreignKey: 'battle_id', targetKey: 'battle_id' });

User.hasMany(Battle, { 
  foreignKey: 'winner_user_id',
  as: 'winner_battles'  // Add this alias
});

Battle.belongsTo(User, { 
  foreignKey: 'winner_user_id',
  as: 'winner'  // Add this alias
});

module.exports = {
  User,
  Meme,
  Battle,
  Player,
  Category,
  BattleName
};