import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { App } from './index';
import { Navigation, getHistoryInfo } from './logic/navigation';
import { makeStores } from './store';

export interface RenderResult {
  /**
   * Title of page.
   */
  title: string;
  /**
   * content HTML.
   */
  content: string;
}
/**
 * Server-side rendering of requested page.
 */
export async function render(pathname: string): Promise<RenderResult> {
  const stores = makeStores();
  const nav = new Navigation(stores);
  await nav.move(pathname);
  const content = renderToString(<App stores={stores} />);
  // ページ情報
  const page = nav.getCurrentPage();
  if (page == null) {
    // TODO
    return {
      title: '404',
      content,
    };
  }
  const { title } = getHistoryInfo(page);
  return {
    title,
    content,
  };
}
