import { Stores } from '../store';
import * as firebase from 'firebase';
import { Trend } from '../logic/trend';

/**
 * Data needed in runtime (especially for each SSR opportunity)
 */
export interface Runtime {
  stores: Stores;
  firebase: firebase.app.App;
  getTrends: () => Promise<Trend[]>;
}
