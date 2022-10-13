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

    if (bid.getErc20Amount() < this.#minPrice) {
      throw Error('erc20Amount is less than minPrice');
    }

    this.#bids.push(bid);
  }

  getBid(bidderAddr) {
    return this.#bids.find((bid) => bid.getBidderAddr() === bidderAddr);
  }

  deleteBid(bidderAddr) {
    const idx = this.#bids.findIndex((bid) => bid.getBidderAddr() === bidderAddr);

    if (idx < 0) {
      throw Error('bidderAddr not found');
    }

    this.#bids.splice(idx, 1);
  }

  getId() {
    return this.#tokenId;
  };

  getMinPrice() {
    return this.#minPrice;
  };

  getBids() {
    return [...this.#bids];
  }

  #tokenId;
  #minPrice;
  #bids;
}

export default class TokenFactory {
  createToken(tokenId, minPrice) {
    if (typeof tokenId !== 'number') {
      throw Error(tokenId + ' tokenId is not a number');
    }

    if (tokenId < 0) {
      throw Error(tokenId + ' tokenId must be greater than 0');
    }

    if (typeof minPrice !== 'number') {
      throw Error(minPrice + ' minPrice is not a number');
    }

    if (minPrice < 0) {
      throw Error(minPrice + ' minPrice must be greater than 0');
    }

    return new Token({tokenId, minPrice});
  }
}
