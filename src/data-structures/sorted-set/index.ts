import { Node, size, isRed, RED, BLACK } from './node';
import { CompareFn } from '@/common/types';
import { max, min, floor, ceiling, has, createSnapshot } from './BST';
import { insert, deleteMin, deleteMax, remove } from './redBlackBST';
import { NoSuchElementError } from '@/common/errors';

/**
 * Represents an sorted set data structure.
 *
 * It supports the usual `add`, `has`, `delete`, `size`, and `isEmpty` methods.
 * It also provides methods for finding the minimum, maximum, floor, and
 * ceiling.
 *
 * This implementation uses a left-leaning red-black BST. The `add`, `has`,
 * `delete`, `min`, `max`, `ceiling`, `floor` operations each takes O(log(n))
 * time in the worst case, where n is the number of elements in the set. The
 * `size` and `isEmpty` operations take O(1) time. Construction takes O(1) time.
 *
 * Note: Modifying value of object type can break the order of the set.
 */
export class SortedSet<T> implements Iterable<T> {
  protected _root: Node<T> | null = null;
  protected _compareFn: CompareFn<T>;

  /**
   * Initializes an empty sorted set.
   *
   * @param compareFn Function used to determine the order of elements. It is
   * expected to return a negative value if the first argument is less than the
   * second argument, zero if they're equal, and a positive value otherwise.
   */
  constructor(compareFn: CompareFn<T>) {
    this._compareFn = compareFn;
  }

  // Set methods.

  /**
   * Returns the number of elements in this sorted set.
   *
   * @returns The number of elements in this sorted set
   */
  size(): number {
    return size(this._root);
  }

  /**
   * Determines whether this sorted set is empty.
   *
   * @returns `true` if this sorted set is empty, `false` otherwise
   */
  isEmpty(): boolean {
    return !this._root;
  }

  /**
   * Removes all elements from this sorted set.
   */
  clear(): void {
    this._root = null;
  }

  /**
   * Determines whether this sorted set contains the given element.
   *
   * @param value The element
   *
   * @returns `true` if this sorted set contains `value`, `false` otherwise
   */
  has(value: T): boolean {
    return has(this._root, this._compareFn, value);
  }

  /**
   * Inserts a new element with a specified value into this sorted set, if
   * there isn't an element with the same value already in this sorted set.
   *
   * @param value The value
   */
  add(value: T): this {
    this._root = insert(this._root, this._compareFn, value);
    this._root.color = BLACK;
    return this;
  }

  /**
   * Deletes the specified value from this sorted set.
   *
   * @param value The value
   *
   * @returns `true` if `value` was deleted, `false` otherwise
   */
  delete(value: T): boolean {
    if (!this.has(value)) return false;
    // This sorted set contains value, so root is not null.
    const root = this._root as Node<T>;
    if (!isRed(root.left) && !isRed(root.right)) root.color = RED;
    this._root = remove(root, this._compareFn, value);
    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion --
     * This sorted set is not empty implies that root is not null
     */
    if (!this.isEmpty()) this._root!.color = BLACK;
    return true;
  }

  // sorted set methods.

  /**
   * Returns the smallest value in this sorted set.
   *
   * @returns The smallest value in this sorted set
   *
   * @throws {NoSuchElementError} if this sorted set is empty
   */
  min(): T {
    if (this.isEmpty()) throw new NoSuchElementError('Sorted set is empty');
    return min(this._root as Node<T>).value;
  }

  /**
   * Returns the largest value in this sorted set.
   *
   * @returns The largest value in this sorted set
   *
   * @throws {NoSuchElementError} if this sorted set is empty
   */
  max(): T {
    if (this.isEmpty()) throw new NoSuchElementError('Sorted set is empty');
    return max(this._root as Node<T>).value;
  }

  /**
   * Removes the smallest value from the sorted set.
   *
   * @throws {NoSuchElementError} if this sorted set is empty
   */
  deleteMin(): void {
    if (this.isEmpty()) throw new NoSuchElementError('Sorted set is empty');
    // This sorted set is not empty implies that root is not null.
    const root = this._root as Node<T>;
    // If both children of root are black, set root to red.
    if (!isRed(root.left) && !isRed(root.right)) root.color = RED;
    this._root = deleteMin(root);
    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion --
     * This sorted set is not empty implies that root is not null.
     */
    if (!this.isEmpty()) this._root!.color = BLACK;
  }

  /**
   * Removes the largest value from the sorted set.
   *
   * @throws {NoSuchElementError} if this sorted set is empty
   */
  deleteMax(): void {
    if (this.isEmpty()) throw new NoSuchElementError('Sorted set is empty');
    // This sorted set is not empty implies that root is not null.
    const root = this._root as Node<T>;
    // If both children of root are black, set root to red.
    if (!isRed(root.left) && !isRed(root.right)) root.color = RED;
    this._root = deleteMax(root);
    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion --
     * This sorted set is not empty implies that root is not null.
     */
    if (!this.isEmpty()) this._root!.color = BLACK;
  }

  /**
   * Returns the largest value in the sorted set less than or equal to the
   * given value.
   *
   * @param value The value
   *
   * @returns The largest value in the sorted set less than or equal to `value`
   *
   * @throws {NoSuchElementError} if this sorted set is empty or `value` is too
   * small
   */
  floor(value: T): T {
    if (this.isEmpty()) throw new NoSuchElementError('Sorted set is empty');
    const node = floor(this._root, this._compareFn, value);
    if (!node) throw new NoSuchElementError('Value is too small');
    return node.value;
  }

  /**
   * Returns the smallest value in the sorted set bigger than or equal to the
   * given value.
   *
   * @param value The value
   *
   * @returns The smallest value in the sorted set bigger than or equal to
   * `value`
   *
   * @throws {NoSuchElementError} if this sorted set is empty or `value` is too
   * large
   */
  ceiling(value: T): T {
    if (this.isEmpty()) throw new NoSuchElementError('Sorted set is empty');
    const node = ceiling(this._root, this._compareFn, value);
    if (!node) throw new NoSuchElementError('Value is too small');
    return node.value;
  }

  *[Symbol.iterator](): IterableIterator<T> {
    for (const value of createSnapshot(this._root)) yield value;
  }
}
