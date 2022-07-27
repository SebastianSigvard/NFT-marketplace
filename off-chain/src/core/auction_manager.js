/**
 * AuctionManager, mantains list of nfts and their bids.
 */
export default class AuctionManager {
  /**
 * AuctionManager constructor.
 * @param {Object} checker Dep Inject of data validator.
 */
  constructor(checker) {
    this.#checker = checker;
    this.#lists = {};
    this.#nextListId = 0;
  }

  /**
 * Create an auction list.
 * @param {String} ownerAddr Address of nft's owner.
 * @param {String} nftContractAddr Address of nft collection.
 * @param {Array}  tokenIds Tokens ids to put on auction.
 * @param {Array}  minPrices Minimum price of each token.
 * @return {Object} Status object.
 */
  async createList(ownerAddr, nftContractAddr, tokenIds, minPrices) {
    const ret = {status: 'error', message: 'default error'};

    if (! await this.#checker.isValidAddr(ownerAddr)) {
      ret.status = 'error';
      ret.message = 'Owner Address is not valid';
      return ret;
    }

    if (! await this.#checker.isValidAddr(nftContractAddr)) {
      ret.status = 'error';
      ret.message = 'nftContractAddr Address is not valid';
      return ret;
    }

    for (const tokenId of tokenIds) {
      if (! await this.#checker.validNftOwner(ownerAddr, nftContractAddr, tokenId)) {
        ret.status = 'error'; 1;
        ret.message = `The ownerAddr is not the owner of tokenId[${tokenId}]`;
        return ret;
      }

      if (! await this.#checker.isNftApproved(ownerAddr, nftContractAddr, tokenId)) {
        ret.status = 'error';
        ret.message = `The tokenId[${tokenId}] was not approved to NFT Market`;
        return ret;
      }
    }

    const list = {
      ownerAddr,
      nftContractAddr,
      tokenIds,
      minPrices,
      bids: [],
    };

    this.#lists[this.#nextListId++] = list;

    ret.status = 'success';
    ret.message = 'Auction list successfully added to Market';
    return ret;
  }

  /**
 * Deletes an auction list.
 * @param {Number} listId Id of list.
 * @return {Boolean} true or false if listId existed.
 */
  deletList(listId) {
    if (listId in this.#lists) {
      delete this.#lists[listId];
      return true;
    }

    return false;
  }

  /**
 * Get all auction lists.
 * @return {Object} All lists.
 */
  getLists() {
    return {...this.listId};
  }

  /**
 * Get an specific auction list.
 * @param {Number} listId Id of list.
 * @return {Object} Requested list.
 */
  getList(listId) {
    return this.#lists[listId];
  }

  /**
 * Adds a token to an allready existing auction list.
 * @param {Number} listId Id of list.
 * @param {String} ownerAddr Address of nft's owner.
 * @param {String} nftContractAddr Address of nft collection.
 * @param {Array}  tokenId Token id to put on auction.
 * @param {Array}  minPrice Minimum price of token.
 * @return {Object} Status object.
 */
  async addTokenToList(listId, ownerAddr, nftContractAddr, tokenId, minPrice) {
    const ret = {status: 'error', message: 'default error'};

    if (! await this.#checker.isValidAddr(ownerAddr)) {
      ret.status = 'error';
      ret.message = 'Owner Address is not valid';
      return ret;
    }

    if (! await this.#checker.isValidAddr(nftContractAddr)) {
      ret.status = 'error';
      ret.message = 'nftContractAddr Address is not valid';
      return ret;
    }

    if (! await this.#checker.validNftOwner(ownerAddr, nftContractAddr, tokenId)) {
      ret.status = 'error';
      ret.message = `The ownerAddr is not the owner of tokenId[${tokenId}]`;
      return ret;
    }

    if (! await this.#checker.isNftApproved(ownerAddr, nftContractAddr, tokenId)) {
      ret.status = 'error';
      ret.message = `The tokenId[${tokenId}] was not approved to NFT Market`;
      return ret;
    }

    if (this.#lists[listId].tokenIds.includes(tokenId)) {
      ret.status = 'error';
      ret.message = `The tokenId[${tokenId}] it's allready inside auction list`;
      return ret;
    }

    this.#lists[listId].tokenIds.push(tokenId);
    this.#lists[listId].minPrices.push(minPrice);

    ret.status = 'success';
    ret.message = 'Token added to list';
    return ret;
  }

  /**
 * Deletes a token from an auction list.
 * @param {Number} listId Id of list.
 * @param {Array}  tokenId Tokens ids to be deleted.
 * @return {Boolean} true or false if listId existed and tokenId too.
 */
  deletToken(listId, tokenId) {
    const idx = this.#lists[listId]?.tokenIds.indexOf(tokenId);

    if (index < -1) return false;

    this.#lists[listId].tokenIds.splice(idx, 1);
    this.#lists[listId].minPrices.splice(idx, 1);
    this.#lists[listId].bids = this.#lists[listId].bids.map((bid) => bid.tokenId !== tokenId);

    return true;
  }

  /**
 * Get information of specific token.
 * @param {Number} listId Id of list.
 * @param {Array}  tokenId Tokens ids.
 * @return {Object} Info of token.
 */
  getToken(listId, tokenId) {
    if (! this.#lists[listId]?.tokenIds.includes(tokenId)) return;

    const {ownerAddr, nftContractAddr, bids} = this.#lists[listId];
    const idx = this.#lists[listId].tokenIds.indexOf(tokenId);
    const minPrice = this.#lists[listId].minPrices[idx];

    let bestBid;

    if (bids.length !== 0 ) {
      const filteredBids = bids.filter( (bid) => bid.tokenId === tokenId );
      bestBid = Math.max(...filteredBids.map( (bid) => bid.erc20amount));
    }

    return {
      ownerAddr,
      nftContractAddr,
      minPrice,
      bestBid,
    };
  }

  /**
 * Adds a bid to a specific token id of a specific auction list.
 * @param {Number} listId Id of list.
 * @param {Array}  tokenId Tokens ids.
 * @param {String} bidderAddr Address of bidder.
 * @param {String} erc20ContractAddr Address of ERC20 contract.
 * @param {Number} erc20amount Token id to put on auction.
 * @param {String} bidderSignature Minimum price of token.
 * @return {Object} Status object.
 */
  async addBid(listId, tokenId, bidderAddr, erc20ContractAddr, erc20amount, bidderSignature) {
    const ret = {status: 'error', message: 'default error'};

    if (! this.#lists[listId]?.tokenIds.includes(tokenId)) {
      ret.status = 'error';
      ret.message = 'Invalid listId or TokenId';
      return ret;
    };

    if (! await this.#checker.isValidAddr(bidderAddr)) {
      ret.status = 'error';
      ret.message = 'Bidder address is not valid';
      return ret;
    }

    if (! await this.#checker.isValidAddr(erc20ContractAddr)) {
      ret.status = 'error';
      ret.message = 'ERC20 contract address is not valid';
      return ret;
    }

    if (! await this.#checker.isERC20AmountApproved(erc20ContractAddr, bidderAddr, erc20amount)) {
      ret.status = 'error';
      ret.message = 'ERC20 amount is not approved to Market';
      return ret;
    }

    const {ownerAddr, nftContractAddr, bids} = this.#lists[listId];

    if (! await this.#checker.isSignatureValid(
        bidderSignature,
        bidderAddr,
        ownerAddr,
        bidderAddr,
        nftContractAddr,
        tokenId,
        erc20ContractAddr,
        erc20amount)) {
      ret.status = 'error';
      ret.message = 'Invalid Bidder Signature';
    }

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

    ret.message = 'Bid updated';
    return ret;
  }

  /**
 * Deletes a bid from a token from an auction list.
 * @param {Number} listId Id of list.
 * @param {Array}  tokenId Tokens ids to be deleted.
 * @param {String} bidderAddr Address of bidder.
 * @param {String} bidderSignature Bidder signature of message.
 * @return {Boolean} true or false if listId existed and tokenId too.
 */
  async deletBid(listId, tokenId, bidderAddr, bidderSignature) {
    const ret = {status: 'error', message: 'default error'};

    if (! this.#lists[listId]?.tokenIds.includes(tokenId)) {
      ret.status = 'error';
      ret.message = 'Invalid listId or TokenId';
      return ret;
    };

    if (! await this.#checker.isSignatureValid(
        bidderSignature,
        bidderAddr,
        listId,
        tokenId,
        bidderAddr)) {
      ret.status = 'error';
      ret.message = 'Invalid Bidder Signature';
    }

    this.#lists[listId].bids = this.#lists[listId].bids.map((bid) => {
      return !( bid.tokenId === tokenId && bid.bidderAddr === bidderAddr);
    });

    ret.status = 'success';
    ret.message = 'Bid deleted';
    return ret;
  }


  #lists;
  #nextListId;
  #checker;
}

// Pedir signature para todo los accesos de modificación
// Modificar bid id para que la signature quede con los argumentos de la función
// TODO:  add best bid to list, when delete a bid checks if is the best bid, when adda a bid checks if its best bid
