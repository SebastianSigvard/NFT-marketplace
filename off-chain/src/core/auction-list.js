import listValidatorInterface, {ListValidatorInterface} from './list-validator-interface.js';
import Token from './token.js';

class AuctionList {
  constructor(options) {
    this.#listId = options.listId;
    this.#ownerAddr = options.ownerAddr;
    this.#nftContractAddr = options.nftContractAddr;
    this.#tokens = options.tokens;
  }

  addToken(token) {
    if (! (Object.getPrototypeOf(token) instanceof Token)) {
      throw Error('token must be instance of Token');
    }

    if (this.#tokens.find((_token) => _token.getId() === token.getId())) {
      throw Error('token ' + token.getId() + ' allready in list');
    }

    this.#tokens.push(token);
  }

  deleteToken(tokenId) {
    const idx = this.#tokens.findIndex((token) => token.getId() === tokenId);

    if (idx < 0) {
      throw Error('tokenId not found');
    }

    this.#tokens.splice(idx, 1);
  }

  getListId() {
    return this.#listId;
  };

  getOwnerAddr() {
    return this.#ownerAddr;
  };

  getNftContractAddr() {
    return this.#nftContractAddr;
  };

  getToken(tokenId) {
    return this.#tokens.find((token) => token.getId() === tokenId);
  }

  #listId;
  #ownerAddr;
  #nftContractAddr;
  #tokens;
}

export default class AuctionListFactory {
  constructor(listValidator = listValidatorInterface) {
    if (! (Object.getPrototypeOf(listValidator) instanceof ListValidatorInterface)) {
      throw Error('listValidator must be instance of ListValidatorInterface');
    }

    this.#listValidator = listValidator;
  }

  createList(listId, ownerAddr, nftContractAddr, tokens) {
    if (Number.isNaN(listId)) {
      throw Error(listId + ' is not a number');
    }

    if (! this.#listValidator.isValidAddr(ownerAddr)) {
      throw Error(ownerAddr + ' is not a valid address');
    }

    if (! this.#listValidator.isValidNftContract(nftContractAddr)) {
      throw Error(nftContractAddr + ' is not a valid nft contract address');
    }

    if (! Array.isArray(tokens) ) {
      throw Error('tokens is not an array');
    }

    for (const token of tokens) {
      if (! (Object.getPrototypeOf(token) instanceof Token)) {
        throw Error('token must be instance of Token');
      }
    }

    return new AuctionList({listId, ownerAddr, nftContractAddr, tokens});
  }

  #listValidator;
}

