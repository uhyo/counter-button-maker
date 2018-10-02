import * as React from 'react';
import { hydrate } from 'react-dom';
import { App } from './index';
import { Navigation } from './logic/navigation';
import { makeStores } from './store';
import * as firebase from 'firebase';

import '../css/app.css';
import { handleError } from './logic/error';
import { firebaseApp } from './logic/firebase';
import { Runtime } from './defs/runtime';
import { fetchCounterPageByAPI } from './logic/counter';

const appArea = document.getElementById('app');

// first, make stores.
const stores = makeStores();
// init firebase.
firebaseApp()
  .firestore()
  .settings({
    timestampsInSnapshots: true,
  });
const runtime: Runtime = {
  stores,
  firebase: firebaseApp(),
  fetchCounterPageContent: fetchCounterPageByAPI,
};
// then, initialize Navigation.
const navigation = new Navigation(runtime, false);
// Adapt data provided by server.
const data =
  document.currentScript &&
  JSON.parse(document.currentScript.getAttribute('data-data') || 'null');
stores.page.updatePage(data.path, null, data.params, data.page, null);
stores.counter.updateCount(data.count);
hydrate(<App stores={stores} navigation={navigation} />, appArea);

// Navigate using location.
navigation.initFromLocation(data.path).catch(handleError);
