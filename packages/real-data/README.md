# Scripts for trading algorithms

> Fetching data form Uniswap v2 and finding the most efficient ways to manipulate the price.

## Table of Contents

- [General Info](#general-information)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Setup](#setup)
- [Usage](#usage)
- [Project Status](#project-status)
- [Room for Improvement](#room-for-improvement)
- [Acknowledgements](#acknowledgements)
- [Contact](#contact)

## General Information

- It is a beginning for future trading algorithms for RedStone.

## Technologies Used

- typescript - version 4.9.3
- npm - version 8.19.2
- yarn - version 1.22.19
- axios - version 1.2.0-alpha.1
- node - version v16.18.1

## Features

- Fetching liquidity data from Uniswap v2

## Setup

> Download missing components:
> npm install -g npm
> sudo npm install -g yarn.
> npm install -g typescript
> sudo apt-get install nodejs=16.18.1
> npm init -y
> npm i axios@1.2.0-alpha.1
> yarn add @uniswap/sdk
> yarn add ethers@5.4.1
> yarn add big.js @types/big.js
> yarn add @uniswap/v2-periphery

> Compare installed versions:
> node -v
> npm -v
> tsc -v
> npm list -g

## Usage

To see some liquidity data from Uniswap open terminal in folder with READ.md and run following commands:

`tsc`
`node ./built/src/uniswap-contract-fetcher.js`

## Project Status

Project is: _in Progress_

## Room for Improvement

- some trading algorithms

## Acknowledgements

- This project was inspired by [RedStone Finance](https://github.com/redstone-finance)
- This project was based on:
- [Uniswap v2](https://uniswap.org/docs/v2/)
- [Fork mainnet](https://mixbytes.io/blog/how-fork-mainnet-testing)

## Contact

Created by [@damiad](https://github.com/damiad) - feel free to contact me!
