// services/battleScheduler.js
const cron = require('node-cron');
const { Battle, Player, User, Meme } = require('../models');
const { contract } = require('../config/contract');
const aiService = require('./aiService');
const { Op } = require('sequelize');

class BattleScheduler {
  constructor() {
    // Start registrations at 10 AM IST (4:30 UTC)
    cron.schedule('30 4 * * *', () => this.createDailyBattles());
    
    // Close registrations at 12 PM IST (6:30 UTC)
    cron.schedule('30 6 * * *', () => this.startBattles());
    
    // End battles at 8 AM IST next day (2:30 UTC)
    cron.schedule('30 2 * * *', () => this.endBattles());
  }

  async createDailyBattles() {
    try {
      const categories = ['regular_memes', 'dark_memes', 'celebrity_memes', 'political_memes'];
      
      for (const category of categories) {
        const battle_id = await contract.getBattleId();
        const battleName = await aiService.generateBattleName(category);
        
        // Registration ends in 2 hours
        const registration_ends_at = new Date(Date.now() + 2 * 60 * 60 * 1000);
        // Battle ends in 20 hours
        const battle_ends_at = new Date(Date.now() + 20 * 60 * 60 * 1000);

        await Battle.create({
          battle_id: battle_id.toString(),
          name: battleName,
          category,
          status: 'registration',
          registration_ends_at,
          battle_ends_at
        });
      }
    } catch (error) {
      console.error('Error creating daily battles:', error);
    }
  }

  async startBattles() {
    try {
      await Battle.update(
        { status: 'active' },
        {
          where: {
            status: 'registration',
            registration_ends_at: { [Op.lte]: new Date() }
          }
        }
      );
    } catch (error) {
      console.error('Error starting battles:', error);
    }
  }

  async endBattles() {
    try {
      const battlesToEnd = await Battle.findAll({
        where: {
          status: 'active',
          battle_ends_at: { [Op.lte]: new Date() }
        }
      });

      for (const battle of battlesToEnd) {
        // Call contract to declare winner
        await contract.DeclareWinner(battle.battle_id);
        
        // Get winner from contract
        const winnerAddress = await contract.viewWinner(battle.battle_id);
        
        // Get winner's votes
        const votes = await contract.viewVotes(battle.battle_id, winnerAddress);
        
        // Update battle in database
        const winner = await User.findOne({
          where: { wallet_address: winnerAddress }
        });

        if (winner) {
          await battle.update({
            status: 'completed',
            winner_user_id: winner.id
          });

          // Update player votes
          const player = await Player.findOne({
            where: {
              battle_id: battle.battle_id,
              user_id: winner.id
            }
          });

          if (player) {
            await player.update({ votes: votes.toString() });
          }
        }
      }
    } catch (error) {
      console.error('Error ending battles:', error);
    }
  }
}

module.exports = new BattleScheduler();