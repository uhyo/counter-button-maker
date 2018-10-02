import { observable, action } from 'mobx';
import { Trend } from '../logic/trend';

export class TrendStore {
  /**
   * Current trend.
   */
  @observable public trends: Trend[] = [];

  /**
   * update trend.
   */
  @action
  public updateTrend(trends: Trend[]) {
    this.trends = trends;
  }
}
