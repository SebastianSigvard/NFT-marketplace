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
    * @return {Object} Object with status (bool), on succes list id, on error message.
    */
  createList(ownerAddr, nftContractAddr, tokenIds, minPrices) {
    const ret = {status: false, message: 'default error'};

    const listsArray = Object.values(this.#lists);

    if (listsArray.find((list) => list.ownerAddr === ownerAddr && list.nftContractAddr === nftContractAddr)) {
      ret.status = false;
      ret.message = 'List already created, please add tokens individually';
      return ret;
    }

    const list = {
      listId: this.#nextListId++,
      ownerAddr,
      nftContractAddr,
      tokenIds,
      minPrices,
      bids: [],
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

    if (this.#lists[listId].tokenIds.includes(tokenId)) {
      ret.status = false;
      ret.message = `The tokenId[${tokenId}] it's allready inside auction list`;
      return ret;
    }

    this.#lists[listId].tokenIds.push(tokenId);
    this.#lists[listId].minPrices.push(minPrice);

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

    const idx = this.#lists[listId]?.tokenIds.indexOf(tokenId);

    if (idx === -1 || ! idx) {
      ret.status = false;
      ret.message = 'Invalid listId or tokenId';
      return ret;
    }

    this.#lists[listId].tokenIds.splice(idx, 1);
    this.#lists[listId].minPrices.splice(idx, 1);
    this.#lists[listId].bids = this.#lists[listId].bids.map((bid) => bid.tokenId !== tokenId);

    ret.status = true;
    ret.message = 'Token deleted';
    return ret;
  }

  /**
     *
    * @param {Number} listId Id of list.
    * @param {Number} tokenId Tokens ids to be deleted.
    * @param {String} bidderAddr Address of bidder.
    * @param {String} erc20ContractAddr Address of ERC20 contract.
    * @param {Number} erc20amount Amount of ERC20 token.
    * @param {String} bidderSignature Bidder signature of auction.
    * @return {Object} Object with status (bool), on error message.
    */
  addBid(listId, tokenId, bidderAddr, erc20ContractAddr, erc20amount, bidderSignature) {
    throw new Error('No implementation of AuctionStorageInterface virtual fun.');
    return {};
  }

  /** Adds a bid to a specific token id of a specific auction list.
    * Deletes a bid from a token from an auction list.
    * @param {Number} listId Id of list.
    * @param {Number} tokenId Token id to be deleted.
    * @param {String} bidderAddr Address of bidder.
    * @return {Object} Object with status (bool), on error message.
    */
  deleteBid(listId, tokenId, bidderAddr) {
    throw new Error('No implementation of AuctionStorageInterface virtual fun.');
    return {};
  }

  #lists;
  #nextListId;
}

export default new AuctionStorage();
