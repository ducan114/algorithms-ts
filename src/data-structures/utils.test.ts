import { describe, expect, it } from '@jest/globals';
import { Collection } from './ultils';

describe('Collection', () => {
  it('should be created empty', () => {
    const collection = new Collection();
    expect(collection.isEmpty()).toBe(true);
  });
});
