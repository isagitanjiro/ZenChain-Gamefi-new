// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract ZCToken is ERC20, Ownable {
    constructor() ERC20("ZenChain Game Token", "ZC") {
        _mint(msg.sender, 1000000 * 10**decimals()); // 1M initial supply
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}

contract GameRewards is Ownable, ReentrancyGuard {
    using ECDSA for bytes32;

    ZCToken public zcToken;
    address public gameServer;
    
    struct GameSession {
        address player;
        uint256 score;
        uint256 timestamp;
        bool claimed;
    }
    
    struct LeaderboardEntry {
        address player;
        uint256 totalScore;
        uint256 totalEarnings;
        uint256 gamesPlayed;
    }
    
    mapping(bytes32 => GameSession) public gameSessions;
    mapping(address => LeaderboardEntry) public leaderboard;
    mapping(address => uint256) public dailyEarnings;
    mapping(address => uint256) public lastPlayDate;
    
    address[] public topPlayers;
    uint256 public constant BASE_REWARD = 10 * 10**18; // 10 ZC base reward
    uint256 public constant SCORE_MULTIPLIER = 1 * 10**15; // 0.001 ZC per score point
    uint256 public constant DAILY_BONUS = 50 * 10**18; // 50 ZC daily bonus
    
    event GameCompleted(address indexed player, uint256 score, uint256 reward);
    event RewardClaimed(address indexed player, uint256 amount);
    event DailyBonusClaimed(address indexed player, uint256 amount);
    
    constructor(address _zcToken, address _gameServer) {
        zcToken = ZCToken(_zcToken);
        gameServer = _gameServer;
    }
    
    function submitGameResult(
        address player,
        uint256 score,
        uint256 timestamp,
        bytes32 sessionId,
        bytes memory signature
    ) external {
        require(msg.sender == gameServer, "Only game server can submit results");
        require(!gameSessions[sessionId].claimed, "Session already claimed");
        
        // Verify signature from game server
        bytes32 messageHash = keccak256(abi.encodePacked(player, score, timestamp, sessionId));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        require(ethSignedMessageHash.recover(signature) == gameServer, "Invalid signature");
        
        // Calculate reward
        uint256 reward = BASE_REWARD + (score * SCORE_MULTIPLIER);
        
        // Store game session
        gameSessions[sessionId] = GameSession({
            player: player,
            score: score,
            timestamp: timestamp,
            claimed: false
        });
        
        // Update leaderboard
        updateLeaderboard(player, score, reward);
        
        // Check for daily bonus
        if (block.timestamp - lastPlayDate[player] >= 1 days) {
            reward += DAILY_BONUS;
            dailyEarnings[player] += DAILY_BONUS;
            lastPlayDate[player] = block.timestamp;
            emit DailyBonusClaimed(player, DAILY_BONUS);
        }
        
        // Mint and transfer rewards
        zcToken.mint(player, reward);
        gameSessions[sessionId].claimed = true;
        
        emit GameCompleted(player, score, reward);
        emit RewardClaimed(player, reward);
    }
    
    function updateLeaderboard(address player, uint256 score, uint256 reward) internal {
        LeaderboardEntry storage entry = leaderboard[player];
        
        if (entry.player == address(0)) {
            entry.player = player;
            topPlayers.push(player);
        }
        
        entry.totalScore += score;
        entry.totalEarnings += reward;
        entry.gamesPlayed += 1;
        
        // Sort top players (simple bubble sort for small arrays)
        for (uint i = 0; i < topPlayers.length - 1; i++) {
            for (uint j = 0; j < topPlayers.length - i - 1; j++) {
                if (leaderboard[topPlayers[j]].totalScore < leaderboard[topPlayers[j + 1]].totalScore) {
                    address temp = topPlayers[j];
                    topPlayers[j] = topPlayers[j + 1];
                    topPlayers[j + 1] = temp;
                }
            }
        }
    }
    
    function getTopPlayers(uint256 limit) external view returns (address[] memory) {
        uint256 length = limit > topPlayers.length ? topPlayers.length : limit;
        address[] memory result = new address[](length);
        
        for (uint256 i = 0; i < length; i++) {
            result[i] = topPlayers[i];
        }
        
        return result;
    }
    
    function setGameServer(address _gameServer) external onlyOwner {
        gameServer = _gameServer;
    }
}
