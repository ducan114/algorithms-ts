import { beforeEach, describe, expect, it } from '@jest/globals';
import { Queue } from '.';
import { Collection } from '../ultils';
import { NoSuchElementError } from '@/common/errors';

describe('Queue', () => {
  let queue: Queue<number>;
  beforeEach(() => {
    queue = new Queue();
  });
  it('should be a collection of items', () => {
    expect(queue).toBeInstanceOf(Collection);
  });
  it('should enqueue to the back', () => {
    queue.enqueue(1);
    queue.enqueue(2);
    let back = NaN;
    for (const item of queue) back = item;
    expect(back).toBe(2);
  });
  it('should increment size by one when enqueue', () => {
    queue.enqueue(1);
    expect(queue.size()).toBe(1);
  });
  it('should not dequeue from the front if empty', () => {
    expect(() => {
      queue.dequeue();
    }).toThrow(NoSuchElementError);
  });
  it('should retrieve front item when dequeue', () => {
    queue.enqueue(1);
    queue.enqueue(2);
    expect(queue.dequeue()).toBe(1);
  });
  it('should remove front item when dequeue', () => {
    queue.enqueue(1);
    queue.enqueue(2);
    queue.dequeue();
    expect(queue.peek()).toBe(2);
  });
  it('should decrement size by one when dequeue', () => {
    queue.enqueue(1);
    queue.dequeue();
    expect(queue.size()).toBe(0);
  });
  it('should not peek from the front if empty', () => {
    expect(() => {
      queue.peek();
    }).toThrow(NoSuchElementError);
  });
  it('should retrieve front item when peek', () => {
    queue.enqueue(1);
    queue.enqueue(2);
    expect(queue.peek()).toBe(1);
  });
  it('should not remove front item when peek', () => {
    queue.enqueue(1);
    queue.peek();
    expect(queue.peek()).toBe(1);
  });
  it('should not decrement size when peek', () => {
    queue.enqueue(1);
    queue.peek();
    expect(queue.size()).toBe(1);
  });
  it('should iterate through all items in FIFO order', () => {
    const arr = [1, 2, 3, 4];
    for (const item of arr) queue.enqueue(item);
    let i = 0;
    for (const item of queue) expect(item).toBe(arr[i++]);
  });
});
