/**
 * Red-black binary search tree node related code.
 */

export const RED = true,
  BLACK = false;

export class Node<K, V> {
  key: K;
  value: V;
  left: Node<K, V> | null = null;
  right: Node<K, V> | null = null;
  color: boolean;
  size: number;

  constructor(key: K, value: V, color: boolean, size: number) {
    this.key = key;
    this.value = value;
    this.color = color;
    this.size = size;
  }
}

/**
 * Returns the number of nodes in subtree rooted at a given node.
 *
 * @param root Root of the subtree
 *
 * @returns The number of nodes in the subtree rooted at `root`, 0 if `root`
 * is `null`
 */
export function size<K, V>(root: Node<K, V> | null): number {
  if (!root) return 0;
  return root.size;
}

/**
 * Determines the color of a node.
 *
 * @param node A node
 *
 * @returns `false` if `node` is `null` or is black, `true` otherwise
 */
export function isRed<K, V>(node: Node<K, V> | null): boolean {
  if (!node) return false;
  return node.color === RED;
}
