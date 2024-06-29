/**
 * Red-black binary search tree related functions.
 */

import { Node, RED, isRed, size } from './node';
import { CompareFn } from '@/common/types';
import { min } from './BST';
import { ok } from 'node:assert/strict';

/**
 * Inserts the value into subtree rooted at a given node if there isn't a node
 * with the same value already in the subtree.
 *
 * @param root Root of the subtree
 * @param compareFn Function used to determine the order of values. It is
 * expected to return a negative value if the first argument is less than the
 * second argument, zero if they're equal, and a positive value otherwise.
 * @param value The value
 *
 * @returns The new root of the subtree
 */
export function insert<T>(
  root: Node<T> | null,
  compareFn: CompareFn<T>,
  value: T
): Node<T> {
  if (!root) return new Node(value, RED, 1);
  const cmp = compareFn(value, root.value);
  if (cmp < 0) root.left = insert(root.left, compareFn, value);
  else if (cmp > 0) root.right = insert(root.right, compareFn, value);
  return balance(root);
}

/**
 * Deletes the minimum value from subtree rooted at a given node.
 *
 * @param root Root of the subtree
 *
 * @returns The root of the subtree after deleting
 */
export function deleteMin<T>(root: Node<T>): Node<T> | null {
  ok(isRed(root) || isRed(root.left));
  // Remove a bottom red node.
  if (!root.left) return null;
  if (!isRed(root.left) && !isRed(root.left.left)) root = moveRedLeft(root);
  // `root.left` is either a red node or a node whose left child is red now.
  // So it is not null.
  root.left = deleteMin(root.left as Node<T>);
  return balance(root);
}

/**
 * Deletes the maximum value from subtree rooted at a given node.
 *
 * @param root Root of the subtree
 *
 * @returns The root of the subtree after deleting
 */
export function deleteMax<T>(root: Node<T>): Node<T> | null {
  ok(isRed(root) || isRed(root.right) || isRed(root.left));
  if (isRed(root.left)) root = rotateRight(root);
  if (!root.right) return null;
  if (!isRed(root.right) && !isRed(root.right.left)) root = moveRedRight(root);
  // `root.right` is either a red node or a node whose one of its children is
  // red now. So it is not null.
  root.right = deleteMax(root.right as Node<T>);
  return balance(root);
}

/**
 * Deletes the specified value from subtree rooted at a given node.
 *
 * @param root Root of the subtree
 * @param compareFn Function used to determine the order of values. It is
 * expected to return a negative value if the first argument is less than the
 * second argument, zero if they're equal, and a positive value otherwise.
 * @param value The value
 *
 * @returns The new root of the subtree after deletion
 */
export function remove<T>(
  root: Node<T>,
  compareFn: CompareFn<T>,
  value: T
): Node<T> | null {
  if (compareFn(value, root.value) < 0) {
    // `root.left` must exist.
    ok(root.left);
    if (!isRed(root.left) && !isRed(root.left.left)) root = moveRedLeft(root);
    // `root.left` is either a red node or a node whose left child is red now.
    // So it is not null.
    root.left = remove(root.left as Node<T>, compareFn, value);
  } else {
    if (isRed(root.left)) root = rotateRight(root);
    if (compareFn(value, root.value) === 0 && !root.right) return null;
    // `root.right` exists, either not match yet or match but not at the bottom.
    ok(root.right);
    if (!isRed(root.right) && !isRed(root.right.left))
      root = moveRedRight(root);
    if (compareFn(value, root.value) === 0) {
      const minNode = min(root.right as Node<T>);
      root.value = minNode.value;
      root.right = deleteMin(root.right as Node<T>);
    } else root.right = remove(root.right as Node<T>, compareFn, value);
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
function rotateLeft<T>(root: Node<T>): Node<T> {
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
function rotateRight<T>(root: Node<T>): Node<T> {
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
function flipColors<T>(node: Node<T>): void {
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
function moveRedLeft<T>(node: Node<T>): Node<T> {
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
function moveRedRight<T>(node: Node<T>): Node<T> {
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
function balance<T>(root: Node<T>): Node<T> {
  if (isRed(root.right) && !isRed(root.left)) root = rotateLeft(root);
  if (root.left && isRed(root.left) && isRed(root.left.left))
    root = rotateRight(root);
  if (isRed(root.left) && isRed(root.right)) flipColors(root);
  return root;
}
