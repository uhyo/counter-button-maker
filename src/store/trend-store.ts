import { observable, action } from 'mobx';
import { Trend } from '../logic/trend';

export class TrendStore {
  /**
   * Flag indicating currently loading trends.
   */
  @observable public loading: boolean = true;
  /**
   * Current trend.
   */
  @observable public trends: Trend[] = [];

  /**
   * Set state to loading.
   */
  @action
  public setLoading() {
    this.loading = true;
  }
  /**
   * load trends.
   */
  @action
  public loadTrend(trends: Trend[]) {
    this.loading = false;
    this.trends = trends;
  }
}
