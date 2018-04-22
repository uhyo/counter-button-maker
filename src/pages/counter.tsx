import * as React from 'react';
import { observer } from 'mobx-react';
import { bind } from 'bind-decorator';
import {
  CounterPageData,
  CounterPageContent,
  BackgroundDef,
} from '../defs/page';
import { StoreConsumer } from '../store';
import { PageWrapperBase, PageWrapper } from './base';
import { Centralize } from '../components/center';
import { MainContent } from '../components/main-content';
import { CounterValue } from '../components/counter';
import { PageStore } from '../store/page-store';
import { Button } from '../components/button';
import styled from 'styled-components';

export interface IPropCounterPage {
  content: CounterPageContent;
}
@observer
export class CounterPage extends React.Component<IPropCounterPage, {}> {
  public render() {
    const {
      content: {
        title,
        description,
        background,
        buttonLabel,
        buttonBg,
        buttonColor,
      },
    } = this.props;
    return (
      <PageWrapper background={background}>
        <Centralize>
          <MainContent>
            <StoreConsumer>
              {({ page, counter }) => (
                <>
                  <p>{description}</p>
                  <CounterValue counterStore={counter} />
                  <p>
                    <IncrementButton
                      pageStore={page}
                      buttonBg={buttonBg}
                      buttonColor={buttonColor}
                    >
                      {buttonLabel}
                    </IncrementButton>
                  </p>
                </>
              )}
            </StoreConsumer>
          </MainContent>
        </Centralize>
      </PageWrapper>
    );
  }
}

class PageWrapperInner extends React.Component<
  {
    background: BackgroundDef;
    className?: string;
  },
  {}
> {
  public render() {
    const { className, children } = this.props;
    return <PageWrapperBase className={className}>{children}</PageWrapperBase>;
  }
}

interface IPropIncremenButton {
  pageStore: PageStore;
  buttonBg: string;
  buttonColor: string;
}
class IncrementButton extends React.Component<
  IPropIncremenButton,
  {
    lastClickTime: number;
  }
> {
  constructor(props: IPropIncremenButton) {
    super(props);
    this.state = {
      lastClickTime: Date.now(),
    };
  }
  public render() {
    const { children, buttonBg, buttonColor } = this.props;
    const disableDblClock = (e: React.SyntheticEvent<any>) => {
      e.preventDefault();
    };
    return (
      <Button
        onClick={this.handleClick}
        onDoubleClick={disableDblClock}
        style={{
          backgroundColor: buttonBg,
          color: buttonColor,
        }}
      >
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
