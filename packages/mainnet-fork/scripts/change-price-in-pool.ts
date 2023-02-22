import { ethers } from "hardhat";
import {
  Pair,
  Token,
  Fetcher,
  Route,
  Trade,
  TokenAmount,
  TradeType,
  Percent,
} from "@uniswap/sdk";
import config from "../hardhat.config";

const tokenAadress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; // WETH on Ethereum mainnet
const tokenBadress = "0x6B175474E89094C44Da98b954EedeAC495271d0F"; // DAI on Ethereum mainnet
const uniswapV2RouterAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"; // Uniswap v2 router address
const amountIn = "4429375206869451436485177876632446640558"; //18 decimals

async function main() {
  const provider = ethers.provider;
  const networkID = config.networks.hardhat.chainId; // 31337 for hardhat testing

  const tokenA: Token = new Token(networkID, tokenAadress, 18); // 18 is the number of decimals
  const tokenB: Token = new Token(networkID, tokenBadress, 18); // 18 is the number of decimals
  const pair: Pair = await Fetcher.fetchPairData(tokenA, tokenB, provider); // fetch pool for the pair using the Hardhat provider

  const route = new Route([pair], tokenA);

  const trade = new Trade(
    route,
    new TokenAmount(tokenA, amountIn),
    TradeType.EXACT_INPUT
  );

  const deadline = Math.floor(Date.now() / 1000) + 60 * 1; // 1 minute from the current Unix time
  const path = [tokenA.address, tokenB.address];

  const [owner] = await ethers.provider.listAccounts();
  const to = owner; // use the first wallet from the list

  const [signer] = await ethers.getSigners();
  const uniswapV2Router = await ethers.getContractAt(
    "IUniswapV2Router02",
    uniswapV2RouterAddress
  );

  const slippageTolerance = new Percent("1", "10000"); // 0.01% slippage tolerance
  const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw;

  const tx = await uniswapV2Router.swapExactTokensForTokens(
    trade.inputAmount.raw.toString(),
    amountOutMin.toString(),
    path,
    to,
    deadline,
    { gasLimit: 1000000 }
  );
  console.log(`Transaction hash: ${tx.hash}`);
}

main().catch((error) => {
  console.error(error);
});
