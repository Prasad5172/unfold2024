// controllers/battleController.js
const { Battle, Player, Category, User, Meme } = require('../models');
const sequelize = require('../config/database');
const aiService = require('../services/aiAgent');
const { contract } = require('../config/contract');
const { ethers } = require('ethers');
const cron = require('node-cron');

const battleController = {
  async registerForBattle(req, res) {
    const t = await sequelize.transaction();
    try {
      const { user_id, meme_id, wallet_address, token_address } = req.body;
      
      // Get the meme text for AI categorization
      const meme = await Meme.findByPk(meme_id);
      if (!meme) {
        throw new Error('Meme not found');
      }

      // Predict category using AI
      const predictedCategory = await aiService.predictCategory(meme.text);
      
      // Check if there's an active battle for this category
      let battle = await Battle.findOne({
        where: {
          winner_user_id: null,
          '$Category.type$': predictedCategory
        },
        include: [Category]
      });

      let battle_id;
      
      if (!battle) {
        // Get new battle ID from contract - direct call, no need for .wait()
        battle_id = await contract.getBattleId();
        console.log('Generated battle_id:', battle_id);

        // Create new battle in database
        battle = await Battle.create({
          battle_id: battle_id.toString(), // Convert to string for storage
          winner_user_id: null
        }, { transaction: t });

        await Category.create({
          battle_id: battle_id.toString(),
          type: predictedCategory,
          name: `${predictedCategory.replace('_', ' ').toUpperCase()} BATTLE`,
          user_count: 1
        }, { transaction: t });
      } else {
        battle_id = battle.battle_id;
      }

      console.log('Joining battle with ID:', battle_id);

      // Join battle in smart contract
      const joinTx = await contract.JoinBattle(
        battle_id,
        token_address
        // { value: ethers.parseEther("0.25") }
      );
      const receipt = await joinTx.wait();
      console.log('Join battle transaction receipt:', receipt);

      // Create player entry
      await Player.create({
        battle_id: battle_id.toString(),
        user_id,
        votes: 0
      }, { transaction: t });

      await t.commit();
      res.status(201).json({ 
        message: 'Successfully registered for battle',
        battle_id: battle_id.toString(),
        category: predictedCategory,
        transaction_hash: receipt.hash
      });
    } catch (error) {
      await t.rollback();
      console.error('Battle registration error:', error);
      res.status(400).json({ 
        error: error.message,
        details: error.reason || error.data?.message // Include contract error details if available
      });
    }
  },

  async voteForMeme(req, res) {
    try {
      const { battle_id, voter_address, meme_address } = req.body;
      
      // Call contract to vote
      const voteTx = await contract.upvote(voter_address, battle_id, meme_address);
      const receipt = await voteTx.wait();

      // Get updated votes from contract
      const votes = await contract.viewVotes(battle_id, meme_address);
      
      // Update votes in database
      const player = await Player.findOne({
        include: [{
          model: User,
          where: { wallet_address: meme_address }
        }],
        where: { battle_id }
      });

      if (player) {
        await player.update({ votes: votes.toString() });
      }

      res.json({ 
        message: 'Vote recorded successfully', 
        votes: votes.toString(),
        transaction_hash: receipt.hash
      });
    } catch (error) {
      console.error('Voting error:', error);
      res.status(500).json({ 
        error: error.message,
        details: error.reason || error.data?.message
      });
    }
  }
};

module.exports = battleController;