import { Collection } from '../ultils';
import { IlligalArgumentError, NoSuchElementError } from '@/common/errors';
import { exchange } from '@/common/helpers';

/**
 * Represents an abstract priority queue of items. Each item is associated with
 * a priority. It supports the usual `enqueue`, `dequeue` and `peek` operations,
 * along with `delete` and `change` methods.
 *
 * This implementation uses a binary heap to organize items by their priority.
 * The `enqueue`, `dequeue`, `change`, and `delete` operations take O(log(n))
 * time in the worst case, where n is the number of items in the priority queue.
 *
 * Note: Mutating priority values externally can break the order of the priority
 * queue.
 */
export abstract class AbstractPQ<Item, Priority> extends Collection {
  /**
   * Array representation of the binary heap of items
   */
  protected _heap: Item[] = [];

  /**
   * Determine whether an item is in this priority queue or not.
   *
   * @param item Item to check
   *
   * @returns A boolean indicating whether `item` exists in this priority queue
   * or not
   */
  abstract has(item: Item): boolean;

  /**
   * Associates a priority value with an item.
   *
   * @param item An item
   * @param priority A priority
   *
   * @throws {IlligalArgumentError} if `item` is already in this priority queue
   */
  enqueue(item: Item, priority: Priority): void {
    if (this.has(item))
      throw new IlligalArgumentError('Item is already in this priority queue');
    this._setIndex(item, this.size());
    this._heap.push(item);
    this._setPriority(item, priority);
    this._incrementSize();
    this._heapifyUp(this._getIndex(item));
  }

  /**
   * Removes and returns the item at the front of this priority queue.
   *
   * @returns The item at the front of this priority queue
   *
   * @throws {NoSuchElementError} if this priority queue is empty
   */
  dequeue(): Item {
    if (this.isEmpty()) throw new NoSuchElementError('Priority queue is empty');
    const item = this._heap[0];
    this._exchange(0, this.size() - 1);
    this._deleteItem(this.size() - 1);
    this._decrementSize();
    this._heapifyDown(0);
    return item;
  }

  /**
   * Returns the item at the front of this priority queue.
   *
   * @returns The item at the front of this priority queue
   *
   * @throws {NoSuchElementError} if this priority queue is empty
   */
  peek(): Item {
    if (this.isEmpty()) throw new NoSuchElementError('Priotiry queue is empty');
    return this._heap[0];
  }

  /**
   * Changes the priority of an item to the specified value.
   *
   * @param item Item to change priority
   * @param priority New priority value
   *
   * @throws {NoSuchElementError} if this priority queue is empty
   */
  change(item: Item, priority: Priority) {
    if (!this.has(item))
      throw new NoSuchElementError('Item is not in this priority queue');
    this._setPriority(item, priority);
    const idx = this._getIndex(item);
    this._heapifyUp(idx);
    this._heapifyDown(idx);
  }

  /**
   * Deletes an item from this priority queue.
   *
   * @param item Item to delete
   *
   * @throws {NoSuchElementError} if this priority queue is empty
   */
  delete(item: Item): void {
    if (!this.has(item))
      throw new NoSuchElementError('Item is not in this priority queue');
    const idx = this._getIndex(item);
    this._exchange(idx, this.size() - 1);
    this._deleteItem(this.size() - 1);
    this._decrementSize();
    this._heapifyUp(idx);
    this._heapifyDown(idx);
  }

  /**
   * Returns the priority value of an item.
   *
   * @param item An item
   *
   * @returns The priority value of an item
   *
   * @throws {NoSuchElementError} if `item` does not exist
   */
  abstract getPriority(item: Item): Priority;

  /**
   * Moves an item up if neccesary to restore the heap order.
   *
   * @param idx Index of the item
   */
  protected _heapifyUp(idx: number): void {
    // While the item has a parent.
    while (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2);
      if (this._canBeParent(parentIdx, idx)) break;
      // Move the item up.
      this._exchange(parentIdx, idx);
      idx = parentIdx;
    }
  }

  /**
   * Moves an item down if necessary to restore the heap order.
   *
   * @param idx Index of the item
   */
  protected _heapifyDown(idx: number): void {
    const n = this.size();
    let childIdx = 2 * idx + 1;
    // While the item has a left child.
    while (childIdx < n) {
      // Check for right child and select the better child.
      if (childIdx + 1 < n && this._canBeParent(childIdx + 1, childIdx))
        childIdx++;
      if (this._canBeParent(idx, childIdx)) break;
      // Move the item down.
      this._exchange(idx, childIdx);
      idx = childIdx;
      childIdx = 2 * idx + 1;
    }
  }

  /**
   * Exchanges two items in the heap and updates their indexes.
   *
   * @param idx1 Index of the first item
   * @param idx2 Index of the second item
   */
  protected _exchange(idx1: number, idx2: number): void {
    exchange(this._heap, idx1, idx2);
    this._setIndex(this._heap[idx1], idx1);
    this._setIndex(this._heap[idx2], idx2);
  }

  /**
   * Assigns a priority value to an item.
   *
   * @param item An item
   * @param priority A priority value
   */
  protected abstract _setPriority(item: Item, priority: Priority): void;

  /**
   * Associates an item with its current index in the heap.
   *
   * @param item An item
   * @param idx Curent index of `item` in the heap
   */
  protected abstract _setIndex(item: Item, idx: number): void;

  /**
   * Gets the current index in the heap of an item.
   *
   * @param item An item
   *
   * @returns Current index of `item` in the heap
   */
  protected abstract _getIndex(item: Item): number;

  /**
   * Removes the associated priority and index in the heap of an item at the
   * given heap index.
   *
   * @param idx Index of the item
   */
  protected abstract _deleteItem(idx: number): void;

  /**
   * Determines whether an item can be parent of another item in the heap.
   *
   * @param idx1 Index of the first item in the heap
   * @param idx2 Index of the second item in the heap
   *
   * @returns A boolean indicating whether the first item can be parent of the
   * second item
   */
  protected abstract _canBeParent(idx1: number, idx2: number): boolean;
}
