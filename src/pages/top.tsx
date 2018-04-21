import * as React from 'react';
import styled from 'styled-components';
import { PageWrapperBase, NormalPageWrapper } from './base';
import { serviceName, serviceDescription } from '../defs/service';
import { Button } from '../components/button';
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

export interface IPropTopPage {
  page: TopPageData;
  navigation: Navigation;
}
/**
 * Render the top page.
 */
export class TopPage extends React.PureComponent<IPropTopPage, {}> {
  public render() {
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
            </p>
          </MainContent>
        </Centralize>
      </NormalPageWrapper>
    );
  }
  @bind
  protected handleNewClick(): void {
    this.props.navigation.move('/new', 'push').catch(handleError);
  }
}

const Description = styled.p`
  font-weight: bold;
`;
