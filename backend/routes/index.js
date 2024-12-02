// routes/index.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const memeController = require('../controllers/memeController');
const battleController = require('../controllers/battleController');

// User routes
router.post('/users', userController.register);
router.get('/users/wallet/:wallet_address', userController.checkWallet);

// Meme routes 
router.post('/memes', memeController.addMeme);
router.get('/memes/user/:user_id', memeController.listUserMemes);
router.get('/memes/category/:category', memeController.listMemesByCategory);

// Battle routes
router.get('/battles/live', battleController.getLiveBattles);
router.get('/battles/user/:user_id', battleController.getUserBattles);
router.get('/battles/wins/:user_id', battleController.getUserWins);
router.get('/leaderboard', battleController.getLeaderboard);
router.post('/battles/register', battleController.registerForBattle);
router.post('/battles/vote', battleController.voteForMeme);

module.exports = router;