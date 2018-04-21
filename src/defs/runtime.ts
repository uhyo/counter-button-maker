import { Stores } from '../store';
import * as firebase from 'firebase';

/**
 * Data needed in runtime (especially for each SSR opportunity)
 */
export interface Runtime {
  stores: Stores;
  firebase: firebase.app.App;
}
