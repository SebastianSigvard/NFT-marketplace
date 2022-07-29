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
 * @param {String} ownerSignature Signautre of owner.
 * @return {Object} Status object.
 */
  createList(ownerAddr, nftContractAddr, tokenIds, minPrices, ownerSignature) {
    const ret = {status: 'error', message: 'default error'};

    const listsArray = Object.values(this.#lists);

    if (listsArray.find((list) => list.ownerAddr === ownerAddr && list.nftContractAddr === nftContractAddr)) {
      ret.status = 'error';
      ret.message = 'List already created, please add tokens individually';
      return ret;
    }

    if (! this.#checker.isValidAddr(ownerAddr)) {
      ret.status = 'error';
      ret.message = 'Owner Address is not valid';
      return ret;
    }

    if (! this.#checker.isValidAddr(nftContractAddr)) {
      ret.status = 'error';
      ret.message = 'nftContractAddr Address is not valid';
      return ret;
    }

    if (! this.#checker.isSignatureValid(ownerSignature, ownerAddr,
        ownerAddr,
        nftContractAddr)) {
      ret.status = 'error';
      ret.message = 'Invalid Owner Signature, please sign only ownerAddr, nftContractAddr arguments';
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

    ret.status = 'success';
    ret.list = {...list};
    ret.message = 'Auction list successfully added to Market';
    return ret;
  }

  /**
 * Deletes an auction list.
 * @param {Number} listId Id of list.
 * @param {String} ownerSignature Signautre of owner.
 * @return {Object} Status object.
 */
  deleteList(listId, ownerSignature) {
    const ret = {status: 'error', message: 'default error'};

    if (! this.#lists[listId]) {
      ret.status = 'error';
      ret.message = 'Invalid listId';
      return ret;
    }

    const {ownerAddr} = this.#lists[listId];

    if (! this.#checker.isSignatureValid(ownerSignature, ownerAddr,
        listId)) {
      ret.status = 'error';
      ret.message = 'Invalid Owner Signature';
      return ret;
    }

    delete this.#lists[listId];

    ret.status = 'success';
    ret.message = 'List deleted';
    return ret;
  }

  /**
 * Get all auction lists.
 * @return {Object} All lists.
 */
  getLists() {
    return Object.values(this.#lists);
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
 * @param {String} nftContractAddr Address of nft collection.
 * @param {Number}  tokenId Token id to put on auction.
 * @param {Number}  minPrice Minimum price of token.
 * @param {String} ownerSignature Signautre of owner.
 * @return {Object} Status object.
 */
  addTokenToList(listId, nftContractAddr, tokenId, minPrice, ownerSignature) {
    const ret = {status: 'error', message: 'default error'};

    if (! this.#lists[listId]) {
      ret.status = 'error';
      ret.message = 'Invalid listId';
      return ret;
    }

    const {ownerAddr} = this.#lists[listId];

    if (! this.#checker.isSignatureValid(ownerSignature, ownerAddr,
        listId,
        nftContractAddr,
        tokenId,
        minPrice)) {
      ret.status = 'error';
      ret.message = 'Invalid Owner Signature';
      return ret;
    }

    if (! this.#checker.isValidAddr(ownerAddr)) {
      ret.status = 'error';
      ret.message = 'Owner Address is not valid';
      return ret;
    }

    if (! this.#checker.isValidAddr(nftContractAddr)) {
      ret.status = 'error';
      ret.message = 'nftContractAddr Address is not valid';
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
 * @param {Number} tokenId Tokens ids to be deleted.
 * @param {String} ownerSignature Signautre of owner.
 * @return {Object} Status object.
 */
  deleteToken(listId, tokenId, ownerSignature) {
    const ret = {status: 'error', message: 'default error'};

    const idx = this.#lists[listId]?.tokenIds.indexOf(tokenId);

    if (idx === -1 || ! idx) {
      ret.status = 'error';
      ret.message = 'Invalid listId or tokenId';
      return ret;
    }

    const {ownerAddr} = this.#lists[listId];

    if (! this.#checker.isSignatureValid(ownerSignature, ownerAddr,
        listId,
        tokenId)) {
      ret.status = 'error';
      ret.message = 'Invalid Owner Signature';
      return ret;
    }

    this.#lists[listId].tokenIds.splice(idx, 1);
    this.#lists[listId].minPrices.splice(idx, 1);
    this.#lists[listId].bids = this.#lists[listId].bids.map((bid) => bid.tokenId !== tokenId);

    ret.status = 'success';
    ret.message = 'Token deleted';
    return ret;
  }

  /**
 * Get information of specific token.
 * @param {Number} listId Id of list.
 * @param {Number} tokenId Token id.
 * @return {Object} Info of token.
 */
  getToken(listId, tokenId) {
    const ret = {status: 'error', message: 'default error'};

    if (! this.#lists[listId]?.tokenIds.includes(tokenId)) {
      ret.status = 'error';
      ret.message = 'Invalid listId or tokenId';
      return ret;
    }

    const {ownerAddr, nftContractAddr, bids} = this.#lists[listId];
    const idx = this.#lists[listId].tokenIds.indexOf(tokenId);
    const minPrice = this.#lists[listId].minPrices[idx];

    let bestBid;

    if (bids.length !== 0 ) {
      const filteredBids = bids.filter( (bid) => bid.tokenId === tokenId );
      bestBid = Math.max(...filteredBids.map( (bid) => bid.erc20amount));
    }

    ret.status = 'success';
    ret.message = 'Token found';
    ret.data = {
      ownerAddr,
      nftContractAddr,
      minPrice,
      bestBid,
    };

    return ret;
  }

  /**
 * Adds a bid to a specific token id of a specific auction list.
 * @param {String} ownerAddr Address of nft's owner.
 * @param {String} bidderAddr Address of bidder.
 * @param {String} nftContractAddr Address of nft collection.
 * @param {Number} tokenId Token id.
 * @param {String} erc20ContractAddr Address of ERC20 contract.
 * @param {Number} erc20amount Amount of ERC20 token.
 * @param {String} bidderSignature Bidder signature of message.
 * @return {Object} Status object.
 */
  addBid(ownerAddr, bidderAddr, nftContractAddr, tokenId, erc20ContractAddr, erc20amount, bidderSignature) {
    const ret = {status: 'error', message: 'default error'};

    const listsArray = Object.values(this.#lists);

    const list = listsArray.find( (list) => list.nftContractAddr === nftContractAddr && list.ownerAddr === ownerAddr);

    const listId = list?.listId;

    if (! list) {
      ret.status = 'error';
      ret.message = 'No auction list with those nftContractAddr and ownerAddr';
      return ret;
    };

    if (! this.#lists[listId].tokenIds.includes(tokenId)) {
      ret.status = 'error';
      ret.message = 'Invalid tokenId';
      return ret;
    }

    const idx = this.#lists[listId].tokenIds.indexOf(tokenId);

    if ( this.#lists[listId].minPrices[idx] > erc20amount) {
      ret.status = 'error';
      ret.message = 'erc20amount is less than min price';
      return ret;
    }

    if (! this.#checker.isValidAddr(bidderAddr)) {
      ret.status = 'error';
      ret.message = 'Bidder address is not valid';
      return ret;
    }

    if (! this.#checker.isValidAddr(erc20ContractAddr)) {
      ret.status = 'error';
      ret.message = 'ERC20 contract address is not valid';
      return ret;
    }

    if (! this.#checker.isSignatureValid(bidderSignature, bidderAddr,
        ownerAddr,
        bidderAddr,
        nftContractAddr,
        tokenId,
        erc20ContractAddr,
        erc20amount)) {
      ret.status = 'error';
      ret.message = 'Invalid Bidder Signature';
      return ret;
    }

    const {bids} = this.#lists[listId];

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
 * @param {Number} tokenId Token id to be deleted.
 * @param {String} bidderAddr Address of bidder.
 * @param {String} bidderSignature Bidder signature of message.
 * @return {Boolean} true or false if listId existed and tokenId too.
 */
  deleteBid(listId, tokenId, bidderAddr, bidderSignature) {
    const ret = {status: 'error', message: 'default error'};

    if (! this.#lists[listId]?.tokenIds.includes(tokenId)) {
      ret.status = 'error';
      ret.message = 'Invalid listId or TokenId';
      return ret;
    };

    const newBids = this.#lists[listId].bids.filter((bid) => {
      return !( bid.tokenId === tokenId && bid.bidderAddr === bidderAddr);
    });

    if (newBids.length === this.#lists[listId].bids.length) {
      ret.status = 'error';
      ret.message = 'No bid found with that bidderAddr and tokenId';
      return ret;
    }

    if (! this.#checker.isSignatureValid(bidderSignature, bidderAddr,
        listId,
        tokenId,
        bidderAddr)) {
      ret.status = 'error';
      ret.message = 'Invalid Bidder Signature';
      return ret;
    }

    this.#lists[listId].bids = newBids;

    ret.status = 'success';
    ret.message = 'Bid deleted';
    return ret;
  }

  /**
 * Approves a bid.
 * @param {String} ownerAddr Address of nft's owner.
 * @param {String} bidderAddr Address of bidder.
 * @param {String} nftContractAddr Address of nft collection.
 * @param {Number} tokenId Token id.
 * @param {String} erc20ContractAddr Address of ERC20 contract.
 * @param {Number} erc20amount Amount of ERC20 token.
 * @param {String} ownerSignature Signautre of owner.
 * @return {Object} Status object.
 */
  approveBid(ownerAddr, bidderAddr, nftContractAddr, tokenId, erc20ContractAddr, erc20amount, ownerSignature) {
    const ret = {status: 'error', message: 'default error'};

    const listsArray = Object.values(this.#lists);

    const list = listsArray.find( (list) => list.nftContractAddr === nftContractAddr && list.ownerAddr === ownerAddr);

    const listId = list?.listId;

    if (! list) {
      ret.status = 'error';
      ret.message = 'No auction list with those nftContractAddr and ownerAddr';
      return ret;
    };

    if (! this.#checker.isSignatureValid(ownerSignature, ownerAddr,
        ownerAddr,
        bidderAddr,
        nftContractAddr,
        tokenId,
        erc20ContractAddr,
        erc20amount)) {
      ret.status = 'error';
      ret.message = 'Invalid owner Signature';
      return ret;
    }

    const {bids} = this.#lists[listId];

    const bid = bids.find( (bid) => bid.bidderAddr === bidderAddr && bid.tokenId === tokenId);

    if (! bid ) {
      ret.status = 'error';
      ret.message = 'There is no bid with provided argumetns bidderAddr and tokenId';
      return ret;
    }

    if (! (bid.erc20ContractAddr === erc20ContractAddr && bid.erc20amount === erc20amount) ) {
      ret.status = 'error';
      ret.message = 'erc20ContractAddr or erc20amount arguments not equal to auction list data';
      return ret;
    }

    bid.ownerSignature = ownerSignature;
    bid.approval = true;

    ret.status = 'success';
    ret.message = 'Successfully approved bid. on-chain transaction now can be executed';
    ret.bid = {
      ownerAddr,
      bidderAddr,
      nftContractAddr,
      tokenId,
      erc20ContractAddr,
      erc20amount,
      ownerSignature,
      bidderSignature: bid.bidderSignature,
    };

    return ret;
  }

  /**
 * Deletes a token without signature of owner.
 * @param {Number} listId Id of list.
 * @param {Number} tokenId Token id to be deleted.
 * @param {String} bidderAddr Address of bidder.
 * @return {Object} Status object.
*/
  getApprovedBid(listId, tokenId, bidderAddr) {
    const ret = {status: 'error', message: 'default error'};

    if (! this.#lists[listId]) {
      ret.status = 'error';
      ret.message = 'Invalid listId';
      return ret;
    }

    const bids = this.#lists[listId].bids;
    const bid = bids.find( (bid) => bid.bidderAddr === bidderAddr && bid.tokenId === tokenId);

    if (! bid ) {
      ret.status = 'error';
      ret.message = 'There is no bid with provided argumetns bidderAddr and tokenId';
      return ret;
    }

    if (! bid.approval) {
      ret.status = 'error';
      ret.message = 'Bid not yet approved';
      return ret;
    }

    const {ownerAddr, nftContractAddr} = this.#lists[listId];
    const {erc20ContractAddr, erc20amount, ownerSignature, bidderSignature} = bid;

    ret.status = 'success';
    ret.message = 'On-chain transaction can be executed';

    ret.bid = {
      ownerAddr,
      bidderAddr,
      nftContractAddr,
      tokenId,
      erc20ContractAddr,
      erc20amount,
      ownerSignature,
      bidderSignature,
    };

    return ret;
  }


  /**
 * Deletes a token without permission.
 * @param {String} ownerAddr Address of nft's owner.
 * @param {String} nftContractAddr Address of nft collection.
 * @param {Number} tokenId Tokens id.
 */
  localDeleteToken(ownerAddr, nftContractAddr, tokenId) {
    const listsArray = Object.values(this.#lists);

    const list = listsArray.find( (list) => list.nftContractAddr === nftContractAddr && list.ownerAddr === ownerAddr);

    if (!list) return;

    const listId = list.listId;

    const idx = this.#lists[listId]?.tokenIds.indexOf(tokenId);

    if (idx === -1 || ! idx) return;

    this.#lists[listId].tokenIds.splice(idx, 1);
    this.#lists[listId].minPrices.splice(idx, 1);
    this.#lists[listId].bids = this.#lists[listId].bids.map((bid) => bid.tokenId !== tokenId);
  }

  #lists;
  #nextListId;
  #checker;
}
