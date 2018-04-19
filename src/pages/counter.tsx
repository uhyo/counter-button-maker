import * as React from 'react';
import { observer } from 'mobx-react';
import { CounterPageData, CounterPageContent } from '../defs/page';
import { counterStore, StoreConsumer } from '../store';
import { PageWrapperBase } from './base';
import { Centralize } from '../components/center';
import { MainContent } from '../components/main-content';
import { CounterValue } from '../components/counter';

export interface IPropCounterPage {
  content: CounterPageContent;
}
@observer
export class CounterPage extends React.Component<IPropCounterPage, {}> {
  public render() {
    const {
      content: { title, description },
    } = this.props;
    return (
      <PageWrapperBase>
        <Centralize>
          <MainContent>
            <p>{description}</p>
            <StoreConsumer>
              {({ counter }) => <CounterValue counterStore={counter} />}
            </StoreConsumer>
          </MainContent>
        </Centralize>
      </PageWrapperBase>
    );
  }
}
