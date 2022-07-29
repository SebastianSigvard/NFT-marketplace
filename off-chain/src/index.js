import AuctionManager from './core/auction_manager.js';
import bodyParser from 'body-parser';
import Checker from './checker.js';
import logger from './logger.js';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import Web3 from 'web3';
import fs from 'fs';
dotenv.config();

// Inits checker and auctionManager
const checker = new Checker();
const autctionManager = new AuctionManager(checker);

// Start web3
const web3 = new Web3(process.env.API_URL);

// Create market contract handler
const contractAbi = JSON.parse(fs.readFileSync(process.env.MARKET_ABI)).abi;
const contractAddress = process.env.MARKET_CON_ADDR;

const marketContract = new web3.eth.Contract(contractAbi, contractAddress);

// Listen for Transaction Executed to delete executed transactions from auction manager
marketContract.getPastEvents('TransactionExecuted', {fromBlock: 'earliest'}, (err, event) => {
  if (err) {
    logger.error(err);
    return;
  }

  event.forEach( (event) => {
    logger.debug(event.returnValues);
    const {ownerAddr, nftContractAddr, tokenId} = event.returnValues;
    autctionManager.localDeleteToken(ownerAddr, nftContractAddr, tokenId);
  });
});

// Configure express
const app = express();

app.use(bodyParser.json());
app.use(cors());

// API REST
// List:
app.post('/list', async (request, response) => {
  const {ownerAddr, nftContractAddr, tokenIds, minPrices, ownerSignature} = request.body;
  if ( !ownerAddr || !nftContractAddr || !tokenIds || !minPrices || !ownerSignature) {
    return response.status(400).json( {
      status: 'error',
      message: 'body must include ownerAddr, nftContractAddr, tokenIds, minPrices, ownerSignature',
    });
  }

  const res = autctionManager.createList(ownerAddr, nftContractAddr, tokenIds, minPrices, ownerSignature);
  const code = res.status === 'success' ? 200 : 400;
  response.status(code).json(res);
});

app.delete('/list', async (request, response) => {
  const {listId, ownerSignature} = request.body;
  if ( listId === undefined || !ownerSignature) {
    return response.status(400).json( {
      status: 'error',
      message: 'body must include listId, ownerSignature',
    });
  }

  const res = autctionManager.deleteList(listId, ownerSignature);
  const code = res.status === 'success' ? 200 : 400;
  response.status(code).json(res);
});

app.get('/list', async (request, response) => {
  const {listId} = request.query;

  if (listId === undefined) {
    return response.status(200).json({
      status: 'success',
      lists: autctionManager.getLists(),
    });
  }

  const res = autctionManager.getList(Number.parseInt(listId));

  if ( ! res ) {
    return response.status(400).json({
      status: 'error',
      message: 'No list with that listId',
    });
  }

  response.status(200).json({
    status: 'success',
    list: res,
  });
});

// Token:
app.post('/token', async (request, response) => {
  const {listId, nftContractAddr, tokenId, minPrice, ownerSignature} = request.body;
  if ( listId === undefined || !nftContractAddr || tokenId === undefined || !minPrice || !ownerSignature) {
    return response.status(400).json( {
      status: 'error',
      message: 'body must include listId, nftContractAddr, tokenId, minPrice, ownerSignature',
    });
  }

  const res = autctionManager.addTokenToList(listId, nftContractAddr, tokenId, minPrice, ownerSignature);
  const code = res.status === 'success' ? 200 : 400;
  response.status(code).json(res);
});

app.delete('/token', async (request, response) => {
  const {listId, tokenId, ownerSignature} = request.body;
  if ( listId === undefined || tokenId === undefined || !ownerSignature) {
    return response.status(400).json( {
      status: 'error',
      message: 'body must include listId, tokenId, ownerSignature',
    });
  }

  const res = autctionManager.deleteToken(listId, tokenId, ownerSignature);
  const code = res.status === 'success' ? 200 : 400;
  response.status(code).json(res);
});

app.get('/token', async (request, response) => {
  const {listId, tokenId} = request.query;
  if ( listId === undefined || tokenId === undefined) {
    return response.status(400).json( {
      status: 'error',
      message: 'query must include listId, tokenId',
    });
  }

  const res = autctionManager.getToken(Number.parseInt(listId), Number.parseInt(tokenId));
  const code = res.status === 'success' ? 200 : 400;
  response.status(code).json(res);
});

// Bid:
app.post('/bid', async (request, response) => {
  const {ownerAddr, bidderAddr, nftContractAddr, tokenId} = request.body;
  const {erc20ContractAddr, erc20amount, bidderSignature} = request.body;

  if ( !ownerAddr || !bidderAddr || !nftContractAddr || tokenId === undefined ||
        !erc20ContractAddr || !erc20amount || !bidderSignature) {
    return response.status(400).json( {
      status: 'error',
      message: 'body must include ownerAddr, bidderAddr, nftContractAddr, tokenId' +
            'erc20ContractAddr, erc20amount, bidderSignature',
    });
  }

  const res = autctionManager.addBid(ownerAddr, bidderAddr, nftContractAddr, tokenId,
      erc20ContractAddr, erc20amount, bidderSignature);
  const code = res.status === 'success' ? 200 : 400;
  response.status(code).json(res);
});

app.delete('/bid', async (request, response) => {
  const {listId, tokenId, bidderAddr, bidderSignature} = request.body;

  if ( listId === undefined || tokenId === undefined || !bidderAddr || !bidderSignature) {
    return response.status(400).json( {
      status: 'error',
      message: 'body must include listId, tokenId, bidderAddr, bidderSignature',
    });
  }

  const res = autctionManager.deleteBid(listId, tokenId, bidderAddr, bidderSignature);
  const code = res.status === 'success' ? 200 : 400;
  response.status(code).json(res);
});

// Approve
app.post('/approve', async (request, response) => {
  const {ownerAddr, bidderAddr, nftContractAddr, tokenId} = request.body;
  const {erc20ContractAddr, erc20amount, ownerSignature} = request.body;

  if ( !ownerAddr || !bidderAddr || !nftContractAddr || tokenId === undefined ||
          !erc20ContractAddr || !erc20amount || !ownerSignature) {
    return response.status(400).json( {
      status: 'error',
      message: 'body must include ownerAddr, bidderAddr, nftContractAddr, tokenId' +
              'erc20ContractAddr, erc20amount, ownerSignature',
    });
  }

  const res = autctionManager.approveBid(ownerAddr, bidderAddr, nftContractAddr, tokenId,
      erc20ContractAddr, erc20amount, ownerSignature);
  const code = res.status === 'success' ? 200 : 400;
  response.status(code).json(res);
});

app.get('/approve', async (request, response) => {
  const {listId, tokenId, bidderAddr} = request.body;

  if ( listId === undefined || tokenId === undefined || !bidderAddr ) {
    return response.status(400).json( {
      status: 'error',
      message: 'body must include listId, tokenId, bidderAddr',
    });
  }

  const res = autctionManager.getApprovedBid(listId, tokenId, bidderAddr);
  const code = res.status === 'success' ? 200 : 400;
  response.status(code).json(res);
});

// Express listen
app.listen(process.env.PORT || 5000, () => {
  logger.info('App aviable on http://localhost:5000');
});
