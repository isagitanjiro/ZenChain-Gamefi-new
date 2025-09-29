"use client"
import { useAccount } from "wagmi"
import { ConnectWallet } from "@/components/wallet/connect-wallet"
import { NetworkStatus } from "@/components/wallet/network-status"
import { WalletInfo } from "@/components/wallet/wallet-info"
import { Leaderboard } from "@/components/dashboard/leaderboard"
import { PlayerProfile } from "@/components/dashboard/player-profile"
import { GameHistory } from "@/components/dashboard/game-history"
import { DailyChallenges } from "@/components/dashboard/daily-challenges"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GamepadIcon, Trophy, User, History, Target, Zap } from "lucide-react"

export default function DashboardPage() {
  const { isConnected } = useAccount()

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border/40 bg-background/95 backdrop-blur">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <GamepadIcon className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">ZenChain GameFi</span>
            </div>
            <ConnectWallet />
          </div>
        </header>

        <div className="container py-24">
          <Card className="game-card max-w-md mx-auto">
            <CardHeader className="text-center">
              <Trophy className="h-12 w-12 text-gaming-gold mx-auto mb-4" />
              <CardTitle>Connect to View Dashboard</CardTitle>
              <CardDescription>Connect your wallet to access your gaming dashboard and leaderboards</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ConnectWallet />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <GamepadIcon className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">ZenChain GameFi</span>
            <Badge variant="secondary" className="ml-2">
              <Zap className="mr-1 h-3 w-3" />
              Dashboard
            </Badge>
          </div>
          <ConnectWallet />
        </div>
      </header>

      <div className="container py-8">
        <NetworkStatus />
      </div>

      <div className="container pb-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Gaming Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Track your performance, compete with others, and manage your rewards
          </p>
        </div>

        <div className="mb-8">
          <WalletInfo />
        </div>

        <Tabs defaultValue="leaderboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Leaderboard</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Challenges</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="leaderboard" className="space-y-6">
            <Leaderboard />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <PlayerProfile />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <GameHistory />
          </TabsContent>

          <TabsContent value="challenges" className="space-y-6">
            <DailyChallenges />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
