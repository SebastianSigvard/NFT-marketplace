import validatorInterface, {ValidatorInterface} from './validator-interface.js';
import TokenFactory, {Token} from './token.js';

export class AuctionList {
  constructor(options) {
    this.#listId = options.listId;
    this.#ownerAddr = options.ownerAddr;
    this.#nftContractAddr = options.nftContractAddr;
    this.#tokens = options.tokens;
  }

  addToken(token) {
    if (! (token instanceof Token)) {
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
    const token = this.#tokens.find((token) => token.getId() === tokenId);
    if (!token) {
      throw Error('no token found with tokenId ' + tokenId);
    }
    return token;
  }

  getTokens() {
    return [...this.#tokens];
  }

  #listId;
  #ownerAddr;
  #nftContractAddr;
  #tokens;
}

export default class AuctionListFactory {
  constructor(validator = validatorInterface) {
    if (! (Object.getPrototypeOf(validator) instanceof ValidatorInterface)) {
      throw Error('validator must be instance of ValidatorInterface');
    }

    this.#validator = validator;
    this.#tokenFactory = new TokenFactory(validator);
  }

  async createList(listId, ownerAddr, nftContractAddr, tokens) {
    if (typeof listId !== 'number') {
      throw Error(listId + ' is not a number');
    }

    if (! this.#validator.isValidAddr(ownerAddr)) {
      throw Error(ownerAddr + ' is not a valid address');
    }

    if (! await this.#validator.isValidNftContract(nftContractAddr)) {
      throw Error(nftContractAddr + ' is not a valid nft contract address');
    }

    if (! Array.isArray(tokens) ) {
      throw Error('tokens is not an array');
    }

    for (const token of tokens) {
      if (! (token instanceof Token)) {
        throw Error('token must be instance of Token');
      }
    }

    return new AuctionList({listId, ownerAddr, nftContractAddr, tokens});
  }

  copyList(list) {
    if (! list instanceof AuctionList) {
      throw Error('list is not an instance of AuctionList');
    }

    const tokens = [];

    for (const token of list.getTokens()) {
      tokens.push(this.#tokenFactory.copyToken(token));
    }

    return new AuctionList({
      listId: list.getListId(),
      ownerAddr: list.getOwnerAddr(),
      nftContractAddr: list.getNftContractAddr(),
      tokens,
    });
  }

  #validator;
  #tokenFactory;
}

