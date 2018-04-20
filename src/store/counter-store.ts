import { observable, action } from 'mobx';
import { CounterPageData } from '../defs/page';

export class CounterStore {
  /**
   * Number of count for current counter.
   */
  @observable public count: number = 0;
  /**
   * Update counter value.
   */
  @action
  public updateCount(count: number): void {
    this.count = count;
  }
}
