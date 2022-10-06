import AuctionStorageInterface from './auctionStorageInterface';

/**
 * Implementation of an Auction Storage following Interface definition.
 */
class AuctionStorage extends AuctionStorageInterface {
  /**
     * Creates a new auction list
    * @param {String} ownerAddr Address of nft's owner.
    * @param {String} nftContractAddr Address of nft collection.
    * @param {Array}  tokenIds Tokens ids to put on auction.
    * @param {Array}  minPrices Minimum price of each token.
    * @return {Object} Object with status (bool), on succes list, on error message.
    */
  addList(ownerAddr, nftContractAddr, tokenIds, minPrices) {
    const ret = {status: false, message: 'default error'};

    const listsArray = Object.values(this.#lists);

    if (listsArray.find((list) => list.ownerAddr === ownerAddr && list.nftContractAddr === nftContractAddr)) {
      ret.status = false;
      ret.message = 'List already created, please add tokens individually';
      return ret;
    }

    const tokens = tokenIds.map( (tokenId, idx) => ({
      id: tokenId,
      minPrice: minPrices[idx],
      bids: [],
    }));

    const list = {
      listId: this.#nextListId++,
      ownerAddr,
      nftContractAddr,
      tokens,
    };

    this.#lists[list.listId] = list;

    ret.status = true;
    ret.list = {...list};
    ret.message = 'Auction list successfully added to Market';
    return ret;
  }

  /**
    * Deletes an auction list.
    * @param {Number} listId Id of list.
    * @return {Object} Object with status (bool), on error message.
    */
  deleteList(listId) {
    const ret = {status: false, message: 'default error'};

    if (! this.#lists[listId]) {
      ret.status = false;
      ret.message = 'Invalid listId';
      return ret;
    }

    delete this.#lists[listId];

    ret.status = true;
    ret.message = 'List deleted';
    return ret;
  }

  /**
    * Get an specific auction list.
    * @param {Number} listId Id of list.
    * @return {Object} Requested list, on error undefined.
    */
  getList(listId) {
    return this.#lists[listId];
  }

  /**
    * Get all auction lists.
    * @return {Object} All lists.
    */
  getLists() {
    return Object.values(this.#lists);
  }

  /**
    * Adds a token to an allready existing auction list.
    * @param {Number} listId Id of list.
    * @param {String} nftContractAddr Address of nft collection.
    * @param {Number} tokenId Token id to put on auction.
    * @param {Number} minPrice Minimum price of token.
    * @return {Object} Object with status (bool), on error message.
    */
  addToken(listId, nftContractAddr, tokenId, minPrice) {
    const ret = {status: false, message: 'default error'};

    if (! this.#lists[listId]) {
      ret.status = false;
      ret.message = 'Invalid listId';
      return ret;
    }

    if (this.#lists[listId].tokens.find( (token) => token.id === tokenId)) {
      ret.status = false;
      ret.message = `The tokenId[${tokenId}] it's allready inside auction list`;
      return ret;
    }

    this.#lists[listId].tokens.push({
      id: tokenId,
      minPrice: minPrice,
      bids: [],
    });

    ret.status = true;
    ret.message = 'Token added to list';
    return ret;
  }

  /**
    * Deletes a token from an auction list.
    * @param {Number} listId Id of list.
    * @param {Number} tokenId Tokens ids to be deleted.
    * @return {Object} Object with status (bool), on error message.
    */
  deleteToken(listId, tokenId) {
    const ret = {status: false, message: 'default error'};

    if (! this.#lists[listId]) {
      ret.status = false;
      ret.message = 'Invalid listId';
      return ret;
    }

    const token = this.#lists[listId].tokens.find( (token) => token.id === tokenId);
    if (! token) {
      ret.status = false;
      ret.message = 'Invalid tokenId';
      return ret;
    }

    const idx = this.#lists[listId]?.tokens.indexOf(token);

    this.#lists[listId].tokens.splice(idx, 1);

    ret.status = true;
    ret.message = 'Token deleted';
    return ret;
  }

  /**
    * Returns solicited token.
    * @param {Number} listId Id of list.
    * @param {Number} tokenId Tokens ids to be deleted.
    * @return {Object} Object with status (bool), on succes token, on error message.
    */
  getToken(listId, tokenId) {
    const ret = {status: false, message: 'default error'};

    if (! this.#lists[listId]) {
      ret.status = false;
      ret.message = 'Invalid listId';
      return ret;
    }

    const token = this.#lists[listId].tokens.find( (token) => token.id === tokenId);
    if (! token) {
      ret.status = false;
      ret.message = 'Invalid tokenId';
      return ret;
    }

    ret.status = true;
    ret.message = 'Success';
    ret.token = token;
    return ret;
  }

  /**
     * Adds or updates bid
    * @param {Number} listId Id of list.
    * @param {Number} tokenId Tokens ids to be deleted.
    * @param {String} bidderAddr Address of bidder.
    * @param {String} erc20ContractAddr Address of ERC20 contract.
    * @param {Number} erc20amount Amount of ERC20 token.
    * @param {String} bidderSignature Bidder signature of auction.
    * @param {String} ownerSignature Bidder signature of auction.
    * @param {String} approval Bidder signature of auction.
    * @return {Object} Object with status (bool), on error message.
    */
  addBid(listId, tokenId, bidderAddr, erc20ContractAddr, erc20amount,
      bidderSignature, ownerSignature = undefined, approval = false) {
    const ret = {status: false, message: 'default error'};

    if (! this.#lists[listId]) {
      ret.status = false;
      ret.message = 'Invalid listId';
      return ret;
    }

    const token = this.#lists[listId].tokens.find( (token) => token.id === tokenId);
    if (! token) {
      ret.status = false;
      ret.message = 'Invalid tokenId';
      return ret;
    }
    const {bids} = token;

    let bid = bids.find( (bid) => bid.bidderAddr === bidderAddr && bid.tokenId === tokenId);

    ret.status = 'success';

    if ( ! bid ) {
      bid = {
        bidderAddr,
        tokenId,
        erc20ContractAddr,
        erc20amount,
        ownerSignature: undefined,
        bidderSignature,
        approval: false,
      };

      bids.push(bid);

      ret.message = 'Bid added';
      return ret;
    }

    bid.erc20amount = erc20amount;
    bid.bidderSignature = bidderSignature;
    bid.ownerSignature = ownerSignature;
    bid.approval = approval;

    ret.message = 'Bid updated';
    return ret;
  }

  /** Deletes a bid from a token from an auction list.
    * @param {Number} listId Id of list.
    * @param {Number} tokenId Token id to be deleted.
    * @param {String} bidderAddr Address of bidder.
    * @return {Object} Object with status (bool), on error message.
    */
  deleteBid(listId, tokenId, bidderAddr) {
    const ret = {status: false, message: 'default error'};

    if (! this.#lists[listId]) {
      ret.status = false;
      ret.message = 'Invalid listId';
      return ret;
    }

    const token = this.#lists[listId].tokens.find( (token) => token.id === tokenId);
    if (! token) {
      ret.status = false;
      ret.message = 'Invalid tokenId';
      return ret;
    }
    const {bids} = token;

    const newBids = bids.filter((bid) => {
      return !( bid.tokenId === tokenId && bid.bidderAddr === bidderAddr);
    });

    if (newBids.length === bids.length) {
      ret.status = 'error';
      ret.message = 'No bid found with that bidderAddr and tokenId';
      return ret;
    }

    token.bids = newBids;

    ret.status = 'success';
    ret.message = 'Bid deleted';
    return ret;
  }

  /** Get bid
    * @param {Number} listId Id of list.
    * @param {Number} tokenId Token id to be deleted.
    * @param {String} bidderAddr Address of bidder.
    * @return {Object} Object with status (bool),on succes bid, on error message.
    */
  getBid(listId, tokenId, bidderAddr) {
    const ret = {status: false, message: 'default error'};

    if (! this.#lists[listId]) {
      ret.status = false;
      ret.message = 'Invalid listId';
      return ret;
    }

    const token = this.#lists[listId].tokens.find( (token) => token.id === tokenId);
    if (! token) {
      ret.status = false;
      ret.message = 'Invalid tokenId';
      return ret;
    }
    const {bids} = token;

    const bid = bids.find((bid) => bid.bidderAddr === bidderAddr);
    if (! bid) {
      ret.status = false;
      ret.message = 'Not bid found with that bidderAddr';
      return ret;
    }

    ret.status = true;
    ret.message = 'Bid found';
    ret.bid = bid;
    return ret;
  }

  #lists;
  #nextListId;
}

export default new AuctionStorage();
