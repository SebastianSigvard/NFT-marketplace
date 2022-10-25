import Web3 from 'web3';
import ganache from 'ganache';
import Validator from '../../src/infra/validator.js';

const web3 = new Web3(ganache.provider());
const accounts = await web3.eth.getAccounts();

const ownerAddr = accounts[0];
const bidderAddr = accounts[1];

const nftContractAddr = '0x4Fdf0833d31DCF8Dc8eb14ffac49e1038ed75622';
const erc20ContractAddr = '0xEBD12E72Cce970a7E7252a66AF2B6B39612287A3';

// TESTS
const validator = new Validator(web3);

test('Is valid addr: successfully', async () => {
  const res = validator.isValidAddr(accounts[0]);
  expect(res).toBe(true);
});

test('Is valid addr: invalid addr (error)', async () => {
  const res = validator.isValidAddr('0xC1912fEE45d61C87Cc5EA59DaE31190FFFFf232d');
  expect(res).toBe(false);
});

test('Is signature valid: successfully', async () => {
  const message = web3.utils.soliditySha3(ownerAddr, bidderAddr, nftContractAddr, 1, erc20ContractAddr, 20);
  const signatureOwner = await web3.eth.sign(message, ownerAddr);

  const res = await validator.isSignatureValid(signatureOwner, ownerAddr,
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

  const res = validator.isSignatureValid(signatureOwner, bidderAddr,
      ownerAddr,
      bidderAddr,
      nftContractAddr,
      1,
      erc20ContractAddr,
      20);
  expect(res).toBe(false);
});

test('Is NftContractvalid: invalid', async () => {
  let res = await validator.isValidNftContract('0xC1912fEE45d61C87Cc5EA59DaE31190FFFFf232d');
  expect(res).toBe(false);
  res = await validator.isValidNftContract(nftContractAddr);
  expect(res).toBe(false);
});

test('Is erc20ContractAddr: invalid', async () => {
  let res = await validator.isValidErc20Contract('0xC1912fEE45d61C87Cc5EA59DaE31190FFFFf232d');
  expect(res).toBe(false);
  res = await validator.isValidErc20Contract(erc20ContractAddr);
  expect(res).toBe(false);
});
