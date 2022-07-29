# NFT_Marketplace
Cheap NFT Marketplace 

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
