
const { ethers } = require('ethers');

const contractABI = [
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "battleId",
				"type": "bytes32"
			}
		],
		"name": "DeclareWinner",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "battleId",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "_Meme",
				"type": "address"
			}
		],
		"name": "JoinBattle",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "voter",
				"type": "address"
			},
			{
				"internalType": "bytes32",
				"name": "battleId",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "Meme",
				"type": "address"
			}
		],
		"name": "upvote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "Battles",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "participantsCount",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "Winner",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "Feereceiver",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getBattleId",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "isVoted",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "MemeJoined",
		"outputs": [
			{
				"internalType": "bool",
				"name": "isAlreadyJoined",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "userInfo",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "NoOfwins",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "NoOfBattles",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "battleId",
				"type": "bytes32"
			},
			{
				"internalType": "address",
				"name": "Meme",
				"type": "address"
			}
		],
		"name": "viewVotes",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "battleId",
				"type": "bytes32"
			}
		],
		"name": "viewWinner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
const contractAddress = "0x4754e3A1bfb71413EB557E2fcD3a1515f0822Ea8";

const provider = new ethers.JsonRpcProvider("https://base-sepolia.g.alchemy.com/v2/joXzMSVmB0-d3O0RuMuuswjKMRKvXaWb");
const wallet = new ethers.Wallet("ADD_YOUR_PRIVATE_KEY", provider);
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

module.exports = { 
    contract,
    provider,
    wallet 
};