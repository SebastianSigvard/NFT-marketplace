/* eslint-disable no-unused-vars */
import AuctionManager from '../../src/core/auction-manager.js';
import MemAuctionStorage from '../../src/infra/memAuctionStorage.js';
import ValidatorMock from '../validator_mock.js';

const validatorMock = new ValidatorMock();
const memAuctionStorage = new MemAuctionStorage(validatorMock);
const auctionManager = new AuctionManager(validatorMock, memAuctionStorage);

const minPrice = 10;
const ownerAddr = 'fakeAddr';
const bidderAddr = 'fakeAddr';
const nftContractAddr = 'fakeAddr';
const tokenId = 0;
const erc20ContractAddr = 'fakeAddr';
const erc20amount = 11;
const bidderSignature = 'fakeBidderSignature';
const ownerSignature = 'fakeOwnerSignature';

test('AuctionManager list', async () => {
  const list = await auctionManager.createList(ownerAddr,
      nftContractAddr,
      [{tokenId, minPrice}],
  );

  expect(list.getListId()).toBe(0);
  expect(list.getOwnerAddr()).toBe(ownerAddr);
  expect(list.getNftContractAddr()).toBe(nftContractAddr);

  const token = list.getToken(tokenId);

  expect(token.getId()).toBe(tokenId);
  expect(token.getMinPrice()).toBe(minPrice);
  expect(token.getBids()).toStrictEqual([]);

  await auctionManager.deleteList(list.getListId());

  const lists = await auctionManager.getLists();

  expect(lists.length).toBe(0);
});

test('AuctionManager token', async () => {
  const list = await auctionManager.createList(ownerAddr,
      nftContractAddr,
      [{tokenId, minPrice}],
  );

  await auctionManager.addToken(list.getListId(),
      {
        tokenId: tokenId + 1,
        minPrice: minPrice + 1,
      },
  );

  let storedList = await auctionManager.getList(list.getListId());
  let tokens = storedList.getTokens();

  expect(tokens.length).toBe(2);
  expect(tokens[0].getId()).toBe(tokenId);
  expect(tokens[0].getMinPrice()).toBe(minPrice);
  expect(tokens[1].getId()).toBe(tokenId + 1);
  expect(tokens[1].getMinPrice()).toBe(minPrice + 1);

  await auctionManager.deleteToken(list.getListId(), tokenId + 1);

  storedList = await auctionManager.getList(list.getListId());
  tokens = storedList.getTokens();

  expect(tokens.length).toBe(1);
  expect(tokens[0].getId()).toBe(tokenId);
  expect(tokens[0].getMinPrice()).toBe(minPrice);

  const token0 = await auctionManager.getToken(list.getListId(), tokenId);

  expect(token0.getId()).toBe(tokenId);
  expect(token0.getMinPrice()).toBe(minPrice);

  await auctionManager.deleteList(list.getListId());
  const lists = await auctionManager.getLists();
  expect(lists.length).toBe(0);
});

test('AuctionManager bid', async () => {
  const list = await auctionManager.createList(ownerAddr,
      nftContractAddr,
      [{tokenId, minPrice}],
  );

  await auctionManager.makeBid(ownerAddr,
      bidderAddr,
      nftContractAddr,
      tokenId,
      erc20ContractAddr,
      erc20amount,
      bidderSignature,
  );

  let bid = await auctionManager.getBid(list.getListId(), tokenId, bidderAddr);

  expect(bid.getOwnerAddr()).toBe(ownerAddr);
  expect(bid.getBidderAddr()).toBe(bidderAddr);
  expect(bid.getNftContractAddr()).toBe(nftContractAddr);
  expect(bid.getTokenId()).toBe(tokenId);
  expect(bid.getErc20ContractAddr()).toBe(erc20ContractAddr);
  expect(bid.getErc20Amount()).toBe(erc20amount);
  expect(bid.getOwnerSignature()).toBe(null);
  expect(bid.getBidderSignature()).toBe(bidderSignature);

  await auctionManager.approveBid(list.getListId(),
      tokenId,
      bidderAddr,
      ownerSignature,
  );

  bid = await auctionManager.getBid(list.getListId(), tokenId, bidderAddr);

  expect(bid.getOwnerAddr()).toBe(ownerAddr);
  expect(bid.getBidderAddr()).toBe(bidderAddr);
  expect(bid.getNftContractAddr()).toBe(nftContractAddr);
  expect(bid.getTokenId()).toBe(tokenId);
  expect(bid.getErc20ContractAddr()).toBe(erc20ContractAddr);
  expect(bid.getErc20Amount()).toBe(erc20amount);
  expect(bid.getOwnerSignature()).toBe(ownerSignature);
  expect(bid.getBidderSignature()).toBe(bidderSignature);

  await auctionManager.deleteBid(list.getListId(), tokenId, bidderAddr);

  const token = await auctionManager.getToken(list.getListId(), tokenId);
  const bids = token.getBids();

  expect(bids.length).toBe(0);

  await auctionManager.deleteList(list.getListId());
  const lists = await auctionManager.getLists();
  expect(lists.length).toBe(0);
});


test('AuctionManager throw test', async () => {
  try {
    const list = await auctionManager.createList(ownerAddr,
        nftContractAddr,
        {tokenId, minPrice},
    );

    expect(true).toBe(false);
  } catch (err) {
    expect(err.message).toBe('tokens must be a non empty array');
  }

  try {
    const list = await auctionManager.createList(ownerAddr,
        nftContractAddr,
        [],
    );

    expect(true).toBe(false);
  } catch (err) {
    expect(err.message).toBe('tokens must be a non empty array');
  }

  try {
    const list = await auctionManager.createList(ownerAddr,
        nftContractAddr,
        [{}],
    );

    expect(true).toBe(false);
  } catch (err) {
    expect(err.message).toBe('All tokens must has tokenId and minPrice');
  }

  try {
    await auctionManager.addToken(0, {});
    expect(true).toBe(false);
  } catch (err) {
    expect(err.message).toBe('All tokens must has tokenId and minPrice');
  }

  try {
    await auctionManager.makeBid(ownerAddr,
        bidderAddr,
        nftContractAddr,
        tokenId,
        erc20ContractAddr,
        erc20amount,
        bidderSignature,
    );
    expect(true).toBe(false);
  } catch (err) {
    expect(err.message).toBe('auctionList with ownerAddr ' + ownerAddr +
        ' and nftContractAddr ' + nftContractAddr + ' not found');
  }
});

