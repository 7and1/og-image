/**
 * Concurrent async operations with a limit
 * Executes promises with controlled concurrency
 */
export async function asyncPool<T, R>(
  poolLimit: number,
  items: T[],
  iteratorFn: (item: T, index: number) => Promise<R>,
  onProgress?: (completed: number, total: number) => void
): Promise<R[]> {
  const results: R[] = [];
  const executing: Promise<void>[] = [];
  let completed = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const promise = Promise.resolve()
      .then(() => iteratorFn(item, i))
      .then((result) => {
        results[i] = result;
        completed++;
        onProgress?.(completed, items.length);
      })
      .catch((error) => {
        // Store error as result to avoid breaking the pool
        results[i] = { error: error.message } as unknown as R;
        completed++;
        onProgress?.(completed, items.length);
      });

    const cleanup = promise.then(() => {
      executing.splice(executing.indexOf(cleanup), 1);
    });
    executing.push(cleanup);

    if (executing.length >= poolLimit) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);
  return results;
}
