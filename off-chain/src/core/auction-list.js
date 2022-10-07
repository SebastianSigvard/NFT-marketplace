import Token from './token.js';
import listValidatorInterface, {ListValidatorInterface} from './list-validator-interface.js';

class AuctionList {
    constructor(options){
        this.#listId = options.listId;
        this.#ownerAddr = options.ownerAddr;
        this.#nftContractAddr = options.nftContractAddr;
        this.#tokens = options.tokens;
    }

    addToken(token) {

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

    #listValidator;
}
