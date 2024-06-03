import { NoSuchElementError } from './errors';

/**
 * Exchanges elements at the two specified indices of the specified array.
 *
 * @param a An array containing two specified indices
 * @param idx1 Index of the first element
 * @param idx2 Index of the second element
 *
 * @throws {NoSuchElementError} This error is thrown if the specified array does
 * not contain the specified index
 */
export function exchange<T>(a: T[], idx1: number, idx2: number): void {
  if (idx1 < 0 || idx1 >= a.length)
    throw new NoSuchElementError(`Input array does not contain index ${idx1}`);
  if (idx2 < 0 || idx2 >= a.length)
    throw new NoSuchElementError(`Input array does not contain index ${idx2}`);
  const tmp = a[idx1];
  a[idx1] = a[idx2];
  a[idx2] = tmp;
}
