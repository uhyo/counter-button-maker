import { observable, action, computed } from 'mobx';
import { CounterPageData } from '../defs/page';

export class CounterStore {
  /**
   * Number of count for current counter.
   */
  @observable protected _count: number = 0;
  /**
   * Whether current value is invalid.
   */
  @observable protected invalid: boolean = false;
  @computed
  public get count(): number {
    return this.invalid ? 0 : this._count;
  }
  /**
   * Update counter value.
   */
  @action
  public updateCount(count: number): void {
    this._count = count;
    this.invalid = false;
  }
  /**
   * Make it invalid
   */
  @action
  public invalidate(): void {
    this.invalid = true;
  }
}
