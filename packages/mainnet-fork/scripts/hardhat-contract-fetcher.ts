import { Token, Fetcher, Pair } from "@uniswap/sdk";
import { Big } from "big.js";
import { ethers } from "hardhat";
import config from "../hardhat.config";
import { getTokenInfo } from "./constants";

const precision = 40; // Total number of significant digits to return
const tokenAsymbol = "DAI"; // we can change this to any token symbol
const tokenBsymbol = "WETH"; // we can change this to any token symbol
const percentage = 10; // you can change to any number (e.g. 10 for 10%), 0 if you want to skip this function
const transactionFee = 0.003; // 0.3% transaction fee

const tokenAInfo = getTokenInfo(tokenAsymbol);
const tokenBInfo = getTokenInfo(tokenBsymbol);

function getLiquidity(num1: string, num2: string): Big {
  const bigNum1 = new Big(num1);
  const bigNum2 = new Big(num2);
  return bigNum1.times(bigNum2).sqrt();
}

function amountBRequiredToIncreasePrice(
  percentage: number,
  transactionFee: number,
  tokenAreserve: string,
  tokenBreserve: string,
  tokenAprice: string
): void {
  const bigPercentage = new Big(1 + percentage / 100).sqrt().minus(1);
  const bigTransactionFee = new Big(1 / (1 - transactionFee));
  const liquidity = getLiquidity(tokenAreserve, tokenBreserve);
  const sqrtPrice = new Big(tokenAprice).sqrt();
  const result = bigPercentage
    .times(sqrtPrice)
    .times(liquidity)
    .times(bigTransactionFee);
  console.log(
    `Amount of tokenB required to increasee price by ${percentage}%: ${result.toPrecision(
      precision
    )}`
  );
}

const main = async () => {
  const provider = ethers.provider;
  const networkID = config.networks.hardhat.chainId; // 31337 for hardhat testing

  const tokenA: Token = new Token(
    networkID,
    tokenAInfo.address,
    tokenAInfo.decimals
  );
  const tokenB: Token = new Token(
    networkID,
    tokenBInfo.address,
    tokenBInfo.decimals
  );
  const pair: Pair = await Fetcher.fetchPairData(tokenA, tokenB, provider); // fetch pool for the pair using the Hardhat provider
  const tokenAreserve = pair.reserve0.toSignificant(precision); // tokenA reserve
  const tokenBreserve = pair.reserve1.toSignificant(precision); // tokenB reserve
  const tokenAprice = pair.priceOf(tokenA).toSignificant(precision); // price of tokenA in tokenB

  console.log(`tokenA reserve: ${tokenAreserve}`);
  console.log(`tokenB reserve: ${tokenBreserve}`);
  console.log(
    `Price of tokenA in tokenB: ${pair
      .priceOf(tokenA)
      .toSignificant(precision)}`
  );
  console.log(
    `Liquidity: ${getLiquidity(tokenAreserve, tokenBreserve).toPrecision(
      precision
    )}`
  );
  if (percentage)
    amountBRequiredToIncreasePrice(
      percentage,
      transactionFee,
      tokenAreserve,
      tokenBreserve,
      tokenAprice
    );
};

main().catch((error) => {
  console.error(error);
});
