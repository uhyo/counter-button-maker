import styled from 'styled-components';

/**
 * Base component for page wrapper.
 */
export const PageWrapperBase = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  background-size: cover;
  background-position: center;
`;

/**
 * Page wrapper with default background.
 */
export const NormalPageWrapper = styled(PageWrapperBase)`
  background: url(/static/back.jpg);
`;
