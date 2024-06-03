import { CompareFn } from '@/common/types';
import { Collection } from '../ultils';
import { NoSuchElementError } from '@/common/errors';
import { exchange } from '@/common/helpers';

/**
 * Represents an abstract binary heap of items, where all parent items come
 * before their children or all parent items come after their children in some
 * order. It supports the usual `add`, `remove`, and `peek` operations.
 *
 * This implementation uses an array to represent the heap. The `add` and `remove`
 * operations take O(log(n)) amortized time, where n is the number of items in
 * the heap. This is an amortized bound (and not a worst case bound) because of
 * array resizing operations. The `peek` operation takes O(1) time. Construction
 * takes O(1) time.
 *
 * Note: Mutating items externally can break the order of the heap.
 */
export abstract class Heap<T> extends Collection {
  protected _items: T[] = [];
  /**
   * Function used to determine whether an item can be parent of another item
   * according to this heap order.
   */
  protected abstract _canBeParentFn: CanBeParentFn<T>;

  /**
   * Adds a new item to this heap.
   *
   * @param item The new item to add
   */
  add(item: T): void {
    this._items.push(item);
    this._incrementSize();
    heapifyUp(this._items, this._canBeParentFn, this.size() - 1);
  }

  /**
   * Removes and returns the item at the root of this heap.
   *
   * @returns The item at the root of this heap
   *
   * @throws {NoSuchElementError} if this heap is empty
   */
  remove(): T {
    if (this.isEmpty()) throw new NoSuchElementError('Heap is empty');
    const item = this._items[0];
    exchange(this._items, 0, this.size() - 1);
    this._decrementSize();
    heapifyDown(this._items, this._canBeParentFn, 0);
    return item;
  }

  /**
   * Returns the item at the root of this heap.
   *
   * @returns The item at the root of this heap.
   *
   * @throws {NoSuchElementError} if this heap is empty.
   */
  peek(): T {
    if (this.isEmpty()) throw new NoSuchElementError('Heap is empty');
    return this._items[0];
  }
}

/**
 * Represents a max heap of items, where all parent items come after thier
 * children in a given order.
 */
export class MaxHeap<T> extends Heap<T> {
  protected _canBeParentFn: CanBeParentFn<T>;

  /**
   * Initializes an empty max heap of items.
   *
   * @param compareFn Function used to determine the order of two items. It is
   * expected to return a negative value if the first argument is less than the
   * second argument, zero if they're equal, and a positive value otherwise.
   */
  constructor(compareFn: CompareFn<T>) {
    super();
    this._canBeParentFn = (a, b) => compareFn(a, b) >= 0;
  }
}

export class MinHeap<T> extends Heap<T> {
  protected _canBeParentFn: CanBeParentFn<T>;

  /**
   * Initializes an empty min heap of items.
   *
   * @param compareFn Function used to determine the order of two items. It is
   * expected to return a negative value if the first argument is less than the
   * second argument, zero if they're equal, and a positive value otherwise.
   */
  constructor(compareFn: CompareFn<T>) {
    super();
    this._canBeParentFn = (a, b) => compareFn(a, b) <= 0;
  }
}

/**
 * Moves an item up if necessary to restore the heap order of a binary heap.
 *
 * @param heap Array representation of the heap.
 * @param canBeParentFn Function used to determine if an item can be parent of
 * another item according to the heap order. It is expected to have two
 * parameters and to return `true` if the first argument can be parent of the
 * second argument item, otherwise `false`.
 * @param idx Index of the item in `heap`.
 */
function heapifyUp<T>(
  heap: T[],
  canBeParentFn: CanBeParentFn<T>,
  idx: number
): void {
  // While the item has a parent.
  while (idx > 0) {
    const parentIdx = Math.floor((idx - 1) / 2);
    if (canBeParentFn(heap[parentIdx], heap[idx])) break;
    // Move the item up.
    exchange(heap, parentIdx, idx);
    idx = parentIdx;
  }
}

/**
 * Moves an item down if necessary to restore the heap order of a binary heap.
 *
 * @param heap Array representation of the heap.
 * @param canbeParentFn Function used to determine if an item can be parent of
 * another item according to the heap order. It is expected to have two
 * parameters and to return `true` if the first argument can be parent of the
 * second argument item, otherwise `false`.
 * @param idx Index of the item in `heap`.
 * @param n The number of items in the heap. It is used to limit the portion
 * of `heap` that represents the heap (from index `0` to `n - 1`). It is
 * default to `heap.length`
 */
export function heapifyDown<T>(
  heap: T[],
  canbeParentFn: CanBeParentFn<T>,
  idx: number,
  n = heap.length
): void {
  let childIdx = 2 * idx + 1;
  // While the item has a left child.
  while (childIdx < n) {
    // Check for right child and select the better child.
    if (childIdx + 1 < n && canbeParentFn(heap[childIdx + 1], heap[childIdx]))
      childIdx++;
    if (canbeParentFn(heap[idx], heap[childIdx])) break;
    // Move the item down.
    exchange(heap, idx, childIdx);
    idx = childIdx;
  }
}

type CanBeParentFn<T> = (a: T, b: T) => boolean;
