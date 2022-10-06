/**
 * Abstract class for Auction Storage Interface definition for
 * Auction manager.
 */
export class AuctionStorageInterface {
  /**
     * Creates a new auction list
    * @param {String} ownerAddr Address of nft's owner.
    * @param {String} nftContractAddr Address of nft collection.
    * @param {Array}  tokenIds Tokens ids to put on auction.
    * @param {Array}  minPrices Minimum price of each token.
    * @return {Object} Object with status (bool), on succes list, on error message.
    */
  addList(ownerAddr, nftContractAddr, tokenIds, minPrices) {
    throw new Error('No implementation of AuctionStorageInterface virtual fun.');
    return {};
  }

  /**
    * Deletes an auction list.
    * @param {Number} listId Id of list.
    * @return {Object} Object with status (bool), on error message.
    */
  deleteList(listId) {
    throw new Error('No implementation of AuctionStorageInterface virtual fun.');
    return {};
  }

  /**
    * Get an specific auction list.
    * @param {Number} listId Id of list.
    * @return {Object} Requested list, on error undefined.
    */
  getList(listId) {
    throw new Error('No implementation of AuctionStorageInterface virtual fun.');
    return {};
  }

  /**
    * Get all auction lists.
    * @return {Object} All lists.
    */
  getLists() {
    throw new Error('No implementation of AuctionStorageInterface virtual fun.');
    return {};
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
    throw new Error('No implementation of AuctionStorageInterface virtual fun.');
    return {};
  }

  /**
    * Deletes a token from an auction list.
    * @param {Number} listId Id of list.
    * @param {Number} tokenId Tokens ids to be deleted.
    * @return {Object} Object with status (bool), on error message.
    */
  deleteToken(listId, tokenId) {
    throw new Error('No implementation of AuctionStorageInterface virtual fun.');
    return {};
  }

  /**
    * Returns solicited token.
    * @param {Number} listId Id of list.
    * @param {Number} tokenId Tokens ids to be deleted.
    * @return {Object} Object with status (bool), on succes token, on error message.
    */
  getToken(listId, tokenId) {
    throw new Error('No implementation of AuctionStorageInterface virtual fun.');
    return {};
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

  /** Get bid
    * @param {Number} listId Id of list.
    * @param {Number} tokenId Token id to be deleted.
    * @param {String} bidderAddr Address of bidder.
    * @return {Object} Object with status (bool),on succes bid, on error message.
    */
  getBid(listId, tokenId, bidderAddr) {
    throw new Error('No implementation of AuctionStorageInterface virtual fun.');
    return {};
  }
}

export default new AuctionStorageInterface();
