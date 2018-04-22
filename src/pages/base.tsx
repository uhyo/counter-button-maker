import styled from 'styled-components';

/**
 * Base component for page wrapper.
 */
export const PageWrapperBase = styled.div`
  width: 100%;
  height: 100vh;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  overflow-y: auto;
`;

/**
 * Page wrapper with default background.
 */
export const NormalPageWrapper = styled(PageWrapperBase)`
  background-image: url(/static/back.jpg);
`;
