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
CheapNFTMarketplace contract address in ropsten: 0x9BD71EA9A8Fea78787a27f0E733B74fefB02e76e

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

/approve:
- POST: Owner approves a bid
- GET: Get an approved bid

### TEST
To test core logic please run:

```bash
cd off-chain
npm run test
```
### TODOS:
 - Check correct handling of events in off chain system.
 - Check erc20 addres in end point API and accept only one contract.
