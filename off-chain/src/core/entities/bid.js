import validatorInterface, {ValidatorInterface} from './validator-interface.js';

export class Bid {
  constructor(options) {
    this.#ownerAddr = options.ownerAddr;
    this.#bidderAddr = options.bidderAddr;
    this.#nftContractAddr = options.nftContractAddr;
    this.#tokenId = options.tokenId;
    this.#erc20ContractAddr = options.erc20ContractAddr;
    this.#erc20amount = options.erc20amount;
    this.#ownerSignature = null;
    this.#bidderSignature = options.bidderSignature;
  }

  getOwnerAddr() {
    return this.#ownerAddr;
  }

  getBidderAddr() {
    return this.#bidderAddr;
  }

  getNftContractAddr() {
    return this.#nftContractAddr;
  }

  getTokenId() {
    return this.#tokenId;
  }

  getErc20ContractAddr() {
    return this.#erc20ContractAddr;
  }

  getErc20Amount() {
    return this.#erc20amount;
  }

  getOwnerSignature() {
    return this.#ownerSignature;
  }

  setOwnerSignature(ownerSignature) {
    this.#ownerSignature = ownerSignature;
  }

  getBidderSignature() {
    return this.#bidderSignature;
  }

  #ownerAddr;
  #bidderAddr;
  #nftContractAddr;
  #tokenId;
  #erc20ContractAddr;
  #erc20amount;
  #ownerSignature;
  #bidderSignature;
}

export default class BidFactory {
  constructor(validator = validatorInterface) {
    if (! (Object.getPrototypeOf(validator) instanceof ValidatorInterface)) {
      throw Error('validator must be instance of ValidatorInterface');
    }

    this.#validator = validator;
  }

  async createBid(ownerAddr, bidderAddr, nftContractAddr, tokenId, erc20ContractAddr, erc20amount, bidderSignature) {
    if (! this.#validator.isValidAddr(ownerAddr)) {
      throw Error(ownerAddr + ' ownerAddr is not a valid address');
    }

    if (! this.#validator.isValidAddr(bidderAddr)) {
      throw Error(bidderAddr + ' bidderAddr is not a valid address');
    }

    if (! await this.#validator.isValidNftContract(nftContractAddr)) {
      throw Error(nftContractAddr + ' is not a valid nft contract address');
    }

    if (typeof tokenId !== 'number') {
      throw Error(tokenId + ' tokenId is not a number');
    }

    if (tokenId < 0) {
      throw Error(tokenId + ' tokenId must be greater than 0');
    }

    if (! await this.#validator.isValidErc20Contract(erc20ContractAddr)) {
      throw Error(erc20ContractAddr + ' is not a valid erc20 contract address');
    }

    if (typeof erc20amount!== 'number') {
      throw Error(erc20amount + ' erc20amount is not a number');
    }

    if (erc20amount <= 0 ) {
      throw Error(erc20amount + ' erc20amount is not greater than 0');
    }

    if (! this.#validator.isSignatureValid(bidderSignature, bidderAddr,
        ownerAddr,
        bidderAddr,
        nftContractAddr,
        tokenId,
        erc20ContractAddr,
        erc20amount) ) {
      throw Error('bidderSignature not valid');
    }

    return new Bid({ownerAddr,
      bidderAddr,
      nftContractAddr,
      tokenId,
      erc20ContractAddr,
      erc20amount,
      bidderSignature});
  }

  copyBid(bid) {
    const bidCp = new Bid({ownerAddr: bid.getOwnerAddr(),
      bidderAddr: bid.getBidderAddr(),
      nftContractAddr: bid.getNftContractAddr(),
      tokenId: bid.getTokenId(),
      erc20ContractAddr: bid.getErc20ContractAddr(),
      erc20amount: bid.getErc20Amount(),
      bidderSignature: bid.getBidderSignature(),
    });

    bidCp.setOwnerSignature(bid.getOwnerSignature());

    return bidCp;
  }

  #validator;
}
