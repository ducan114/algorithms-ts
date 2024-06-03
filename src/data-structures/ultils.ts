/**
 * Represents an collection of elements. It supports public methods to retrieve
 * infomations about the collection's size, and protected methods
 * `incrementSize` and `decrementSize` to update the size in subclasses.
 */
export class Collection {
  private _size = 0;

  /**
   * Returns the number of elements in this collection.
   *
   * @returns The number of elements in this collection
   */
  size(): number {
    return this._size;
  }

  /**
   * Determines whether this collection is empty.
   *
   * @returns `true` if this collection is empty, `false` otherwise
   */
  isEmpty(): boolean {
    return this.size() === 0;
  }

  /**
   * Increments the size of this collection by one.
   */
  protected _incrementSize(): void {
    this._size++;
  }

  /**
   * Decrements the size of this collection by one.
   */
  protected _decrementSize(): void {
    this._size--;
  }
}
