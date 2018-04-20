import { PageData } from './page';

/**
 * One route.
 */
export interface Route<Params, PD extends PageData> {
  /**
   * Hook dispatched when move is triggered.
   * Fetch data required by pages here.
   */
  beforeMove: (params: Params) => Promise<PD>;
  /**
   * Hook dispatched when leaving this page.
   */
  beforeLeave: (params: Params, page: PD) => Promise<void>;
}
