import {AuctionStorageInterface} from '../core/auction-storage-interface.js';
import ListFactory, {AuctionList} from '../core/entities/auction-list.js';

/**
 * Implementation of an Auction Storage in RAM following Interface definition.
 */
export default class MemAuctionStorage extends AuctionStorageInterface {
  /**
    * AuctionStorage constructor.
    * @param {Validator} validator an implementation of ValidatorInterfac
    */
  constructor(validator) {
    super();

    this.#listFactory = new ListFactory(validator);
    this.#lists = {};
    this.#nextListId = 0;
  }

  // Must check if other list has same ownerAddr and nftContractAddr at same time
  // @return {AuctionList} Auction list.
  async createList(ownerAddr, nftContractAddr, tokens) {
    const listsArray = Object.values(this.#lists);

    const foundList = listsArray.find((list) => {
      return (
        list.getOwnerAddr() === ownerAddr &&
        list.getNftContractAddr() === nftContractAddr
      );
    });

    if (foundList) {
      throw Error('there is allready a list with requested ownerAddr and nftContractAddr');
    }

    const list = await this.#listFactory.createList(this.#nextListId++, ownerAddr, nftContractAddr, tokens);
    const listCp = this.#listFactory.copyList(list);

    this.#lists[list.getListId()] = list;

    return listCp;
  }

  // Must checks that list is an instance of AuctionList
  async updateList(list) {
    if (! (list instanceof AuctionList)) {
      throw Error('list must be an instance of AuctionList');
    }

    if (!this.#lists[list.getListId()]) {
      throw Error('no list with listId ' + list.getListId());
    }

    const listCp = this.#listFactory.copyList(list);

    this.#lists[listCp.getListId()] = listCp;
  }

  async deleteList(listId) {
    if (!this.#lists[listId]) {
      throw Error('no list with listId ' + listId);
    }

    delete this.#lists[listId];
  }

  // @return {AuctionList} Auction list.
  // must throw if not list found
  async getList(listId) {
    const list = this.#lists[listId];

    if (!list) {
      throw Error('no list with listId ' + listId);
    }

    const listCp = this.#listFactory.copyList(list);

    return listCp;
  }

  async getLists() {
    const lists = [];

    for (const list of Object.values(this.#lists)) {
      const listCp = this.#listFactory.copyList(list);

      lists.push(listCp);
    }

    return lists;
  }

  #listFactory;
  #lists;
  #nextListId;
}

