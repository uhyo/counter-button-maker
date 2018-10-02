import styled from 'styled-components';
import { MainContent } from './main-content';

/**
 * Wrapper of two-column contents.
 */
export const TwoColumn = styled.div`
  display: flex;
  flex-flow: row nowrap;
`;

export const SubContent = styled(MainContent)`
  flex: 50% 1 1;
  margin: 2em 2em;
  padding: 1em 1em 1px;
  text-align: inherit;
  h1 {
    font-size: 1.5em;
  }
`;
