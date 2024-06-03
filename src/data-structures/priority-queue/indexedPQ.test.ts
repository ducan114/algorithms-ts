import { beforeEach, describe, expect, it } from '@jest/globals';
import { IndexedMaxPQ, IndexedMinPQ } from './indexedPQ';
import { Collection } from '../ultils';
import { CompareFn } from '@/common/types';
import { IlligalArgumentError, NoSuchElementError } from '@/common/errors';

const priorities = [1, 2, 0, -1, 5];
const n = priorities.length;

describe('IndexedMaxPQ', () => {
  const compareFn: CompareFn<number> = (a, b) => a - b;
  const maxPriority = priorities.reduce((max, val) =>
    compareFn(val, max) > 0 ? val : max
  );
  let pq: IndexedMaxPQ<number>;
  beforeEach(() => {
    pq = new IndexedMaxPQ(compareFn, n);
  });
  it('should be a collection of items', () => {
    expect(pq).toBeInstanceOf(Collection);
  });
  it('should return true if item is existed', () => {
    pq.enqueue(0, 1);
    expect(pq.has(0)).toBe(true);
  });
  it('should return false if item is not existed', () => {
    expect(pq.has(0)).toBe(false);
  });
  it('should not enqueue if item is not an integer', () => {
    expect(() => {
      pq.enqueue(0.5, 1);
    }).toThrow(RangeError);
  });
  it('should not enqueue if item is negative', () => {
    expect(() => {
      pq.enqueue(-1, 1);
    }).toThrow(RangeError);
  });
  it('should not enqueue if item is overflow', () => {
    expect(() => {
      pq.enqueue(n, 1);
    }).toThrow(RangeError);
  });
  it('should not enqueue if item is existed', () => {
    pq.enqueue(0, priorities[0]);
    expect(() => {
      pq.enqueue(0, priorities[0]);
    }).toThrow(IlligalArgumentError);
  });
  it('should increment size by one when enqueuing', () => {
    const oldSize = pq.size();
    pq.enqueue(0, priorities[0]);
    expect(pq.size()).toBe(oldSize + 1);
  });
  it('should not get priority if item is not an integer', () => {
    expect(() => {
      pq.getPriority(0.5);
    }).toThrow(RangeError);
  });
  it('should not get priority if item is negative', () => {
    expect(() => {
      pq.getPriority(-1);
    }).toThrow(RangeError);
  });
  it('should not get priority if item is overflow', () => {
    expect(() => {
      pq.getPriority(n);
    }).toThrow(RangeError);
  });
  it('should not get priority if item is not existed', () => {
    expect(() => {
      pq.getPriority(0);
    }).toThrow(NoSuchElementError);
  });
  it('should return the priority of an item', () => {
    pq.enqueue(0, 5);
    expect(pq.getPriority(0)).toBe(5);
  });
  it('should not dequeue if it is empty', () => {
    expect(() => {
      pq.dequeue();
    }).toThrow(NoSuchElementError);
  });
  it('should decrement size by one when dequeuing', () => {
    for (let i = 0; i < n; i++) pq.enqueue(i, priorities[i]);
    const oldSize = pq.size();
    pq.dequeue();
    expect(pq.size()).toBe(oldSize - 1);
  });
  it('should return the item with highest priority when dequeuing', () => {
    for (let i = 0; i < n; i++) pq.enqueue(i, priorities[i]);
    expect(priorities[pq.dequeue()]).toBe(maxPriority);
  });
  it('should remove the item with highest priority when dequeuing', () => {
    for (let i = 0; i < n; i++) pq.enqueue(i, priorities[i]);
    const item = pq.dequeue();
    let isValid = true;
    while (isValid && !pq.isEmpty())
      isValid = compareFn(priorities[item], priorities[pq.dequeue()]) >= 0;
    expect(isValid).toBe(true);
  });
  it('should not peek if it is empty', () => {
    expect(() => {
      pq.peek();
    }).toThrow(NoSuchElementError);
  });
  it('should not decrement size when peeking', () => {
    pq.enqueue(0, priorities[0]);
    const size = pq.size();
    pq.peek();
    expect(pq.size()).toBe(size);
  });
  it('should not remove the item with highest priority when peeking', () => {
    for (let i = 0; i < n; i++) pq.enqueue(i, priorities[i]);
    pq.peek();
    expect(priorities[pq.peek()]).toBe(maxPriority);
  });
  it('should return the item with highest priority when peeking', () => {
    for (let i = 0; i < n; i++) pq.enqueue(i, priorities[i]);
    expect(priorities[pq.peek()]).toBe(maxPriority);
  });
  it('should not change priority if item is not an integer', () => {
    expect(() => {
      pq.change(0.5, 1);
    }).toThrow(RangeError);
  });
  it('should not change priority if item is negative', () => {
    expect(() => {
      pq.change(-1, 1);
    }).toThrow(RangeError);
  });
  it('should not change priority if item is overflow', () => {
    expect(() => {
      pq.change(n, 1);
    }).toThrow(RangeError);
  });
  it('should not change priority if item is not existed', () => {
    expect(() => {
      pq.change(0, 1);
    }).toThrow(NoSuchElementError);
  });
  it('should be able to change priority of an item', () => {
    pq.enqueue(0, priorities[0]);
    const newPriority = priorities[0] + 5;
    pq.change(0, newPriority);
    expect(pq.getPriority(0)).toBe(newPriority);
  });
  it('should not delete if item is not an integer', () => {
    expect(() => {
      pq.delete(0.5);
    }).toThrow(RangeError);
  });
  it('should not delete if item is negative', () => {
    expect(() => {
      pq.delete(-1);
    }).toThrow(RangeError);
  });
  it('should not delete if item is overflow', () => {
    expect(() => {
      pq.delete(n);
    }).toThrow(RangeError);
  });
  it('should not delete if item is not existed', () => {
    expect(() => {
      pq.delete(0);
    }).toThrow(NoSuchElementError);
  });
  it('should be able to delete a specific item', () => {
    pq.enqueue(0, priorities[0]);
    const itemToDelete = 0;
    pq.delete(itemToDelete);
    expect(pq.has(itemToDelete)).toBe(false);
  });
});

describe('IndexedMinPQ', () => {
  const compareFn: CompareFn<number> = (a, b) => a - b;
  const minPriority = priorities.reduce((min, val) =>
    compareFn(val, min) < 0 ? val : min
  );
  let pq: IndexedMinPQ<number>;
  beforeEach(() => {
    pq = new IndexedMinPQ(compareFn, n);
  });
  it('should be a collection of items', () => {
    expect(pq).toBeInstanceOf(Collection);
  });
  it('should return true if item is existed', () => {
    pq.enqueue(0, 1);
    expect(pq.has(0)).toBe(true);
  });
  it('should return false if item is not existed', () => {
    expect(pq.has(0)).toBe(false);
  });
  it('should not enqueue if item is not an integer', () => {
    expect(() => {
      pq.enqueue(0.5, 1);
    }).toThrow(RangeError);
  });
  it('should not enqueue if item is negative', () => {
    expect(() => {
      pq.enqueue(-1, 1);
    }).toThrow(RangeError);
  });
  it('should not enqueue if item is overflow', () => {
    expect(() => {
      pq.enqueue(n, 1);
    }).toThrow(RangeError);
  });
  it('should not enqueue if item is existed', () => {
    pq.enqueue(0, priorities[0]);
    expect(() => {
      pq.enqueue(0, priorities[0]);
    }).toThrow(IlligalArgumentError);
  });
  it('should increment size by one when enqueuing', () => {
    const oldSize = pq.size();
    pq.enqueue(0, priorities[0]);
    expect(pq.size()).toBe(oldSize + 1);
  });
  it('should not get priority if item is not an integer', () => {
    expect(() => {
      pq.getPriority(0.5);
    }).toThrow(RangeError);
  });
  it('should not get priority if item is negative', () => {
    expect(() => {
      pq.getPriority(-1);
    }).toThrow(RangeError);
  });
  it('should not get priority if item is overflow', () => {
    expect(() => {
      pq.getPriority(n);
    }).toThrow(RangeError);
  });
  it('should not get priority if item is not existed', () => {
    expect(() => {
      pq.getPriority(0);
    }).toThrow(NoSuchElementError);
  });
  it('should return the priority of an item', () => {
    pq.enqueue(0, 5);
    expect(pq.getPriority(0)).toBe(5);
  });
  it('should not dequeue if it is empty', () => {
    expect(() => {
      pq.dequeue();
    }).toThrow(NoSuchElementError);
  });
  it('should decrement size by one when dequeuing', () => {
    for (let i = 0; i < n; i++) pq.enqueue(i, priorities[i]);
    const oldSize = pq.size();
    pq.dequeue();
    expect(pq.size()).toBe(oldSize - 1);
  });
  it('should return the item with lowest priority when dequeuing', () => {
    for (let i = 0; i < n; i++) pq.enqueue(i, priorities[i]);
    expect(priorities[pq.dequeue()]).toBe(minPriority);
  });
  it('should remove the item with lowest priority when dequeuing', () => {
    for (let i = 0; i < n; i++) pq.enqueue(i, priorities[i]);
    const item = pq.dequeue();
    let isValid = true;
    while (isValid && !pq.isEmpty())
      isValid = compareFn(priorities[item], priorities[pq.dequeue()]) <= 0;
    expect(isValid).toBe(true);
  });
  it('should not peek if it is empty', () => {
    expect(() => {
      pq.peek();
    }).toThrow(NoSuchElementError);
  });
  it('should not decrement size when peeking', () => {
    pq.enqueue(0, priorities[0]);
    const size = pq.size();
    pq.peek();
    expect(pq.size()).toBe(size);
  });
  it('should not remove the item with lowest priority when peeking', () => {
    for (let i = 0; i < n; i++) pq.enqueue(i, priorities[i]);
    pq.peek();
    expect(priorities[pq.peek()]).toBe(minPriority);
  });
  it('should return the item with lowest priority when peeking', () => {
    for (let i = 0; i < n; i++) pq.enqueue(i, priorities[i]);
    expect(priorities[pq.peek()]).toBe(minPriority);
  });
  it('should not change priority if item is not an integer', () => {
    expect(() => {
      pq.change(0.5, 1);
    }).toThrow(RangeError);
  });
  it('should not change priority if item is negative', () => {
    expect(() => {
      pq.change(-1, 1);
    }).toThrow(RangeError);
  });
  it('should not change priority if item is overflow', () => {
    expect(() => {
      pq.change(n, 1);
    }).toThrow(RangeError);
  });
  it('should not change priority if item is not existed', () => {
    expect(() => {
      pq.change(0, 1);
    }).toThrow(NoSuchElementError);
  });
  it('should be able to change priority of an item', () => {
    pq.enqueue(0, priorities[0]);
    const newPriority = priorities[0] + 5;
    pq.change(0, newPriority);
    expect(pq.getPriority(0)).toBe(newPriority);
  });
  it('should not delete if item is not an integer', () => {
    expect(() => {
      pq.delete(0.5);
    }).toThrow(RangeError);
  });
  it('should not delete if item is negative', () => {
    expect(() => {
      pq.delete(-1);
    }).toThrow(RangeError);
  });
  it('should not delete if item is overflow', () => {
    expect(() => {
      pq.delete(n);
    }).toThrow(RangeError);
  });
  it('should not delete if item is not existed', () => {
    expect(() => {
      pq.delete(0);
    }).toThrow(NoSuchElementError);
  });
  it('should be able to delete a specific item', () => {
    pq.enqueue(0, priorities[0]);
    const itemToDelete = 0;
    pq.delete(itemToDelete);
    expect(pq.has(itemToDelete)).toBe(false);
  });
});
