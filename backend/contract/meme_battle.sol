// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract MemeBattle {
    struct MemeTokens{
        address creator; 
        address Meme; 
        uint NoUpvotes; 
    }
    struct BattleDetails{
        // bytes32 battleCode; 
        uint participantsCount; 
        // MemeTokens[] Memes; 
        mapping(uint => MemeTokens) Memes; 
        mapping(address => uint) MemeId; 
        address Winner; 
    }
    struct UserDetails{
        // address creator;
        uint NoOfwins; 
        uint NoOfBattles; 
        bytes32[] battleCodes; 
    }
    struct UserBattle{
        bool isAlreadyJoined ; 
    }
    // mapping(address => mapping(address => bytes32)) public UserToBattle; 
    mapping(bytes32 => mapping (address => UserBattle)) public MemeJoined; 
    mapping(bytes32 => BattleDetails) public Battles; 
    mapping(address => UserDetails) public userInfo; 
    mapping(address => mapping(bytes32 => bool)) public isVoted; 
    address public Feereceiver; 
    constructor(){
        Feereceiver = msg.sender; 
    }
    receive() external payable{}
    function JoinBattle(bytes32 battleId,address _Meme) external payable{
        require(MemeJoined[battleId][_Meme].isAlreadyJoined == false, "already joined");
        require(msg.value >= 0.0000005 ether, "Insufficient Amount") ; 
        payable(address(this)).transfer(msg.value); 
        // payFee(0.0005 ether);
        // BattleDetails storage info = Battles[battleId]; 
        // info.participantsCount += 1; 
        // info.MemeId[_Meme] = info.participantsCount; 
        // info.Memes[info.participantsCount]= MemeTokens({creator: msg.sender,Meme: _Meme,NoUpvotes :0});
        // uint count = Battles[battleId].participantsCount; 
        Battles[battleId].participantsCount += 1; 
        uint count = Battles[battleId].participantsCount; 
        Battles[battleId].MemeId[_Meme] = Battles[battleId].participantsCount; 
        Battles[battleId].Memes[count]= MemeTokens({creator: msg.sender,Meme: _Meme,NoUpvotes :0});

        MemeJoined[battleId][_Meme].isAlreadyJoined = true; 
        userInfo[msg.sender].battleCodes.push(battleId); 
    }
    function upvote(address voter, bytes32 battleId,address Meme) external{
        require(isVoted[voter][battleId] == false,"Already voted"); 
        BattleDetails storage info = Battles[battleId]; 
        uint Id = info.MemeId[Meme]; 
        info.Memes[Id].NoUpvotes++; 
        isVoted[msg.sender][battleId] = true; 
    }
    function DeclareWinner(bytes32 battleId) external{
        //upvote Calculation needs to be done; 
        uint length = Battles[battleId].participantsCount; 
        uint Amount = 0.00000051e18 * length; 
        BattleDetails storage info = Battles[battleId]; 
        int MaxUpvotes = -99999; 
        for(uint i = 1; i<= length; i++){
            if(int(info.Memes[i].NoUpvotes) > MaxUpvotes){
                MaxUpvotes = int(info.Memes[i].NoUpvotes) ; 
                Battles[battleId].Winner = Battles[battleId].Memes[i].Meme; 
            }
        }
        payable(Battles[battleId].Winner).transfer(Amount);
    }
    function viewWinner(bytes32 battleId) external view returns(address){
        return Battles[battleId].Winner; 
    }
    function viewVotes(bytes32 battleId, address Meme) external view returns(uint){
        uint Id = Battles[battleId].MemeId[Meme]; 
        return Battles[battleId].Memes[Id].NoUpvotes; 
    }
    // function payFee(uint amount) internal{
    //     payable(address(this)).transfer(amount); 
    // }
    function getBattleId() external view returns(bytes32){
        return bytes32(keccak256(abi.encodePacked(block.timestamp))); 
    }
}