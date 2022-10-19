import requestHandler from '../src/request-handler.js';
import Web3 from 'web3';

const web3 = new Web3(process.env.API_URL);

const ownerAccount = web3.eth.accounts.privateKeyToAccount(
  process.env.TEST_OWNER_PRIVATE_KEY
);
const bidderAccount = web3.eth.accounts.privateKeyToAccount(
  process.env.TEST_BIDDER_PRIVATE_KEY
);

const minPrice = 10;
const ownerAddr = ownerAccount.address;
const bidderAddr = bidderAccount.address;
const nftContractAddr = process.env.NFT_CONTRACT_ADDRESS;
const tokenId = 0;
const erc20ContractAddr = process.env.ERC20_CONTRACT_ADDRESS;
const erc20amount = 11;

test('RequestHandler list', async () => {
  const message = web3.utils.soliditySha3(ownerAddr, nftContractAddr);
  const ownerSignature = await web3.eth.accounts.sign(message, process.env.TEST_OWNER_PRIVATE_KEY);

  const res = requestHandler.createList({
    ownerAddr,
    nftContractAddr,
    tokens: [{tokenId, minPrice}],
    ownerSignature
  });
});

