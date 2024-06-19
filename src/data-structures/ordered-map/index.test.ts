import { describe, it, beforeEach, expect } from '@jest/globals';
import { CompareFn } from '@/common/types';
import { OrderedMap } from '.';
import { NoSuchElementError } from '@/common/errors';

describe('OrderedMap', () => {
  const keys = [8, 5, 1, 4, 6, 2, 7, 3];
  const vals = [6, 8, 4, 1, 7, 3, 2, 5];
  const compareFn: CompareFn<number> = (a, b) => a - b;
  let orderedMap: OrderedMap<number, number>;
  beforeEach(() => {
    orderedMap = new OrderedMap(compareFn);
  });
  it('should be created empty', () => {
    expect(orderedMap.size()).toBe(0);
    expect(orderedMap.isEmpty()).toBe(true);
  });
  it('should return true if key is in the ordered map', () => {
    orderedMap.set(keys[0], vals[0]);
    expect(orderedMap.has(keys[0])).toBe(true);
  });
  it('should return false if key is not in the ordered map', () => {
    expect(orderedMap.has(keys[0])).toBe(false);
  });
  it('should return the associated value if key is in the ordered map', () => {
    orderedMap.set(keys[0], vals[0]);
    expect(orderedMap.get(keys[0])).toBe(vals[0]);
  });
  it('should return undefined if key is not in the ordered map', () => {
    expect(orderedMap.get(keys[0])).toBeUndefined();
  });
  it('should insert the given key-value pairs into the ordered map', () => {
    const n = keys.length;
    for (let i = 0; i < n; i++) orderedMap.set(keys[i], vals[i]);
    let isValid = true;
    for (let i = 0; i < n; i++)
      if (orderedMap.get(keys[i]) !== vals[i]) isValid = false;
    expect(isValid).toBe(true);
  });
  it('should increment size when inserting', () => {
    const oldSize = orderedMap.size();
    orderedMap.set(keys[0], vals[0]);
    expect(orderedMap.size()).toBe(oldSize + 1);
  });
  it('should update the value if key is in the ordered map', () => {
    orderedMap.set(keys[0], vals[0]);
    orderedMap.set(keys[0], vals[0] + 5);
    expect(orderedMap.get(keys[0])).toBe(vals[0] + 5);
  });
  it('should not delete if key is not in the ordered map', () => {
    expect(orderedMap.delete(keys[0])).toBe(false);
  });
  it('should delete if key is in the ordered map', () => {
    const n = keys.length;
    for (let i = 0; i < n; i++) orderedMap.set(keys[i], vals[i]);
    expect(orderedMap.delete(1)).toBe(true);
    expect(orderedMap.has(1)).toBe(false);
    expect(orderedMap.delete(4)).toBe(true);
    expect(orderedMap.has(4)).toBe(false);
    expect(orderedMap.delete(6)).toBe(true);
    expect(orderedMap.has(6)).toBe(false);
    expect(orderedMap.delete(7)).toBe(true);
    expect(orderedMap.has(7)).toBe(false);
  });
  it('should clear all the mappings', () => {
    orderedMap.set(1, 3);
    orderedMap.set(3, 1);
    orderedMap.set(2, 2);
    orderedMap.clear();
    expect(orderedMap.size()).toBe(0);
    expect(orderedMap.isEmpty()).toBe(true);
    expect(orderedMap.has(1)).toBe(false);
    expect(orderedMap.has(2)).toBe(false);
    expect(orderedMap.has(3)).toBe(false);
  });
  it('should not return the largest key if the ordered map is empty', () => {
    expect(() => {
      orderedMap.max();
    }).toThrow(NoSuchElementError);
  });
  it('should return the largest key if the ordered map is not empty', () => {
    orderedMap.set(1, 3);
    orderedMap.set(3, 1);
    orderedMap.set(2, 2);
    expect(orderedMap.max()).toBe(3);
  });
  it('should not return the smallest key if the ordered map is empty', () => {
    expect(() => {
      orderedMap.min();
    }).toThrow(NoSuchElementError);
  });
  it('should return the smallest key if the ordered map is not empty', () => {
    orderedMap.set(1, 3);
    orderedMap.set(3, 1);
    orderedMap.set(2, 2);
    expect(orderedMap.min()).toBe(1);
  });
  it('should not delete the smallest key and its associated value if the ordered map is empty', () => {
    expect(() => {
      orderedMap.deleteMin();
    }).toThrow(NoSuchElementError);
  });
  it('should delete the smallest key and its associated value if the ordered map is not empty', () => {
    const n = keys.length;
    let minKey = Infinity;
    for (let i = 0; i < n; i++) {
      orderedMap.set(keys[i], vals[i]);
      minKey = Math.min(minKey, keys[i]);
    }
    orderedMap.deleteMin();
    expect(orderedMap.has(minKey)).toBe(false);
  });
  it('should not delete the largest key and its associated value if the ordered map is empty', () => {
    expect(() => {
      orderedMap.deleteMax();
    }).toThrow(NoSuchElementError);
  });
  it('should delete the largest key and its associated value if the ordered map is not empty', () => {
    const n = keys.length;
    let maxKey = -Infinity;
    for (let i = 0; i < n; i++) {
      orderedMap.set(keys[i], vals[i]);
      maxKey = Math.max(maxKey, keys[i]);
    }
    maxKey = Math.max(maxKey, 5.5, 6.5);
    orderedMap.set(5.5, 0);
    orderedMap.set(6.5, -1);
    orderedMap.deleteMax();
    expect(orderedMap.has(maxKey)).toBe(false);
  });
  it('should not return floor of a given key if the ordered map is empty', () => {
    expect(() => {
      orderedMap.floor(1);
    }).toThrow(NoSuchElementError);
  });
  it('should not return floor of a given key if the key is too small', () => {
    orderedMap.set(1, 3);
    orderedMap.set(4, 1);
    orderedMap.set(2.5, 2);
    expect(() => {
      orderedMap.floor(0.99);
    }).toThrow(NoSuchElementError);
  });
  it('should return floor of a given key', () => {
    orderedMap.set(1, 3);
    orderedMap.set(4, 1);
    orderedMap.set(2.5, 2);
    expect(orderedMap.floor(3)).toBe(2.5);
    expect(orderedMap.floor(1)).toBe(1);
    expect(orderedMap.floor(5)).toBe(4);
  });
  it('should not return ceiling of a given key if the ordered map is empty', () => {
    expect(() => {
      orderedMap.ceiling(1);
    }).toThrow(NoSuchElementError);
  });
  it('should not return ceiling of a given key if the key is too large', () => {
    orderedMap.set(1, 3);
    orderedMap.set(4, 1);
    orderedMap.set(2.5, 2);
    expect(() => {
      orderedMap.ceiling(4.01);
    }).toThrow(NoSuchElementError);
  });
  it('should return ceiling of a given key', () => {
    orderedMap.set(1, 3);
    orderedMap.set(4, 1);
    orderedMap.set(2.5, 2);
    expect(orderedMap.ceiling(3)).toBe(4);
    expect(orderedMap.ceiling(2.5)).toBe(2.5);
    expect(orderedMap.ceiling(0.99)).toBe(1);
  });
});
