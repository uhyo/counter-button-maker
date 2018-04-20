import { CounterStore } from './counter-store';
import { PageStore } from './page-store';
export {
  Provider as StoreProvider,
  Consumer as StoreConsumer,
} from './component';

export interface Stores {
  counter: CounterStore;
  page: PageStore;
}

/**
 * Construct a store.
 */
export function makeStores(): Stores {
  return {
    counter: new CounterStore(),
    page: new PageStore(),
  };
}
