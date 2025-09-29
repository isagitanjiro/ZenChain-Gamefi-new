"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpDown, Coins, TrendingUp, History, Info } from "lucide-react"
import { ConnectWallet } from "@/components/wallet/connect-wallet"
import { WalletInfo } from "@/components/wallet/wallet-info"
import { useAccount } from "wagmi"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SwapInterface } from "@/components/swap/swap-interface"
import { SwapHistory } from "@/components/swap/swap-history"
import { LiquidityPool } from "@/components/swap/liquidity-pool"

export default function SwapPage() {
  const { isConnected } = useAccount()

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
            <div className="text-center space-y-4">
              <Coins className="h-16 w-16 text-purple-400 mx-auto" />
              <h1 className="text-4xl font-bold text-white">Token Swap</h1>
              <p className="text-gray-300 max-w-md">
                Connect your wallet to swap ZC tokens for ZTC and participate in the GameFi economy
              </p>
            </div>
            <ConnectWallet />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Token Swap</h1>
            <p className="text-gray-300">Exchange your earned ZC tokens for ZTC</p>
          </div>
          <WalletInfo />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Swap Interface */}
          <div className="xl:col-span-2">
            <Tabs defaultValue="swap" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-purple-500/20">
                <TabsTrigger value="swap" className="data-[state=active]:bg-purple-600">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Swap
                </TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-purple-600">
                  <History className="h-4 w-4 mr-2" />
                  History
                </TabsTrigger>
                <TabsTrigger value="pool" className="data-[state=active]:bg-purple-600">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Pool Info
                </TabsTrigger>
              </TabsList>

              <TabsContent value="swap">
                <SwapInterface />
              </TabsContent>

              <TabsContent value="history">
                <SwapHistory />
              </TabsContent>

              <TabsContent value="pool">
                <LiquidityPool />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Swap Stats */}
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-purple-400" />
                  Swap Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-300">Current Rate</span>
                  <span className="text-white font-mono">1 ZC = 0.85 ZTC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">24h Volume</span>
                  <span className="text-white font-mono">12,450 ZC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Total Swapped</span>
                  <span className="text-white font-mono">156,789 ZC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Pool TVL</span>
                  <span className="text-white font-mono">$45,230</span>
                </div>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Info className="h-5 w-5 mr-2 text-blue-400" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-300">
                <p>• Earn ZC tokens by playing games and completing challenges</p>
                <p>• Swap ZC for ZTC using our automated market maker</p>
                <p>• ZTC can be used for premium features and governance</p>
                <p>• All swaps are secured by smart contracts on ZenChain</p>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-slate-800/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Recent Swaps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { amount: "150 ZC", rate: "0.85", time: "2m ago" },
                  { amount: "75 ZC", rate: "0.84", time: "5m ago" },
                  { amount: "300 ZC", rate: "0.86", time: "8m ago" },
                ].map((swap, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="text-gray-300">{swap.amount}</span>
                    <span className="text-purple-400">@{swap.rate}</span>
                    <span className="text-gray-500">{swap.time}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
