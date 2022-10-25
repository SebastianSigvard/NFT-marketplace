import {ValidatorInterface} from '../src/core/entities/validator-interface.js';

export default class ValidatorMock extends ValidatorInterface {
  isValidAddr() {
    return true;
  }

  isSignatureValid() {
    return true;
  }

  isValidNftContract() {
    return true;
  }

  isValidErc20Contract() {
    return true;
  }
}
