import { describe, it, beforeEach, expect } from '@jest/globals';
import { CompareFn } from '@/common/types';
import { SortedMap } from '.';
import { NoSuchElementError } from '@/common/errors';

describe('SortedMap', () => {
  const keys = [8, 5, 1, 4, 6, 2, 7, 3];
  const vals = [6, 8, 4, 1, 7, 3, 2, 5];
  const compareFn: CompareFn<number> = (a, b) => a - b;
  let sortedMap: SortedMap<number, number>;
  beforeEach(() => {
    sortedMap = new SortedMap(compareFn);
  });
  it('should be created empty', () => {
    expect(sortedMap.size()).toBe(0);
    expect(sortedMap.isEmpty()).toBe(true);
  });
  it('should return true if key is in the sorted map', () => {
    sortedMap.set(keys[0], vals[0]);
    expect(sortedMap.has(keys[0])).toBe(true);
  });
  it('should return false if key is not in the sorted map', () => {
    expect(sortedMap.has(keys[0])).toBe(false);
  });
  it('should return the associated value if key is in the sorted map', () => {
    sortedMap.set(keys[0], vals[0]);
    expect(sortedMap.get(keys[0])).toBe(vals[0]);
  });
  it('should return undefined if key is not in the sorted map', () => {
    expect(sortedMap.get(keys[0])).toBeUndefined();
  });
  it('should insert the given key-value pairs into the sorted map', () => {
    const n = keys.length;
    for (let i = 0; i < n; i++) sortedMap.set(keys[i], vals[i]);
    let isValid = true;
    for (let i = 0; i < n; i++)
      if (sortedMap.get(keys[i]) !== vals[i]) isValid = false;
    expect(isValid).toBe(true);
  });
  it('should increment size when inserting', () => {
    const oldSize = sortedMap.size();
    sortedMap.set(keys[0], vals[0]);
    expect(sortedMap.size()).toBe(oldSize + 1);
  });
  it('should update the value if key is in the sorted map', () => {
    sortedMap.set(keys[0], vals[0]);
    sortedMap.set(keys[0], vals[0] + 5);
    expect(sortedMap.get(keys[0])).toBe(vals[0] + 5);
  });
  it('should not delete if key is not in the sorted map', () => {
    expect(sortedMap.delete(keys[0])).toBe(false);
  });
  it('should delete if key is in the sorted map', () => {
    const n = keys.length;
    for (let i = 0; i < n; i++) sortedMap.set(keys[i], vals[i]);
    expect(sortedMap.delete(1)).toBe(true);
    expect(sortedMap.has(1)).toBe(false);
    expect(sortedMap.delete(4)).toBe(true);
    expect(sortedMap.has(4)).toBe(false);
    expect(sortedMap.delete(6)).toBe(true);
    expect(sortedMap.has(6)).toBe(false);
    expect(sortedMap.delete(7)).toBe(true);
    expect(sortedMap.has(7)).toBe(false);
  });
  it('should clear all the mappings', () => {
    sortedMap.set(1, 3);
    sortedMap.set(3, 1);
    sortedMap.set(2, 2);
    sortedMap.clear();
    expect(sortedMap.size()).toBe(0);
    expect(sortedMap.isEmpty()).toBe(true);
    expect(sortedMap.has(1)).toBe(false);
    expect(sortedMap.has(2)).toBe(false);
    expect(sortedMap.has(3)).toBe(false);
  });
  it('should not return the largest key if the sorted map is empty', () => {
    expect(() => {
      sortedMap.max();
    }).toThrow(NoSuchElementError);
  });
  it('should return the largest key if the sorted map is not empty', () => {
    sortedMap.set(1, 3);
    sortedMap.set(3, 1);
    sortedMap.set(2, 2);
    expect(sortedMap.max()).toBe(3);
  });
  it('should not return the smallest key if the sorted map is empty', () => {
    expect(() => {
      sortedMap.min();
    }).toThrow(NoSuchElementError);
  });
  it('should return the smallest key if the sorted map is not empty', () => {
    sortedMap.set(1, 3);
    sortedMap.set(3, 1);
    sortedMap.set(2, 2);
    expect(sortedMap.min()).toBe(1);
  });
  it('should not delete the smallest key and its associated value if the sorted map is empty', () => {
    expect(() => {
      sortedMap.deleteMin();
    }).toThrow(NoSuchElementError);
  });
  it('should delete the smallest key and its associated value if the sorted map is not empty', () => {
    const n = keys.length;
    let minKey = Infinity;
    for (let i = 0; i < n; i++) {
      sortedMap.set(keys[i], vals[i]);
      minKey = Math.min(minKey, keys[i]);
    }
    sortedMap.deleteMin();
    expect(sortedMap.has(minKey)).toBe(false);
  });
  it('should not delete the largest key and its associated value if the sorted map is empty', () => {
    expect(() => {
      sortedMap.deleteMax();
    }).toThrow(NoSuchElementError);
  });
  it('should delete the largest key and its associated value if the sorted map is not empty', () => {
    const n = keys.length;
    let maxKey = -Infinity;
    for (let i = 0; i < n; i++) {
      sortedMap.set(keys[i], vals[i]);
      maxKey = Math.max(maxKey, keys[i]);
    }
    maxKey = Math.max(maxKey, 5.5, 6.5);
    sortedMap.set(5.5, 0);
    sortedMap.set(6.5, -1);
    sortedMap.deleteMax();
    expect(sortedMap.has(maxKey)).toBe(false);
  });
  it('should not return floor of a given key if the sorted map is empty', () => {
    expect(() => {
      sortedMap.floor(1);
    }).toThrow(NoSuchElementError);
  });
  it('should not return floor of a given key if the key is too small', () => {
    sortedMap.set(1, 3);
    sortedMap.set(4, 1);
    sortedMap.set(2.5, 2);
    expect(() => {
      sortedMap.floor(0.99);
    }).toThrow(NoSuchElementError);
  });
  it('should return floor of a given key', () => {
    sortedMap.set(1, 3);
    sortedMap.set(4, 1);
    sortedMap.set(2.5, 2);
    expect(sortedMap.floor(3)).toBe(2.5);
    expect(sortedMap.floor(1)).toBe(1);
    expect(sortedMap.floor(5)).toBe(4);
  });
  it('should not return ceiling of a given key if the sorted map is empty', () => {
    expect(() => {
      sortedMap.ceiling(1);
    }).toThrow(NoSuchElementError);
  });
  it('should not return ceiling of a given key if the key is too large', () => {
    sortedMap.set(1, 3);
    sortedMap.set(4, 1);
    sortedMap.set(2.5, 2);
    expect(() => {
      sortedMap.ceiling(4.01);
    }).toThrow(NoSuchElementError);
  });
  it('should return ceiling of a given key', () => {
    sortedMap.set(1, 3);
    sortedMap.set(4, 1);
    sortedMap.set(2.5, 2);
    expect(sortedMap.ceiling(3)).toBe(4);
    expect(sortedMap.ceiling(2.5)).toBe(2.5);
    expect(sortedMap.ceiling(0.99)).toBe(1);
  });
});
