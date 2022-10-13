import validatorInterface, {ValidatorInterface} from './validator-interface.js';

export class Bid {
  constructor(ownerAddr, bidderAddr, nftContractAddr, tokenId, erc20ContractAddr, erc20amount, bidderSignature) {
    this.#ownerAddr = ownerAddr;
    this.#bidderAddr = bidderAddr;
    this.#nftContractAddr = nftContractAddr;
    this.#tokenId = tokenId;
    this.#erc20ContractAddr = erc20ContractAddr;
    this.#erc20amount = erc20amount;
    this.#ownerSignature = null;
    this.#bidderSignature = bidderSignature;
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

  createBid(ownerAddr, bidderAddr, nftContractAddr, tokenId, erc20ContractAddr, erc20amount, bidderSignature) {
    if (! this.#validator.isValidAddr(ownerAddr)) {
      throw Error(ownerAddr + ' ownerAddr is not a valid address');
    }

    if (! this.#validator.isValidAddr(bidderAddr)) {
      throw Error(bidderAddr + ' bidderAddr is not a valid address');
    }

    if (! this.#validator.isValidNftContract(nftContractAddr)) {
      throw Error(nftContractAddr + ' is not a valid nft contract address');
    }

    if (Number.isNaN(tokenId)) {
      throw Error(tokenId + ' tokenId is not a number');
    }

    if (tokenId < 0) {
      throw Error(tokenId + ' tokenId must be greater than 0');
    }

    if (! this.#validator.isValidErc20Contract(erc20ContractAddr)) {
      throw Error(erc20ContractAddr + ' is not a valid erc20 contract address');
    }

    if (Number.isNaN(erc20amount)) {
      throw Error(erc20amount + ' erc20mount is not a number');
    }

    if (erc20amount <= 0 ){
      throw Error(erc20amount + ' erc20mount is not a grater than 0');
    }

    if(! this.#validator.isSignatureValid(bidderSignature, bidderAddr,
      ownerAddr,
      bidderAddr,
      nftContractAddr,
      tokenId,
      erc20ContractAddr,
      erc20amount) ) {
      throw Error('bidderSignature not valid');
    }

    return new Bid(....
  }

  #validator;
}