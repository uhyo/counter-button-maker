import { Stores } from '../store';
import * as firebase from 'firebase';
import { Trend } from '../logic/trend';
import { CounterPageContent } from './page';

/**
 * Data needed in runtime (especially for each SSR opportunity)
 */
export interface Runtime {
  stores: Stores;
  firebase: firebase.app.App;
  fetchCounterPageContent: (id: string) => Promise<CounterPageContent | null>;
}
