import * as React from 'react';
import styled from 'styled-components';
import { PageWrapperBase } from './base';
import { serviceName, serviceDescription } from '../defs/service';
import { Centralize } from '../components/center';
import { MainContent } from '../components/main-content';
import { CounterValue } from '../components/counter';
import { StoreConsumer } from '../store';

/**
 * Render the top page.
 */
export function TopPage() {
  return (
    <Wrapper>
      <Centralize>
        <MainContent>
          <h1>{serviceName}</h1>
          <Description>{serviceDescription}</Description>
          <StoreConsumer>
            {({ counter }) => (
              <CounterValue
                title="作成されたサービスの数"
                counterStore={counter}
              />
            )}
          </StoreConsumer>
        </MainContent>
      </Centralize>
    </Wrapper>
  );
}

/**
 * Wrapper of top page.
 */
const Wrapper = styled(PageWrapperBase)`
  background: url(/static/back.jpg);
  background-size: cover;
  background-position: center;
`;

const Description = styled.p`
  font-weight: bold;
`;
