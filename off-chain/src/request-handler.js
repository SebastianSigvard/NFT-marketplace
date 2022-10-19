import MemAuctionStorage from './infra/memAuctionStorage.js';
import AuctionManager from './core/auction-manager.js';
import Validator from './infra/validator.js';
import dotenv from 'dotenv';
import Web3 from 'web3';
dotenv.config();

class RequestHandler {
  constructor() {
    const web3 = new Web3(process.env.API_URL);

    this.#validator = new Validator(web3);

    const memAuctionStorage = new MemAuctionStorage(this.#validator);

    this.#auctionManager = new AuctionManager(
        this.#validator,
        memAuctionStorage,
    );
  }

  createList({ownerAddr, nftContractAddr, tokens, ownerSignature}) {
    if ( ownerAddr === undefined ||
        nftContractAddr === undefined ||
        tokens === undefined ||
        ownerSignature === undefined
    ) {
      return {
        status: false,
        message: 'body must have ownerAddr, nftContractAddr, tokens and ownerSignature',
      };
    }

    if ( this.#validator.isSignatureValid(ownerSignature, ownerAddr,
        ownerAddr,
        nftContractAddr)
    ) {
      return {
        status: false,
        message: 'Invalid Owner Signature, please sign only ownerAddr and nftContractAddr arguments',
      };
    }

    try {
      const res = this.#auctionManager.createList(
          ownerAddr,
          nftContract,
          tokens,
      );

      return {status: true, message: res};
    } catch (err) {
      return {status: false, message: err.message};
    }
  }

  deleteList({listId, ownerAddr, ownerSignature}) {
    if ( listId === undefined ||
        ownerAddr === undefined ||
        ownerSignature === undefined
    ) {
      return {
        status: false,
        message: 'body must have listId, ownerAddr and ownerSignature',
      };
    }

    if ( this.#validator.isSignatureValid(ownerSignature, ownerAddr,
        listId)
    ) {
      return {
        status: false,
        message: 'Invalid Owner Signature',
      };
    }

    try {
      const res = this.#auctionManager.deleteList(listId);

      return {status: true, message: res};
    } catch (err) {
      return {status: false, message: err.message};
    }
  }

  getList({listId}) {
    if ( listId === undefined) {
      return {
        status: false,
        message: 'Request must have listId',
      };
    }

    try {
      const res = this.#auctionManager.getList(listId);

      return {status: true, message: res};
    } catch (err) {
      return {status: false, message: err.message};
    }
  }

  getLists() {
    try {
      const res = this.#auctionManager.getLists();

      return {status: true, message: res};
    } catch (err) {
      return {status: false, message: err.message};
    }
  }

  addToken({listId, token, ownerAddr, ownerSignature}) {
    if ( listId === undefined ||
        token === undefined ||
        ownerAddr === undefined ||
        ownerSignature === undefined
    ) {
      return {
        status: false,
        message: 'body must have listId, token, ownerAddr and ownerSignature',
      };
    }

    if ( this.#validator.isSignatureValid(ownerSignature, ownerAddr,
        listId,
        token,
        ownerAddr)
    ) {
      return {
        status: false,
        message: 'Invalid Owner Signature',
      };
    }

    try {
      const res = this.#auctionManager.addToken(
          listId,
          token,
      );

      return {status: true, message: res};
    } catch (err) {
      return {status: false, message: err.message};
    }
  }

  deleteToken({listId, tokenId, ownerAddr, ownerSignature}) {
    if ( listId === undefined ||
        tokenId === undefined ||
        ownerAddr === undefined ||
        ownerSignature === undefined
    ) {
      return {
        status: false,
        message: 'body must have listId, tokenId, ownerAddr and ownerSignature',
      };
    }

    if ( this.#validator.isSignatureValid(ownerSignature, ownerAddr,
        listId,
        tokenId,
        ownerAddr)
    ) {
      return {
        status: false,
        message: 'Invalid Owner Signature',
      };
    }

    try {
      const res = this.#auctionManager.deleteToken(
          listId,
          tokenId,
      );

      return {status: true, message: res};
    } catch (err) {
      return {status: false, message: err.message};
    }
  }

  getToken({listId, tokenId}) {
    if ( listId === undefined ||
        tokenId === undefined
    ) {
      return {
        status: false,
        message: 'body must have listId and tokenId',
      };
    }

    try {
      const res = this.#auctionManager.getToken(
          listId,
          tokenId,
      );

      return {status: true, message: res};
    } catch (err) {
      return {status: false, message: err.message};
    }
  }

  makeBid({ownerAddr,
    bidderAddr,
    nftContractAddr,
    tokenId,
    erc20ContractAddr,
    erc20amount,
    bidderSignature}) {
    if ( ownerAddr === undefined ||
        bidderAddr === undefined ||
        nftContractAddr === undefined ||
        tokenId === undefined ||
        erc20ContractAddr === undefined ||
        erc20amount === undefined ||
        bidderSignature === undefined
    ) {
      return {
        status: false,
        message: 'body must have ownerAddr, ' +
      'bidderAddr, ' +
      'nftContractAddr, ' +
      'tokenId, ' +
      'erc20ContractAddr, ' +
      'erc20amount and ' +
      'bidderSignature',
      };
    }

    if ( this.#validator.isSignatureValid(bidderSignature, bidderAddr,
        ownerAddr,
        bidderAddr,
        nftContractAddr,
        tokenId,
        erc20ContractAddr,
        erc20amountlistId)
    ) {
      return {
        status: false,
        message: 'Invalid Bidder Signature',
      };
    }

    try {
      const res = this.#auctionManager.makeBid(ownerAddr,
          bidderAddr,
          nftContractAddr,
          tokenId,
          erc20ContractAddr,
          erc20amount,
          bidderSignature,
      );

      return {status: true, message: res};
    } catch (err) {
      return {status: false, message: err.message};
    }
  }

  deleteBid({listId, tokenId, bidderAddr, bidderSignature}) {
    if ( listId === undefined ||
        tokenId === undefined ||
        bidderAddr === undefined ||
        bidderSignature === undefined
    ) {
      return {
        status: false,
        message: 'body must have listId, tokenId, bidderAddr and bidderSignature',
      };
    }

    if ( this.#validator.isSignatureValid(bidderSignature, bidderAddr,
        listId,
        tokenId,
        bidderAddr)
    ) {
      return {
        status: false,
        message: 'Invalid Bidder Signature',
      };
    }

    try {
      const res = this.#auctionManager.deleteBid(
          listId,
          tokenId,
          bidderAddr,
      );

      return {status: true, message: res};
    } catch (err) {
      return {status: false, message: err.message};
    }
  }

  approveBid({ownerAddr,
    bidderAddr,
    nftContractAddr,
    tokenId,
    erc20ContractAddr,
    erc20amount,
    ownerSignature}) {
    if ( ownerAddr === undefined ||
        bidderAddr === undefined ||
        nftContractAddr === undefined ||
        tokenId === undefined ||
        erc20ContractAddr === undefined ||
        erc20amount === undefined ||
        ownerSignature === undefined
    ) {
      return {
        status: false,
        message: 'body must have ownerAddr, ' +
      'bidderAddr, ' +
      'nftContractAddr, ' +
      'tokenId, ' +
      'erc20ContractAddr, ' +
      'erc20amount and ' +
      'ownerSignature',
      };
    }

    if ( this.#validator.isSignatureValid(ownerSignature, ownerAddr,
        ownerAddr,
        bidderAddr,
        nftContractAddr,
        tokenId,
        erc20ContractAddr,
        erc20amountlistId)
    ) {
      return {
        status: false,
        message: 'Invalid Bidder Signature',
      };
    }

    try {
      const res = this.#auctionManager.approveBid(listId,
          tokenId,
          bidderAddr,
          ownerSignatur,
      );

      return {status: true, message: res};
    } catch (err) {
      return {status: false, message: err.message};
    }
  }

  getBid({listId, tokenId, bidderAddr}) {
    if ( listId === undefined ||
        tokenId === undefined ||
        bidderAddr === undefined
    ) {
      return {
        status: false,
        message: 'body must have listId, tokenId and bidderAddr',
      };
    }

    try {
      const res = this.#auctionManager.getBid(listId,
          tokenId,
          bidderAddr,
      );

      return {status: true, message: res};
    } catch (err) {
      return {status: false, message: err.message};
    }
  }

  #validator;
  #auctionManager;
}

export default new RequestHandler();

