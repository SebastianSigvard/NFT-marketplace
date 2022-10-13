import ValidatorMock from './validator_mock.js';
import BidFactory from '../src/core/bid.js';

const validatorMock = new ValidatorMock();
const bidFactory = new BidFactory(validatorMock);

const ownerAddr = 'fakeAddr';
const bidderAddr = 'fakeAddr';
const nftContractAddr = 'fakeAddr';
const tokenId = 0;
const erc20ContractAddr = 'fakeAddr';
const erc20amount = 1;
const bidderSignature = 'fakeSignature';

test('Create Bid', async () => {
  const bid = bidFactory.createBid(ownerAddr,
    bidderAddr,
    nftContractAddr,
    tokenId,
    erc20ContractAddr,
    erc20amount,
    bidderSignature)

  expect(res).toBe(true);
});
