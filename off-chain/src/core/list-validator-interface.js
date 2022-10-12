export class ListValidatorInterface {
  isValidAddr(ownerAddr) {
    throw new Error('No implementation of isValidAddr virtual fun.');
    return {};
  }

  isValidNftContract(nftContractAddr) {
    throw new Error('No implementation of isValidNftContract virtual fun.');
    return {};
  }
}

export default new ListValidatorInterface();
