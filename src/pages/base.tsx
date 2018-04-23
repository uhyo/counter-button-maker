import styled from 'styled-components';
import { BackgroundDef } from '../defs/page';
import * as React from 'react';
import { backgroundImageProxy } from '../defs/service';

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

/**
 * Page wrapper with defined background.
 */
export class PageWrapper extends React.PureComponent<
  { background: BackgroundDef },
  {}
> {
  public render() {
    const { background, children } = this.props;
    const backgroundImageValue =
      background == null
        ? 'url(/static/back.jpg)'
        : background.type === 'image'
          ? `url(${backgroundImageProxy(background.url)})`
          : `linear-gradient(to bottom, ${background.from}, ${background.to})`;
    const repeat =
      background && background.type === 'image' && background.repeat;
    const style = {
      backgroundImage: backgroundImageValue,
      backgroundRepeat: repeat ? 'repeat' : 'no-repeat',
      backgroundSize: repeat ? 'auto' : 'cover',
    };
    return <PageWrapperBase style={style}>{children}</PageWrapperBase>;
  }
}
