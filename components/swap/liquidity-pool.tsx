"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, DollarSign, Users, Droplets } from "lucide-react"
import { useContractRead } from "@/hooks/use-contract-read"

export function LiquidityPool() {
  // Get pool information
  const { data: poolInfo } = useContractRead({
    address: process.env.NEXT_PUBLIC_SWAP_CONTRACT_ADDRESS as `0x${string}`,
    abi: [
      {
        name: "getPoolInfo",
        type: "function",
        stateMutability: "view",
        inputs: [],
        outputs: [
          { name: "zcReserve", type: "uint256" },
          { name: "ztcReserve", type: "uint256" },
          { name: "totalLiquidity", type: "uint256" },
          { name: "feeRate", type: "uint256" },
        ],
      },
    ],
    functionName: "getPoolInfo",
  })

  // Mock data for demonstration
  const poolStats = {
    zcReserve: "125,000",
    ztcReserve: "106,250",
    totalValueLocked: "$45,230",
    volume24h: "$12,450",
    volume7d: "$89,320",
    fees24h: "$62.25",
    fees7d: "$446.60",
    apy: "12.5",
    liquidityProviders: 156,
    priceChange24h: -2.3,
    priceChange7d: 8.7,
  }

  return (
    <div className="space-y-6">
      {/* Pool Overview */}
      <Card className="bg-slate-800/50 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Droplets className="h-5 w-5 mr-2 text-blue-400" />
            ZC/ZTC Liquidity Pool
          </CardTitle>
          <CardDescription className="text-gray-300">
            Automated Market Maker pool statistics and information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Pool Composition */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">ZC Reserve</span>
                <span className="text-purple-400 font-mono">{poolStats.zcReserve}</span>
              </div>
              <Progress value={54} className="h-2" />
              <span className="text-xs text-gray-400 mt-1">54% of pool</span>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">ZTC Reserve</span>
                <span className="text-blue-400 font-mono">{poolStats.ztcReserve}</span>
              </div>
              <Progress value={46} className="h-2" />
              <span className="text-xs text-gray-400 mt-1">46% of pool</span>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-white">{poolStats.totalValueLocked}</div>
              <div className="text-sm text-gray-400">Total Value Locked</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-400">{poolStats.apy}%</div>
              <div className="text-sm text-gray-400">APY</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-400">{poolStats.liquidityProviders}</div>
              <div className="text-sm text-gray-400">LP Providers</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-400">0.3%</div>
              <div className="text-sm text-gray-400">Trading Fee</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Volume & Fees */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
              Trading Volume
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">24h Volume</span>
              <div className="text-right">
                <div className="text-white font-mono">{poolStats.volume24h}</div>
                <div className="text-sm text-green-400 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +15.2%
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">7d Volume</span>
              <div className="text-right">
                <div className="text-white font-mono">{poolStats.volume7d}</div>
                <div className="text-sm text-green-400 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8.7%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-yellow-400" />
              Fee Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">24h Fees</span>
              <div className="text-right">
                <div className="text-white font-mono">{poolStats.fees24h}</div>
                <div className="text-sm text-green-400 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.8%
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">7d Fees</span>
              <div className="text-right">
                <div className="text-white font-mono">{poolStats.fees7d}</div>
                <div className="text-sm text-green-400 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +6.4%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Price Chart Placeholder */}
      <Card className="bg-slate-800/50 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Price History</CardTitle>
          <CardDescription className="text-gray-300">ZC/ZTC exchange rate over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-slate-700/30 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-400">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Price chart coming soon</p>
              <p className="text-sm">Current rate: 1 ZC = 0.85 ZTC</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pool Information */}
      <Card className="bg-slate-800/50 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Users className="h-5 w-5 mr-2 text-purple-400" />
            Pool Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-300">
          <p>• This is an automated market maker (AMM) pool for ZC/ZTC token swaps</p>
          <p>• Trading fees are distributed proportionally to liquidity providers</p>
          <p>• Pool uses a constant product formula (x * y = k) for pricing</p>
          <p>• Slippage increases with larger trade sizes relative to pool depth</p>
          <p>• All transactions are secured by smart contracts on ZenChain testnet</p>
        </CardContent>
      </Card>
    </div>
  )
}
