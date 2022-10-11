import listValidatorInterface, {ListValidatorInterface} from './list-validator-interface.js';
import Token from './token.js';

class AuctionList {
    constructor(options){
        this.#listId = options.listId;
        this.#ownerAddr = options.ownerAddr;
        this.#nftContractAddr = options.nftContractAddr;
        this.#tokens = options.tokens;
    }

    addToken(token) {
        if (! (Object.getPrototypeOf(token) instanceof Token))
            throw Error('token must be instance of Token');

        this.#tokens.push(token);
    }

    #lsitId;
    #ownerAddr;
    #nftContractAddr;
    #tokens;
}

export default class AuctionListFactory {
    constructor(listValidator) {
        if (! (Object.getPrototypeOf(listValidator) instanceof ListValidatorInterface))
            throw Error('listValidator must be instance of ListValidatorInterface');

        this.#listValidator = listValidator;
    }

    createList(listId, ownerAddr, nftContractAddr, tokens) {
        if(Number.isNaN(listId))
            throw Error(listId + ' is not a number');

        if(! this.#listValidator.isValidAddr(ownerAddr))
            throw Error(ownerAddr + ' is not a valid address');

        if(! this.#listValidator.isValidNftContract(nftContractAddr))
            thow Error(nftContractAddr + ' is not a valid nft contract address');

        if(! Array.isArray(tokens) )
            throw Error('tokens is not an array');

        for(const token of tokens){
            if (! (Object.getPrototypeOf(token) instanceof Token))
                throw Error('token must be instance of Token');
        }

        return new AuctionList(listId, ownerAddr, nftContractAddr, tokens);
    }

    #listValidator;
}

