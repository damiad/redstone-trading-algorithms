import { ChainId, Token, Fetcher, Pair } from "@uniswap/sdk";
import { Big } from "big.js";

const precision = 40; //Total number of significant digits to return
const networkID = ChainId.MAINNET; // 1 for Ethereum mainnet
const tokenAadress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; // WETH on Ethereum mainnet
const tokenBadress = "0x6B175474E89094C44Da98b954EedeAC495271d0F"; // DAI on Ethereum mainnet
// You can find token adressess for different networks:
// Ethereum mainnet: https://etherscan.io/tokens
// Binance Smart Chain: https://bscscan.com/tokens
// Polygon (formerly Matic): https://explorer-mainnet.maticvigil.com/tokens
// Fantom: https://ftmscan.com/tokens

const tokenA: Token = new Token(networkID, tokenAadress, 18); // 18 is the number of decimals
const tokenB: Token = new Token(networkID, tokenBadress, 18); // 18 is the number of decimals
// Alternatively if you don't know decimals, you can use the Fetcher function to get the Token object
// const tokenA: Token = await Fetcher.fetchTokenData(networkID, tokenAadress);
// const tokenB: Token  = await Fetcher.fetchTokenData(networkID, tokenBadress);

const pair: Pair = await Fetcher.fetchPairData(tokenA, tokenB); // fetch pool for the pair

const tokenAreserve = pair.reserve0.toSignificant(precision); // tokenA reserve
const tokenBreserve = pair.reserve1.toSignificant(precision); // tokenB reserve
const tokenAprice = pair.priceOf(tokenA).toSignificant(precision); // price of tokenA in tokenB

console.log(`tokenA reserve: ${tokenAreserve}`);
console.log(`tokenB reserve: ${tokenBreserve}`);
console.log(`Price of tokenA in tokenB: ${tokenAprice}`);

function getLiquidity(num1: string, num2: string): Big {
  const bigNum1 = new Big(num1);
  const bigNum2 = new Big(num2);
  return bigNum1.times(bigNum2).sqrt();
}
console.log(
  `Liquidity: ${getLiquidity(tokenAreserve, tokenBreserve).toPrecision(
    precision
  )}`
);

const percentage = 10; // you can change to any number (e.g. 10 for 10%)
const transactionFee = 0.003; // 0.3% transaction fee
function amountBRequiredToIncreasePrice(
  percentage: number,
  transactionFee: number
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
if (percentage) amountBRequiredToIncreasePrice(percentage, transactionFee);
