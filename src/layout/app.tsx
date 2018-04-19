import * as React from 'react';

import { TopPage } from '../pages/top';
import { CounterPage } from '../pages/counter';
import { StoreProvider, counterStore, pageStore } from '../store';
import { Router } from './router';

/**
 * App component for routing.
 */
export class App extends React.Component {
  public render() {
    const stores = {
      counter: counterStore,
      page: pageStore,
    };
    return (
      <StoreProvider value={stores}>
        <Router pageStore={pageStore} />
      </StoreProvider>
    );
  }
}
