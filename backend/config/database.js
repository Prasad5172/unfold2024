// src/config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Parse the connection URL
const dbUrl = new URL(process.env.DATABASE_URL);

const sequelize = new Sequelize(dbUrl.pathname.slice(1), dbUrl.username, dbUrl.password, {
  host: dbUrl.hostname,
  port: dbUrl.port,
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: console.log // Enable logging to debug connection issues
});

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

testConnection();

module.exports = sequelize;