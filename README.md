# Go! Test Token

## Install

`npm i`

## Run test

`npm run test`

## Coverage

`npm run coverage`

## Deploy

_create .env-polygon_testnet before._

`npx hardhat run --network polygon_testnet scripts/deployGoToken.ts`

## Task example

`npx hardhat mint --network rinkeby --token TOKEN_ADDRESS --amount TOKEN_AMOUNT --user OWNER_ADDRESS`
