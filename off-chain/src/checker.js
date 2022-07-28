import Web3 from 'web3';

/**
 * Checker, checks validity of address and NFT and ERC20 tokens
 * ownership and approvals.
 */
export default class Checker {
  /**
 * Checker constructor.
 */
  constructor() {
    this.#web3 = new Web3();
  }

  /**
     * Checks if a given string is a valid Ethereum address.
     * @param {String} addr address.
     * @return {Boolean}
     */
  isValidAddr(addr) {
    return this.#web3.utils.isAddress(addr);
  }

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
