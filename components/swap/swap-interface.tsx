"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowUpDown, Loader2, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

export function SwapInterface() {
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [isReversed, setIsReversed] = useState(false)
  const [slippage, setSlippage] = useState("0.5")
  const [isSwapping, setIsSwapping] = useState(false)

  const mockBalances = {
    ZC: "1,250.50",
    ZTC: "875.25",
  }

  const calculateSwapRate = (amount: string) => {
    if (!amount || isNaN(Number(amount))) return ""
    const rate = isReversed ? 1.15 : 0.87 // Mock exchange rates
    return (Number(amount) * rate).toFixed(4)
  }

  // Calculate output amount when input changes
  useEffect(() => {
    if (fromAmount) {
      const outputAmount = calculateSwapRate(fromAmount)
      setToAmount(outputAmount)
    } else {
      setToAmount("")
    }
  }, [fromAmount, isReversed])

  const handleSwap = async () => {
    if (!fromAmount || !toAmount) return

    setIsSwapping(true)

    setTimeout(() => {
      setIsSwapping(false)
      toast.success(`Successfully swapped ${fromAmount} ${fromToken} for ${toAmount} ${toToken}!`)
      setFromAmount("")
      setToAmount("")
    }, 2000)
  }

  const handleReverse = () => {
    setIsReversed(!isReversed)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  const handleMaxClick = () => {
    const balance = isReversed ? mockBalances.ZTC : mockBalances.ZC
    setFromAmount(balance.replace(",", ""))
  }

  const fromToken = isReversed ? "ZTC" : "ZC"
  const toToken = isReversed ? "ZC" : "ZTC"
  const fromBalance = isReversed ? mockBalances.ZTC : mockBalances.ZC
  const toBalance = isReversed ? mockBalances.ZC : mockBalances.ZTC

  return (
    <Card className="game-card">
      <CardHeader>
        <CardTitle className="text-primary">Battle Token Swap</CardTitle>
        <CardDescription className="text-muted-foreground">
          Exchange your battle tokens using our automated market maker
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* From Token */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-foreground">From</Label>
            <span className="text-sm text-muted-foreground">
              Balance: {fromBalance} {fromToken}
            </span>
          </div>
          <div className="relative">
            <Input
              type="number"
              placeholder="0.0"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="bg-card border-border text-foreground pr-20"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMaxClick}
                className="text-primary hover:text-primary/80 h-6 px-2 battle-button"
              >
                MAX
              </Button>
              <span className="text-foreground font-medium">{fromToken}</span>
            </div>
          </div>
        </div>

        {/* Swap Direction Button */}
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReverse}
            className="rounded-full p-2 bg-card hover:bg-card/80 border border-primary/20 battle-button"
          >
            <ArrowUpDown className="h-4 w-4 text-primary" />
          </Button>
        </div>

        {/* To Token */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-foreground">To</Label>
            <span className="text-sm text-muted-foreground">
              Balance: {toBalance} {toToken}
            </span>
          </div>
          <div className="relative">
            <Input
              type="number"
              placeholder="0.0"
              value={toAmount}
              readOnly
              className="bg-card border-border text-foreground pr-16"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <span className="text-foreground font-medium">{toToken}</span>
            </div>
          </div>
        </div>

        {/* Slippage Settings */}
        <div className="space-y-2">
          <Label className="text-foreground">Slippage Tolerance</Label>
          <div className="flex space-x-2">
            {["0.1", "0.5", "1.0"].map((value) => (
              <Button
                key={value}
                variant={slippage === value ? "default" : "outline"}
                size="sm"
                onClick={() => setSlippage(value)}
                className={
                  slippage === value
                    ? "bg-primary text-primary-foreground battle-button"
                    : "border-border text-foreground battle-button"
                }
              >
                {value}%
              </Button>
            ))}
            <Input
              type="number"
              placeholder="Custom"
              value={slippage}
              onChange={(e) => setSlippage(e.target.value)}
              className="w-20 bg-card border-border text-foreground text-center"
            />
          </div>
        </div>

        {/* Swap Details */}
        {fromAmount && toAmount && (
          <div className="bg-card/50 rounded-lg p-4 space-y-2 text-sm neon-border">
            <div className="flex justify-between text-foreground">
              <span>Rate</span>
              <span>
                1 {fromToken} = {(Number(toAmount) / Number(fromAmount)).toFixed(4)} {toToken}
              </span>
            </div>
            <div className="flex justify-between text-foreground">
              <span>Minimum Received</span>
              <span>
                {(Number(toAmount) * (1 - Number(slippage) / 100)).toFixed(4)} {toToken}
              </span>
            </div>
            <div className="flex justify-between text-foreground">
              <span>Price Impact</span>
              <span className="text-primary">{"<0.01%"}</span>
            </div>
          </div>
        )}

        {/* Swap Button */}
        <Button onClick={handleSwap} disabled={!fromAmount || !toAmount || isSwapping} className="w-full battle-button">
          {isSwapping ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Swapping...
            </>
          ) : (
            `Swap ${fromToken} for ${toToken}`
          )}
        </Button>

        {/* Warning */}
        <div className="flex items-start space-x-2 text-sm text-battle-gold bg-battle-gold/10 rounded-lg p-3 neon-border">
          <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <p>This is a demo interface. In production, make sure you have enough ETH for gas fees.</p>
        </div>
      </CardContent>
    </Card>
  )
}
