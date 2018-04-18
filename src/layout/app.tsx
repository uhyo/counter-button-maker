import * as React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { TopPage } from '../pages/index';
import { CounterPage } from '../pages/counter';

/**
 * App component for routing.
 */
export class App extends React.Component {
  public render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={TopPage} />
          <Route path="/:id([-_a-zA-Z0-9]{4,})" component={CounterPage} />
        </Switch>
      </BrowserRouter>
    );
  }
}
