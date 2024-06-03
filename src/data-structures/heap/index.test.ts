import { beforeEach, describe, expect, it } from '@jest/globals';
import { CompareFn } from '@/common/types';
import { MaxHeap, MinHeap } from '.';
import { Collection } from '../ultils';
import { NoSuchElementError } from '@/common/errors';

const items = [1, 2, 0, -4, 7];

describe('MaxHeap', () => {
  const compareFn: CompareFn<number> = (a, b) => a - b;
  const max = items.reduce((max, item) =>
    compareFn(item, max) > 0 ? item : max
  );
  let heap: MaxHeap<number>;
  beforeEach(() => {
    heap = new MaxHeap<number>(compareFn);
  });
  it('should be a collection of items', () => {
    expect(heap).toBeInstanceOf(Collection);
  });
  it('should increment size by one when adding a new item', () => {
    const oldSize = heap.size();
    heap.add(items[0]);
    expect(heap.size()).toBe(oldSize + 1);
  });
  it('should not remove if heap is empty', () => {
    expect(() => {
      heap.remove();
    }).toThrow(NoSuchElementError);
  });
  it('should decrement size by one when removing', () => {
    for (const item of items) heap.add(item);
    const oldSize = heap.size();
    heap.remove();
    expect(heap.size()).toBe(oldSize - 1);
  });
  it('should return the maximum item when removing', () => {
    for (const item of items) heap.add(item);
    expect(heap.remove()).toBe(max);
  });
  it('should remove the maximum item when removing', () => {
    for (const item of items) heap.add(item);
    const max = heap.remove();
    let isValid = true;
    while (isValid && !heap.isEmpty())
      isValid = compareFn(max, heap.remove()) >= 0;
    expect(isValid).toBe(true);
  });
  it('should not peek if heap is empty', () => {
    expect(() => {
      heap.peek();
    }).toThrow(NoSuchElementError);
  });
  it('should not decrement size when peeking', () => {
    heap.add(items[0]);
    const size = heap.size();
    heap.peek();
    expect(heap.size()).toBe(size);
  });
  it('should not remove the maximum item when peeking', () => {
    for (const item of items) heap.add(item);
    heap.peek();
    expect(heap.peek()).toBe(max);
  });
  it('should return the maximum item when peeking', () => {
    for (const item of items) heap.add(item);
    expect(heap.peek()).toBe(max);
  });
});

describe('MinHeap', () => {
  const compareFn: CompareFn<number> = (a, b) => a - b;
  const min = items.reduce((min, item) =>
    compareFn(item, min) < 0 ? item : min
  );
  let heap: MinHeap<number>;
  beforeEach(() => {
    heap = new MinHeap<number>(compareFn);
  });
  it('should be a collection of items', () => {
    expect(heap).toBeInstanceOf(Collection);
  });
  it('should increment size by one when adding a new item', () => {
    const oldSize = heap.size();
    heap.add(items[0]);
    expect(heap.size()).toBe(oldSize + 1);
  });
  it('should not remove if heap is empty', () => {
    expect(() => {
      heap.remove();
    }).toThrow(NoSuchElementError);
  });
  it('should decrement size by one when removing', () => {
    for (const item of items) heap.add(item);
    const oldSize = heap.size();
    heap.remove();
    expect(heap.size()).toBe(oldSize - 1);
  });
  it('should return the minimum item when removing', () => {
    for (const item of items) heap.add(item);
    expect(heap.remove()).toBe(min);
  });
  it('should remove the minimum item when removing', () => {
    for (const item of items) heap.add(item);
    const min = heap.remove();
    let isValid = true;
    while (isValid && !heap.isEmpty())
      isValid = compareFn(min, heap.remove()) <= 0;
    expect(isValid).toBe(true);
  });
  it('should not peek if heap is empty', () => {
    expect(() => {
      heap.peek();
    }).toThrow(NoSuchElementError);
  });
  it('should not decrement size when peeking', () => {
    heap.add(items[0]);
    const size = heap.size();
    heap.peek();
    expect(heap.size()).toBe(size);
  });
  it('should not remove the minimum item when peeking', () => {
    for (const item of items) heap.add(item);
    heap.peek();
    expect(heap.peek()).toBe(min);
  });
  it('should return the minimum item when peeking', () => {
    for (const item of items) heap.add(item);
    expect(heap.peek()).toBe(min);
  });
});
