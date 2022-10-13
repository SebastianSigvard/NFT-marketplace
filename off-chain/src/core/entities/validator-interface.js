export class ValidatorInterface {
  isValidAddr(ownerAddr) {
    throw new Error('No implementation of isValidAddr virtual fun.');
    return {};
  }

  isValidNftContract(nftContractAddr) {
    throw new Error('No implementation of isValidNftContract virtual fun.');
    return {};
  }

  isValidErc20Contract(erc20ContractAddr) {
    throw new Error('No implementation of isValidErc20Contract virtual fun.');
    return {};
  }

  isSignatureValid(signature, addr, ...args) {
    throw new Error('No implementation of isSignatureValid virtual fun.');
    return {};
  }
}

export default new ValidatorInterface();
