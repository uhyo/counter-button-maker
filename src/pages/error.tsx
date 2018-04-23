import { Navigation } from '../logic/navigation';
import * as React from 'react';
import { NormalPageWrapper } from './base';
import { Centralize } from '../components/center';
import { MainContent } from '../components/main-content';
import { serviceName } from '../defs/service';
import { StoreConsumer } from '../store';
import { CounterValue } from '../components/counter';
import { Button } from '../components/button';
import { SmallNotes } from '../components/paragraph';
import { Link } from '../components/link';
import { bind } from 'bind-decorator';

export interface IPropErrorPage {
  code: number;
  navigation: Navigation;
}
export class ErrorPage extends React.PureComponent<IPropErrorPage, {}> {
  public render() {
    return (
      <NormalPageWrapper>
        <Centralize>
          <MainContent>
            <StoreConsumer>
              {({ page, counter }) => (
                <>
                  <CounterValue counterStore={counter} />
                  <p>
                    <Button onClick={() => page.state.stream.increment()}>
                      {this.props.code}
                    </Button>
                  </p>
                </>
              )}
            </StoreConsumer>
            <SmallNotes>
              {serviceName + ' '}
              <Link href="/" navigation={this.props.navigation}>
                トップページへ
              </Link>
            </SmallNotes>
          </MainContent>
        </Centralize>
      </NormalPageWrapper>
    );
  }
}
