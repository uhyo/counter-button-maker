import * as React from 'react';
import styled from 'styled-components';

/**
 * Nice button.
 */
export const Button = styled.button`
  appearance: none;
  margin: 0 0.6em;
  border: none;
  border-radius: 6px;

  background-color: #42bf99;
  color: white;
  font-weight: bold;
  font-size: 1em;
  padding: 1em;
`;

/**
 * Tweet button.
 */
export const TweetButton = styled(Button)`
  background-color: #55acee;
  color: white;
  font-weight: bold;
`;

export const TweetButtonSlim = styled(TweetButton)`
  padding: 0.45em 1em;
`;
