import tokenValidatorInterface, {TokenValidatorInterface} from './token-interface.js'

export class Token {
    constructor(options) {
        this.#tokenId = options.tokenId;
        this.#minPrice = options.minPrice;
        this.#bids = options.bids;
    }

    #tokenId;
    #minPrice;
    #bids;
}

export default class TokenFactory {
    constructor(tokenValidator) {
        if (! (Object.getPrototypeOf(tokenValidator) instanceof TokenValidatorInterface))
            throw Error('tokenValidator must be instance of TokenValidatorInterface');

        this.#tokenValidator = tokenValidator;
    }

    #tokenValidator;
}
