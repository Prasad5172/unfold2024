# Meme Battle Platform

A decentralized platform for meme battles where users can submit memes, participate in battles, and vote for their favorite memes using blockchain technology.

## Features

- **User Management**: Register and authenticate users with wallet addresses
- **Meme Management**: Upload and categorize memes using AI
- **Battle System**: Create and participate in meme battles
- **Voting System**: Vote for favorite memes using blockchain
- **Leaderboard**: Track user performance and wins
- **AI Integration**: Automatic meme categorization and battle name generation
- **Blockchain Integration**: Secure voting and battle management

## Tech Stack

### Backend
- Node.js
- Express
- Sequelize ORM
- PostgreSQL
- OpenAI API (GPT-4 Vision)
- Ethers.js

### Frontend
- React.js
- Ethers.js for Web3 integration
- Tailwind CSS for styling
- React Query for state management

### Smart Contracts
- Solidity
- Hardhat

## Prerequisites

- Node.js >= 14
- PostgreSQL
- OpenAI API Key
- Ethereum Wallet and Provider (e.g., Infura)
- MetaMask or similar Web3 wallet

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
OPENAI_API_KEY=your_openai_api_key
CONTRACT_ADDRESS=your_contract_address
PROVIDER_URL=your_ethereum_provider_url
PRIVATE_KEY=your_private_key
PORT=3000
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Prasad5172/unfold2024
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

## API Endpoints

### User Management
- `POST /api/users` - Register new user
- `GET /api/users/wallet/:wallet_address` - Check wallet existence

### Meme Management
- `POST /api/memes` - Add new meme
- `GET /api/memes/user/:user_id` - Get user's memes
- `GET /api/memes/category/:category` - Get memes by category

### Battle Management
- `GET /api/battles/live` - Get live battles
- `GET /api/battles/user/:user_id` - Get user's battles
- `GET /api/battles/wins/:user_id` - Get user's wins
- `POST /api/battles/register` - Register for battle
- `POST /api/battles/vote` - Vote for meme
- `GET /api/leaderboard` - Get global leaderboard

## Battle System

The platform runs daily battles in different categories:
- Regular Memes
- Dark Memes
- Celebrity Memes
- Political Memes

Battle Schedule:
- Registration starts: 10 AM IST
- Registration closes: 12 PM IST
- Battle ends: 8 AM IST (next day)

## Meme Categories

Memes are automatically categorized using GPT-4 Vision API into:
- Regular Memes
- Dark Memes
- Celebrity Memes
- Political Memes
- Sexist Memes (filtered)

## Smart Contract Integration

The platform uses smart contracts for:
- Battle creation and management
- Voting system
- Winner declaration
- Token staking and rewards

## Security Features

- Wallet address verification
- Transaction signing
- Rate limiting
- Input validation
- SQL injection prevention
- XSS protection

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI for GPT-4 Vision API
- Ethereum community
- IPFS for decentralized storage