import * as React from 'react';
import styled from 'styled-components';
import { withProps } from './styled';

/**
 * Component which centralizes its content.
 */
export class Centralize extends React.PureComponent<
  {
    maximize?: boolean;
  },
  {}
> {
  public render() {
    const { children, maximize } = this.props;
    return (
      <Wrapper>
        <Child maximize={maximize}>{children}</Child>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
`;

const Child = withProps<{
  maximize?: boolean;
}>()(styled.div)`
  margin: auto;
  max-width: 95%;
  min-width: ${props => (props.maximize ? '95%' : '60%')};
`;
