import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { App } from './index';
import { move } from './logic/navigation';

export async function render(pathname: string): Promise<string> {
  await move(pathname);
  return renderToString(<App />);
}
