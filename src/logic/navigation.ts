import { fetchCounterPageContent, fetchCounterPageByAPI } from './counter';
import { history } from './history';
import { handleError } from './error';
import {
  PageData,
  CounterPageData,
  TopPageData,
  NewPageData,
  ErrorPageData,
} from '../defs/page';
import { serviceName, serviceDescription } from '../defs/service';
import { Router } from '../layout/router';
import { Routing, Route } from './routing';
import {
  makeCounterStream,
  CounterEvent,
  CounterStream,
  makeDummyStream,
} from './counter/stream';
import { Stores } from '../store';
import { Runtime } from '../defs/runtime';
import { toJS } from 'mobx';
import { loadTrends } from './trend/loader';
import { Trend } from './trend';

/**
 * Flag for history update.
 */
type HistoryUpdate = 'push' | 'replace' | 'none';
export class Navigation {
  protected router: Routing;
  protected historyUnlisten: any;
  /**
   * Function to cancel current navigation.
   */
  protected cancel: (() => void) | null = null;
  constructor(protected runtime: Runtime, public readonly server: boolean) {
    const {
      stores: { counter: counterStore, trend: trendStore },
    } = runtime;
    // Construct a router.
    const router = (this.router = new Routing());
    router.add<
      {},
      TopPageData,
      { stream: CounterStream; cancelFlag: { value: boolean } }
    >('/', {
      beforeMove: async runtime => {
        trendStore.setLoading();
        return {
          page: 'top',
        };
      },
      beforeEnter: async (runtime, _, _1) => {
        // start loading trends if it's on client.
        const cancelFlag = { value: false };
        if (!this.server) {
          // intentionally do not wait for this.
          loadTrends(runtime).then(trends => {
            if (!cancelFlag.value) {
              trendStore.loadTrend(trends);
            }
          });
        }
        // Prepare counter stream.
        const stream = makeCounterStream('/top', runtime, this.server);
        const count = await stream.start();
        if (count != null) {
          counterStore.updateCount(count);
        }
        if (!this.server) {
          stream.emitter.on('count', ({ count }: CounterEvent) => {
            counterStore.updateCount(count);
          });
        }
        return { stream, cancelFlag };
      },
      beforeLeave: async (_, _1, _2, { stream, cancelFlag }) => {
        // stop stream when leaving page.
        stream.close();
        // stop effect of remaining handlers.
        cancelFlag.value = true;
        // counter value is invalid until new value is fetched
        if (!this.server) {
          counterStore.invalidate();
        }
      },
    });
    router.add<{}, NewPageData, void>('/new', {
      beforeMove: async () => {
        return {
          page: 'new',
        };
      },
      beforeEnter: async () => {},
      beforeLeave: async () => {},
    });
    router.add<{ id: string }, CounterPageData, { stream: CounterStream }>(
      '/:id([-_a-zA-Z0-9]{4,})',
      {
        beforeMove: async (runtime, { id }) => {
          // Fetch page data for it.
          const content = await runtime.fetchCounterPageContent(id);
          if (content == null) {
            // Such page is not found. Internal redirect
            return `/404/${id}`;
          }
          return {
            page: 'counter',
            content,
          };
        },
        beforeEnter: async (runtime, { id }, page) => {
          // Prepare counter stream.
          const stream = makeCounterStream(
            `/counters/${id}`,
            runtime,
            this.server,
          );
          const count = await stream.start();
          if (count != null) {
            counterStore.updateCount(count);
          }
          if (!this.server) {
            stream.emitter.on('count', ({ count }: CounterEvent) => {
              counterStore.updateCount(count);
            });
          }
          return { stream };
        },
        beforeLeave: async (_, _1, _2, { stream }) => {
          // stop stream when leaving page.
          stream.close();
          if (!this.server) {
            // counter value is invalid until new value is fetched
            // do not update on server so that rendered component is not updated
            counterStore.invalidate();
          }
        },
      },
    );
    router.add<{ path: string }, ErrorPageData, { stream: CounterStream }>(
      '/404/:path*',
      {
        beforeMove: async (runtime, params) => {
          return {
            page: 'error',
            code: 404,
            path: '/' + (params.path || ''),
          };
        },
        beforeEnter: async (runtime, {}, page) => {
          // Prepare dummy stream for error page.
          const stream = makeDummyStream(page.code);
          const count = await stream.start();
          if (count != null) {
            counterStore.updateCount(count);
          }
          if (!this.server) {
            stream.emitter.on('count', ({ count }: CounterEvent) => {
              counterStore.updateCount(count);
            });
          }
          return { stream };
        },
        beforeLeave: async (_, _1, _2, { stream }) => {
          // stop stream when leaving page.
          stream.close();
          if (!this.server) {
            // counter value is invalid until new value is fetched
            // do not update on server so that rendered component is not updated
            counterStore.invalidate();
          }
        },
      },
    );
    this.initHistory();
  }
  /**
   * Init history object if available.
   */
  protected initHistory(): void {
    if (history != null) {
      this.historyUnlisten = history.listen(async (location, action) => {
        if (action === 'POP') {
          // It is pop.
          const obj = location.state;
          if (obj == null) {
            // ???
            this.move(location.pathname, 'none');
            return;
          }
          // Reuse params and pagedata.
          const { path, page } = obj;
          // Re-route.
          const res = this.router.route(path);
          if (res == null) {
            // ???
            this.move(path, 'none');
            return;
          }
          // XXX This logic appars twice!
          const pageStore = this.runtime.stores.page;
          if (pageStore.route != null) {
            pageStore.route
              .beforeLeave(
                this.runtime,
                pageStore.params,
                pageStore.page,
                pageStore.state,
              )
              .catch(handleError);
          }
          // bypass beforemove.
          const state = await res.route.beforeEnter(
            this.runtime,
            res.params,
            page,
          );
          this.navigate(path, res.route, res.params, page, state, 'none');
        }
      });
    }
  }
  /**
   * Move to given path.
   * @returns whether this move is cancelled.
   */
  public async move(
    pathname: string,
    historyFlag: HistoryUpdate,
  ): Promise<boolean> {
    const { runtime } = this;
    const {
      stores: { page: pageStore },
    } = runtime;
    if (this.cancel != null) {
      // cancel ongoing navigation in favor of new one.
      this.cancel();
    }
    let cancelled = false;
    this.cancel = () => (cancelled = true);

    let res =
      this.router.route(pathname) || this.router.route('/404' + pathname);
    if (res == null) {
      // !?
      throw new Error('Could not navigate');
    }
    let route = res.route;
    let page: PageData | string | null = await route.beforeMove(
      runtime,
      res.params,
    );
    if (cancelled) return true;
    if ('string' === typeof page) {
      // string indicates redirect.
      // redirect is allowed only once.
      res = this.router.route(page) || this.router.route('/404' + page);
      if (res == null) {
        throw new Error('Could not navigate');
      }
      route = res.route;
      page = await route.beforeMove(runtime, res.params);
      if ('string' === typeof page) {
        // huh?
        throw new Error('Double redirect');
      }
    }
    if (cancelled) return true;
    // Clean up previous state.
    // It is intentionally non-blocking for fast loading of next page.
    if (pageStore.route != null) {
      pageStore.route
        .beforeLeave(runtime, pageStore.params, pageStore.page, pageStore.state)
        .catch(handleError);
    }
    const state = await route.beforeEnter(runtime, res.params, page);
    if (cancelled) {
      // close because canceled.
      route.beforeLeave(runtime, res.params, page, state);
      return true;
    }
    this.navigate(res.path, route, res.params, page, state, historyFlag);
    this.cancel = null;
    return false;
  }

  /**
   * Initialize the page
   * using `location` information.
   * @returns whether initialization is canceled.
   */
  public async initFromLocation(routepath?: string): Promise<boolean> {
    const pathname = routepath || location.pathname;
    // XXX cancel process appears twice
    if (this.cancel != null) {
      this.cancel();
    }
    let cancelled = false;
    this.cancel = () => (cancelled = true);

    // await this.move(pathname, 'replace');
    // beforeMove is already done by server, so no need to do it.
    const res = this.router.route(pathname);
    // ??? it's 404!
    if (res == null) {
      this.cancel = null;
      return await this.move(pathname, 'replace');
    }
    const route = res.route;
    const page = this.runtime.stores.page.page;
    const state = await route.beforeEnter(this.runtime, res.params, page);
    if (cancelled) {
      route.beforeLeave(this.runtime, res.params, page, state);
      return true;
    }
    this.navigate(pathname, route, res.params, page, state, 'replace');
    return false;
  }

  /**
   * Navigate to given page.
   * @param path resolved path of route object.
   * @param route Route object of current page.
   * @param params Params object.
   * @param page Object of page to move to.
   * @param state Internal state used by this page.
   * @param replace Whether it replaces current page in history.
   */
  public navigate<
    Params extends Record<string, string>,
    PD extends PageData,
    State
  >(
    path: string,
    route: Route<Params, PD, State> | null,
    params: Params,
    page: PageData | null,
    state: State,
    historyFlag: HistoryUpdate,
  ): void {
    // update history.
    if (history != null) {
      if (page != null) {
        const { path: histpath, title } = getHistoryInfo(page);
        // `page` might come from mobx, so convert to plain object.
        if (historyFlag === 'replace') {
          history.replace(histpath, { path, params, page: toJS(page) });
        } else if (historyFlag === 'push') {
          history.push(histpath, { path, params, page: toJS(page) });
        }
        document.title = title;
      }
    }
    this.runtime.stores.page.updatePage(path, route, params, page, state);
  }
  /**
   * Close navigation.
   */
  public async close(): Promise<void> {
    const {
      stores: { page: pageStore },
    } = this.runtime;
    // Clean up current page.
    if (pageStore.route != null) {
      pageStore.route
        .beforeLeave(
          this.runtime,
          pageStore.params,
          pageStore.page,
          pageStore.state,
        )
        .catch(handleError);
    }
    // Clean up history listening.
    if (this.historyUnlisten != null) {
      this.historyUnlisten();
    }
  }
}

export interface HistoryInfo {
  /**
   * Path of this page.
   */
  path: string;
  /**
   * Title for this page.
   */
  title: string;
  /**
   * Social things.
   */
  social: {
    image: string;
    description: string;
    twitterCreator: string | null;
  };
}
/**
 * Get history information of given page.
 */
export function getHistoryInfo(page: PageData): HistoryInfo {
  switch (page.page) {
    case 'top': {
      return {
        path: '/',
        title: serviceName,
        social: {
          image: '/static/card.jpg',
          description: serviceDescription,
          // XXX ad-hoc
          twitterCreator: '@uhyo_',
        },
      };
    }
    case 'new': {
      return {
        path: '/new',
        title: serviceName,
        social: {
          image: '/static/card.jpg',
          description: serviceDescription,
          // XXX ad-hoc
          twitterCreator: '@uhyo_',
        },
      };
    }
    case 'counter': {
      return {
        path: `/${page.content.id}`,
        title: page.content.title,
        social: {
          image:
            page.content.background == null
              ? '/static/back.jpg'
              : page.content.background.type === 'gradient'
                ? ''
                : page.content.background.url,
          description: page.content.description,
          twitterCreator: null,
        },
      };
    }
    case 'error': {
      return {
        path: page.path,
        title: page.code === 404 ? `404 Not Found` : String(page.code),
        social: {
          image: '/static/card.jpg',
          description: '',
          twitterCreator: '@uhyo_',
        },
      };
    }
  }
}
