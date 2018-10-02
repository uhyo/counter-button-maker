import styled from 'styled-components';
import { MainContent } from './main-content';
import { phone, notPhone } from './media';

/**
 * Wrapper of two-column contents.
 */
export const TwoColumn = styled.div`
  display: flex;
  flex-flow: row nowrap;

  ${phone`
    flex-flow: row wrap;
  `};
`;

export const SubContent = styled(MainContent)`
  flex: 50% 1 1;
  ${phone`
    flex: 100% 1 1;
  `};
  ${notPhone`
    margin: 2em 1em;
    padding: 1em 1em 1px;
    h1 {
      font-size: 1.5em;
    }
  `} text-align: inherit;
`;
