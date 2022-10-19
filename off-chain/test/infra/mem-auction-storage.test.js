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

  const list = await memAuctionStorage.createList(ownerAddr, nftContractAddr, [token]);

  expect(list.getListId()).toBe(0);
  expect(list.getOwnerAddr()).toBe(ownerAddr);
  expect(list.getNftContractAddr()).toBe(nftContractAddr);
  expect(list.getTokens()).toStrictEqual([token]);

  // check that stored list don't change
  list.deleteToken(tokenId);

  let listStored = await memAuctionStorage.getList(list.getListId());

  expect(list.getTokens().length).toStrictEqual(0);
  expect(listStored.getTokens().length).toStrictEqual(1);

  await memAuctionStorage.updateList(list);
  listStored = await memAuctionStorage.getList(list.getListId());
  expect(listStored.getTokens().length).toStrictEqual(0);

  // add another list and check get lists
  const list1 = await memAuctionStorage.createList(ownerAddr, nftContractAddr + 1, [token]);

  let lists = await memAuctionStorage.getLists();

  expect(lists.length).toBe(2);
  expect(lists[0].getNftContractAddr()).toBe(nftContractAddr);
  expect(lists[1].getNftContractAddr()).toBe(nftContractAddr + 1);

  await memAuctionStorage.deleteList(list1.getListId());

  lists = await memAuctionStorage.getLists();
  expect(lists.length).toBe(1);
  expect(lists[0].getNftContractAddr()).toBe(nftContractAddr);

  await memAuctionStorage.deleteList(list.getListId());
  lists = await memAuctionStorage.getLists();
  expect(lists.length).toBe(0);
});


test('MemAuctionStorage throw test', async () => {
  const token = tokenFactory.createToken(tokenId, minPrice);

  const list0 = await memAuctionStorage.createList(ownerAddr, nftContractAddr, [token]);

  try {
    const list1 = await memAuctionStorage.createList(ownerAddr, nftContractAddr, [token]);
    expect(true).toBe(false);
  } catch (err) {
    expect(err.message).toBe('there is allready a list with requested ownerAddr and nftContractAddr');
  }

  await memAuctionStorage.deleteList(list0.getListId());

  try {
    await memAuctionStorage.updateList({});
    expect(true).toBe(false);
  } catch (err) {
    expect(err.message).toBe('list must be an instance of AuctionList');
  }

  try {
    await memAuctionStorage.updateList(list0);
    expect(true).toBe(false);
  } catch (err) {
    expect(err.message).toBe('no list with listId 2');
  }

  try {
    await memAuctionStorage.deleteList(3);
    expect(true).toBe(false);
  } catch (err) {
    expect(err.message).toBe('no list with listId 3');
  }

  try {
    await memAuctionStorage.getList(3);
    expect(true).toBe(false);
  } catch (err) {
    expect(err.message).toBe('no list with listId 3');
  }
});
