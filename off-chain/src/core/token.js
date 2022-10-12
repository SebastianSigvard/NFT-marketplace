import Bid from './bid.js';

export class Token {
  constructor(options) {
    this.#tokenId = options.tokenId;
    this.#minPrice = options.minPrice;
    this.#bids = [];
  }

  addBid(bid) {
    if (! (Object.getPrototypeOf(bid) instanceof Bid)) {
      throw Error('bid must be instance of Bid');
    }

    this.#bids.push(bid);
  }

  getId() { return this.#tokenId };

  getMinPrice() { return this.#tokenId };

  #tokenId;
  #minPrice;
  #bids;
}

export default class TokenFactory {
  createToken(tokenId, minPrice) {
    if (Number.isNaN(tokenId)) {
      throw Error(tokenId + ' tokenId is not a number');
    }

    if (tokenId < 0) {
      throw Error(tokenId + ' tokenId must be greater than 0');
    }

    if (Number.isNaN(minPrice)) {
      throw Error(minPrice + ' minPrice is not a number');
    }

    if (minPrice < 0) {
      throw Error(minPrice + ' minPrice must be greater than 0');
    }

    return new Token({tokenId, minPrice});
  }
}
