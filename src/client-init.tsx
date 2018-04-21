import * as React from 'react';
import { hydrate } from 'react-dom';
import { App } from './index';
import { Navigation } from './logic/navigation';
import { makeStores } from './store';
import * as firebase from 'firebase';

import '../css/app.css';
import { handleError } from './logic/error';

const appArea = document.getElementById('app');

// first, make stores.
const stores = makeStores();
// init firebase.
const firebaseApp = (window as any).__firebaseApp__ as firebase.app.App;
firebaseApp.firestore().settings({
  timestampsInSnapshots: true,
});
const runtime = {
  stores,
  firebase: firebaseApp,
};
// then, initialize Navigation.
const navigation = new Navigation(runtime, false);
// Adapt data provided by server.
const data =
  document.currentScript &&
  JSON.parse(document.currentScript.getAttribute('data-data') || 'null');
stores.page.updatePage(null, data.params, data.page, null);
stores.counter.updateCount(data.count);
hydrate(<App stores={stores} />, appArea);

// Navigate using location.
navigation.initFromLocation().catch(handleError);
