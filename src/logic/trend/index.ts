import { BackgroundDef } from '../../defs/page';

/**
 * Trend object.
 */
export interface Trend {
  /**
   * ID of this button.
   */
  id: string;
  /**
   * title of this button.
   */
  title: string;
  /**
   * background definition of this button.
   */
  background: BackgroundDef;
  /**
   * number used for sorting.
   */
  sortNumber: number;
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
        for (let j = i; j > 0; j--) {
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
