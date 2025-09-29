"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Search, Filter } from "lucide-react"
import { useAccount } from "wagmi"

interface SwapTransaction {
  id: string
  timestamp: Date
  fromToken: string
  toToken: string
  fromAmount: string
  toAmount: string
  rate: string
  txHash: string
  status: "completed" | "pending" | "failed"
  gasUsed: string
}

export function SwapHistory() {
  const { address } = useAccount()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterToken, setFilterToken] = useState("all")

  // Mock data - in real app, fetch from blockchain/API
  const swapHistory: SwapTransaction[] = [
    {
      id: "1",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      fromToken: "ZC",
      toToken: "ZTC",
      fromAmount: "150.0",
      toAmount: "127.5",
      rate: "0.85",
      txHash: "0x1234...5678",
      status: "completed",
      gasUsed: "0.002",
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      fromToken: "ZTC",
      toToken: "ZC",
      fromAmount: "50.0",
      toAmount: "58.8",
      rate: "1.176",
      txHash: "0x2345...6789",
      status: "completed",
      gasUsed: "0.0018",
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      fromToken: "ZC",
      toToken: "ZTC",
      fromAmount: "300.0",
      toAmount: "255.0",
      rate: "0.85",
      txHash: "0x3456...7890",
      status: "completed",
      gasUsed: "0.0025",
    },
    {
      id: "4",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      fromToken: "ZC",
      toToken: "ZTC",
      fromAmount: "75.0",
      toAmount: "63.75",
      rate: "0.85",
      txHash: "0x4567...8901",
      status: "failed",
      gasUsed: "0.001",
    },
  ]

  const filteredHistory = swapHistory.filter((tx) => {
    const matchesSearch =
      tx.txHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.fromToken.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.toToken.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === "all" || tx.status === filterStatus
    const matchesToken = filterToken === "all" || tx.fromToken === filterToken || tx.toToken === filterToken

    return matchesSearch && matchesStatus && matchesToken
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "failed":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const formatDate = (date: Date) => {
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    )
  }

  return (
    <Card className="bg-slate-800/50 border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-white">Swap History</CardTitle>
        <CardDescription className="text-gray-300">View all your token swap transactions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by transaction hash or token..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-700/50 border-slate-600 text-white"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-32 bg-slate-700/50 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterToken} onValueChange={setFilterToken}>
            <SelectTrigger className="w-full sm:w-32 bg-slate-700/50 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="all">All Tokens</SelectItem>
              <SelectItem value="ZC">ZC</SelectItem>
              <SelectItem value="ZTC">ZTC</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Transaction List */}
        <div className="space-y-4">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No transactions found matching your filters</p>
            </div>
          ) : (
            filteredHistory.map((tx) => (
              <div
                key={tx.id}
                className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50 hover:border-purple-500/30 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(tx.status)}>
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </Badge>
                      <span className="text-sm text-gray-400">{formatDate(tx.timestamp)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-white">
                      <span className="font-mono">
                        {tx.fromAmount} {tx.fromToken}
                      </span>
                      <span className="text-gray-400">→</span>
                      <span className="font-mono">
                        {tx.toAmount} {tx.toToken}
                      </span>
                      <span className="text-sm text-gray-400">
                        @ {tx.rate} {tx.toToken}/{tx.fromToken}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>Gas: {tx.gasUsed} ETH</span>
                      <span>Hash: {tx.txHash}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-purple-400 hover:text-purple-300"
                    onClick={() => window.open(`https://explorer.zenchain.io/tx/${tx.txHash}`, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-600/50">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{filteredHistory.length}</div>
            <div className="text-sm text-gray-400">Total Swaps</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {filteredHistory.filter((tx) => tx.status === "completed").length}
            </div>
            <div className="text-sm text-gray-400">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {filteredHistory.filter((tx) => tx.status === "pending").length}
            </div>
            <div className="text-sm text-gray-400">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">
              {filteredHistory.filter((tx) => tx.status === "failed").length}
            </div>
            <div className="text-sm text-gray-400">Failed</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
