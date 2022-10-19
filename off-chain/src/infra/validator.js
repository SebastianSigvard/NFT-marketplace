import {ValidatorInterface} from '../core/entities/validator-interface.js';
import Web3 from 'web3';
import erc721 from '@openzeppelin/contracts/build/contracts/ERC721.json';
import erc20 from '@openzeppelin/contracts/build/contracts/ERC20.json';

/**
 * Validator, checks validity of address and NFT and ERC20 tokens
 * ownership and approvals.
 */
export default class Validator extends ValidatorInterface{
  constructor(web3) {
    super();

    if (! (web3 instanceof Web3)) {
      throw Error('web3 must be instance of Web3');
    }

    this.#web3 = web3;
  }

  /**
     * Checks if a given string is a valid Ethereum address.
     * @param {String} addr address.
     * @return {Boolean}
     */
  isValidAddr(addr) {
    return this.#web3.utils.isAddress(addr);
  }

  async isValidNftContract(nftContractAddr) {
    if (! this.isValidAddr(nftContractAddr)) return false;
    const nftContract = new this.#web3.eth.Contract(erc721.abi, nftContractAddr);

    try {
      const res = await nftContract.methods.supportsInterface('0x80ac58cd').call();
      if (!res) return false;
    } catch (err) {
      return false;
    }

    return true;
  };

  async isValidErc20Contract(erc20ContractAddr) {
    if (! this.isValidAddr(erc20ContractAddr)) return false;
    const erc20Contract = new this.#web3.eth.Contract(erc20.abi, erc20ContractAddr);

    // TODO: better validation
    try {
      await erc20Contract.methods.totalSupply().call();
      return true;
    } catch (err) {
      return false;
    }
  };

  /**
 * Checks if signature of a message composed of multiple args
 * corresponds to the given address.
 * @param {String} signature Signature for validation.
 * @param {String} addr address to validate.
 * @param {Array}  args args to construct message.
 * @return {Boolean}
 */
  isSignatureValid(signature, addr, ...args) {
    const message = this.#web3.utils.soliditySha3(...args);
    const signatureAddr = this.#web3.eth.accounts.recover(
        message,
        signature,
    );
    return signatureAddr === addr;
  }

  #web3;
}
