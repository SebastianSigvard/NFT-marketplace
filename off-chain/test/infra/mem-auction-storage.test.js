/* eslint-disable no-unused-vars */
import MemAuctionStorage from '../../src/infra/memAuctionStorage.js';
import ValidatorMock from '../validator_mock.js';
import TokenFactory from '../../src/core/entities/token.js';

const validatorMock = new ValidatorMock();
const memAuctionStorage = new MemAuctionStorage(validatorMock);
const tokenFactory = new TokenFactory(validatorMock);

const minPrice = 10;
const tokenId = 0;
const ownerAddr = 'fakeAddr';
const nftContractAddr = 'fakeAddr';

test('Create list successfully', async () => {
  const token = tokenFactory.createToken(tokenId, minPrice);

  const list = memAuctionStorage.createList(ownerAddr, nftContractAddr, [token]);

  expect(list.getListId()).toBe(0);
  expect(list.getOwnerAddr()).toBe(ownerAddr);
  expect(list.getNftContractAddr()).toBe(nftContractAddr);
  expect(list.getTokens()).toStrictEqual([token]);

  // check that stored list don't change
  list.deleteToken(tokenId);

  let listStored = memAuctionStorage.getList(list.getListId());

  expect(list.getTokens().length).toStrictEqual(0);
  expect(listStored.getTokens().length).toStrictEqual(1);

  memAuctionStorage.updateList(list);
  listStored = memAuctionStorage.getList(list.getListId());
  expect(listStored.getTokens().length).toStrictEqual(0);

  // add another list and check get lists
  const list1 = memAuctionStorage.createList(ownerAddr, nftContractAddr + 1, [token]);

  let lists = memAuctionStorage.getLists();

  expect(lists.length).toBe(2);
  expect(lists[0].getNftContractAddr()).toBe(nftContractAddr);
  expect(lists[1].getNftContractAddr()).toBe(nftContractAddr + 1);

  memAuctionStorage.deleteList(list1.getListId());

  lists = memAuctionStorage.getLists();
  expect(lists.length).toBe(1);
  expect(lists[0].getNftContractAddr()).toBe(nftContractAddr);

  memAuctionStorage.deleteList(list.getListId());
  lists = memAuctionStorage.getLists();
  expect(lists.length).toBe(0);
});


test('MemAuctionStorage throw test', async () => {
  const token = tokenFactory.createToken(tokenId, minPrice);

  const list0 = memAuctionStorage.createList(ownerAddr, nftContractAddr, [token]);

  try {
    const list1 = memAuctionStorage.createList(ownerAddr, nftContractAddr, [token]);
    expect(true).toBe(false);
  } catch (err) {
    expect(err.message).toBe('there is allready a list with requested ownerAddr and nftContractAddr');
  }

  memAuctionStorage.deleteList(list0.getListId());

  try {
    memAuctionStorage.updateList({});
    expect(true).toBe(false);
  } catch (err) {
    expect(err.message).toBe('list must be an instance of AuctionList');
  }

  try {
    memAuctionStorage.updateList(list0);
    expect(true).toBe(false);
  } catch (err) {
    expect(err.message).toBe('no list with listId 2');
  }

  try {
    memAuctionStorage.deleteList(3);
    expect(true).toBe(false);
  } catch (err) {
    expect(err.message).toBe('no list with listId 3');
  }

  try {
    memAuctionStorage.getList(3);
    expect(true).toBe(false);
  } catch (err) {
    expect(err.message).toBe('no list with listId 3');
  }
});
