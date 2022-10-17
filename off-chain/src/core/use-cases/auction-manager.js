import auctionStorageInterface, {AuctionStorageInterface} from '../../infra/auctionStorageInterface.js';
import TokenFactory from '../entities/token.js';
import BidFactory from '../entities/bid.js';

export default class AuctionManager {
  constructor(validator, auctionStorage = auctionStorageInterface) {
    if (! (Object.getPrototypeOf(auctionStorage) instanceof AuctionStorageInterface)) {
      throw Error('auctionStorage dep inject must be an instance of AuctionStorageInterface');
    }

    this.#auctionStorage = auctionStorage;
    this.#tokenFactory = new TokenFactory(validator);
    this.#bidFactory = new BidFactory(validator);
  }

  // @param {Array} _tokens Array of objects {tokenId, minPrice}.
  createList(ownerAddr, nftContractAddr, _tokens) {
    if (! Array.isArray(_tokens) || _tokens.length === 0) {
      throw Error('tokens must be a non empty array');
    }

    const tokens = [];

    for (const token of _tokens) {
      if (token.tokenId === undefined || token.minPrice === undefined) {
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

  // @param {Token} _token object {tokenId, minPrice}.
  addToken(listId, _token) {
    if (_token.tokenId === undefined || _token.minPrice === undefined) {
      throw Error('All tokens must has tokenId and minPrice');
    }

    const list = this.#auctionStorage.getList(listId);

    const token = this.#tokenFactory.createToken(_token.tokenId, _token.minPrice);

    list.addToken(token);

    this.#auctionStorage.updateList(list);
  }

  deleteToken(listId, tokenId) {
    const list = this.#auctionStorage.getList(listId);

    list.deleteToken(tokenId);

    this.#auctionStorage.updateList(list);
  }

  getToken(listId, tokenId) {
    const list = this.#auctionStorage.getList(listId);

    return list.getToken(tokenId);
  }

  makeBid(ownerAddr,
      bidderAddr,
      nftContractAddr,
      tokenId,
      erc20ContractAddr,
      erc20amount,
      bidderSignature) {
    const lists = this.#auctionStorage.getLists();

    const list = lists.find( (_list) => {
      return (
        _list.getOwnerAddr() === ownerAddr &&
        _list.getNftContractAddr() === nftContractAddr
      );
    });

    if (!list) {
      throw Error('auctionList with ownerAddr ' + ownerAddr +
        ' and nftContractAddr ' + nftContractAddr + ' not found');
    }

    const token = list.getToken(tokenId);

    const bid = this.#bidFactory.createBid(ownerAddr,
        bidderAddr,
        nftContractAddr,
        tokenId,
        erc20ContractAddr,
        erc20amount,
        bidderSignature);

    token.addBid(bid);

    this.#auctionStorage.updateList(list);
  }

  deleteBid(listId, tokenId, bidderAddr) {
    const list = this.#auctionStorage.getList(listId);

    const token = list.getToken(tokenId);

    token.deleteBid(bidderAddr);

    this.#auctionStorage.updateList(list);
  }

  getBid(listId, tokenId, bidderAddr) {
    const list = this.#auctionStorage.getList(listId);

    const token = list.getToken(tokenId);

    return token.getBid(bidderAddr);
  }

  approveBid(listId, tokenId, bidderAddr, ownerSignature) {
    const list = this.#auctionStorage.getList(listId);

    const token = list.getToken(tokenId);

    const bid = token.getBid(bidderAddr);

    bid.setOwnerSignature(ownerSignature);

    this.#auctionStorage.updateList(list);
  }

  #auctionStorage;
  #tokenFactory;
  #bidFactory;
}

