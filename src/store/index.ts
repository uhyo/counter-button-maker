import { CounterStore } from './counter-store';
import { PageStore } from './page-store';
import { NewStore } from './new-store';
import { TrendStore } from './trend-store';
export {
  Provider as StoreProvider,
  Consumer as StoreConsumer,
} from './component';

export interface Stores {
  counter: CounterStore;
  page: PageStore;
  trend: TrendStore;
  new: NewStore;
}

/**
 * Construct a store.
 */
export function makeStores(): Stores {
  return {
    counter: new CounterStore(),
    page: new PageStore(),
    trend: new TrendStore(),
    new: new NewStore(),
  };
}
