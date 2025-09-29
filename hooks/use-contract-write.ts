"use client"

import { useWriteContract, useWaitForTransaction } from "wagmi"
import { useGameRewardsContract, useZCSwapContract } from "./use-contract-read"
import { toast } from "sonner"

export { useWriteContract as useContractWrite } from "wagmi"

export function useSubmitGameResult() {
  const gameRewards = useGameRewardsContract()
  const { writeContract, data: hash, isLoading, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransaction({
    hash,
  })

  const submitResult = async (
    player: `0x${string}`,
    score: bigint,
    timestamp: bigint,
    sessionId: `0x${string}`,
    signature: `0x${string}`,
  ) => {
    try {
      await writeContract({
        ...gameRewards,
        functionName: "submitGameResult",
        args: [player, score, timestamp, sessionId, signature],
      })
    } catch (err) {
      toast({
        title: "Transaction Failed",
        description: "Failed to submit game result. Please try again.",
        variant: "destructive",
      })
    }
  }

  return {
    submitResult,
    isLoading: isLoading || isConfirming,
    isSuccess,
    error,
  }
}

export function useSwapTokens() {
  const zcSwap = useZCSwapContract()
  const { writeContract, data: hash, isLoading, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransaction({
    hash,
  })

  const swapZcToZtc = async (amount: bigint) => {
    try {
      await writeContract({
        ...zcSwap,
        functionName: "swapZcToZtc",
        args: [amount],
      })
    } catch (err) {
      toast({
        title: "Swap Failed",
        description: "Failed to swap ZC to ZTC. Please try again.",
        variant: "destructive",
      })
    }
  }

  const swapZtcToZc = async (amount: bigint) => {
    try {
      await writeContract({
        ...zcSwap,
        functionName: "swapZtcToZc",
        args: [amount],
      })
    } catch (err) {
      toast({
        title: "Swap Failed",
        description: "Failed to swap ZTC to ZC. Please try again.",
        variant: "destructive",
      })
    }
  }

  return {
    swapZcToZtc,
    swapZtcToZc,
    isLoading: isLoading || isConfirming,
    isSuccess,
    error,
  }
}

export function useTokenApproval() {
  const { writeContract, data: hash, isLoading, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransaction({
    hash,
  })

  const approveToken = async (tokenAddress: `0x${string}`, spenderAddress: `0x${string}`, amount: bigint) => {
    try {
      await writeContract({
        address: tokenAddress,
        abi: [
          {
            name: "approve",
            type: "function",
            stateMutability: "nonpayable",
            inputs: [
              { name: "spender", type: "address" },
              { name: "amount", type: "uint256" },
            ],
            outputs: [{ name: "", type: "bool" }],
          },
        ],
        functionName: "approve",
        args: [spenderAddress, amount],
      })
    } catch (err) {
      toast({
        title: "Approval Failed",
        description: "Failed to approve token spending. Please try again.",
        variant: "destructive",
      })
    }
  }

  return {
    approveToken,
    isLoading: isLoading || isConfirming,
    isSuccess,
    error,
  }
}
