/**
 * Abstract class for Auction Storage Interface definition for
 * Auction manager.
 */
export class AuctionStorageInterface {
  // Must check if other list has same ownerAddr and nftContractAddr at same time
  // @return {AuctionList} Auction list.
  async createList(ownerAddr, nftContractAddr, tokens) {
    throw new Error('No implementation of AuctionStorageInterface virtual fun.');
    return {};
  }

  // Must checks that list is an instance of AuctionList
  async updateList(list) {
    throw new Error('No implementation of AuctionStorageInterface virtual fun.');
    return {};
  }

  async deleteList(listId) {
    throw new Error('No implementation of AuctionStorageInterface virtual fun.');
    return {};
  }

  // @return {AuctionList} Auction list.
  // must throw if not list found
  async getList(listId) {
    throw new Error('No implementation of AuctionStorageInterface virtual fun.');
    return {};
  }

  // @return {Array} Array of all Auction lists.
  async getLists() {
    throw new Error('No implementation of AuctionStorageInterface virtual fun.');
    return {};
  }
}

export default new AuctionStorageInterface();
