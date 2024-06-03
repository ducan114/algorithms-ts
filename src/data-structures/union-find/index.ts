/**
 * Represents the union-find data type (also known as the disjoint-sets data
 * type). It supports the classic `union` and `find` operations, along with a
 * `count` operation that returns the number of sets.
 *
 * The union-find data type models a collection of sets containing `n` elements,
 * with each element in exactly one set. The elements are named `0` through `n -
 * 1`. Initially, there are `n` sets, with each element in its own set. The
 * canonical element of a set (also known as the root, identifier, leader, or
 * set representative) is one distinguished element in the set. `find(x)`
 * returns the canonical element of the set containing `x`. The `find` operation
 * returns the same value for two elements if and only if they are in the same
 * set. `union(x, y)` merges the set containing element `x` with the set
 * containing element `y`. That is, if `x` and `y` are in different sets,
 * replace these sets with a new set that is the union of the two. `count`
 * returns the number of sets.
 *
 * The canonical element of a set can change only when the set itself changes
 * during a call to `union`; it cannot change during a call to either `find` or
 * `count`.
 *
 * This implementation uses weighted quick union by rank with path compression.
 *  The constructor takes O(n), where n is the number of elements. The `union`
 *  and `find` operations take O(log(n)) time in the worst case and
 *  O(&alpha;(n)) on average (O(&alpha;(n)) is regarded as O(1) in practice),
 *  where &alpha;(n) is the Inverse Ackermann function. The `count` operation
 *  takes O(1) time.
 */
export class UnionFind {
  /** `_parent[i]` is the parent of `i` */
  protected _parent: number[];
  /** `_size[i]` is the number of elements in subtree rooted at `i` */
  protected _rank: number[];
  /** The number of sets */
  protected _cnt: number;

  /**
   * Initializes an empty union-find data structure with `n` elements `0` through `n - 1`.
   * Initially, each element is in its own set.
   *
   * @param n The number of elements
   *
   * @throws {RangeError} if `n` is not a non-negative integer
   */
  constructor(n: number) {
    this._cnt = n;
    this._parent = new Array(n);
    this._rank = new Array(n).fill(0);
    for (let i = 0; i < n; i++) this._parent[i] = i;
  }

  /**
   * Returns the canonical element of the set containing the specified element.
   *
   * @param x An element
   * @returns The canonical element of the set containing `x`
   *
   * @throws {RangeError} if `x` is an invalid element
   */
  find(x: number): number {
    if (!Number.isInteger(x)) throw new RangeError('Element is not an integer');
    if (x < 0 || x >= this._parent.length)
      throw new RangeError('Element is out of bounds');
    if (x !== this._parent[x]) this._parent[x] = this.find(this._parent[x]);
    return this._parent[x];
  }

  /**
   * Merges the set containing one element with the set containing the other element.
   *
   * @param x One element
   * @param y The other element
   *
   * @throws {RangeError} if `x` or `y` is an invalid element
   */
  union(x: number, y: number): void {
    const px = this.find(x);
    const py = this.find(y);
    if (px === py) return;
    if (this._rank[px] > this._rank[py]) this._parent[py] = px;
    else if (this._rank[px] < this._rank[py]) this._parent[px] = py;
    else {
      this._parent[py] = px;
      this._rank[px]++;
    }
    this._cnt--;
  }

  /**
   * Returns the number of sets (an integer between `1` and `n`).
   *
   * @returns The number of sets
   */
  count() {
    return this._cnt;
  }
}
