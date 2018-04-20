import * as React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { CounterStore } from '../store/counter-store';
import { notPhone } from './media';

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
        <TitleWrapper>
          {title ? <TitleInner>{title}:</TitleInner> : null}
        </TitleWrapper>
        <CounterWrapper>{count}</CounterWrapper>
      </OuterWrapper>
    );
  }
}

const OuterWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  ${notPhone`
    flex-flow: row nowrap;
    justify-content: flex-end;

    ::after {
      content: '';
      flex: auto 1 0;
    }
  `};
`;

const CounterWrapper = styled.span`
  align-self: center;

  font-size: 2.4em;
  font-family: 'Do Hyeon', sans-serif;
`;

const TitleWrapper = styled.span`
  flex: auto 1 0;
  position: relative;
  align-self: center;
`;

const TitleInner = styled.span`
  ${notPhone`
    position: absolute;
    top: -0.5em;
    right: 1em;
  `};
`;
