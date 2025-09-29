"use client"

import { useAccount, useBalance } from "wagmi"
import { useReadContract } from "wagmi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coins, Wallet, TrendingUp } from "lucide-react"
import { CONTRACT_ADDRESSES } from "@/lib/web3-config"
import { ERC20_ABI } from "@/lib/contracts"
import { formatEther } from "viem"

export function WalletInfo() {
  const { address, isConnected } = useAccount()

  // Get ZEN balance
  const { data: zenBalance } = useBalance({
    address,
  })

  // Get ZC token balance
  const { data: zcBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.ZC_TOKEN as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    enabled: !!address,
  })

  // Get ZTC token balance
  const { data: ztcBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.ZTC_TOKEN as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    enabled: !!address,
  })

  if (!isConnected || !address) {
    return (
      <Card className="game-card">
        <CardContent className="flex items-center justify-center p-6">
          <div className="text-center">
            <Wallet className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Connect your wallet to view balances</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="game-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">ZEN Balance</CardTitle>
          <Coins className="h-4 w-4 text-neon-blue" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-neon-blue">
            {zenBalance ? Number.parseFloat(formatEther(zenBalance.value)).toFixed(4) : "0.0000"}
          </div>
          <p className="text-xs text-muted-foreground">Native ZenChain token</p>
        </CardContent>
      </Card>

      <Card className="game-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">ZC Tokens</CardTitle>
          <TrendingUp className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-accent">
            {zcBalance ? Number.parseFloat(formatEther(zcBalance as bigint)).toFixed(2) : "0.00"}
          </div>
          <p className="text-xs text-muted-foreground">Game reward tokens</p>
        </CardContent>
      </Card>

      <Card className="game-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">ZTC Tokens</CardTitle>
          <Badge variant="secondary" className="text-xs">
            Trading
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gaming-gold">
            {ztcBalance ? Number.parseFloat(formatEther(ztcBalance as bigint)).toFixed(2) : "0.00"}
          </div>
          <p className="text-xs text-muted-foreground">Trading tokens</p>
        </CardContent>
      </Card>
    </div>
  )
}
