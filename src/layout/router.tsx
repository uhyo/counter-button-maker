import * as React from 'react';
import { observer } from 'mobx-react';
import { StoreConsumer } from '../store';
import { TopPage } from '../pages/top';
import { NewPage } from '../pages/new';
import { CounterPage } from '../pages/counter';
import { PageStore } from '../store/page-store';
import { Navigation } from '../logic/navigation';

export interface IPropRouter {
  pageStore: PageStore;
  navigation: Navigation;
}
/**
 * Component which does routing.
 */
@observer
export class Router extends React.Component<IPropRouter, {}> {
  public render() {
    const {
      pageStore: { page },
      navigation,
    } = this.props;
    if (page == null) {
      return null;
    }
    switch (page.page) {
      case 'top': {
        return <TopPage page={page} navigation={navigation} />;
      }
      case 'new': {
        return <NewPage navigation={navigation} />;
      }
      case 'counter': {
        return <CounterPage content={page.content} />;
      }
    }
  }
}
