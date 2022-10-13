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
const erc20amount = 1;
const bidderSignature = 'fakeBidderSignature';
const ownerSignature = 'fakeOwnerSignature';

const goodBid = bidFactory.createBid(ownerAddr,
    bidderAddr,
    nftContractAddr,
    tokenId,
    erc20ContractAddr,
    erc20amount,
    bidderSignature);

  console.log(goodBid.getTokenId());
test('Create token successfully', async () => {
  const token = tokenFactory.createToken(tokenId, minPrice);

  expect(token.getId()).toBe(tokenId);
  expect(token.getMinPrice()).toBe(minPrice);
  expect(token.getBids().length).toBe(0);

  console.log(goodBid);
  console.log(Object.getPrototypeOf(goodBid));
  token.addBid(goodBid);
  expect(token.getBids().length).toBe(1);
  //expect(token.getBids()[0].getTokenId()).toBe(tokenId);
});
