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
import IUniswapV2Router02 from "@uniswap/v2-periphery/build/IUniswapV2Router02.json";
import { Big } from "big.js";
import { Contract } from "ethers";
import { exit } from "process";

const tokenAadress = "0x6B175474E89094C44Da98b954EedeAC495271d0F"; // DAI on Ethereum mainnet
const tokenBadress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; // WETH on Ethereum mainnet
const uniswapV2RouterAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"; // Uniswap v2 router address
const amountIn = "1000000000000000000"; //18 decimals
const gasLimit = 1000000;

async function enoughResources(tokenContract: Contract, owner: string) {
  //checks ETH balance for gas
  const provider = ethers.provider;
  const gasPrice = await provider.getGasPrice();
  const gasCost = gasPrice.mul(gasLimit);
  const gasBalance = await provider.getBalance(owner);
  if (gasBalance.lt(gasCost)) {
    console.log(
      "gasBalance is: ",
      gasBalance.toString(),
      "gasCost is: ",
      gasCost.toString()
    );
    console.log("Not enough ETH for gas");
    process.exit(1);
  }

  //checks token balance
  const balance = await tokenContract.balanceOf(owner);
  const bigBalance = new Big(balance.toString());
  const bigAmountIn = new Big(amountIn);
  if (bigBalance < bigAmountIn) {
    console.log(
      "balance is: ",
      balance.toString(),
      "required amount is: ",
      amountIn
    );
    console.log("Not enough tokens to swap");
    process.exit(1);
  }
}

async function approveTransaction(tokenToSpent: Token, owner: string) {
  const tokenContract = new ethers.Contract(
    tokenToSpent.address,
    [
      "function approve(address spender, uint256 amount) public returns (bool)",
      "function balanceOf(address account) public view returns (uint256)",
    ],
    ethers.provider.getSigner()
  );

  await enoughResources(tokenContract, owner);

  const approvalTx = await tokenContract.approve(
    uniswapV2RouterAddress,
    amountIn,
    { gasLimit: gasLimit }
  );
  console.log(`Approval transaction hash: ${approvalTx.hash}`);
}

async function main() {
  const provider = ethers.provider;
  const networkID = config.networks.hardhat.chainId; // 31337 for hardhat testing

  const tokenA: Token = new Token(networkID, tokenAadress, 18); // 18 is the number of decimals
  const tokenB: Token = new Token(networkID, tokenBadress, 18); // 18 is the number of decimals
  const pair: Pair = await Fetcher.fetchPairData(tokenA, tokenB, provider); // fetch pool for the pair using the Hardhat provider

  const route = new Route([pair], tokenB);

  const trade = new Trade(
    route,
    new TokenAmount(tokenB, amountIn),
    TradeType.EXACT_INPUT
  );

  const deadline = Math.floor(Date.now() / 1000) + 60 * 1; // 1 minute from the current Unix time
  const path = [tokenB.address, tokenA.address];

  const [owner] = await ethers.provider.listAccounts();
  const to = owner; // use the first wallet from the list

  const uniswapV2Router = await ethers.getContractAt(
    IUniswapV2Router02.abi,
    uniswapV2RouterAddress
  );

  const slippageTolerance = new Percent("1000", "10000"); // 10% slippage tolerance
  const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw;

  await approveTransaction(tokenB, owner);

  try {
    const tx = await uniswapV2Router.swapExactTokensForTokens(
      trade.inputAmount.raw.toString(),
      amountOutMin.toString(),
      path,
      to,
      deadline,
      { gasLimit: gasLimit }
    );
    console.log(`Transaction hash: ${tx.hash}`);
  } catch (error) {
    console.log(`Transaction failed with error: ${error.message}`);
  }
}

main().catch((error) => {
  console.error(error);
});
