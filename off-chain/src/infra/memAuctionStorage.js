import {AuctionStorageInterface} from './auctionStorageInterface.js';
import ListFactory, {AuctionList} from '../core/entities/auction-list.js';

/**
 * Implementation of an Auction Storage in RAM following Interface definition.
 */
export class MemAuctionStorage extends AuctionStorageInterface {
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
  createList(ownerAddr, nftContractAddr, tokens) {
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

    const list = this.#listFactory.createList(this.#nextListId++, ownerAddr, nftContractAddr, tokens);

    this.#lists[list.getListId()] = list;

    return JSON.parse(JSON.stringify(list));
  }

  // Must checks that list is an instance of AuctionList
  updateList(list) {
    if (! (list instanceof AuctionList)) {
      throw Error('list must be an instance of AuctionList');
    }

    if (!this.#lists[list.getListId()]) {
      throw Error('no list with listId ' + list.getListId());
    }

    this.#lists[list.getListId] = list;
  }

  deleteList(listId) {
    if (!this.#lists[listId]) {
      throw Error('no list with listId ' + list.getListId());
    }

    delete this.#lists[listId];
  }

  // @return {AuctionList} Auction list.
  // must throw if not list found
  getList(listId) {
    if (!this.#lists[listId]) {
      throw Error('no list with listId ' + list.getListId());
    }

    return JSON.parse(JSON.stringify(pthis.#lists[listId]));
  }

  getLists() {
    const lists = [];

    for (const list of this.#lists) {
      lists.push(JSON.parse(JSON.stringify(list)));
    }

    return lists;
  }

  #listFactory;
  #lists;
  #nextListId;
}

export default new AuctionStorage();

