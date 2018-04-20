import * as React from 'react';
import { hydrate } from 'react-dom';
import { App } from './index';
import { Navigation } from './logic/navigation';
import { makeStores } from './store';

import '../css/app.css';

const appArea = document.getElementById('app');

// first, make stores.
const stores = makeStores();
// then, initialize Navigation.
const navigation = new Navigation(stores);

hydrate(<App stores={stores} />, appArea);

// Navigate using location.
navigation.initFromLocation();
