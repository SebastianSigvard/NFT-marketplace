/* eslint-disable no-unused-vars */
import TokenFactory from '../../src/core/entities/token.js';
import ValidatorMock from '../validator_mock.js';
import BidFactory from '../../src/core/entities/bid.js';
import AuctionListFactory from '../../src/core/entities/auction-list.js';

const validatorMock = new ValidatorMock();
const bidFactory = new BidFactory(validatorMock);
const tokenFactory = new TokenFactory(validatorMock);
const auctionListFactory = new AuctionListFactory(validatorMock);

const listId = 0;
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

test('Create auctionList successfully', async () => {
  const token1 = tokenFactory.createToken(tokenId, minPrice);
  const token2 = tokenFactory.createToken(tokenId + 1, minPrice);
  const token3 = tokenFactory.createToken(tokenId + 2, minPrice);

  const auctionList = auctionListFactory.createList(
      listId,
      ownerAddr,
      nftContractAddr,
      [token1, token2],
  );

  expect(auctionList.getListId()).toBe(listId);
  expect(auctionList.getOwnerAddr()).toBe(ownerAddr);
  expect(auctionList.getNftContractAddr()).toBe(nftContractAddr);
  expect(auctionList.getTokens()).toStrictEqual([token1, token2]);
  expect(auctionList.getToken(tokenId)).toBe(token1);
  expect(auctionList.getToken(tokenId + 1)).toBe(token2);

  auctionList.addToken(token3);
  expect(auctionList.getToken(tokenId + 2)).toBe(token3);

  auctionList.deleteToken(tokenId);
  expect(auctionList.getTokens()).toStrictEqual([token2, token3]);

  // test throw
  try {
    auctionList.addToken({});
    fail('fun must throw');
  } catch (err) {
    expect(err.message).toBe('token must be instance of Token');
  }

  try {
    auctionList.addToken(token2);
    fail('fun must throw');
  } catch (err) {
    expect(err.message).toBe('token 1 allready in list');
  }

  try {
    auctionList.deleteToken(tokenId);
    fail('fun must throw');
  } catch (err) {
    expect(err.message).toBe('tokenId not found');
  }
});

test('Create auctionList successfully', async () => {
  const token1 = tokenFactory.createToken(tokenId, minPrice);
  const token2 = tokenFactory.createToken(tokenId + 1, minPrice);
  const token3 = tokenFactory.createToken(tokenId + 2, minPrice);

  const auctionList = auctionListFactory.createList(
      listId,
      ownerAddr,
      nftContractAddr,
      [token1, token2],
  );

  const auctionListCp = auctionListFactory.copyList(auctionList);

  expect(auctionListCp.getListId()).toBe(listId);
  expect(auctionListCp.getOwnerAddr()).toBe(ownerAddr);
  expect(auctionListCp.getNftContractAddr()).toBe(nftContractAddr);
  expect(auctionListCp.getTokens()).toStrictEqual([token1, token2]);
  expect(auctionListCp.getToken(tokenId)).toStrictEqual(token1);
  expect(auctionListCp.getToken(tokenId + 1)).toStrictEqual(token2);

});
test('AuctionListFactory fail test throw', async () => {
  const token1 = tokenFactory.createToken(tokenId, minPrice);
  const token2 = tokenFactory.createToken(tokenId + 1, minPrice);

  try {
    const auctionList = auctionListFactory.createList(
        'a',
        ownerAddr,
        nftContractAddr,
        [token1, token2],
    );
    fail('fun must throw');
  } catch (err) {
    expect(err.message).toBe('a is not a number');
  }

  try {
    const auctionList = auctionListFactory.createList(
        listId,
        ownerAddr,
        nftContractAddr,
        {},
    );
    fail('fun must throw');
  } catch (err) {
    expect(err.message).toBe('tokens is not an array');
  }

  try {
    const auctionList = auctionListFactory.createList(
        listId,
        ownerAddr,
        nftContractAddr,
        [token1, {}],
    );
    fail('fun must throw');
  } catch (err) {
    expect(err.message).toBe('token must be instance of Token');
  }
});

