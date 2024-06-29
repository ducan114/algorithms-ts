/**
 * Binary search tree related functions
 */

import { Node } from './node';
import { CompareFn } from '@/common/types';

/**
 * Check if a value exists in subtree rooted at a given node.
 *
 * @param root Root of the subtree
 * @param compareFn Function used to determine the order of values. It is
 * expected to return a negative value if the first argument is less than the
 * second argument, zero if they're equal, and a positive value otherwise.
 * @param value The value
 *
 * @returns `true` if `value` exists in the subtree, `false` otherwise
 */
export function has<T>(
  root: Node<T> | null,
  compareFn: CompareFn<T>,
  value: T
): boolean {
  while (root) {
    const cmp = compareFn(value, root.value);
    if (cmp < 0) root = root.left;
    else if (cmp > 0) root = root.right;
    else return true;
  }
  return false;
}

/**
 * Finds the node with the smallest value in subtree rooted at the given node.
 *
 * @param root Root of the subtree
 *
 * @returns The node with the smallest value in subtree rooted at `root`
 */
export function min<T>(root: Node<T>): Node<T> {
  if (!root.left) return root;
  return min(root.left);
}

/**
 * Finds the node with the biggest value in subtree rooted at the given node.
 *
 * @param root Root of the substree
 *
 * @returns The node with the biggest value in subtree rooted at `root`
 */
export function max<T>(root: Node<T>): Node<T> {
  if (!root.right) return root;
  return max(root.right);
}

/**
 * Finds the node with largest value that is smaller than or equal to the
 * specified value in subtree rooted at the given node.
 *
 * @param root Root of the subtree
 * @param compareFn Function used to determine the order of values. It is
 * expected to return a negative value if the first argument is less than the
 * second argument, zero if they're equal, and a positive value otherwise.
 * @param value The value
 *
 * @returns The node with largest value that is smaller than or equal to `value`
 * or `null` if `value` is too small
 */
export function floor<T>(
  root: Node<T> | null,
  compareFn: CompareFn<T>,
  value: T
): Node<T> | null {
  if (!root) return null;
  const cmp = compareFn(value, root.value);
  if (cmp === 0) return root;
  if (cmp < 0) return floor(root.left, compareFn, value);
  // Find node with larger value from the right
  return floor(root.right, compareFn, value) ?? root;
}

/**
 * Finds the node with smallest value that is bigger than or equal to the
 * specified value in subtree rooted at the given node.
 *
 * @param root Root of the subtree
 * @param compareFn Function used to determine the order of values. It is
 * expected to return a negative value if the first argument is less than the
 * second argument, zero if they're equal, and a positive value otherwise.
 * @param value The value
 *
 * @returns The node with smallest value that is bigger than or equal to `value`
 * or `null` if `value` is too large
 */
export function ceiling<T>(
  root: Node<T> | null,
  compareFn: CompareFn<T>,
  value: T
): Node<T> | null {
  if (!root) return null;
  const cmp = compareFn(value, root.value);
  if (cmp === 0) return root;
  if (cmp > 0) return ceiling(root.right, compareFn, value);
  // Find node with smaller value from the left
  return ceiling(root.left, compareFn, value) ?? root;
}

/**
 * Creates a snapshot of subtree rooted at a given node.
 *
 * @param root Root of the subtree
 *
 * @returns An array of values as the result of in order traversal
 */
export function createSnapshot<T>(root: Node<T> | null): T[] {
  if (!root) return [];
  const snapshot: T[] = [];
  function dfs(node: Node<T> | null): void {
    if (!node) return;
    dfs(node.left);
    snapshot.push(node.value);
    dfs(node.right);
  }
  dfs(root);
  return snapshot;
}
