import * as React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { CounterStore } from '../store/counter-store';

export interface IPropCounterValue {
  counterStore: CounterStore;
  /**
   * Optionally, title of this counter value.
   */
  title?: string;
}
/**
 * Component which shows the value of counter.
 */
@observer
export class CounterValue extends React.Component<IPropCounterValue, {}> {
  public render() {
    const {
      counterStore: { count },
      title,
    } = this.props;
    return (
      <OuterWrapper>
        {title ? <TitleWrapper>{title}:</TitleWrapper> : null}
        <CounterWrapper>{count}</CounterWrapper>
      </OuterWrapper>
    );
  }
}

const OuterWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  @media (min-width: 600px) {
    flex-flow: row nowrap;
    justify-content: flex-end;

    ::after {
      content: '';
      flex: calc(50% - 1.2ex) 0 0;
    }
  }
`;

const CounterWrapper = styled.span`
  align-self: center;
  margin-left: 0.6ex;

  font-size: 2.4em;
  font-family: 'Do Hyeon', sans-serif;
`;

const TitleWrapper = styled.span`
  align-self: center;
`;
