import ValidatorMock from '../validator_mock.js';
import BidFactory from '../../src/core/entities/bid.js';

const validatorMock = new ValidatorMock();
const bidFactory = new BidFactory(validatorMock);

const ownerAddr = 'fakeAddr';
const bidderAddr = 'fakeAddr';
const nftContractAddr = 'fakeAddr';
const tokenId = 0;
const erc20ContractAddr = 'fakeAddr';
const erc20amount = 1;
const bidderSignature = 'fakeBidderSignature';
const ownerSignature = 'fakeOwnerSignature';

test('Create Bid successfully', async () => {
  const bid = bidFactory.createBid(ownerAddr,
    bidderAddr,
    nftContractAddr,
    tokenId,
    erc20ContractAddr,
    erc20amount,
    bidderSignature)

  expect(bid.getOwnerAddr()).toBe(ownerAddr);
  expect(bid.getBidderAddr()).toBe(bidderAddr);
  expect(bid.getNftContractAddr()).toBe(nftContractAddr);
  expect(bid.getTokenId()).toBe(tokenId);
  expect(bid.getErc20ContractAddr()).toBe(erc20ContractAddr);
  expect(bid.getErc20Amount()).toBe(erc20amount);
  expect(bid.getOwnerSignature()).toBe(null);
  expect(bid.getBidderSignature()).toBe(bidderSignature);

  bid.setOwnerSignature(ownerSignature);
  expect(bid.getOwnerSignature()).toBe(ownerSignature);
});

test('Create bidFactory fails for bad validator', async () => {
  try {
    const bF = new BidFactory('kk');
    expect(true).toBe(false);
  } catch(err) {
    expect(err.message).toBe('validator must be instance of ValidatorInterface');
  }
});

test('Create Bid fail for bad tokenId', async () => {
  try {
    const bid = bidFactory.createBid(ownerAddr,
      bidderAddr,
      nftContractAddr,
      'a',
      erc20ContractAddr,
      erc20amount,
      bidderSignature);
    expect(true).toBe(false);
  } catch(err) {
    expect(err.message).toBe('a tokenId is not a number');
  }
});

test('Create Bid fail for negative tokenId', async () => {
  try {
    const bid = bidFactory.createBid(ownerAddr,
      bidderAddr,
      nftContractAddr,
      -1,
      erc20ContractAddr,
      erc20amount,
      bidderSignature);
    expect(true).toBe(false);
  } catch(err) {
    expect(err.message).toBe('-1 tokenId must be greater than 0');
  }
});

test('Create Bid fail for negative tokenId', async () => {
  try {
    const bid = bidFactory.createBid(ownerAddr,
      bidderAddr,
      nftContractAddr,
      -1,
      erc20ContractAddr,
      erc20amount,
      bidderSignature);
    expect(true).toBe(false);
  } catch(err) {
    expect(err.message).toBe('-1 tokenId must be greater than 0');
  }
});

test('Create Bid fail for bad erc20amount', async () => {
  try {
    const bid = bidFactory.createBid(ownerAddr,
      bidderAddr,
      nftContractAddr,
      tokenId,
      erc20ContractAddr,
      'a',
      bidderSignature);
    expect(true).toBe(false);
  } catch(err) {
    expect(err.message).toBe('a erc20amount is not a number');
  }
});

test('Create Bid fail for negative erc20amount', async () => {
  try {
    const bid = bidFactory.createBid(ownerAddr,
      bidderAddr,
      nftContractAddr,
      tokenId,
      erc20ContractAddr,
      -2,
      bidderSignature);
    expect(true).toBe(false);
  } catch(err) {
    expect(err.message).toBe('-2 erc20amount is not greater than 0');
  }
});
