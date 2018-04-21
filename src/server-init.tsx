import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { App } from './index';
import { Navigation, getHistoryInfo } from './logic/navigation';
import { makeStores } from './store';
import { PageData } from './defs/page';

export interface RenderResult {
  /**
   * Title of page.
   */
  title: string;
  /**
   * content HTML.
   */
  content: string;
  /**
   * page params.
   */
  params: Record<string, string>;
  /**
   * Page info for stores.
   */
  page: PageData | null;
  /**
   * Count store data.
   */
  count: number;
}
/**
 * Server-side rendering of requested page.
 */
export async function render(pathname: string): Promise<RenderResult> {
  const stores = makeStores();
  const nav = new Navigation(stores, true);
  await nav.move(pathname);
  const content = renderToString(<App stores={stores} />);
  nav.close();
  const { params, page } = stores.page;
  if (page == null) {
    // TODO
    return {
      title: '404',
      content,
      params,
      page,
      count: stores.counter.count,
    };
  }
  const { title } = getHistoryInfo(page);
  return {
    title,
    content,
    params,
    page,
    count: stores.counter.count,
  };
}
