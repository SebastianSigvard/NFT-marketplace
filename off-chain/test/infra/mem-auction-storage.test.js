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
});
