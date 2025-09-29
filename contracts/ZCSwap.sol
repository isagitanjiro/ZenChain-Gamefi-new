// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ZTCToken is ERC20, Ownable {
    constructor() ERC20("ZenChain Trading Token", "ZTC") {
        _mint(msg.sender, 500000 * 10**decimals()); // 500K initial supply
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}

contract ZCSwap is Ownable, ReentrancyGuard {
    ERC20 public zcToken;
    ERC20 public ztcToken;
    
    uint256 public zcReserve;
    uint256 public ztcReserve;
    uint256 public constant MINIMUM_LIQUIDITY = 1000;
    
    struct SwapHistory {
        address user;
        uint256 zcAmount;
        uint256 ztcAmount;
        uint256 timestamp;
        bool isZcToZtc;
    }
    
    mapping(address => SwapHistory[]) public userSwapHistory;
    SwapHistory[] public allSwaps;
    
    event Swap(
        address indexed user,
        uint256 zcAmount,
        uint256 ztcAmount,
        bool isZcToZtc,
        uint256 timestamp
    );
    
    event LiquidityAdded(uint256 zcAmount, uint256 ztcAmount);
    
    constructor(address _zcToken, address _ztcToken) {
        zcToken = ERC20(_zcToken);
        ztcToken = ERC20(_ztcToken);
    }
    
    function addLiquidity(uint256 zcAmount, uint256 ztcAmount) external onlyOwner {
        require(zcAmount > 0 && ztcAmount > 0, "Invalid amounts");
        
        zcToken.transferFrom(msg.sender, address(this), zcAmount);
        ztcToken.transferFrom(msg.sender, address(this), ztcAmount);
        
        zcReserve += zcAmount;
        ztcReserve += ztcAmount;
        
        emit LiquidityAdded(zcAmount, ztcAmount);
    }
    
    function swapZcToZtc(uint256 zcAmount) external nonReentrant {
        require(zcAmount > 0, "Invalid amount");
        require(zcReserve > 0 && ztcReserve > 0, "No liquidity");
        
        uint256 ztcAmount = getZtcAmountOut(zcAmount);
        require(ztcAmount > 0, "Insufficient output amount");
        require(ztcAmount <= ztcReserve, "Insufficient ZTC liquidity");
        
        zcToken.transferFrom(msg.sender, address(this), zcAmount);
        ztcToken.transfer(msg.sender, ztcAmount);
        
        zcReserve += zcAmount;
        ztcReserve -= ztcAmount;
        
        // Record swap history
        SwapHistory memory swap = SwapHistory({
            user: msg.sender,
            zcAmount: zcAmount,
            ztcAmount: ztcAmount,
            timestamp: block.timestamp,
            isZcToZtc: true
        });
        
        userSwapHistory[msg.sender].push(swap);
        allSwaps.push(swap);
        
        emit Swap(msg.sender, zcAmount, ztcAmount, true, block.timestamp);
    }
    
    function swapZtcToZc(uint256 ztcAmount) external nonReentrant {
        require(ztcAmount > 0, "Invalid amount");
        require(zcReserve > 0 && ztcReserve > 0, "No liquidity");
        
        uint256 zcAmount = getZcAmountOut(ztcAmount);
        require(zcAmount > 0, "Insufficient output amount");
        require(zcAmount <= zcReserve, "Insufficient ZC liquidity");
        
        ztcToken.transferFrom(msg.sender, address(this), ztcAmount);
        zcToken.transfer(msg.sender, zcAmount);
        
        ztcReserve += ztcAmount;
        zcReserve -= zcAmount;
        
        // Record swap history
        SwapHistory memory swap = SwapHistory({
            user: msg.sender,
            zcAmount: zcAmount,
            ztcAmount: ztcAmount,
            timestamp: block.timestamp,
            isZcToZtc: false
        });
        
        userSwapHistory[msg.sender].push(swap);
        allSwaps.push(swap);
        
        emit Swap(msg.sender, zcAmount, ztcAmount, false, block.timestamp);
    }
    
    function getZtcAmountOut(uint256 zcAmountIn) public view returns (uint256) {
        require(zcAmountIn > 0, "Invalid input amount");
        require(zcReserve > 0 && ztcReserve > 0, "No liquidity");
        
        uint256 zcAmountInWithFee = zcAmountIn * 997; // 0.3% fee
        uint256 numerator = zcAmountInWithFee * ztcReserve;
        uint256 denominator = (zcReserve * 1000) + zcAmountInWithFee;
        
        return numerator / denominator;
    }
    
    function getZcAmountOut(uint256 ztcAmountIn) public view returns (uint256) {
        require(ztcAmountIn > 0, "Invalid input amount");
        require(zcReserve > 0 && ztcReserve > 0, "No liquidity");
        
        uint256 ztcAmountInWithFee = ztcAmountIn * 997; // 0.3% fee
        uint256 numerator = ztcAmountInWithFee * zcReserve;
        uint256 denominator = (ztcReserve * 1000) + ztcAmountInWithFee;
        
        return numerator / denominator;
    }
    
    function getUserSwapHistory(address user) external view returns (SwapHistory[] memory) {
        return userSwapHistory[user];
    }
    
    function getReserves() external view returns (uint256, uint256) {
        return (zcReserve, ztcReserve);
    }
}
