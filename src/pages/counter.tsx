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
import { Button, TweetButtonSlim } from '../components/button';
import styled from 'styled-components';
import { Navigation } from '../logic/navigation';
import { Link } from '../components/link';
import { serviceName } from '../defs/service';

export interface IPropCounterPage {
  content: CounterPageContent;
  navigation: Navigation;
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
      navigation,
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
                  <About>
                    <TweetButtonSlim onClick={this.handleTweet}>
                      ツイート
                    </TweetButtonSlim>
                  </About>
                  <About>
                    {title} ver 1.0 [<Link href="/" navigation={navigation}>
                      ABOUT
                    </Link>]
                  </About>
                </>
              )}
            </StoreConsumer>
          </MainContent>
        </Centralize>
      </PageWrapper>
    );
  }
  @bind
  protected handleTweet(): void {
    window.open(
      'https://twitter.com/intent/tweet?text=' +
        encodeURIComponent(`${this.props.content.title} #${serviceName}\n`) +
        '&url=' +
        encodeURIComponent(location.href),
      '',
      'width=650, height=450, menuber=no, toolbar=no, scrollbars=yes',
    );
  }
}

const About = styled.p`
  margin-bottom: 4px;
  font-size: smaller;
  text-align: right;
`;

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
        onTouchEnd={this.handleTouchEnd}
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
  @bind
  protected handleTouchEnd(e: React.SyntheticEvent<any>): void {
    // We also cansel touchend so that double-tap zoom does not work.
    e.preventDefault();
    this.handleClick(e);
  }
}
