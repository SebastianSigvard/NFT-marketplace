import BidFactory, {Bid} from './bid.js';

export class Token {
  constructor(options) {
    this.#tokenId = options.tokenId;
    this.#minPrice = options.minPrice;
    this.#bids = [];
  }

  addBid(bid) {
    if (! (bid instanceof Bid)) {
      throw Error('bid must be instance of Bid');
    }

    if (bid.getErc20Amount() < this.#minPrice) {
      throw Error('erc20amount is less than minPrice');
    }

    const idx = this.#bids.findIndex((_bid) => _bid.getBidderAddr() === bid.getBidderAddr() );

    if ( idx < 0) {
      this.#bids.push(bid);
    } else {
      this.#bids[idx] = bid;
    }
  }

  getBid(bidderAddr) {
    const bid = this.#bids.find((bid) => bid.getBidderAddr() === bidderAddr);

    if (!bid) {
      throw Error('no bid found with bidderAddr ' + bidderAddr);
    }

    return bid;
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
  constructor(validator) {
    this.#bidFactory = new BidFactory(validator);
  }

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

  copyToken(token) {
    if (! (token instanceof Token)) {
      throw Error('token is not an instance of Token');
    }

    const tokenCp = new Token({tokenId: token.getId(), minPrice: token.getMinPrice()});

    for (const bid of token.getBids()) {
      tokenCp.addBid(this.#bidFactory.copyBid(bid));
    }

    return tokenCp;
  }

  #bidFactory;
}
