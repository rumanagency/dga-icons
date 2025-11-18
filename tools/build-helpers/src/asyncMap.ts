export async function asyncMap<T, U>(
  array: T[],
  asyncFn: (item: T, index: number) => Promise<U>
): Promise<U[]> {
  return Promise.all(array.map(asyncFn));
}
