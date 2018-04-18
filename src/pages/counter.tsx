import * as React from 'react';
import { CounterPageData } from '../defs/page';

export interface IPropCounterPage {
  page: CounterPageData;
  count: 0;
}
/**
 * Page for counter.
 */
export class CounterPage extends React.PureComponent<IPropCounterPage, {}> {
  public render() {
    const { count } = this.props;
    return (
      <div>
        <p>Counter! {count}</p>
      </div>
    );
  }
}
