import { Collection } from '../ultils';
import { Node, getIterator } from '@/data-structures/singly-linked-list';
import { NoSuchElementError } from '@/common/errors';

/**
 * Represents a last-in-first-out (LIFO) stack of items. It supports the usual
 * `push` and `pop` operations, along with methods for peeking at the top item,
 * and iterating through the items in LIFO order.
 *
 * This implementation uses a singly linked list. The `push`, `pop`, and `peek`
 * operations all take constant time in the worst case.
 */
export default class Stack<T> extends Collection implements Iterable<T> {
  protected _top: Node<T> | null = null;

  /**
   * Adds the item to this stack.
   *
   * @param item The item to add
   */
  push(item: T): void {
    this._top = new Node<T>(item, this._top);
    this._incrementSize();
  }

  /**
   * Removes and returns the item most recently added to this stack.
   *
   * @returns The item most recently added to this stack
   *
   * @throws {NoSuchElementError} if this stack is empty
   */
  pop(): T {
    if (this.isEmpty()) throw new NoSuchElementError('Stack is empty');
    const top = this._top as Node<T>;
    this._top = top.next;
    this._decrementSize();
    return top.item;
  }

  /**
   * Returns the item most recently added to this stack.
   *
   * @returns The item most recently added to this stack
   *
   * @throws {NoSuchElementError} if this stack is empty
   */
  peek(): T {
    if (this.isEmpty()) throw new NoSuchElementError('Stack is empty');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this._top!.item;
  }

  /**
   * Returns an iterator to this stack that iterates through the items in LIFO
   * order.
   *
   * @returns An iterator to this stack that iterates through the items in LIFO
   * order
   */
  [Symbol.iterator]() {
    return getIterator(this._top);
  }
}
