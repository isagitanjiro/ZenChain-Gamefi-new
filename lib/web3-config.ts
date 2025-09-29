// lib/web3-config.ts
// Frontend-only stub to allow Vercel build

export const chains = [
  {
    id: 8408,
    name: "ZenChain Testnet",
    network: "zenchain-testnet",
    nativeCurrency: { decimals: 18, name: "ZenChain", symbol: "ZEN" },
    rpcUrls: { public: { http: ["https://zenchain-testnet.api.onfinality.io/public"] } },
    blockExplorers: { default: { name: "ZenChain Explorer", url: "https://zenchain-testnet.blockscout.com" } },
    testnet: true,
  },
]

export const wagmiConfig = {} // stub config

export const CONTRACT_ADDRESSES = {
  ZC_TOKEN: "0x0000000000000000000000000000000000000000",
  ZTC_TOKEN: "0x0000000000000000000000000000000000000000",
  GAME_REWARDS: "0x0000000000000000000000000000000000000000",
  ZC_SWAP: "0x0000000000000000000000000000000000000000",
}
