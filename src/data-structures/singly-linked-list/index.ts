/**
 * Returns an iterator that iterates through the items of the singly linked list
 * whose first node is pointed to by the given pointer.
 *
 * @param head Pointer to the first node of the singly linked list
 * @yields The next item in the list
 */
export function* getIterator<T>(head: Node<T> | null): IterableIterator<T> {
  let cur = head;
  while (cur) {
    yield cur.item;
    cur = cur.next;
  }
}

/**
 * Represents a singly linked list node that contains an item, and a reference to
 * another singly linked list node or `null`.
 */
export class Node<T> {
  item: T;
  next: Node<T> | null;

  constructor(item: T, next: Node<T> | null = null) {
    this.item = item;
    this.next = next;
  }
}
