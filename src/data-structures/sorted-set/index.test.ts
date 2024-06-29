import { describe, it, beforeEach, expect } from '@jest/globals';
import { CompareFn } from '@/common/types';
import { SortedSet } from '.';
import { NoSuchElementError } from '@/common/errors';

describe('SortedSet', () => {
  const vals = [8, 5, 1, 4, 6, 2, 7, 3];
  const compareFn: CompareFn<number> = (a, b) => a - b;
  let sortedSet: SortedSet<number>;
  beforeEach(() => {
    sortedSet = new SortedSet(compareFn);
  });
  it('should be created empty', () => {
    expect(sortedSet.size()).toBe(0);
    expect(sortedSet.isEmpty()).toBe(true);
  });
  it('should return true if value is in the sorted set', () => {
    sortedSet.add(vals[0]);
    expect(sortedSet.has(vals[0])).toBe(true);
  });
  it('should return false if value is not in the sorted set', () => {
    expect(sortedSet.has(vals[0])).toBe(false);
  });
  it('should insert the given value-value pairs into the sorted set', () => {
    const n = vals.length;
    for (let i = 0; i < n; i++) sortedSet.add(vals[i]);
    let isValid = true;
    for (let i = 0; i < n; i++) if (!sortedSet.has(vals[i])) isValid = false;
    expect(isValid).toBe(true);
  });
  it('should increment size when adding', () => {
    const oldSize = sortedSet.size();
    sortedSet.add(vals[0]);
    expect(sortedSet.size()).toBe(oldSize + 1);
  });
  it('should delete if value is in the sorted set', () => {
    const n = vals.length;
    for (let i = 0; i < n; i++) sortedSet.add(vals[i]);
    expect(sortedSet.delete(1)).toBe(true);
    expect(sortedSet.has(1)).toBe(false);
    expect(sortedSet.delete(4)).toBe(true);
    expect(sortedSet.has(4)).toBe(false);
    expect(sortedSet.delete(6)).toBe(true);
    expect(sortedSet.has(6)).toBe(false);
    expect(sortedSet.delete(7)).toBe(true);
    expect(sortedSet.has(7)).toBe(false);
  });
  it('should not delete if value is not in the sorted set', () => {
    expect(sortedSet.delete(1)).toBe(false);
  });
  it('should clear all the elements', () => {
    sortedSet.add(1);
    sortedSet.add(3);
    sortedSet.add(2);
    sortedSet.clear();
    expect(sortedSet.size()).toBe(0);
    expect(sortedSet.isEmpty()).toBe(true);
    expect(sortedSet.has(1)).toBe(false);
    expect(sortedSet.has(2)).toBe(false);
    expect(sortedSet.has(3)).toBe(false);
  });
  it('should not return the largest value if the sorted set is empty', () => {
    expect(() => {
      sortedSet.max();
    }).toThrow(NoSuchElementError);
  });
  it('should return the largest value if the sorted set is not empty', () => {
    sortedSet.add(1);
    sortedSet.add(3);
    sortedSet.add(2);
    expect(sortedSet.max()).toBe(3);
  });
  it('should not return the smallest value if the sorted set is empty', () => {
    expect(() => {
      sortedSet.min();
    }).toThrow(NoSuchElementError);
  });
  it('should return the smallest value if the sorted set is not empty', () => {
    sortedSet.add(1);
    sortedSet.add(3);
    sortedSet.add(2);
    expect(sortedSet.min()).toBe(1);
  });
  it('should not delete the smallest value if the sorted set is empty', () => {
    expect(() => {
      sortedSet.deleteMin();
    }).toThrow(NoSuchElementError);
  });
  it('should delete the smallest value if the sorted set is not empty', () => {
    const n = vals.length;
    for (let i = 0; i < n; i++) sortedSet.add(vals[i]);
    sortedSet.deleteMin();
    expect(sortedSet.has(Math.min(...vals))).toBe(false);
  });
  it('should not delete the largest value if the sorted set is empty', () => {
    expect(() => {
      sortedSet.deleteMax();
    }).toThrow(NoSuchElementError);
  });
  it('should delete the largest value if the sorted set is not empty', () => {
    const n = vals.length;
    let maxVal = -Infinity;
    for (let i = 0; i < n; i++) {
      sortedSet.add(vals[i]);
      maxVal = Math.max(maxVal, vals[i]);
    }
    sortedSet.add(5.5);
    sortedSet.add(6.5);
    maxVal = Math.max(maxVal, 5.5, 6.5);
    sortedSet.deleteMax();
    expect(sortedSet.has(maxVal)).toBe(false);
  });

  it('should not return floor of a given value if the sorted set is empty', () => {
    expect(() => {
      sortedSet.floor(1);
    }).toThrow(NoSuchElementError);
  });
  it('should not return floor of a given value if the value is too small', () => {
    sortedSet.add(1);
    sortedSet.add(4);
    sortedSet.add(2.5);
    expect(() => {
      sortedSet.floor(0.99);
    }).toThrow(NoSuchElementError);
  });
  it('should return floor of a given value', () => {
    sortedSet.add(1);
    sortedSet.add(4);
    sortedSet.add(2.5);
    expect(sortedSet.floor(3)).toBe(2.5);
    expect(sortedSet.floor(1)).toBe(1);
    expect(sortedSet.floor(5)).toBe(4);
  });
  it('should not return ceiling of a given value if the sorted set is empty', () => {
    expect(() => {
      sortedSet.ceiling(1);
    }).toThrow(NoSuchElementError);
  });
  it('should not return ceiling of a given value if the value is too large', () => {
    sortedSet.add(1);
    sortedSet.add(4);
    sortedSet.add(2.5);
    expect(() => {
      sortedSet.ceiling(4.01);
    }).toThrow(NoSuchElementError);
  });
  it('should return ceiling of a given value', () => {
    sortedSet.add(1);
    sortedSet.add(4);
    sortedSet.add(2.5);
    expect(sortedSet.ceiling(3)).toBe(4);
    expect(sortedSet.ceiling(2.5)).toBe(2.5);
    expect(sortedSet.ceiling(0.99)).toBe(1);
  });
});
