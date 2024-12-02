// controllers/battleController.js
const { Battle, Player, Category, User, Meme } = require('../models');
const aiService = require('../services/aiAgent');
const { contract } = require('../config/contract');
const { ethers } = require('ethers');
const sequelize = require('../config/database');

const battleController = {
  async getLiveBattles(req, res) {
    try {
      const battles = await Battle.findAll({
        where: {
          winner_user_id: null
        },
        include: [{
          model: Player,
          include: [{
            model: User,
            attributes: ['name', 'wallet_address']
          }]
        }, {
          model: Category
        }],
        order: [['createdAt', 'DESC']]
      });
      res.json(battles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getUserBattles(req, res) {
    try {
      const { user_id } = req.params;
      const battles = await Battle.findAll({
        include: [{
          model: Player,
          where: { user_id },
          required: true,
          include: [{
            model: User,
            attributes: ['name', 'wallet_address']
          }]
        }, {
          model: Category
        }],
        order: [['createdAt', 'DESC']]
      });
      res.json(battles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getUserWins(req, res) {
    try {
      const { user_id } = req.params;
      const battles = await Battle.findAll({
        where: { winner_user_id: user_id },
        include: [{
          model: Player,
          include: [{
            model: User,
            attributes: ['name', 'wallet_address']
          }]
        }, {
          model: Category
        }],
        order: [['createdAt', 'DESC']]
      });
      res.json(battles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getLeaderboard(req, res) {
    try {
      const leaderboard = await User.findAll({
        attributes: [
          'id',
          'name',
          'wallet_address',
          [sequelize.fn('COUNT', sequelize.col('winner_battles.id')), 'wins']
        ],
        include: [{
          model: Battle,
          as: 'winner_battles',  // Add this alias
          attributes: [],
          required: false  // Use LEFT JOIN instead of INNER JOIN
        }],
        group: ['User.id', 'User.name', 'User.wallet_address'],
        order: [[sequelize.literal('wins'), 'DESC']],
        limit: 100
      });
  
      // Format the response
      const formattedLeaderboard = leaderboard.map(user => ({
        id: user.id,
        name: user.name,
        wallet_address: user.wallet_address,
        wins: parseInt(user.getDataValue('wins'), 10) || 0
      }));
  
      res.json(formattedLeaderboard);
    } catch (error) {
      console.error('Leaderboard error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // In battleController.js, update the registerForBattle function:

async registerForBattle(req, res) {
  const t = await sequelize.transaction();
  try {
    const { user_id, meme_id, wallet_address, token_address } = req.body;
    
    console.log('Looking for meme with ID:', meme_id);
    
    const meme = await Meme.findOne({
      where: { id: meme_id },
      logging: console.log 
    });

    if (!meme) {
      throw new Error('Meme not found');
    }

    // Check if there's an active battle
    let battle = await Battle.findOne({
      where: {
        winner_user_id: null,
        status: 'registration'
      },
      include: [Category]
    });

    let battle_id;
    
    if (!battle) {
      console.log('Creating new battle...');
      battle_id = await contract.getBattleId();
      console.log('Generated battle_id:', battle_id);
      const battleName = await aiService.generateBattleName(meme.category);

      // Set registration end time to 2 hours from now
      const registration_ends_at = new Date(Date.now() + 2 * 60 * 60 * 1000);
      // Set battle end time to 24 hours from now
      const battle_ends_at = new Date(Date.now() + 24 * 60 * 60 * 1000);

      battle = await Battle.create({
        battle_id: battle_id.toString(),
        name: battleName,
        category: meme.category, // Use meme's category
        status: 'registration',
        registration_ends_at,
        battle_ends_at,
        winner_user_id: null
      }, { transaction: t });

      await Category.create({
        battle_id: battle_id.toString(),
        type: meme.category,
        name: battleName,
        user_count: 1
      }, { transaction: t });
    } else {
      battle_id = battle.battle_id;
      console.log('Joining existing battle:', battle_id);
      // Increment user count
      await Category.increment('user_count', {
        where: { battle_id },
        transaction: t
      });
    }

    // Create player entry
    await Player.create({
      battle_id: battle_id.toString(),
      user_id,
      votes: 0
    }, { transaction: t });

    console.log('Joining battle on contract...');
    // Join battle in smart contract
    const joinTx = await contract.JoinBattle(
      battle_id,
      token_address
      // { value: ethers.parseEther("0.25") }
    );
    const receipt = await joinTx.wait();
    console.log('Join battle transaction receipt:', receipt);

    await t.commit();
    res.status(201).json({ 
      message: 'Successfully registered for battle',
      battle_id: battle_id.toString(),
      battle_name: battle.name,
      transaction_hash: receipt.hash
    });
  } catch (error) {
    await t.rollback();
    console.error('Battle registration error:', error);
    res.status(400).json({ 
      error: error.message,
      details: error.reason || error.data?.message
    });
  }
},

async voteForMeme(req, res) {
  try {
    const { battle_id, voter_address, meme_address } = req.body;
    
    // First verify the battle exists
    const battle = await Battle.findOne({
      where: { battle_id: battle_id }
    });

    if (!battle) {
      return res.status(404).json({ error: 'Battle not found' });
    }

    try {
      // Verify addresses are valid
      if (!ethers.isAddress(voter_address) || !ethers.isAddress(meme_address)) {
        return res.status(400).json({ error: 'Invalid Ethereum address format' });
      }

      console.log('Voting with parameters:', {
        battle_id,
        voter_address,
        meme_address
      });

      // Call contract to vote
      const voteTx = await contract.upvote(
        voter_address,
        battle_id,
        meme_address,
        { gasLimit: 200000 } // Add reasonable gas limit
      );

      console.log('Vote transaction submitted:', voteTx.hash);
      
      const receipt = await voteTx.wait();
      console.log('Vote transaction confirmed:', receipt);

      // Get updated votes from contract
      const votes = await contract.viewVotes(battle_id, meme_address);
      console.log('Updated votes:', votes.toString());
      
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
        console.log('Database updated for player:', player.id);
      }

      res.json({ 
        message: 'Vote recorded successfully', 
        votes: votes.toString(),
        transaction_hash: receipt.hash
      });
    } catch (error) {
      console.error('Contract interaction error:', error);
      
      if (error.code === 'INVALID_ARGUMENT') {
        return res.status(400).json({
          error: 'Invalid argument',
          details: error.message
        });
      }

      if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
        return res.status(400).json({
          error: 'Transaction would fail',
          details: 'The transaction would fail. This might be due to invalid parameters or insufficient gas.'
        });
      }

      throw error;
    }
  } catch (error) {
    console.error('Voting error:', error);
    res.status(500).json({ 
      error: error.message,
      details: error.reason || error.data?.message,
      code: error.code
    });
  }
},

  async endBattle(battle_id) {
    const t = await sequelize.transaction();
    try {
      // Call contract to declare winner
      const declareTx = await contract.DeclareWinner(battle_id);
      await declareTx.wait();

      // Get winner from contract
      const winnerAddress = await contract.viewWinner(battle_id);
      
      // Get winner's votes
      const votes = await contract.viewVotes(battle_id, winnerAddress);
      
      // Update battle in database
      const winner = await User.findOne({
        where: { wallet_address: winnerAddress }
      });

      if (winner) {
        await Battle.update(
          { winner_user_id: winner.id },
          { 
            where: { battle_id },
            transaction: t 
          }
        );

        // Update player votes
        const player = await Player.findOne({
          where: {
            battle_id,
            user_id: winner.id
          }
        });

        if (player) {
          await player.update(
            { votes: votes.toString() },
            { transaction: t }
          );
        }
      }

      await t.commit();
      return true;
    } catch (error) {
      await t.rollback();
      console.error('Error ending battle:', error);
      return false;
    }
  }
};

module.exports = battleController;