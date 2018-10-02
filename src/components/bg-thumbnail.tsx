import { BackgroundDef } from '../defs/page';
import * as React from 'react';
import { backgroundImageProxy } from '../defs/service';
import styled from 'styled-components';

/**
 * Box which shows thumbnail of background.
 */
export const BgThumbnail: React.StatelessComponent<{
  bg: BackgroundDef | { type: 'placeholder' };
  size?: number;
}> = ({ bg, size = 80 }) => {
  if (bg == null) {
    // show default box.
    return (
      <ImageBox
        role="img"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundImage: 'url(/static/favicon-144.png)',
          backgroundSize: 'contain',
        }}
      />
    );
  } else if (bg.type === 'gradient') {
    // do the same gradient.
    return (
      <ImageBox
        role="img"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundImage: `linear-gradient(
            to bottom,
            ${bg.from},
            ${bg.to}
          )`,
        }}
      />
    );
  } else if (bg.type === 'placeholder') {
    // special placeholder
    return (
      <ImageBox
        role="img"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: 'rgba(160, 160, 160, 0.7)',
        }}
      />
    );
  } else {
    // show background image.
    return (
      <ImageBox
        role="img"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundImage: `url(${backgroundImageProxy(bg.url)}`,
          backgroundSize: 'cover',
        }}
      />
    );
  }
};

const ImageBox = styled.div`
  display: inline-block;
  vertical-align: middle;

  border-radius: 5px;
  margin: 0 8px;
`;
