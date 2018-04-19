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

export const counterStore = new CounterStore();
export const pageStore = new PageStore();
