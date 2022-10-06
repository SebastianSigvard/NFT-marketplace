import Web3 from 'web3';
import ganache from 'ganache';
import Checker from '../src/checker.js';

const web3 = new Web3(ganache.provider());
const accounts = await web3.eth.getAccounts();

const ownerAddr = accounts[0];
const bidderAddr = accounts[1];

const nftContractAddr = '0x4Fdf0833d31DCF8Dc8eb14ffac49e1038ed75622';
const erc20ContractAddr = '0xEBD12E72Cce970a7E7252a66AF2B6B39612287A3';

// TESTS
const checker = new Checker();

test('Is valid addr: successfully', async () => {
  const res = checker.isValidAddr(accounts[0]);
  expect(res).toBe(true);
});

test('Is valid addr: invalid addr (error)', async () => {
  const res = checker.isValidAddr('0xC1912fEE45d61C87Cc5EA59DaE31190FFFFf232d');
  expect(res).toBe(false);
});

test('Is signature valid: successfully', async () => {
  const message = web3.utils.soliditySha3(ownerAddr, bidderAddr, nftContractAddr, 1, erc20ContractAddr, 20);
  const signatureOwner = await web3.eth.sign(message, ownerAddr);

  const res = await checker.isSignatureValid(signatureOwner, ownerAddr,
      ownerAddr,
      bidderAddr,
      nftContractAddr,
      1,
      erc20ContractAddr,
      20);
  expect(res).toBe(true);
});

test('Is signature valid: invalid', async () => {
  const message = web3.utils.soliditySha3(ownerAddr, bidderAddr, nftContractAddr, 1, erc20ContractAddr, 20);
  const signatureOwner = await web3.eth.sign(message, ownerAddr);

  const res = checker.isSignatureValid(signatureOwner, bidderAddr,
      ownerAddr,
      bidderAddr,
      nftContractAddr,
      1,
      erc20ContractAddr,
      20);
  expect(res).toBe(false);
});
