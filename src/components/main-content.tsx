import styled from 'styled-components';

/**
 * Wrapper of main content which should be placed at the center of page.
 */
export const MainContent = styled.section`
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 2em;
  padding: 1em 4em 1px;
  margin: 2em 0;

  color: black;
  text-align: center;

  h1 {
    font-size: 2em;
  }

  @media (max-width: 600px) {
    border-radius: 1em;
    padding: 0.6em;

    h1 {
      font-size: 1.3em;
    }
  }
`;

/**
 * Lighter theme.
 */
export const MainContentLight = styled(MainContent)`
  background-color: rgba(255, 255, 255, 0.9);
`;
/**
 * Dark theme.
 */
export const MainContentDark = styled(MainContent)`
  background-color: rgba(0, 0, 0, 0.63);
  color: white;

  a {
    color: #ffcc99;
  }
`;
