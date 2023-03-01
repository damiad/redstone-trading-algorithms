import { ethers } from "hardhat";
export const tokens = [
  {
    symbol: "WETH",
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    decimals: 18,
  },
  {
    symbol: "DAI",
    address: "0x6b175474e89094c44da98b954eedeac495271d0f",
    decimals: 18,
  },
  {
    symbol: "USDC",
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    decimals: 6,
  },
  {
    symbol: "WBTC",
    address: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
    decimals: 8,
  },
  {
    symbol: "LINK",
    address: "0x514910771af9ca656af840dff83e8264ecf986ca",
    decimals: 18,
  },
];

export function getTokenInfo(symbol: string) {
  const token = tokens.find((t) => t.symbol === symbol);
  if (token) {
    return {
      symbol: token.symbol,
      address: ethers.utils.getAddress(token.address), //checksum address
      decimals: token.decimals,
    };
  } else {
    throw new Error(`Token with symbol ${symbol} not found`);
  }
}

export const uniswapV2Router02Address =
  "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
