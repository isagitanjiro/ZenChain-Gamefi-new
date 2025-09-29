"use client"

import { useReadContract } from "wagmi"
import { CONTRACT_ADDRESSES } from "@/lib/web3-config"
import { GAME_REWARDS_ABI, ZC_SWAP_ABI, ERC20_ABI } from "@/lib/contracts"

export { useReadContract as useContractRead } from "wagmi"

export function useGameRewardsContract() {
  return {
    address: CONTRACT_ADDRESSES.GAME_REWARDS as `0x${string}`,
    abi: GAME_REWARDS_ABI,
  }
}

export function useZCSwapContract() {
  return {
    address: CONTRACT_ADDRESSES.ZC_SWAP as `0x${string}`,
    abi: ZC_SWAP_ABI,
  }
}

export function useZCTokenContract() {
  return {
    address: CONTRACT_ADDRESSES.ZC_TOKEN as `0x${string}`,
    abi: ERC20_ABI,
  }
}

export function useZTCTokenContract() {
  return {
    address: CONTRACT_ADDRESSES.ZTC_TOKEN as `0x${string}`,
    abi: ERC20_ABI,
  }
}

// Custom hooks for common contract reads
export function usePlayerStats(playerAddress?: `0x${string}`) {
  const gameRewards = useGameRewardsContract()

  return useReadContract({
    ...gameRewards,
    functionName: "leaderboard",
    args: playerAddress ? [playerAddress] : undefined,
    enabled: !!playerAddress,
  })
}

export function useTopPlayers(limit = 10) {
  const gameRewards = useGameRewardsContract()

  return useReadContract({
    ...gameRewards,
    functionName: "getTopPlayers",
    args: [BigInt(limit)],
  })
}

export function useSwapReserves() {
  const zcSwap = useZCSwapContract()

  return useReadContract({
    ...zcSwap,
    functionName: "getReserves",
  })
}

export function useTokenBalance(tokenAddress: `0x${string}`, userAddress?: `0x${string}`) {
  return useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: userAddress ? [userAddress] : undefined,
    enabled: !!userAddress,
  })
}
