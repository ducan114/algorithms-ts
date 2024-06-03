import { describe, beforeEach, it, expect } from '@jest/globals';
import Stack from '.';
import { Collection } from '../ultils';
import { NoSuchElementError } from '@/common/errors';

describe('Stack', () => {
  let stack: Stack<number>;
  beforeEach(() => {
    stack = new Stack();
  });
  it('should be a collection of items', () => {
    expect(stack).toBeInstanceOf(Collection);
  });
  it('should push to the top', () => {
    stack.push(1);
    stack.push(2);
    expect(stack.peek()).toBe(2);
  });
  it('should increment size by one when push', () => {
    stack.push(1);
    expect(stack.size()).toBe(1);
  });
  it('should not pop from the top if empty', () => {
    expect(() => {
      stack.pop();
    }).toThrow(NoSuchElementError);
  });
  it('should retrieve top item when pop', () => {
    stack.push(1);
    stack.push(2);
    expect(stack.pop()).toBe(2);
  });
  it('should remove top item when pop', () => {
    stack.push(1);
    stack.push(2);
    stack.pop();
    expect(stack.peek()).toBe(1);
  });
  it('should decrement size by one when pop', () => {
    stack.push(1);
    stack.pop();
    expect(stack.size()).toBe(0);
  });
  it('should not peek from the top if empty', () => {
    expect(() => {
      stack.peek();
    }).toThrow(NoSuchElementError);
  });
  it('should retrieve top item when peek', () => {
    stack.push(1);
    stack.push(2);
    expect(stack.peek()).toBe(2);
  });
  it('should not remove top item when peek', () => {
    stack.push(1);
    stack.push(2);
    stack.peek();
    expect(stack.peek()).toBe(2);
  });
  it('should not decrement size when peek', () => {
    stack.push(1);
    stack.peek();
    expect(stack.size()).toBe(1);
  });
  it('should iterate through all items in LIFO order', () => {
    const arr = [1, 2, 3, 4];
    for (const item of arr) stack.push(item);
    let i = arr.length - 1;
    for (const item of stack) expect(item).toBe(arr[i--]);
  });
});
