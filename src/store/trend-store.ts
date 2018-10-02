import { observable, action } from 'mobx';

export class TrendStore {
  /**
   * Current trend.
   */
  @observable public trends: TrendEntry[] = [];

  /**
   * update trend.
   */
  @action
  public updateTrend(trends: TrendEntry[]) {
    this.trends = trends;
  }
}

export interface TrendEntry {
  /**
   * Name of counter.
   */
  name: string;
}
