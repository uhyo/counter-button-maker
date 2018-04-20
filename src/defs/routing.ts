import { PageData } from './page';

/**
 * One route.
 */
export interface Route<Params, PD extends PageData, State> {
  /**
   * Hook dispatched when move is triggered.
   * Fetch data required by pages here.
   */
  beforeMove: (params: Params) => Promise<PD>;
  /**
   * Hook dispatched when moved to page.
   * Init internal state here.
   */
  beforeEnter: (params: Params, page: PD) => Promise<State>;
  /**
   * Hook dispatched when leaving this page.
   */
  beforeLeave: (params: Params, page: PD, state: State) => Promise<void>;
}
