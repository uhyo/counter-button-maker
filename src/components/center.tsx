import * as React from 'react';
import styled from 'styled-components';

/**
 * Component which centralizes its content.
 */
export class Centralize extends React.PureComponent {
  public render() {
    const { children } = this.props;
    return (
      <Wrapper>
        <Child>{children}</Child>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
`;

const Child = styled.div`
  max-width: 90%;
  min-width: 55%;
`;
