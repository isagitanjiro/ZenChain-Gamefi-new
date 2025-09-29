"use client"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sword, Coins, Target, Users, Shield, Flame, Crown, Swords, Zap, Star, Trophy, Gamepad2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function HomePage() {
  const [isConnected, setIsConnected] = useState(false)
  const [battleCount, setBattleCount] = useState(850000)
  const [activeWarriors, setActiveWarriors] = useState(12450)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setBattleCount((prev) => prev + Math.floor(Math.random() * 5))
      setActiveWarriors((prev) => prev + Math.floor(Math.random() * 3))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const nftBackgrounds = [
    "/cyberpunk-warrior-nft-with-glowing-sword.jpg",
    "/dragon-knight-nft-with-fire-effects.jpg",
    "/space-marine-nft-with-laser-weapons.jpg",
    "/ninja-assassin-nft-with-shadow-effects.jpg",
    "/mage-wizard-nft-with-magical-aura.jpg",
    "/robot-warrior-nft-with-neon-lights.jpg",
  ]

  return (
    <div className="min-h-screen battle-particles relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        {nftBackgrounds.map((bg, index) => (
          <div
            key={index}
            className={`absolute opacity-20 animate-float-${(index % 3) + 1} interactive-glow`}
            style={{
              left: `${(index * 15) % 80}%`,
              top: `${(index * 20) % 60}%`,
              animationDelay: `${index * 0.5}s`,
            }}
          >
            <img
              src={bg || "/placeholder.svg"}
              alt={`NFT Warrior ${index + 1}`}
              className="w-32 h-32 rounded-lg border border-primary/20 shadow-lg hover:scale-110 transition-transform duration-500 hover:opacity-40"
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="glass-effect sticky top-0 z-50 relative">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer hover:scale-105 transition-transform">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary glow-effect animate-pulse">
              <Swords className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold hover:text-primary transition-colors">Battle Arena</span>
          </div>
          <div className="flex items-center gap-4">
            {isConnected ? (
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-primary/20 text-primary animate-pulse-battle cursor-pointer hover:bg-primary/30 transition-colors"
                >
                  <Shield className="w-3 h-3 mr-1" />
                  Battle Ready
                </Badge>
                <div className="text-sm cursor-pointer hover:scale-105 transition-transform">
                  <div className="font-medium text-battle-gold">1,250 ZC</div>
                  <div className="text-muted-foreground">Battle Tokens</div>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => setIsConnected(true)}
                className="battle-button hover:scale-105 transition-all duration-300"
              >
                <Sword className="mr-2 h-4 w-4" />
                Enter Arena
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32 z-10">
        <div className="absolute inset-0 hero-gradient" />
        <div className="container relative">
          <div className="mx-auto max-w-4xl text-center">
            <Badge
              variant="secondary"
              className="mb-4 neon-border bg-primary/10 animate-pulse-battle cursor-pointer hover:bg-primary/20 transition-all duration-300 hover:scale-110 live-indicator"
            >
              <Flame className="mr-1 h-3 w-3" />
              Battle Arena Live
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl">
              Fight to Earn
              <span className="text-primary block animate-battle-float hover:scale-105 transition-transform cursor-pointer">
                Epic Rewards
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground text-pretty max-w-2xl mx-auto">
              Enter the ultimate combat arena where skill determines victory. Battle other warriors in real-time, climb
              the ranks, and earn legendary rewards through pure combat prowess.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/game">
                <Button size="lg" className="battle-button hover:scale-110 transition-all duration-300 group">
                  <Swords className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                  Enter Battle
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  size="lg"
                  className="neon-border bg-transparent battle-button hover:scale-110 transition-all duration-300 group"
                >
                  <Crown className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                  Hall of Fame
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 relative z-10">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card
              className="game-card text-center cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20"
              onClick={() => alert("Active Warriors: Join the battle now!")}
            >
              <CardHeader>
                <div className="text-3xl font-bold text-primary animate-pulse-battle">
                  {activeWarriors.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Users className="w-3 h-3" />
                  Active Warriors
                </div>
              </CardHeader>
            </Card>
            <Card
              className="game-card text-center cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-battle-gold/20"
              onClick={() => alert("Battle Rewards: $2.4M distributed to warriors!")}
            >
              <CardHeader>
                <div className="text-3xl font-bold text-battle-gold">$2.4M</div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Coins className="w-3 h-3" />
                  Battle Rewards
                </div>
              </CardHeader>
            </Card>
            <Card
              className="game-card text-center cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20"
              onClick={() => alert(`Battles Fought: ${battleCount.toLocaleString()} epic battles!`)}
            >
              <CardHeader>
                <div className="text-3xl font-bold text-accent">{battleCount.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Gamepad2 className="w-3 h-3" />
                  Battles Fought
                </div>
              </CardHeader>
            </Card>
            <Card
              className="game-card text-center cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-battle-red/20"
              onClick={() => alert("Victory Rate: 99.9% fair battles guaranteed!")}
            >
              <CardHeader>
                <div className="text-3xl font-bold text-battle-red">99.9%</div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Trophy className="w-3 h-3" />
                  Victory Rate
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-24 relative z-10">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl hover:text-primary transition-colors cursor-pointer">
              Combat Features
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">Master the art of battle and earn legendary rewards</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Skill-Based Combat",
                description:
                  "Your fighting skills directly determine your rewards. Master combat techniques to dominate the arena.",
                color: "text-primary",
                action: () => alert("Start training your combat skills now!"),
              },
              {
                icon: Crown,
                title: "Warrior Rankings",
                description: "Climb the global leaderboards. Daily and weekly tournaments with massive prize pools.",
                color: "text-battle-gold",
                action: () => alert("Check your current ranking!"),
              },
              {
                icon: Coins,
                title: "Battle Economy",
                description: "Earn ZC tokens from victories. Trade for rare weapons and legendary battle gear.",
                color: "text-accent",
                action: () => alert("Visit the marketplace!"),
              },
              {
                icon: Users,
                title: "Multiplayer Warfare",
                description:
                  "Battle other warriors in real-time. Form alliances or fight solo in various combat modes.",
                color: "text-neon-blue",
                action: () => alert("Find opponents to battle!"),
              },
              {
                icon: Shield,
                title: "Anti-Cheat Shield",
                description:
                  "Advanced combat verification ensures fair battles and legitimate victories for all warriors.",
                color: "text-neon-purple",
                action: () => alert("Learn about our security measures!"),
              },
              {
                icon: Flame,
                title: "Daily Conquests",
                description: "Complete daily battle quests for bonus rewards and unlock legendary achievement titles.",
                color: "text-battle-red",
                action: () => alert("View today's quests!"),
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="game-card cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-2xl group"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={feature.action}
              >
                <CardHeader>
                  <feature.icon
                    className={`h-8 w-8 ${feature.color} mb-2 transition-all duration-300 ${
                      hoveredCard === index ? "scale-125 rotate-12" : ""
                    }`}
                  />
                  <CardTitle className="group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                  <CardDescription className="group-hover:text-foreground transition-colors">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <Button
          size="icon"
          className="battle-button rounded-full w-12 h-12 hover:scale-110 transition-all duration-300"
          onClick={() => alert("Quick Battle starting!")}
        >
          <Zap className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="neon-border bg-transparent battle-button rounded-full w-12 h-12 hover:scale-110 transition-all duration-300"
          onClick={() => alert("Leaderboard opened!")}
        >
          <Star className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
