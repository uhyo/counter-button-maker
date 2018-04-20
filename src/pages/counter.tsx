import * as React from 'react';
import { observer } from 'mobx-react';
import { CounterPageData, CounterPageContent } from '../defs/page';
import { StoreConsumer } from '../store';
import { PageWrapperBase } from './base';
import { Centralize } from '../components/center';
import { MainContent } from '../components/main-content';
import { CounterValue } from '../components/counter';
import { PageStore } from '../store/page-store';

export interface IPropCounterPage {
  content: CounterPageContent;
}
@observer
export class CounterPage extends React.Component<IPropCounterPage, {}> {
  public render() {
    const {
      content: { title, description, button },
    } = this.props;
    return (
      <PageWrapperBase>
        <Centralize>
          <MainContent>
            <StoreConsumer>
              {({ page, counter }) => (
                <>
                  <p>{description}</p>
                  <CounterValue counterStore={counter} />
                  <p>
                    <IncrementButton pageStore={page}>{button}</IncrementButton>
                  </p>
                </>
              )}
            </StoreConsumer>
          </MainContent>
        </Centralize>
      </PageWrapperBase>
    );
  }
}

class IncrementButton extends React.Component<
  {
    pageStore: PageStore;
  },
  {}
> {
  public render() {
    const { pageStore, children } = this.props;
    const handler = () => {
      // XXX Type is gone here!
      pageStore.state.stream.increment();
    };
    return <button onClick={handler}>{children}</button>;
  }
}
