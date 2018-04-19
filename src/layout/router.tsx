import * as React from 'react';
import { observer } from 'mobx-react';
import { StoreConsumer } from '../store';
import { TopPage } from '../pages/top';
import { CounterPage } from '../pages/counter';
import { PageStore } from '../store/page-store';

export interface IPropRouter {
  pageStore: PageStore;
}
/**
 * Component which does routing.
 */
@observer
export class Router extends React.Component<IPropRouter, {}> {
  public render() {
    const {
      pageStore: { page },
    } = this.props;
    if (page == null) {
      return null;
    }
    switch (page.page) {
      case 'top': {
        return <TopPage />;
      }
      case 'counter': {
        return <CounterPage content={page.content} />;
      }
    }
  }
}
