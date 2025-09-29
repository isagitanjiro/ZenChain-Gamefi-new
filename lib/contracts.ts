export const GAME_REWARDS_ABI = [
  "function submitGameResult(address player, uint256 score, uint256 timestamp, bytes32 sessionId, bytes signature) external",
  "function getTopPlayers(uint256 limit) external view returns (address[])",
  "function leaderboard(address player) external view returns (address player, uint256 totalScore, uint256 totalEarnings, uint256 gamesPlayed)",
  "function dailyEarnings(address player) external view returns (uint256)",
  "event GameCompleted(address indexed player, uint256 score, uint256 reward)",
  "event RewardClaimed(address indexed player, uint256 amount)",
] as const

export const ZC_SWAP_ABI = [
  "function swapZcToZtc(uint256 zcAmount) external",
  "function swapZtcToZc(uint256 ztcAmount) external",
  "function getZtcAmountOut(uint256 zcAmountIn) external view returns (uint256)",
  "function getZcAmountOut(uint256 ztcAmountIn) external view returns (uint256)",
  "function getReserves() external view returns (uint256, uint256)",
  "function getUserSwapHistory(address user) external view returns (tuple(address user, uint256 zcAmount, uint256 ztcAmount, uint256 timestamp, bool isZcToZtc)[])",
  "event Swap(address indexed user, uint256 zcAmount, uint256 ztcAmount, bool isZcToZtc, uint256 timestamp)",
] as const

export const ERC20_ABI = [
  "function balanceOf(address owner) external view returns (uint256)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function decimals() external view returns (uint8)",
  "function symbol() external view returns (string)",
  "function name() external view returns (string)",
] as const
