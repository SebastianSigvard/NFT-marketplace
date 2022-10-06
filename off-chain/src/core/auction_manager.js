import auctionStorageInterface, {AuctionStorageInterface} from '../infra/auctionStorageInterface';

/**
 * AuctionManager, mantains list of nfts and their bids.
 */
export default class AuctionManager {
  /**
 * AuctionManager constructor.
 * @param {Object} checker Dep Inject of data validator.
 * @param {AuctionStorageInterface} auctionStorage Storage dep.
 */
  constructor(checker, auctionStorage = auctionStorageInterface) {
    this.#checker = checker;

    if (! (Object.getPrototypeOf(auctionStorage) instanceof AuctionStorageInterface)) {
      throw Error('auctionStorage dep inject must be an instance of AuctionStorageInterface');
    }

    this.#auctionStorage = auctionStorage;
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
    const ret = {status: false, message: 'default error'};

    if (! this.#checker.isValidAddr(ownerAddr)) {
      ret.status = false;
      ret.message = 'Owner Address is not valid';
      return ret;
    }

    if (! this.#checker.isValidAddr(nftContractAddr)) {
      ret.status = false;
      ret.message = 'nftContractAddr Address is not valid';
      return ret;
    }

    if (! this.#checker.isSignatureValid(ownerSignature, ownerAddr,
        ownerAddr,
        nftContractAddr)) {
      ret.status = false;
      ret.message = 'Invalid Owner Signature, please sign only ownerAddr, nftContractAddr arguments';
      return ret;
    }

    return this.#auctionStorage.addList(ownerAddr, nftContractAddr, tokenIds, minPrices);
  }

  /**
 * Deletes an auction list.
 * @param {Number} listId Id of list.
 * @param {String} ownerSignature Signautre of owner.
 * @return {Object} Status object.
 */
  deleteList(listId, ownerSignature) {
    const ret = {status: false, message: 'default error'};

    const list = this.#auctionStorage.getList(listId);

    if (! list) {
      ret.status = false;
      ret.message = 'Invalid listId';
      return ret;
    }

    if (! this.#checker.isSignatureValid(ownerSignature, list.ownerAddr,
        listId)) {
      ret.status = false;
      ret.message = 'Invalid Owner Signature';
      return ret;
    }

    return this.#auctionStorage.deleteList(listId);
  }

  /**
 * Get all auction lists.
 * @return {Object} All lists.
 */
  getLists() {
    return this.#auctionStorage.getLists();
  }

  /**
 * Get an specific auction list.
 * @param {Number} listId Id of list.
 * @return {Object} Requested list.
 */
  getList(listId) {
    return this.#auctionStorage.getList(listId);
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
    const ret = {status: false, message: 'default error'};

    const list = this.#auctionStorage.getList(listId);

    if (! list) {
      ret.status = false;
      ret.message = 'Invalid listId';
      return ret;
    }

    if (! this.#checker.isSignatureValid(ownerSignature, list.ownerAddr,
        listId,
        nftContractAddr,
        tokenId,
        minPrice)) {
      ret.status = false;
      ret.message = 'Invalid Owner Signature';
      return ret;
    }

    if (! this.#checker.isValidAddr(list.ownerAddr)) {
      ret.status = false;
      ret.message = 'Owner Address is not valid';
      return ret;
    }

    if (! this.#checker.isValidAddr(nftContractAddr)) {
      ret.status = false;
      ret.message = 'nftContractAddr Address is not valid';
      return ret;
    }

    return this.#auctionStorage.addToken(listId, nftContractAddr, tokenId, minPrice);
  }

  /**
 * Deletes a token from an auction list.
 * @param {Number} listId Id of list.
 * @param {Number} tokenId Tokens ids to be deleted.
 * @param {String} ownerSignature Signautre of owner.
 * @return {Object} Status object.
 */
  deleteToken(listId, tokenId, ownerSignature) {
    const ret = {status: false, message: 'default error'};

    const list = this.#auctionStorage.getList(listId);

    if (! list) {
      ret.status = false;
      ret.message = 'Invalid listId';
      return ret;
    }

    if (! this.#checker.isSignatureValid(ownerSignature, list.ownerAddr,
        listId,
        tokenId)) {
      ret.status = false;
      ret.message = 'Invalid Owner Signature';
      return ret;
    }

    return this.#auctionStorage.deleteToken(listId, tokenId);
  }

  /**
 * Get information of specific token.
 * @param {Number} listId Id of list.
 * @param {Number} tokenId Token id.
 * @return {Object} Info of token.
 */
  getToken(listId, tokenId) {
    const ret = {status: false, message: 'default error'};

    const list = this.#auctionStorage.getList(listId);

    if (! list) {
      ret.status = false;
      ret.message = 'Invalid listId';
      return ret;
    }

    const res = this.#auctionStorage.getToken(listId, tokenId);
    if (! res.status) return res;

    const {minPrice, bids} = res.token;

    let bestBid;

    if (bids.length !== 0 ) {
      const filteredBids = bids.filter( (bid) => bid.tokenId === tokenId );
      bestBid = Math.max(...filteredBids.map( (bid) => bid.erc20amount));
    }

    ret.status = true;
    ret.message = 'Token found';
    ret.data = {
      ownerAddr: list.ownerAddr,
      nftContractAddr: list.nftContractAddr,
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
    const ret = {status: false, message: 'default error'};

    const listsArray = this.#auctionStorage.getLists();

    const list = listsArray.find( (list) => list.nftContractAddr === nftContractAddr && list.ownerAddr === ownerAddr);

    if (! list) {
      ret.status = false;
      ret.message = 'No auction list with those nftContractAddr and ownerAddr';
      return ret;
    };

    const res = this.#auctionStorage.getToken(list.listId, tokenId);
    if (! res.status) {
      ret.status = false;
      ret.message = 'Invalid tokenId';
      return ret;
    }

    if ( res.token.minPrice > erc20amount) {
      ret.status = false;
      ret.message = 'erc20amount is less than min price';
      return ret;
    }

    if (! this.#checker.isValidAddr(bidderAddr)) {
      ret.status = false;
      ret.message = 'Bidder address is not valid';
      return ret;
    }

    if (! this.#checker.isValidAddr(erc20ContractAddr)) {
      ret.status = false;
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
      ret.status = false;
      ret.message = 'Invalid Bidder Signature';
      return ret;
    }

    return this.#auctionStorage.addBid(list.listId, tokenId, bidderAddr,
        erc20ContractAddr, erc20amount, bidderSignature);
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
    const ret = {status: false, message: 'default error'};

    if (! this.#checker.isSignatureValid(bidderSignature, bidderAddr,
        listId,
        tokenId,
        bidderAddr)) {
      ret.status = false;
      ret.message = 'Invalid Bidder Signature';
      return ret;
    }

    return this.#auctionStorage.deleteBid(listId, tokenId, bidderAddr);
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
    const ret = {status: false, message: 'default error'};

    const listsArray = this.#auctionStorage.getLists();

    const list = listsArray.find( (list) => list.nftContractAddr === nftContractAddr && list.ownerAddr === ownerAddr);

    if (! list) {
      ret.status = false;
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
      ret.status = false;
      ret.message = 'Invalid owner Signature';
      return ret;
    }
    let res = this.#auctionStorage.getBid(list.listId, tokenId, bidderAddr);
    if (!res.status) return res;
    const bidderSignature = res.bid.bidderSignature;
    if (res.bid.erc20ContractAddr !== erc20ContractAddr || res.bid.erc20amount !== erc20amount) {
      ret.status = false;
      ret.message = 'erc20ContractAddr or erc20amount arguments not equal to auction list data';
      return ret;
    }

    res = this.#auctionStorage.addBid(list.listId, tokenId, bidderAddr, erc20ContractAddr, erc20amount,
        bidderSignature, ownerSignature, true);

    if (! res.status) return res;

    ret.status = true;
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
 * Gets aprroved bid.
 * @param {Number} listId Id of list.
 * @param {Number} tokenId Token id to be deleted.
 * @param {String} bidderAddr Address of bidder.
 * @return {Object} Status object.
*/
  getApprovedBid(listId, tokenId, bidderAddr) {
    const ret = {status: false, message: 'default error'};

    const list = this.#auctionStorage.getList(listId);

    if (! list) {
      ret.status = false;
      ret.message = 'Invalid listId';
      return ret;
    }

    const res = this.#auctionStorage.getBid(listId, tokenId, bidderAddr);

    if (! res.status ) return res;

    if (! res.bid.approval) {
      ret.status = false;
      ret.message = 'Bid not yet approved';
      return ret;
    }

    const {ownerAddr, nftContractAddr} = list;
    const {erc20ContractAddr, erc20amount, ownerSignature, bidderSignature} = res.bid;

    ret.status = true;
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
    const listsArray = this.#auctionStorage.getLists();

    const list = listsArray.find( (list) => list.nftContractAddr === nftContractAddr && list.ownerAddr === ownerAddr);

    if (!list) return;

    this.#auctionStorage.deleteToken(list.listId, tokenId);
  }

  #auctionStorage;
  #checker;
}
