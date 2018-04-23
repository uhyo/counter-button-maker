/**
 * Trend object.
 */
export interface Trend {
  id: string;
  title: string;
}
/**
 * A class which remembers trends like LRU cache.
 * As naive implementation, `size` should be small.
 */
export class Trends {
  public readonly data: Trend[] = [];
  constructor(protected size: number) {}
  public add(trend: Trend): void {
    const { data } = this;
    // search for same entry.
    const len = data.length;
    for (let i = 0; i < len; i++) {
      if (data[i].id === trend.id) {
        // found. Bubble this up to the top.
        for (let j = i; j > 0; i--) {
          data[j] = data[j - 1];
        }
        data[0] = trend;
        return;
      }
    }
    // Not found.
    data.unshift(trend);
    if (len >= this.size) {
      // Discard lest recend item.
      data.pop();
    }
  }
}
