// src/index.js
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const sequelize = require('./config/database');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    
    await sequelize.sync({ force: false }); // CAUTION: This will drop existing tables
    console.log('Database synchronized');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();