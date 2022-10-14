/* eslint-disable no-unused-vars */
import TokenFactory from '../../src/core/entities/token.js';
import ValidatorMock from '../validator_mock.js';
import BidFactory from '../../src/core/entities/bid.js';

const validatorMock = new ValidatorMock();
const bidFactory = new BidFactory(validatorMock);
const tokenFactory = new TokenFactory();

const minPrice = 10;
const ownerAddr = 'fakeAddr';
const bidderAddr = 'fakeAddr';
const nftContractAddr = 'fakeAddr';
const tokenId = 0;
const erc20ContractAddr = 'fakeAddr';
const erc20amount = 11;
const bidderSignature = 'fakeBidderSignature';
const ownerSignature = 'fakeOwnerSignature';

const goodBid = bidFactory.createBid(ownerAddr,
  bidderAddr,
  nftContractAddr,
  tokenId,
  erc20ContractAddr,
  erc20amount,
  bidderSignature);

const badBid = bidFactory.createBid(ownerAddr,
  bidderAddr,
  nftContractAddr,
  tokenId,
  erc20ContractAddr,
  erc20amount - 2,
  bidderSignature);

test('Create token successfully', async () => {
  const token = tokenFactory.createToken(tokenId, minPrice);

  expect(token.getId()).toBe(tokenId);
  expect(token.getMinPrice()).toBe(minPrice);
  expect(token.getBids().length).toBe(0);

  token.addBid(goodBid);
  expect(token.getBids().length).toBe(1);
  expect(token.getBids()[0]).toBe(goodBid);
  expect(token.getBid(bidderAddr)).toBe(goodBid);
  expect(token.getBid(bidderAddr + 1)).toBe(undefined);

  token.deleteBid(bidderAddr);
  expect(token.getBid(bidderAddr)).toBe(undefined);

  token.addBid(goodBid);
  token.addBid(goodBid);
  token.addBid(goodBid);
  token.addBid(goodBid);
  expect(token.getBids().length).toBe(1);

  try {
    token.addBid({});
    fail('fun must throw');
  } catch(err) {
    expect(err.message).toBe('bid must be instance of Bid');
  }

  try {
    token.addBid(badBid);
    fail('fun must throw');
  } catch(err) {
    expect(err.message).toBe('erc20amount is less than minPrice');
  }

  try {
    token.deleteBid(bidderAddr + 1);
    fail('fun must throw');
  } catch(err) {
    expect(err.message).toBe('bidderAddr not found');
  }
});

test('Create token fail all throws', async () => {
  try {
    const token = tokenFactory.createToken('a', minPrice);
    fail('fun must throw');
  } catch(err) {
    expect(err.message).toBe('a tokenId is not a number');
  }

  try {
    const token = tokenFactory.createToken(-1, minPrice);
    fail('fun must throw');
  } catch(err) {
    expect(err.message).toBe('-1 tokenId must be greater than 0');
  }

  try {
    const token = tokenFactory.createToken(tokenId, 'a');
    fail('fun must throw');
  } catch(err) {
    expect(err.message).toBe('a minPrice is not a number');
  }

  try {
    const token = tokenFactory.createToken(tokenId, -1);
    fail('fun must throw');
  } catch(err) {
    expect(err.message).toBe('-1 minPrice must be greater than 0');
  }
});


