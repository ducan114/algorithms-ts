import { Collection } from '../ultils';
import { Node, getIterator } from '../singly-linked-list';
import { NoSuchElementError } from '@/common/errors';

/**
 * Represents a first-in-first-out (FIFO) queue of items. It supports the usual
 * `enqueue` and `dequeue` operations, along with methods for peeking at the
 * front item, and iterating through the items in FIFO order.
 *
 * This implementation uses a singly linked list. The `enqueue`, `dequeue`, and
 * `peek` operations all take constant time in the worst case.
 */
export class Queue<T> extends Collection implements Iterable<T> {
  protected _front: Node<T> | null = null;
  protected _back: Node<T> | null = null;

  /**
   * Adds the item to this queue.
   *
   * @param item The item to add
   */
  enqueue(item: T): void {
    const oldBack = this._back;
    this._back = new Node(item);
    if (oldBack) oldBack.next = this._back;
    else this._front = this._back;
    this._incrementSize();
  }

  /**
   * Removes and returns the item least recently added to this queue.
   *
   * @returns The item least recently added to this queue
   *
   * @throws {NoSuchElementError} if this queue is empty
   */
  dequeue(): T {
    if (this.isEmpty()) throw new NoSuchElementError('Queue is empty');
    const front = this._front as Node<T>;
    this._front = front.next;
    if (!this._front) this._back = null;
    this._decrementSize();
    return front.item;
  }

  /**
   * Returns the item least recently added to this queue.
   *
   * @returns The item least recently added to this queue
   *
   * @throws {NoSuchElementError} if this queue is empty
   */
  peek(): T {
    if (this.isEmpty()) throw new NoSuchElementError('Queue is empty');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this._front!.item;
  }

  /**
   * Returns an iterator that iterates over the items in this queue in FIFO
   * order.
   *
   * @returns An iterator that iterates over the items in this queue in FIFO
   * order
   */
  [Symbol.iterator]() {
    return getIterator(this._front);
  }
}
