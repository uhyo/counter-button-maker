import { CounterStore } from './counter-store';
import { PageStore } from './page-store';
import { NewStore } from './new-store';
export {
  Provider as StoreProvider,
  Consumer as StoreConsumer,
} from './component';

export interface Stores {
  counter: CounterStore;
  page: PageStore;
  new: NewStore;
}

/**
 * Construct a store.
 */
export function makeStores(): Stores {
  return {
    counter: new CounterStore(),
    page: new PageStore(),
    new: new NewStore(),
  };
}
