import { ethers } from "hardhat";
import { Signer } from "@ethersproject/abstract-signer";
import { abi } from "@uniswap/v2-periphery/build/IUniswapV2Router02.json";
import { getTokenInfo, uniswapV2Router02Address } from "./constants";

const tokenSymbol = "WETH"; // we can change this to any token symbol
const amount = ethers.utils.parseEther("100"); // amount to transfer
const tokenAadress = getTokenInfo(tokenSymbol).address;

async function main() {
  const [receiver, deployer] = await ethers.getSigners();
  console.log("Receiver address:", receiver.address);
  console.log("Deployer address:", deployer.address);
  // Deployer mints and sends tokens to receiver
  const mintABI = ["function mint() payable"];
  const mintContract = new ethers.Contract(tokenAadress, mintABI, deployer);
  await mintContract.connect(deployer).mint({ value: amount });
  await mintContract.connect(deployer).transfer(receiver, amount);
  // Approve the Uniswap router to spend
  const uniswapRouter = new ethers.Contract(
    uniswapV2Router02Address,
    abi,
    receiver
  );
  const approveTx = await mintContract
    .connect(receiver)
    .approve(uniswapRouter.address, ethers.constants.MaxUint256);
  await approveTx.wait();
}

main().catch((error) => console.error(error));

//   const transferTx = await mintContract
//     .connect(receiver)
//     .transfer(receiver.address, amount);
//   await transferTx.wait();
// Add liquidity to WETH/DAI pool with 9999 WETH and 10000 DAI
// const DAI_ADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f";
// const amountIn = ethers.utils.parseEther("9999");
// const amountOutMinimum = ethers.utils.parseUnits("10000", 18);
// const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now
// const to = receiver.address;
// const tx = await uniswapRouter
//   .connect(receiver)
//   .addLiquidityETH(
//     DAI_ADDRESS,
//     amountOutMinimum,
//     amountOutMinimum,
//     amountIn,
//     to,
//     deadline,
//     { value: amountIn }
//   );
// console.log(`Transaction hash: ${tx.hash}`);
