# NFT_Marketplace
An on-off-chain system that permit cheap NFT ERC20 transactions:
![image](https://user-images.githubusercontent.com/83707961/190624147-4f6f8a30-ad9e-4a42-a1d2-fc4a64b107a3.png)
1) Owner of the NFT approves all NFT’s to the Marketplace
2) Owner of the NFT signs to create an off-chain auction listing with a minimum price
3) Bidder approves ERC20 tokens to Marketplace
4) Bidder signs a bid for the auction
5) If owner approves the bid, signs it back and retrieve to bidder
6) Anyone with both signatures can settle the transaction
7) The owner takes the ERC20 whilst the bidder takes the NFT.
## ON-CHAIN
### TEST
To test contracts please run:

```bash
cd on-chain
npx truffle test
```
### ADDR
CheapNFTMarketplace contract address in goerli: 0xD1B5181d5BAd76aCda25Da586ce40D3E66C3f41E

## OFF-CHAIN
### API ENDPOINTS
/list:
- POST: create a new list
- DELETE: delete a created list
- GET: get a specific list (listId)

/token:
- POST: Add a token to an already created list
- DELTE: Delete a token from a specific list
- GET: Get information of an specific token

/bid:
- POST: Add or update a bid to a specific token
- DELTE: Delete a bid
- GET: Get a bid

/approve:
- POST: Owner approves a bid

### TEST
To test core logic please run:

```bash
cd off-chain
npm run test
```
### Architecture:
This projects implement clean architecture from uncle Bob:

![image](https://user-images.githubusercontent.com/83707961/197856979-58d6e81f-cae4-4590-ba19-baa0592e66ca.png)
