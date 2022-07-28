import Checker from './checker_mock.js';
import AuctionManager from '../src/core/auction_manager.js';

const checker = new Checker();

const ownerAddr = '0x989Fdfb5936E49a19c31583e7135F30F42D98960';
const bidderAddr = '0xd59d413cb5a1f9A78948EB9A8a8db6CaBAE327F1';
const nftContractAddr = '0x4Fdf0833d31DCF8Dc8eb14ffac49e1038ed75622';
const erc20ContractAddr = '0xEBD12E72Cce970a7E7252a66AF2B6B39612287A3';

const fakeOwnerAddr = '0x1ea77523c1E4D7CB2549c103835DFfA974194B14';
const fakeBidderAddr = '0x90e8Cb2935Edc28F8360337e66986351bb5359C5';
const fakeNftContractAddr = '0x2727CBD0bD0Ad6Ab87433cB67738595A36608d06q';
const fakeErc20ContractAddr = '0xe70A9a95631B55df96fa2a1535E0F5E43C796C67';

const ownerSignature = 'FakeSignature';
const bidderSignature = 'FakeSignature';

const tokenId = 1;
const minPrice = 10;
const erc20amount = 20;

test('Create list: successfully', async () => {
  const auctionManager = new AuctionManager(checker);

  const res = await auctionManager.createList(ownerAddr, nftContractAddr, [tokenId], [minPrice], ownerSignature);
  expect(res.status).toBe('success');
});

test('Create list: List already created (error)', async () => {
  const auctionManager = new AuctionManager(checker);

  let res = await auctionManager.createList(ownerAddr, nftContractAddr, [tokenId], [minPrice], ownerSignature);
  expect(res.status).toBe('success');

  res = await auctionManager.createList(ownerAddr, nftContractAddr, [tokenId], [minPrice], ownerSignature);
  expect(res.status).toBe('error');
  expect(res.message).toBe('List already created, please add tokens individually');
});

test('Delete list: successfully', async () => {
  const auctionManager = new AuctionManager(checker);

  let res = await auctionManager.createList(ownerAddr, nftContractAddr, [tokenId], [minPrice], ownerSignature);
  expect(res.status).toBe('success');

  res = await auctionManager.deletList(res.list.listId, ownerSignature);
  expect(res.status).toBe('success');
});

test('Delete list: Invalid listId (error)', async () => {
  const auctionManager = new AuctionManager(checker);

  const res = await auctionManager.deletList(1, ownerSignature);
  expect(res.status).toBe('error');
  expect(res.message).toBe('Invalid listId');
});

test('Add token to list: successfully', async () => {
  const auctionManager = new AuctionManager(checker);

  let res = await auctionManager.createList(ownerAddr, nftContractAddr, [tokenId], [minPrice], ownerSignature);
  expect(res.status).toBe('success');

  res = await auctionManager.addTokenToList(res.list.listId, nftContractAddr, 2, 10, ownerSignature);
  expect(res.status).toBe('success');
});

test('Add token to list: Invalid listId (error)', async () => {
  const auctionManager = new AuctionManager(checker);

  let res = await auctionManager.createList(ownerAddr, nftContractAddr, [tokenId], [minPrice], ownerSignature);
  expect(res.status).toBe('success');

  res = await auctionManager.addTokenToList(2, nftContractAddr, 2, 10, ownerSignature);
  expect(res.status).toBe('error');
  expect(res.message).toBe('Invalid listId');
});

test('Add token to list: allready inside auction list (error)', async () => {
  const auctionManager = new AuctionManager(checker);

  let res = await auctionManager.createList(ownerAddr, nftContractAddr, [tokenId], [minPrice], ownerSignature);
  expect(res.status).toBe('success');

  res = await auctionManager.addTokenToList(res.list.listId, nftContractAddr, 1, 10, ownerSignature);
  expect(res.status).toBe('error');
  expect(res.message).toBe('The tokenId[1] it\'s allready inside auction list');
});

test('Delete token: successfully', async () => {
  const auctionManager = new AuctionManager(checker);

  let res = await auctionManager.createList(ownerAddr, nftContractAddr, [tokenId], [minPrice], ownerSignature);
  expect(res.status).toBe('success');

  const listId = res.list.listId;
  res = await auctionManager.addTokenToList(listId, nftContractAddr, 2, 10, ownerSignature);
  expect(res.status).toBe('success');

  res = await auctionManager.deletToken(listId, 2, ownerSignature);
  expect(res.status).toBe('success');
});

test('Delete token: Invalid listId or tokenId', async () => {
  const auctionManager = new AuctionManager(checker);

  let res = await auctionManager.createList(ownerAddr, nftContractAddr, [tokenId], [minPrice], ownerSignature);
  expect(res.status).toBe('success');

  const listId = res.list.listId;
  res = await auctionManager.addTokenToList(listId, nftContractAddr, 2, 10, ownerSignature);
  expect(res.status).toBe('success');

  res = await auctionManager.deletToken(listId, 4, ownerSignature);
  expect(res.status).toBe('error');
  expect(res.message).toBe('Invalid listId or tokenId');

  res = await auctionManager.deletToken(4, 2, ownerSignature);
  expect(res.status).toBe('error');
  expect(res.message).toBe('Invalid listId or tokenId');
});

test('Get token: successfully', async () => {
  const auctionManager = new AuctionManager(checker);

  let res = await auctionManager.createList(ownerAddr, nftContractAddr, [tokenId], [minPrice], ownerSignature);
  expect(res.status).toBe('success');

  const listId = res.list.listId;
  res = await auctionManager.getToken(listId, 1);
  expect(res.status).toBe('success');
  expect(res.data.ownerAddr).toBe(ownerAddr);
  expect(res.data.nftContractAddr).toBe(nftContractAddr);
  expect(res.data.minPrice).toBe(minPrice);
  expect(res.data.bestBid).toBe(undefined);
});

test('Get token: Invalid listId or tokenId (error)', async () => {
  const auctionManager = new AuctionManager(checker);

  let res = await auctionManager.createList(ownerAddr, nftContractAddr, [tokenId], [minPrice], ownerSignature);
  expect(res.status).toBe('success');

  const listId = res.list.listId;
  res = await auctionManager.getToken(listId, 2);
  expect(res.status).toBe('error');
  expect(res.message).toBe('Invalid listId or tokenId');

  res = await auctionManager.getToken(2, 1);
  expect(res.status).toBe('error');
  expect(res.message).toBe('Invalid listId or tokenId');
});

test('Add bid: (and update bid) successfully', async () => {
  const auctionManager = new AuctionManager(checker);

  let res = await auctionManager.createList(ownerAddr, nftContractAddr, [tokenId], [minPrice], ownerSignature);
  expect(res.status).toBe('success');

  res = await auctionManager.addBid(ownerAddr, bidderAddr, nftContractAddr, tokenId,
      erc20ContractAddr, erc20amount, bidderSignature);
  expect(res.status).toBe('success');
  expect(res.message).toBe('Bid added');

  res = await auctionManager.addBid(ownerAddr, bidderAddr, nftContractAddr, tokenId,
      erc20ContractAddr, erc20amount + 4, bidderSignature);
  expect(res.status).toBe('success');
  expect(res.message).toBe('Bid updated');
});

test('Add bid: No auction list (error)', async () => {
  const auctionManager = new AuctionManager(checker);

  let res = await auctionManager.createList(ownerAddr, nftContractAddr, [tokenId], [minPrice], ownerSignature);
  expect(res.status).toBe('success');

  res = await auctionManager.addBid(ownerAddr, bidderAddr, nftContractAddr + 1, tokenId,
      erc20ContractAddr, erc20amount, bidderSignature);
  expect(res.status).toBe('error');
  expect(res.message).toBe('No auction list with those nftContractAddr and ownerAddr');
});

test('Add bid: Invalid tokenId (error)', async () => {
  const auctionManager = new AuctionManager(checker);

  let res = await auctionManager.createList(ownerAddr, nftContractAddr, [tokenId], [minPrice], ownerSignature);
  expect(res.status).toBe('success');

  res = await auctionManager.addBid(ownerAddr, bidderAddr, nftContractAddr, tokenId + 1,
      erc20ContractAddr, erc20amount, bidderSignature);
  expect(res.status).toBe('error');
  expect(res.message).toBe('Invalid tokenId');
});

test('Add bid: min price (error)', async () => {
  const auctionManager = new AuctionManager(checker);

  let res = await auctionManager.createList(ownerAddr, nftContractAddr, [tokenId], [minPrice], ownerSignature);
  expect(res.status).toBe('success');

  res = await auctionManager.addBid(ownerAddr, bidderAddr, nftContractAddr, tokenId,
      erc20ContractAddr, 5, bidderSignature);
  expect(res.status).toBe('error');
  expect(res.message).toBe('erc20amount is less than min price');
});


test('Delete bid: successfully', async () => {
  const auctionManager = new AuctionManager(checker);

  let res = await auctionManager.createList(ownerAddr, nftContractAddr, [tokenId], [minPrice], ownerSignature);
  expect(res.status).toBe('success');

  const listId = res.list.listId;

  res = await auctionManager.addBid(ownerAddr, bidderAddr, nftContractAddr, tokenId,
      erc20ContractAddr, erc20amount, bidderSignature);
  expect(res.status).toBe('success');
  expect(res.message).toBe('Bid added');

  res = await auctionManager.deletBid(listId, tokenId, bidderAddr, bidderSignature);
  expect(res.status).toBe('success');
});

test('Delete bid: Invalid listId or TokenId (error)', async () => {
  const auctionManager = new AuctionManager(checker);

  let res = await auctionManager.createList(ownerAddr, nftContractAddr, [tokenId], [minPrice], ownerSignature);
  expect(res.status).toBe('success');

  const listId = res.list.listId;

  res = await auctionManager.addBid(ownerAddr, bidderAddr, nftContractAddr, tokenId,
      erc20ContractAddr, erc20amount, bidderSignature);
  expect(res.status).toBe('success');
  expect(res.message).toBe('Bid added');

  res = await auctionManager.deletBid(listId, tokenId + 1, bidderAddr, bidderSignature);
  expect(res.status).toBe('error');
  expect(res.message).toBe('Invalid listId or TokenId');

  res = await auctionManager.deletBid(listId + 1, tokenId, bidderAddr, bidderSignature);
  expect(res.status).toBe('error');
  expect(res.message).toBe('Invalid listId or TokenId');
});

test('Delete bid: No bid found with bidderAddr and tokenId (error)', async () => {
  const auctionManager = new AuctionManager(checker);

  let res = await auctionManager.createList(ownerAddr, nftContractAddr,
      [tokenId, tokenId +1], [minPrice, minPrice], ownerSignature);
  expect(res.status).toBe('success');

  const listId = res.list.listId;

  res = await auctionManager.addBid(ownerAddr, bidderAddr, nftContractAddr, tokenId,
      erc20ContractAddr, erc20amount, bidderSignature);
  expect(res.status).toBe('success');
  expect(res.message).toBe('Bid added');

  res = await auctionManager.deletBid(listId, tokenId, bidderAddr + 1, bidderSignature);
  expect(res.status).toBe('error');
  expect(res.message).toBe('No bid found with that bidderAddr and tokenId');

  res = await auctionManager.deletBid(listId, tokenId + 1, bidderAddr, bidderSignature);
  expect(res.status).toBe('error');
  expect(res.message).toBe('No bid found with that bidderAddr and tokenId');
});

test('Approve bid: successfully', async () => {
  const auctionManager = new AuctionManager(checker);

  let res = await auctionManager.createList(ownerAddr, nftContractAddr, [tokenId], [minPrice], ownerSignature);
  expect(res.status).toBe('success');

  res = await auctionManager.addBid(ownerAddr, bidderAddr, nftContractAddr, tokenId,
      erc20ContractAddr, erc20amount, bidderSignature);
  expect(res.status).toBe('success');
  expect(res.message).toBe('Bid added');

  res = await auctionManager.approveBid(ownerAddr, bidderAddr, nftContractAddr,
      tokenId, erc20ContractAddr, erc20amount, ownerSignature);
  expect(res.status).toBe('success');
  expect(res.message).toBe('Successfully approved bid. on-chain transaction now can be executed');
  expect(res.bid.ownerAddr).toBe(ownerAddr);
  expect(res.bid.bidderAddr).toBe(bidderAddr);
  expect(res.bid.nftContractAddr).toBe(nftContractAddr);
  expect(res.bid.tokenId).toBe(tokenId);
  expect(res.bid.erc20ContractAddr).toBe(erc20ContractAddr);
  expect(res.bid.erc20amount).toBe(erc20amount);
  expect(res.bid.ownerSignature).toBe(ownerSignature);
  expect(res.bid.bidderSignature).toBe(bidderSignature);
});

test('Approve bid: No auction list nftContractAddr and ownerAddr (error)', async () => {
  const auctionManager = new AuctionManager(checker);

  let res = await auctionManager.createList(ownerAddr, nftContractAddr, [tokenId], [minPrice], ownerSignature);
  expect(res.status).toBe('success');

  res = await auctionManager.addBid(ownerAddr, bidderAddr, nftContractAddr, tokenId,
      erc20ContractAddr, erc20amount, bidderSignature);
  expect(res.status).toBe('success');
  expect(res.message).toBe('Bid added');

  res = await auctionManager.approveBid(ownerAddr, bidderAddr, nftContractAddr + 1,
      tokenId, erc20ContractAddr, erc20amount, ownerSignature);
  expect(res.status).toBe('error');
  expect(res.message).toBe('No auction list with those nftContractAddr and ownerAddr');

  res = await auctionManager.approveBid(ownerAddr + 1, bidderAddr, nftContractAddr,
      tokenId, erc20ContractAddr, erc20amount, ownerSignature);
  expect(res.status).toBe('error');
  expect(res.message).toBe('No auction list with those nftContractAddr and ownerAddr');
});

test('Approve bid: no bid with provided argumetns bidderAddr and tokenId (error)', async () => {
  const auctionManager = new AuctionManager(checker);

  let res = await auctionManager.createList(ownerAddr, nftContractAddr, [tokenId], [minPrice], ownerSignature);
  expect(res.status).toBe('success');

  res = await auctionManager.addBid(ownerAddr, bidderAddr, nftContractAddr, tokenId,
      erc20ContractAddr, erc20amount, bidderSignature);
  expect(res.status).toBe('success');
  expect(res.message).toBe('Bid added');

  res = await auctionManager.approveBid(ownerAddr, bidderAddr + 1, nftContractAddr,
      tokenId, erc20ContractAddr, erc20amount, ownerSignature);
  expect(res.status).toBe('error');
  expect(res.message).toBe('There is no bid with provided argumetns bidderAddr and tokenId');

  res = await auctionManager.approveBid(ownerAddr, bidderAddr, nftContractAddr,
      tokenId + 1, erc20ContractAddr, erc20amount, ownerSignature);
  expect(res.status).toBe('error');
  expect(res.message).toBe('There is no bid with provided argumetns bidderAddr and tokenId');
});

test('Approve bid: erc20ContractAddr or erc20amount arguments not equal to auction list data (error)', async () => {
  const auctionManager = new AuctionManager(checker);

  let res = await auctionManager.createList(ownerAddr, nftContractAddr, [tokenId], [minPrice], ownerSignature);
  expect(res.status).toBe('success');

  res = await auctionManager.addBid(ownerAddr, bidderAddr, nftContractAddr, tokenId,
      erc20ContractAddr, erc20amount, bidderSignature);
  expect(res.status).toBe('success');
  expect(res.message).toBe('Bid added');

  res = await auctionManager.approveBid(ownerAddr, bidderAddr, nftContractAddr,
      tokenId, erc20ContractAddr + 1, erc20amount, ownerSignature);
  expect(res.status).toBe('error');
  expect(res.message).toBe('erc20ContractAddr or erc20amount arguments not equal to auction list data');

  res = await auctionManager.approveBid(ownerAddr, bidderAddr, nftContractAddr,
      tokenId, erc20ContractAddr, erc20amount + 1, ownerSignature);
  expect(res.status).toBe('error');
  expect(res.message).toBe('erc20ContractAddr or erc20amount arguments not equal to auction list data');
});

test('Get approved bid: successfully', async () => {
  const auctionManager = new AuctionManager(checker);

  let res = await auctionManager.createList(ownerAddr, nftContractAddr, [tokenId], [minPrice], ownerSignature);
  expect(res.status).toBe('success');

  const listId = res.list.listId;

  res = await auctionManager.addBid(ownerAddr, bidderAddr, nftContractAddr, tokenId,
      erc20ContractAddr, erc20amount, bidderSignature);
  expect(res.status).toBe('success');
  expect(res.message).toBe('Bid added');

  res = await auctionManager.approveBid(ownerAddr, bidderAddr, nftContractAddr,
      tokenId, erc20ContractAddr, erc20amount, ownerSignature);
  expect(res.status).toBe('success');

  res = await auctionManager.getApprovedBid(listId, tokenId, bidderAddr);
  expect(res.status).toBe('success');
  expect(res.message).toBe('On-chain transaction can be executed');
  expect(res.bid.ownerAddr).toBe(ownerAddr);
  expect(res.bid.bidderAddr).toBe(bidderAddr);
  expect(res.bid.nftContractAddr).toBe(nftContractAddr);
  expect(res.bid.tokenId).toBe(tokenId);
  expect(res.bid.erc20ContractAddr).toBe(erc20ContractAddr);
  expect(res.bid.erc20amount).toBe(erc20amount);
  expect(res.bid.ownerSignature).toBe(ownerSignature);
  expect(res.bid.bidderSignature).toBe(bidderSignature);
});

test('Get approved bid: Invalid listId (error)', async () => {
  const auctionManager = new AuctionManager(checker);

  let res = await auctionManager.createList(ownerAddr, nftContractAddr, [tokenId], [minPrice], ownerSignature);
  expect(res.status).toBe('success');

  const listId = res.list.listId;

  res = await auctionManager.addBid(ownerAddr, bidderAddr, nftContractAddr, tokenId,
      erc20ContractAddr, erc20amount, bidderSignature);
  expect(res.status).toBe('success');
  expect(res.message).toBe('Bid added');

  res = await auctionManager.approveBid(ownerAddr, bidderAddr, nftContractAddr,
      tokenId, erc20ContractAddr, erc20amount, ownerSignature);
  expect(res.status).toBe('success');

  res = await auctionManager.getApprovedBid(listId + 1, tokenId, bidderAddr);
  expect(res.status).toBe('error');
  expect(res.message).toBe('Invalid listId');
});

test('Get approved bid: no bid with provided argumetns bidderAddr and tokenId (error)', async () => {
  const auctionManager = new AuctionManager(checker);

  let res = await auctionManager.createList(ownerAddr, nftContractAddr, [tokenId], [minPrice], ownerSignature);
  expect(res.status).toBe('success');

  const listId = res.list.listId;

  res = await auctionManager.addBid(ownerAddr, bidderAddr, nftContractAddr, tokenId,
      erc20ContractAddr, erc20amount, bidderSignature);
  expect(res.status).toBe('success');
  expect(res.message).toBe('Bid added');

  res = await auctionManager.approveBid(ownerAddr, bidderAddr, nftContractAddr,
      tokenId, erc20ContractAddr, erc20amount, ownerSignature);
  expect(res.status).toBe('success');

  res = await auctionManager.getApprovedBid(listId, tokenId + 1, bidderAddr);
  expect(res.status).toBe('error');
  expect(res.message).toBe('There is no bid with provided argumetns bidderAddr and tokenId');

  res = await auctionManager.getApprovedBid(listId, tokenId, bidderAddr + 1);
  expect(res.status).toBe('error');
  expect(res.message).toBe('There is no bid with provided argumetns bidderAddr and tokenId');
});

test('Get approved bid: Bid not yet approved (error)', async () => {
  const auctionManager = new AuctionManager(checker);

  let res = await auctionManager.createList(ownerAddr, nftContractAddr, [tokenId], [minPrice], ownerSignature);
  expect(res.status).toBe('success');

  const listId = res.list.listId;

  res = await auctionManager.addBid(ownerAddr, bidderAddr, nftContractAddr, tokenId,
      erc20ContractAddr, erc20amount, bidderSignature);
  expect(res.status).toBe('success');
  expect(res.message).toBe('Bid added');

  res = await auctionManager.getApprovedBid(listId, tokenId, bidderAddr);
  expect(res.status).toBe('error');
  expect(res.message).toBe('Bid not yet approved');
});
