import * as React from 'react';

import { TopPage } from '../pages/top';
import { CounterPage } from '../pages/counter';
import { StoreProvider, Stores } from '../store';
import { Router } from './router';

export interface IPropApp {
  stores: Stores;
}
/**
 * App component for routing.
 */
export class App extends React.Component<IPropApp, {}> {
  public render() {
    const stores = this.props.stores;
    return (
      <StoreProvider value={stores}>
        <Router pageStore={stores.page} />
      </StoreProvider>
    );
  }
}
