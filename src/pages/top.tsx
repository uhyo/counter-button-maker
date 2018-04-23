import * as React from 'react';
import styled from 'styled-components';
import { PageWrapperBase, NormalPageWrapper } from './base';
import { serviceName, serviceDescription } from '../defs/service';
import { Button, TweetButton } from '../components/button';
import { Centralize } from '../components/center';
import { MainContent } from '../components/main-content';
import { CounterValue } from '../components/counter';
import { StoreConsumer } from '../store';
import { TopPageData } from '../defs/page';
import { observer } from 'mobx-react';
import { firebaseui, firebase } from '../logic/firebase';
import { PageStore } from '../store/page-store';
import { createDiffieHellman } from 'crypto';
import { Navigation } from '../logic/navigation';
import { handleError } from '../logic/error';
import { bind } from 'bind-decorator';
import { SmallNotes } from '../components/paragraph';
import { Link } from '../components/link';

export interface IPropTopPage {
  page: TopPageData;
  navigation: Navigation;
}
/**
 * Render the top page.
 */
export class TopPage extends React.PureComponent<IPropTopPage, {}> {
  public render() {
    const {
      page: { trends },
      navigation,
    } = this.props;
    return (
      <NormalPageWrapper>
        <Centralize>
          <MainContent>
            <h1>{serviceName}</h1>
            <Description>{serviceDescription}</Description>
            <StoreConsumer>
              {({ counter }) => (
                <CounterValue
                  title="作成されたボタンの数"
                  counterStore={counter}
                />
              )}
            </StoreConsumer>
            <p>
              <Button onClick={this.handleNewClick}>ボタンを作る</Button>
              <TweetButton onClick={this.handleTweet}>ツイート</TweetButton>
            </p>
            {trends.length > 0 ? (
              <p>
                トレンド：{trends.map(({ id, title }) => (
                  <React.Fragment key={id}>
                    {' '}
                    <Link href={`/${id}`} navigation={navigation}>
                      {title}
                    </Link>
                  </React.Fragment>
                ))}
              </p>
            ) : null}
            <SmallNotes>
              ボタンを押すと数が増えるという全く新しい画期的なWebサービスを1分で作って公開できる全く新しい画期的なWebサービスを簡単に複製して公開できる画期的なWebサービスはこちら
              →
              <a
                href="https://github.com/uhyo/counter-button-maker"
                target="_blank"
              >
                GitHub
              </a>
            </SmallNotes>
            <SmallNotes>
              作者のツイッターアカウントはこちら →
              <a href="https://twitter.com/uhyo_" target="_blank">
                Twitter
              </a>
            </SmallNotes>
            <SmallNotes>
              先駆者：
              <a href="http://nyanpass.com/" target="_blank">
                にゃんぱすーボタン
              </a>，
              <a href="http://hinasuki.com/" target="_blank">
                ひなすきボタン
              </a>（もし他にもあったら教えてください）
            </SmallNotes>
          </MainContent>
        </Centralize>
      </NormalPageWrapper>
    );
  }
  @bind
  protected handleNewClick(): void {
    this.props.navigation.move('/new', 'push').catch(handleError);
  }
  protected handleTweet(): void {
    window.open(
      'https://twitter.com/intent/tweet?text=' +
        encodeURIComponent(serviceName) +
        '&url=' +
        encodeURIComponent(location.href),
      '',
      'width=650, height=450, menuber=no, toolbar=no, scrollbars=yes',
    );
  }
}

const Description = styled.p`
  font-weight: bold;
`;
