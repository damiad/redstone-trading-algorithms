import { ethers } from "hardhat";
import { tokens } from "./constants";

async function main() {
  const provider = ethers.provider;
  const addresses = await ethers.provider.listAccounts();

  // Retrieve the balances for each token for each address
  for (const address of addresses) {
    console.log(`Balances for address ${address}:`);
    for (const { symbol, address: tokenAddress, decimals } of tokens) {
      const tokenContract = new ethers.Contract(
        tokenAddress,
        ["function balanceOf(address) view returns (uint256)"],
        provider
      );
      const balance = await tokenContract.balanceOf(address);
      console.log(`${symbol}: ${ethers.utils.formatUnits(balance, decimals)}`);
    }
    console.log("------------------");
  }
}

main().catch((error) => {
  console.error(error);
});
