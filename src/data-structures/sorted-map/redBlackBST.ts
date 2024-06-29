/**
 * Red-black binary search tree related functions.
 */

import { Node, RED, isRed, size } from './node';
import { CompareFn } from '@/common/types';
import { min } from './BST';
import { ok } from 'node:assert/strict';

/**
 * Inserts the key-value pair into subtree rooted at a given node or updates the
 * value associated with key if it is already in the subtree
 *
 * @param root Root of the subtree
 * @param compareFn Function used to determine the order of keys. It is expected
 * to return a negative value if the first argument is less than the second
 * argument, zero if they're equal, and a positive value otherwise.
 * @param key The key
 * @param value The value
 *
 * @returns The new root of the subtree
 */
export function insert<K, V>(
  root: Node<K, V> | null,
  compareFn: CompareFn<K>,
  key: K,
  value: V
): Node<K, V> {
  if (!root) return new Node(key, value, RED, 1);
  const cmp = compareFn(key, root.key);
  if (cmp < 0) root.left = insert(root.left, compareFn, key, value);
  else if (cmp > 0) root.right = insert(root.right, compareFn, key, value);
  else root.value = value;
  return balance(root);
}

/**
 * Deletes the key-value pair with minimum key from subtree rooted at a given
 * node.
 *
 * @param root Root of the subtree
 *
 * @returns The root of the subtree after deleting
 */
export function deleteMin<K, V>(root: Node<K, V>): Node<K, V> | null {
  ok(isRed(root) || isRed(root.left));
  // Remove a bottom red node.
  if (!root.left) return null;
  if (!isRed(root.left) && !isRed(root.left.left)) root = moveRedLeft(root);
  // `root.left` is either a red node or a node whose left child is red now.
  // So it is not null.
  root.left = deleteMin(root.left as Node<K, V>);
  return balance(root);
}

/**
 * Deletes the key-value pair with maximum key from subtree rooted at a given
 * node.
 *
 * @param root Root of the subtree
 *
 * @returns The root of the subtree after deleting
 */
export function deleteMax<K, V>(root: Node<K, V>): Node<K, V> | null {
  ok(isRed(root) || isRed(root.right) || isRed(root.left));
  if (isRed(root.left)) root = rotateRight(root);
  if (!root.right) return null;
  if (!isRed(root.right) && !isRed(root.right.left)) root = moveRedRight(root);
  // `root.right` is either a red node or a node whose one of its children is
  // red now. So it is not null.
  root.right = deleteMax(root.right as Node<K, V>);
  return balance(root);
}

/**
 * Deletes the specified key and its associated value from subtree rooted at a
 * given node.
 *
 * @param root Root of the subtree
 * @param compareFn Function used to determine the order of keys. It is expected
 * to return a negative value if the first argument is less than the second
 * argument, zero if they're equal, and a positive value otherwise.
 * @param key The key
 *
 * @returns The new root of the subtree after deletion
 */
export function remove<K, V>(
  root: Node<K, V>,
  compareFn: CompareFn<K>,
  key: K
): Node<K, V> | null {
  if (compareFn(key, root.key) < 0) {
    // `root.left` must exist.
    ok(root.left);
    if (!isRed(root.left) && !isRed(root.left.left)) root = moveRedLeft(root);
    // `root.left` is either a red node or a node whose left child is red now.
    // So it is not null.
    root.left = remove(root.left as Node<K, V>, compareFn, key);
  } else {
    if (isRed(root.left)) root = rotateRight(root);
    if (compareFn(key, root.key) === 0 && !root.right) return null;
    // `root.right` exists, either not match yet or match but not at the bottom.
    ok(root.right);
    if (!isRed(root.right) && !isRed(root.right.left))
      root = moveRedRight(root);
    if (compareFn(key, root.key) === 0) {
      const minNode = min(root.right as Node<K, V>);
      root.key = minNode.key;
      root.value = minNode.value;
      root.right = deleteMin(root.right as Node<K, V>);
    } else root.right = remove(root.right as Node<K, V>, compareFn, key);
  }
  return balance(root);
}

// Helper functions.

/**
 * Makes a right-leaning link lean to the left.
 *
 * @param root Root node
 *
 * @returns The root of a red-black BST for the same sets of nodes whose left
 * link is red
 *
 * @throws {AssertionError} if `root.right` is not red
 */
function rotateLeft<K, V>(root: Node<K, V>): Node<K, V> {
  ok(root.right && isRed(root.right));
  const newRoot = root.right;
  root.right = newRoot.left;
  newRoot.left = root;
  newRoot.color = root.color;
  root.color = RED;
  newRoot.size = root.size;
  root.size = size(root.left) + size(root.right) + 1;
  return newRoot;
}

/**
 * Makes a left-leaning link lean to the right.
 *
 * @param root Root node
 *
 * @returns The root of a red-black BST for the same sets of nodes whose right
 * link is red
 *
 * @throws {AssertionError} if `root.left` is not red
 */
function rotateRight<K, V>(root: Node<K, V>): Node<K, V> {
  ok(root.left && isRed(root.left));
  const newRoot = root.left;
  root.left = newRoot.right;
  newRoot.right = root;
  newRoot.color = root.color;
  root.color = RED;
  newRoot.size = root.size;
  root.size = size(root.left) + size(root.right) + 1;
  return newRoot;
}

/**
 * Flips the color of a node and its children.
 *
 * @param node Node to flip color
 *
 * @throws {AssertionError} if `node` does not have two children
 */
function flipColors<K, V>(node: Node<K, V>): void {
  // `node` must have opposite color of its two children.
  ok(node.left && node.right);
  ok(isRed(node.left) === isRed(node.right));
  ok(isRed(node) !== isRed(node.left));
  node.color = !node.color;
  node.left.color = !node.left.color;
  node.right.color = !node.right.color;
}

/**
 * Makes left child of a red node or its left child red.
 *
 * @param node A node
 *
 * @returns A modified node
 */
function moveRedLeft<K, V>(node: Node<K, V>): Node<K, V> {
  // `node` is red.
  ok(isRed(node));
  // Both `node.left` and `node.left.left` are black.
  ok(node.left && !isRed(node.left) && !isRed(node.left.left));
  // `node.right` exists.
  ok(node.right);
  flipColors(node);
  if (isRed(node.right.left)) {
    node.right = rotateRight(node.right);
    node = rotateLeft(node);
    flipColors(node);
  }
  return node;
}

/**
 * Makes right child of a red node or its right child red.
 *
 * @param node A node
 *
 * @returns The modified node
 */
function moveRedRight<K, V>(node: Node<K, V>): Node<K, V> {
  // `node` is red.
  ok(isRed(node));
  // Both `node.right` and `node.right.left` are black.
  ok(node.right && !isRed(node.right) && !isRed(node.right.left));
  // `node.left` exists.
  ok(node.left);
  flipColors(node);
  if (isRed(node.left.left)) {
    node = rotateRight(node);
    flipColors(node);
  }
  return node;
}

/**
 * Restores red-black tree invariant.
 *
 * @param root Root of the tree
 *
 * @returns The root of the tree after restoring the invariant
 */
function balance<K, V>(root: Node<K, V>): Node<K, V> {
  if (isRed(root.right) && !isRed(root.left)) root = rotateLeft(root);
  if (root.left && isRed(root.left) && isRed(root.left.left))
    root = rotateRight(root);
  if (isRed(root.left) && isRed(root.right)) flipColors(root);
  return root;
}
