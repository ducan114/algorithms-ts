/**
 * Binary search tree related functions
 */

import { Node } from './node';
import { CompareFn } from '@/common/types';
import { NoSuchElementError } from '@/common/errors';

/**
 * Checks if a key exists in subtree rooted at a given node.
 *
 * @param root Root of the subtree
 * @param compareFn Function used to determine the order of keys. It is expected
 * to return a negative value if the first argument is less than the second
 * argument, zero if they're equal, and a positive value otherwise.
 * @param key The key to search for.
 *
 * @returns `true` if `key` exists in the subtree, `false` otherwise
 */
export function has<K, V>(
  root: Node<K, V> | null,
  compareFn: CompareFn<K>,
  key: K
): boolean {
  while (root) {
    const cmp = compareFn(key, root.key);
    if (cmp < 0) root = root.left;
    else if (cmp > 0) root = root.right;
    else return true;
  }
  return false;
}

/**
 * Returns the value associated with a given key in subtree rooted at a given
 * node.
 *
 * @param root Root of the subtree
 * @param compareFn Function used to determine the order of keys. It is expected
 * to return a negative value if the first argument is less than the second
 * argument, zero if they're equal, and a positive value otherwise.
 * @param key The key
 *
 * @returns The value associated with `key` if `key` is in subtree rooted at
 * `root`
 *
 * @throws {NoSuchElementError} if `key` is not in subtree rooted at `root`
 */
export function get<K, V>(
  root: Node<K, V> | null,
  compareFn: CompareFn<K>,
  key: K
): V {
  while (root) {
    const cmp = compareFn(key, root.key);
    if (cmp < 0) root = root.left;
    else if (cmp > 0) root = root.right;
    else return root.value;
  }
  throw new NoSuchElementError();
}

/**
 * Finds the node with the smallest key in subtree rooted at the given node.
 *
 * @param root Root of the subtree
 *
 * @returns The node with the smallest key in subtree rooted at `root`
 */
export function min<K, V>(root: Node<K, V>): Node<K, V> {
  if (!root.left) return root;
  return min(root.left);
}

/**
 * Finds the node with the biggest key in subtree rooted at the given node.
 *
 * @param root Root of the substree
 *
 * @returns The node with the biggest key in subtree rooted at `root`
 */
export function max<K, V>(root: Node<K, V>): Node<K, V> {
  if (!root.right) return root;
  return max(root.right);
}

/**
 * Finds the node with largest key that is smaller than or equal to the
 * specified key in subtree rooted at the given node.
 *
 * @param root Root of the subtree
 * @param compareFn Function used to determine the order of keys. It is expected
 * to return a negative value if the first argument is less than the second
 * argument, zero if they're equal, and a positive value otherwise.
 * @param key The key
 *
 * @returns The node with largest key that is smaller than or equal to `key` or
 * `null` if `key` is too small
 */
export function floor<K, V>(
  root: Node<K, V> | null,
  compareFn: CompareFn<K>,
  key: K
): Node<K, V> | null {
  if (!root) return null;
  const cmp = compareFn(key, root.key);
  if (cmp === 0) return root;
  if (cmp < 0) return floor(root.left, compareFn, key);
  // Find node with larger key from the right
  return floor(root.right, compareFn, key) ?? root;
}

/**
 * Finds the node with smallest key that is bigger than or equal to the
 * specified key in subtree rooted at the given node.
 *
 * @param root Root of the subtree
 * @param compareFn Function used to determine the order of keys. It is expected
 * to return a negative value if the first argument is less than the second
 * argument, zero if they're equal, and a positive value otherwise.
 * @param key The key
 *
 * @returns The node with smallest key that is bigger than or equal to `key` or
 * `null` if `key` is too large
 */
export function ceiling<K, V>(
  root: Node<K, V> | null,
  compareFn: CompareFn<K>,
  key: K
): Node<K, V> | null {
  if (!root) return null;
  const cmp = compareFn(key, root.key);
  if (cmp === 0) return root;
  if (cmp > 0) return ceiling(root.right, compareFn, key);
  // Find node with smaller key from the left
  return ceiling(root.left, compareFn, key) ?? root;
}

/**
 * Creates a snapshot of subtree rooted at a given node.
 *
 * @param root Root of the subtree
 *
 * @returns An array of key-value pairs as the result of in order traversal
 */
export function createSnapshot<K, V>(root: Node<K, V> | null): [K, V][] {
  if (!root) return [];
  const snapshot: [K, V][] = [];
  function dfs(node: Node<K, V> | null): void {
    if (!node) return;
    dfs(node.left);
    snapshot.push([node.key, node.value]);
    dfs(node.right);
  }
  dfs(root);
  return snapshot;
}
