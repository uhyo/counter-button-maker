import styled from 'styled-components';

/**
 * Wrapper of main content which should be placed at the center of page.
 */
export const MainContent = styled.section`
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 2em;
  padding: 1em 4em 1px;

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
