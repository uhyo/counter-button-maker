import { observable, action } from 'mobx';
import { Trend } from '../logic/trend';

export class TrendStore {
  /**
   * Flag indicating currently loading trends.
   */
  @observable public trendsLoading: boolean = true;
  /**
   * Flag indicating currently loading rankings.
   */
  @observable public rankingLoading: boolean = true;
  /**
   * Current trend.
   */
  @observable public trends: Trend[] = [];
  /**
   * Current ranking.
   */
  @observable public ranking: Trend[] = [];

  /**
   * Set state to loading.
   */
  @action
  public setLoading() {
    this.trendsLoading = true;
    this.rankingLoading = true;
  }
  /**
   * load trends.
   */
  @action
  public loadTrend(trends: Trend[]) {
    this.trendsLoading = false;
    this.trends = trends;
  }
  /**
   * load ranking.
   */
  @action
  public loadRanking(ranking: Trend[]) {
    this.rankingLoading = false;
    this.ranking = ranking;
  }
}
