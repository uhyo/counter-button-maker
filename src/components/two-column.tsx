import styled from 'styled-components';
import { MainContent } from './main-content';

/**
 * Wrapper of two-column contents.
 */
export const TwoColumn = styled.div`
  display: flex;
  flex-flow: column nowrap;
`;

export const SubContent = styled(MainContent)`
  text-align: inherit;
  h1 {
    font-size: 1.5em;
  }
`;
