import { CompareFn } from '@/common/types';
import { AbstractPQ } from './abstractPQ';
import { NoSuchElementError } from '@/common/errors';

/**
 * Represents a fixed capacity indexed priority queue of items. Each item is
 * associated with a priority and is labeled with a unique integer between `0`
 * and `n - 1`, where `n` is the capacity of the queue. It supports the usual
 * `enqueue`, `dequeue` and `peek` operations, along with `delete` and `change`
 * methods.
 *
 * This implementation uses a binary heap to organize items by their priority,
 * an array to associate priorities with items and an array to keeps track of
 * current indices of items in the heap. The `enqueue`, `dequeue`, `change`, and
 * `delete` operations take O(log(n)) time in the worst case, where n is the
 * number of items in the priority queue. Construction takes time proportional
 * to the specified capacity.
 *
 * Note: Mutating priority values externally can break the order of the priority
 * queue.
 */
export abstract class IndexedPQ<T> extends AbstractPQ<number, T> {
  /**
   * `_idxs[i]` stores current index in the heap of the item labeled with `i`.
   * `-1` is used to indicate that an item is not in the heap.
   */
  protected _idxs: number[];
  /**
   * `_priorities[i]` stores the priority value of the item labeled with `i`.
   */
  protected _priorities: (T | null)[];
  /** Function used to determine the order of two priority values. */
  protected _compareFn: CompareFn<T>;

  /**
   * Initializes an empty fixed capacity indexed priority queue.
   *
   * @param compareFn Function used to determine the order of two priority
   * values. It is expected to return a negative value if the first argument is
   * less than the second argument, zero if they're equal, and a positive value
   * otherwise.
   * @param n Maximum number of items this priority queue can hold.
   */
  constructor(compareFn: CompareFn<T>, n: number) {
    super();
    this._compareFn = compareFn;
    this._priorities = new Array(n);
    this._idxs = new Array(n).fill(-1);
  }

  /**
   * Determine whether an item is in this priority queue or not.
   *
   * @param item Item to check
   *
   * @returns A boolean indicating whether `item` exists in this priority queue
   * or not
   *
   * @throws {RangeError} if `item`'s label is invalid
   */
  has(item: number) {
    this._validateItem(item);
    return this._idxs[item] !== -1;
  }

  /**
   * Associates a priority value with an item.
   *
   * @param item An item
   * @param priority A priority
   *
   * @throws {IlligalArgumentError} if `item` is already in this priority queue
   * @throws {RangeError} if `item`'s label is invalid
   */
  enqueue(item: number, priority: T): void {
    this._validateItem(item);
    super.enqueue(item, priority);
  }

  /**
   * Returns the priority value of an item.
   *
   * @param item An item
   *
   * @returns The priority value of an item
   *
   * @throws {RangeError} if `item` is invalid
   * @throws {NoSuchElementError} if `item` does not exist
   */
  getPriority(item: number): T {
    this._validateItem(item);
    if (!this.has(item))
      throw new NoSuchElementError('Item is not in this priority queue');
    return this._priorities[item] as T;
  }

  protected _setPriority(item: number, priority: T): void {
    this._priorities[item] = priority;
  }
  protected _setIndex(item: number, idx: number): void {
    this._idxs[item] = idx;
  }
  protected _getIndex(item: number): number {
    return this._idxs[item];
  }
  protected _deleteItem(item: number): void {
    this._idxs[item] = -1;
    // To help with garbage collection.
    this._priorities[item] = null;
  }

  /**
   * Determines whether an item is valid or not.
   *
   * @param item An item
   *
   * @throws {RangeError} if `item`'s label is invalid
   */
  protected _validateItem(item: number): void {
    if (!Number.isInteger(item)) throw new RangeError('Item is not an integer');
    if (item < 0 || item >= this._idxs.length)
      throw new RangeError('Item is out of bounds');
  }
}

/**
 * Represents a fixed capacity indexed priority queue of items. Each item is
 * associated with a priority and is labeled with a unique integer between `0`
 * and `n - 1`, where `n` is the capacity of the queue. An item come before
 * another item if it has higher priority. It supports the usual `enqueue`,
 * `dequeue` and `peek` operations, along with `delete` and `change` methods.
 *
 * This implementation uses a binary heap to organize items by their priority,
 * an array to associate priorities with items and an array to keeps track of
 * current indices of items in the heap. The `enqueue`, `dequeue`, `change`, and
 * `delete` operations take O(log(n)) time in the worst case, where n is the
 * number of items in the priority queue. Construction takes time proportional
 * to the specified capacity.
 *
 * Note: Mutating priority values externally can break the order of the priority
 * queue.
 */
export class IndexedMaxPQ<T> extends IndexedPQ<T> {
  protected _canBeParent(idx1: number, idx2: number): boolean {
    return (
      this._compareFn(
        this.getPriority(this._heap[idx1]),
        this.getPriority(this._heap[idx2])
      ) >= 0
    );
  }
}

/**
 * Represents a fixed capacity indexed priority queue of items. Each item is
 * associated with a priority and is labeled with a unique integer between `0`
 * and `n - 1`, where `n` is the capacity of the queue. An item come before
 * another item if it has lower priority. It supports the usual `enqueue`,
 * `dequeue` and `peek` operations, along with `delete` and `change` methods.
 *
 * This implementation uses a binary heap to organize items by their priority,
 * an array to associate priorities with items and an array to keeps track of
 * current indices of items in the heap. The `enqueue`, `dequeue`, `change`, and
 * `delete` operations take O(log(n)) time in the worst case, where n is the
 * number of items in the priority queue. Construction takes time proportional
 * to the specified capacity.
 *
 * Note: Mutating priority values externally can break the order of the priority
 * queue.
 */
export class IndexedMinPQ<T> extends IndexedPQ<T> {
  protected _canBeParent(idx1: number, idx2: number): boolean {
    return (
      this._compareFn(
        this.getPriority(this._heap[idx1]),
        this.getPriority(this._heap[idx2])
      ) <= 0
    );
  }
}
