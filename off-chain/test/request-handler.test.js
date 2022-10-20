import requestHandler from '../src/request-handler.js';
import Web3 from 'web3';
import dotenv from 'dotenv';
dotenv.config();

const web3 = new Web3(process.env.API_URL);

const ownerAccount = web3.eth.accounts.privateKeyToAccount(
  process.env.TEST_OWNER_PRIVATE_KEY
);
const bidderAccount = web3.eth.accounts.privateKeyToAccount(
  process.env.TEST_BIDDER_PRIVATE_KEY
);

web3.eth.accounts.wallet.add(ownerAccount);
web3.eth.accounts.wallet.add(bidderAccount);

const minPrice = 10;
const ownerAddr = ownerAccount.address;
const bidderAddr = bidderAccount.address;
const nftContractAddr = process.env.NFT_CONTRACT_ADDRESS;
const tokenId = 0;
const erc20ContractAddr = process.env.ERC20_CONTRACT_ADDRESS;
const erc20amount = 11;

test('RequestHandler list', async () => {
  let message = web3.utils.soliditySha3(ownerAddr, nftContractAddr);
  let ownerSignature = await web3.eth.sign(message, ownerAddr);

  let res = await requestHandler.createList({
    ownerAddr,
    nftContractAddr,
    tokens: [{tokenId, minPrice}],
    ownerSignature
  });

  expect(res.status).toBe(true);
  expect(res.message.getListId()).toBe(0);
  expect(res.message.getNftContractAddr()).toBe(nftContractAddr);

  res = await requestHandler.getLists();
  expect(res.status).toBe(true);
  expect(res.message.length).toBe(1);

  res = await requestHandler.getList({listId: 0});
  expect(res.status).toBe(true);
  expect(res.message.getNftContractAddr()).toBe(nftContractAddr);
  expect(res.message.getTokens().length).toBe(1);

  // Add token
  message = web3.utils.soliditySha3(0,
    {tokenId: tokenId +1, minPrice},
    ownerAddr
  );
  ownerSignature = await web3.eth.sign(message, ownerAddr);

  res = await requestHandler.addToken({listId: 0,
    token: {tokenId: tokenId +1, minPrice},
    ownerAddr,
    ownerSignature}
  );
  expect(res.status).toBe(true);

  res = await requestHandler.getList({listId: 0});
  expect(res.status).toBe(true);
  expect(res.message.getTokens().length).toBe(2);

  // Delete Token
  message = web3.utils.soliditySha3(0,
    tokenId +1,
    ownerAddr
  );
  ownerSignature = await web3.eth.sign(message, ownerAddr);

  res = await requestHandler.deleteToken({listId: 0,
    tokenId: tokenId +1,
    ownerAddr,
    ownerSignature}
  );
  expect(res.status).toBe(true);

  res = await requestHandler.getList({listId: 0});
  expect(res.status).toBe(true);
  expect(res.message.getTokens().length).toBe(1);

  // Get Token
  res = await requestHandler.getToken({listId: 0, tokenId});
  expect(res.status).toBe(true);
  expect(res.message.getId()).toBe(tokenId);
  expect(res.message.getMinPrice()).toBe(minPrice);

  // Make Bid
  message = web3.utils.soliditySha3(ownerAddr,
    bidderAddr,
    nftContractAddr,
    tokenId,
    erc20ContractAddr,
    erc20amount
  );

  const bidderSignature = await web3.eth.sign(message, bidderAddr);

  res = await requestHandler.makeBid({ownerAddr,
    bidderAddr,
    nftContractAddr,
    tokenId,
    erc20ContractAddr,
    erc20amount,
    bidderSignature
  });

  expect(res.status).toBe(true);

  res = await requestHandler.getToken({listId: 0, tokenId});
  expect(res.status).toBe(true);
  expect(res.message.getBids().length).toBe(1);
  expect(res.message.getBids()[0].getBidderAddr()).toBe(bidderAddr);

  // Approve Bid
  message = web3.utils.soliditySha3(0,
    tokenId,
    bidderAddr,
    ownerAddr
  );

  ownerSignature = await web3.eth.sign(message, ownerAddr);

  res = await requestHandler.approveBid({listId: 0,
    tokenId,
    bidderAddr,
    ownerAddr,
    ownerSignature
  });

  console.log(res.message);
  expect(res.status).toBe(true);

  res = await requestHandler.getToken({listId: 0, tokenId});
  expect(res.status).toBe(true);
  expect(res.message.getBids().length).toBe(1);
  expect(res.message.getBids()[0].getBidderAddr()).toBe(bidderAddr);
  expect(res.message.getBids()[0].getOwnerSignature()).toBe(ownerSignature);

  // TODO Get Bid, Delete Bid and Delete List
}, 30000);

