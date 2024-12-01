// scripts/initTrainingData.js
const sequelize = require('../config/database');
const { TrainingMeme } = require('../models');

const trainingData = [
  {
    text: "When you finally find the bug in your code after 4 hours",
    category: "regular_memes"
  },
  {
    text: "That moment when your coffee kicks in",
    category: "regular_memes"
  },
  {
    text: "When your code works on first try",
    category: "regular_memes"
  },
  {
    text: "Breaking news: Politicians actually keeping their promises",
    category: "political_memes"
  },
  {
    text: "Congress members trading stocks be like",
    category: "political_memes"
  },
  {
    text: "Election season: Politicians suddenly remembering voters exist",
    category: "political_memes"
  },
  {
    text: "Taylor Swift showing up at every NFL game",
    category: "celebrity_memes"
  },
  {
    text: "Leonardo DiCaprio's dating algorithm",
    category: "celebrity_memes"
  },
  {
    text: "Celebrities saying they're just like us from their mansions",
    category: "celebrity_memes"
  },
  {
    text: "When the WiFi dies and society collapses",
    category: "dark_memes"
  },
  {
    text: "Student loans following you into the afterlife",
    category: "dark_memes"
  },
  {
    text: "When life gives you lemons but takes your juicer",
    category: "dark_memes"
  }
];

async function initializeTrainingData() {
  try {
    // First authenticate the connection
    await sequelize.authenticate();
    console.log('Connected to database');

    // Create the table if it doesn't exist
    await sequelize.sync({ force: true });
    console.log('Database synchronized');

    // Insert the training data
    await TrainingMeme.bulkCreate(trainingData);
    console.log('Training data initialized successfully');

    // Exit successfully
    process.exit(0);
  } catch (error) {
    console.error('Error initializing training data:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeTrainingData();
