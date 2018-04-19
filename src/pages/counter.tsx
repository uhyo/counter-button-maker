import * as React from 'react';
import { observer } from 'mobx-react';
import { CounterPageData } from '../defs/page';
import { counterStore, StoreConsumer } from '../store';

export interface IPropCounterPageInner {
  store: typeof counterStore;
}
@observer
class CounterPageInner extends React.Component<IPropCounterPageInner, {}> {
  public render() {
    const { count } = this.props.store;
    return (
      <div>
        <p>Counter! {count}</p>
      </div>
    );
  }
}

/**
 * Page for counter.
 */
export class CounterPage extends React.PureComponent {
  public render() {
    return (
      <StoreConsumer>
        {stores => {
          if (stores != null) {
            return <CounterPageInner store={stores.counter} />;
          } else {
            return null;
          }
        }}
      </StoreConsumer>
    );
  }
}
