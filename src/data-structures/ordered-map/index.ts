import { Node, size, isRed, RED, BLACK } from './node';
import { CompareFn } from '@/common/types';
import { get, max, min, floor, ceiling } from './BST';
import { insert, deleteMin, deleteMax, remove } from './redBlackBST';
import { NoSuchElementError } from '@/common/errors';

/**
 * Represents an ordered map data structure.
 *
 * It supports the usual `set`, `get`, `has`, `delete`, `size`, and `isEmpty`
 * methods. It also provides methods for finding the minimum, maximum, floor,
 * and ceiling.
 *
 * This implementation uses a left-leaning red-black BST. The `set`, `get`,
 * `has`, `delete`, `min`, `max`, `ceiling`, `floor` operations each takes
 * O(log(n)) time in the worst case, where n is the number of key-value pairs in
 * the map. The `size` and `isEmpty` operations take O(1) time. Construction
 * takes O(1) time.
 *
 * Note: Modifying key of object type can break the order of the map.
 */
export class OrderedMap<K, V> {
  protected _root: Node<K, V> | null = null;
  protected _compareFn: CompareFn<K>;

  /**
   * Initializes an empty ordered map.
   *
   * @param compareFn Function used to determine the order of keys. It is
   * expected to return a negative value if the first argument is less than the
   * second argument, zero if they're equal, and a positive value otherwise.
   */
  constructor(compareFn: CompareFn<K>) {
    this._compareFn = compareFn;
  }

  // Map methods.

  /**
   * Returns the number of key-value pairs in this ordered map.
   *
   * @returns The number of key-value pairs in this ordered map
   */
  size(): number {
    return size(this._root);
  }

  /**
   * Determines whether this ordered map is empty.
   *
   * @returns `true` if this ordered map is empty, `false` otherwise
   */
  isEmpty(): boolean {
    return this._root === null;
  }

  /**
   * Removes all of the mapping from this ordered map.
   */
  clear(): void {
    this._root = null;
  }

  /**
   * Returns the value associated with the given key.
   *
   * @param key The key
   *
   * @returns The value associated with `key` if `key` is in this map,
   * `undefined` otherwise
   */
  get(key: K): V | undefined {
    try {
      return get(this._root, this._compareFn, key);
    } catch (err) {
      return;
    }
  }

  /**
   * Determines whether this ordered map contains the given key.
   *
   * @param key The key
   *
   * @returns `true` if this ordered map contains `key`, `false` otherwise
   */
  has(key: K): boolean {
    try {
      get(this._root, this._compareFn, key);
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Inserts the specified key-value pair into this map, overwriting the old
   * value with the new value if this map already contains the specified key.
   *
   * @param key The key
   * @param value The value
   */
  set(key: K, value: V): void {
    this._root = insert(this._root, this._compareFn, key, value);
    this._root.color = BLACK;
  }

  /**
   * Deletes the specified key and its associated value from this ordered map.
   *
   * @param key The key
   *
   * @returns `true` if the key was deleted, `false` otherwise
   */
  delete(key: K): boolean {
    if (!this.has(key)) return false;
    // This ordered map contains key, so root is not null.
    const root = this._root as Node<K, V>;
    if (!isRed(root.left) && !isRed(root.right)) root.color = RED;
    this._root = remove(root, this._compareFn, key);
    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion --
     * This ordered map is not empty implies that root is not null
     */
    if (!this.isEmpty()) this._root!.color = BLACK;
    return true;
  }

  // Ordered map methods.

  /**
   * Returns the smallest key in this ordered map.
   *
   * @returns The smallest key in this ordered map
   *
   * @throws {NoSuchElementError} if this ordered map is empty
   */
  min(): K {
    if (this.isEmpty()) throw new NoSuchElementError('Ordered map is empty');
    return min(this._root as Node<K, V>).key;
  }

  /**
   * Returns the largest key in this ordered map.
   *
   * @returns The largest key in this ordered map
   *
   * @throws {NoSuchElementError} if this ordered map is empty
   */
  max(): K {
    if (this.isEmpty()) throw new NoSuchElementError('Ordered map is empty');
    return max(this._root as Node<K, V>).key;
  }

  /**
   * Removes the smallest key and associated value from the ordered map.
   *
   * @throws {NoSuchElementError} if this ordered map is empty
   */
  deleteMin(): void {
    if (this.isEmpty()) throw new NoSuchElementError('Ordered map is empty');
    // This ordered map is not empty implies that root is not null.
    const root = this._root as Node<K, V>;
    // If both children of root are black, set root to red.
    if (!isRed(root.left) && !isRed(root.right)) root.color = RED;
    this._root = deleteMin(root);
    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion --
     * This ordered map is not empty implies that root is not null.
     */
    if (!this.isEmpty()) this._root!.color = BLACK;
  }

  /**
   * Removes the largest key and associated value from the ordered map.
   *
   * @throws {NoSuchElementError} if this ordered map is empty
   */
  deleteMax(): void {
    if (this.isEmpty()) throw new NoSuchElementError('Ordered map is empty');
    // This ordered map is not empty implies that root is not null.
    const root = this._root as Node<K, V>;
    // If both children of root are black, set root to red.
    if (!isRed(root.left) && !isRed(root.right)) root.color = RED;
    this._root = deleteMax(root);
    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion --
     * This ordered map is not empty implies that root is not null.
     */
    if (!this.isEmpty()) this._root!.color = BLACK;
  }

  /**
   * Returns the largest key in the ordered map less than or equal to the given
   * key.
   *
   * @param key The key
   *
   * @returns The largest key in the ordered map less than or equal to `key`
   *
   * @throws {NoSuchElementError} if this ordered map is empty or `key` is too
   * small
   */
  floor(key: K): K {
    if (this.isEmpty()) throw new NoSuchElementError('Ordered map is empty');
    const node = floor(this._root, this._compareFn, key);
    if (!node) throw new NoSuchElementError('Key is too small');
    return node.key;
  }

  /**
   * Returns the smallest key in the ordered map bigger than or equal to the
   * given key.
   *
   * @param key The key
   *
   * @returns The smallest key in the ordered map bigger than or equal to `key`
   *
   * @throws {NoSuchElementError} if this ordered map is empty or `key` is too
   * large
   */
  ceiling(key: K): K {
    if (this.isEmpty()) throw new NoSuchElementError('Ordered map is empty');
    const node = ceiling(this._root, this._compareFn, key);
    if (!node) throw new NoSuchElementError('Key is too small');
    return node.key;
  }
}
