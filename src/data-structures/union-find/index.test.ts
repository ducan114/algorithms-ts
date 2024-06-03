import { beforeEach, describe, expect, it } from '@jest/globals';
import { UnionFind } from '.';

describe('UnionFind', () => {
  const n = 5;
  let uf: UnionFind;
  beforeEach(() => {
    uf = new UnionFind(n);
  });
  it('should be created with each element in its own set', () => {
    expect(uf.count()).toBe(n);
  });
  it('should not find if element is not an integer', () => {
    expect(() => {
      uf.find(0.5);
    }).toThrow(RangeError);
  });
  it('should not find if element is negative', () => {
    expect(() => {
      uf.find(-1);
    }).toThrow(RangeError);
  });
  it('should not find if element is overflow', () => {
    expect(() => {
      uf.find(5);
    }).toThrow(RangeError);
  });
  it('should return different elements if two elements are in different sets', () => {
    expect(uf.find(0)).not.toBe(uf.find(1));
  });
  it('should return the same element if two elements are in the same set', () => {
    uf.union(0, 1);
    uf.union(3, 0);
    expect(uf.find(0)).toBe(uf.find(1));
  });
  it('should not union if two elements are in the same set', () => {
    uf.union(0, 1);
    uf.union(1, 3);
    const canonicalElement = uf.find(0);
    uf.union(3, 0);
    expect(uf.find(1)).toBe(canonicalElement);
  });
  it('should decrement the number of sets by one when merging two sets', () => {
    const cnt = uf.count();
    uf.union(0, 1);
    expect(uf.count()).toBe(cnt - 1);
  });
});
