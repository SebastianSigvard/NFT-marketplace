/**
 * Abstract class for Auction Storage Interface definition for
 * Auction manager.
 */
export class AuctionStorageInterface {
  // Must check if other list has same ownerAddr and nftContractAddr at same time
  // @return {AuctionList} Auction list.
  createList(ownerAddr, nftContractAddr, tokens) {
    throw new Error('No implementation of AuctionStorageInterface virtual fun.');
    return {};
  }

  updateList(list) {
    throw new Error('No implementation of AuctionStorageInterface virtual fun.');
    return {};
  }

  deleteList(listId) {
    throw new Error('No implementation of AuctionStorageInterface virtual fun.');
    return {};
  }

  // @return {AuctionList} Auction list.
  getList(listId) {
    throw new Error('No implementation of AuctionStorageInterface virtual fun.');
    return {};
  }

  // @return {Array} Array of all Auction lists.
  getLists() {
    throw new Error('No implementation of AuctionStorageInterface virtual fun.');
    return {};
  }
}

export default new AuctionStorageInterface();
