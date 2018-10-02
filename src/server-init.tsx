import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import { App } from './index';
import { Navigation, getHistoryInfo, HistoryInfo } from './logic/navigation';
import { makeStores } from './store';
import { PageData } from './defs/page';
import { firebaseApp } from '../server/firebase';
import { Runtime } from './defs/runtime';
import { fetchCounterPageContent } from './logic/counter';

export interface RenderResult {
  /**
   * Title and other infojj
   */
  historyInfo: HistoryInfo;
  /**
   * content HTML.
   */
  content: string;
  /** styles */
  styleTags: string;
  /**
   * Resolved route path.
   */
  path: string;
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
  // Initialize store for this rendering.
  const stores = makeStores();
  const runtime: Runtime = {
    stores,
    firebase: firebaseApp,
    firebaseGlobal: null,
    fetchCounterPageContent: id => fetchCounterPageContent(firebaseApp, id),
  };
  // Simulate navigation to given path.
  const nav = new Navigation(runtime, true);
  const cancelled = await nav.move(pathname, 'replace');
  if (cancelled) {
    throw new Error('Server-side rendering cancelled');
  }
  // Prepare server-side rendering support by styled-components.
  const sheet = new ServerStyleSheet();
  const content = renderToString(
    sheet.collectStyles(<App stores={stores} navigation={nav} />),
  );
  // style tags generated by styled-components.
  const styleTags = sheet.getStyleTags();
  // destruct resources craeted by navigation.
  const { routePath, params, page } = stores.page;
  nav.close();
  if (page == null) {
    // TODO
    return {
      historyInfo: {
        path: '',
        title: '404',
        social: {
          image: '',
          description: '',
          twitterCreator: null,
        },
      },
      path: routePath,
      content,
      styleTags,
      params,
      page,
      count: stores.counter.count,
    };
  }
  return {
    historyInfo: getHistoryInfo(page),
    content,
    styleTags,
    path: routePath,
    params,
    page,
    count: stores.counter.count,
  };
}
