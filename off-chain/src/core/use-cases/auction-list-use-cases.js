import auctionStorageInterface, {AuctionStorageInterface} from '../../infra/auctionStorageInterface.js';
import TokenFactory from '../entities/token.js';

class AuctionListUC {
  constructor(auctionStorage = auctionStorageInterface) {
    if (! (Object.getPrototypeOf(auctionStorage) instanceof AuctionStorageInterface)) {
      throw Error('auctionStorage dep inject must be an instance of AuctionStorageInterface');
    }

    this.#auctionStorage = auctionStorage;
    this.#tokenFactory = new TokenFactory();
  }

  // @param {Array} _tokens Array of objects {tokenId, minPrice}.
  createList(ownerAddr, nftContractAddr, _tokens) {
    if (! Array.isArray(_tokens) || _tokens.length === 0) {
      throw Error('tokens must be a non empty array');
    }

    const tokens = [];

    for (const token of _tokens) {
      if (!token.tokenId || ! token.minPrice) {
        throw Error('All tokens must has tokenId and minPrice');
      }

      tokens.push(this.#tokenFactory.createToken(token.tokenId, token.minPrice));
    }

    return this.#auctionStorage.createList(ownerAddr, nftContractAddr, tokens);
  }

  deleteList(listId) {
    this.#auctionStorage.deleteList(listId);
  }

  getList(listId) {
    return this.#auctionStorage.getList(listId);
  }

  getLists() {
    return this.#auctionStorage.getLists();
  }

  #auctionStorage;
  #tokenFactory;
}

export default new AuctionListUC();
