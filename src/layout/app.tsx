import * as React from 'react';

import { TopPage } from '../pages/top';
import { CounterPage } from '../pages/counter';
import { StoreProvider, Stores } from '../store';
import { Router } from './router';
import { Navigation } from '../logic/navigation';

export interface IPropApp {
  stores: Stores;
  navigation: Navigation;
}
/**
 * App component for routing.
 */
export class App extends React.Component<IPropApp, {}> {
  public render() {
    const { stores, navigation } = this.props;
    return (
      <StoreProvider value={stores}>
        <Router pageStore={stores.page} navigation={navigation} />
      </StoreProvider>
    );
  }
}
