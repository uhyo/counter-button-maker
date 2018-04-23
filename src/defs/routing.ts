import { PageData } from './page';
import { Runtime } from './runtime';

/**
 * One route.
 */
export interface Route<Params, PD extends PageData, State> {
  /**
   * Hook dispatched when move is triggered.
   * Fetch data required by pages here.
   */
  beforeMove: (runtime: Runtime, params: Params) => Promise<PD | string>;
  /**
   * Hook dispatched when moved to page.
   * Init internal state here.
   */
  beforeEnter: (runtime: Runtime, params: Params, page: PD) => Promise<State>;
  /**
   * Hook dispatched when leaving this page.
   */
  beforeLeave: (
    runtime: Runtime,
    params: Params,
    page: PD,
    state: State,
  ) => Promise<void>;
}
