const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const memeController = require('../controllers/memeController');
const battleController = require('../controllers/battleController');

router.get('/users/wallet/:wallet_address', userController.checkWallet);
router.post('/users', userController.register);

router.get('/memes/user/:user_id', memeController.getUserMemes);
router.post('/memes', memeController.addMeme);

router.post('/battles/register', battleController.registerForBattle);
router.post('/battles/vote', battleController.voteForMeme);

module.exports = router;