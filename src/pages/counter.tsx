import * as React from 'react';
import { observer } from 'mobx-react';
import { bind } from 'bind-decorator';
import { CounterPageData, CounterPageContent } from '../defs/page';
import { StoreConsumer } from '../store';
import { PageWrapperBase } from './base';
import { Centralize } from '../components/center';
import { MainContent } from '../components/main-content';
import { CounterValue } from '../components/counter';
import { PageStore } from '../store/page-store';
import { Button } from '../components/button';

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
  {
    lastClickTime: number;
  }
> {
  constructor(props: { pageStore: PageStore }) {
    super(props);
    this.state = {
      lastClickTime: Date.now(),
    };
  }
  public render() {
    const { children } = this.props;
    const disableDblClock = (e: React.SyntheticEvent<any>) => {
      e.preventDefault();
    };
    return (
      <Button onClick={this.handleClick} onDoubleClick={disableDblClock}>
        {children}
      </Button>
    );
  }
  @bind
  protected handleClick(e: React.SyntheticEvent<any>): void {
    // XXX Type is gone here!
    const now = Date.now();
    if (now - this.state.lastClickTime < 100) {
      // throttling
      return;
    }
    this.props.pageStore.state.stream.increment();
    this.setState({
      lastClickTime: now,
    });
  }
}
