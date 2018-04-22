import { fetchCounterPageContent } from './counter';
import { history } from './history';
import { handleError } from './error';
import {
  PageData,
  CounterPageData,
  TopPageData,
  NewPageData,
} from '../defs/page';
import { serviceName } from '../defs/service';
import { Router } from '../layout/router';
import { Routing, Route } from './routing';
import {
  makeCounterStream,
  CounterEvent,
  CounterStream,
} from './counter/stream';
import { Stores } from '../store';
import { Runtime } from '../defs/runtime';

/**
 * Flag for history update.
 */
type HistoryUpdate = 'push' | 'replace' | 'none';
export class Navigation {
  protected router: Routing;
  protected historyUnlisten: any;
  constructor(protected runtime: Runtime, public readonly server: boolean) {
    const {
      stores: { counter: counterStore },
    } = runtime;
    // Construct a router.
    const router = (this.router = new Routing());
    router.add<{}, TopPageData, { stream: CounterStream }>('/', {
      beforeMove: async () => {
        return {
          page: 'top',
        };
      },
      beforeEnter: async (runtime, _, _1) => {
        // Prepare counter stream.
        const stream = makeCounterStream('/top', runtime, this.server);
        const count = await stream.start();
        counterStore.updateCount(count);
        stream.emitter.on('count', ({ count }: CounterEvent) => {
          counterStore.updateCount(count);
        });
        return { stream };
      },

      beforeLeave: async (_, _1, _2, { stream }) => {
        // stop stream when leaving page.
        stream.close();
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
          const content = await fetchCounterPageContent(runtime, id);
          if (content == null) {
            // TODO What!? not found!
            throw new Error('Page not found');
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
          counterStore.updateCount(count);
          stream.emitter.on('count', ({ count }: CounterEvent) => {
            counterStore.updateCount(count);
          });
          return { stream };
        },
        beforeLeave: async (_, _1, _2, { stream }) => {
          // stop stream when leaving page.
          stream.close();
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
          const pathname = location.pathname;
          const obj = location.state;
          if (obj == null) {
            // ???
            this.move(location.pathname, 'none');
            return;
          }
          // Reuse params and pagedata.
          const { page } = obj;
          // Re-route.
          const res = this.router.route(pathname);
          if (res == null) {
            // ???
            this.move(location.pathname, 'none');
            return;
          }
          // bypass beforemove.
          const state = await res.route.beforeEnter(
            this.runtime,
            res.params,
            page,
          );
          this.navigate(res.route, res.params, page, state, 'none');
        }
      });
    }
  }
  /**
   * Move to given path.
   */
  public async move(pathname: string, historyFlag: HistoryUpdate) {
    const { runtime } = this;
    const {
      stores: { page: pageStore },
    } = runtime;
    // Clean up previous state.
    // It is intentionall non-blocking for fast loading of next page.
    if (pageStore.route != null) {
      pageStore.route
        .beforeLeave(runtime, pageStore.params, pageStore.page, pageStore.state)
        .catch(handleError);
    }
    const res = this.router.route(pathname);
    if (res == null) {
      // TODO
      this.navigate(null, {}, null, null, 'replace');
      return;
    }
    const route = res.route;
    const page = await route.beforeMove(runtime, res.params);
    const state = await route.beforeEnter(runtime, res.params, page);

    this.navigate(route, res.params, page, state, historyFlag);
  }

  /**
   * Initialize the page store
   * using `location` information.
   */
  public async initFromLocation() {
    const { pathname } = location;

    await this.move(pathname, 'replace');
  }

  /**
   * Navigate to given page.
   * @param route Route object of current page.
   * @param params Params object.
   * @param page Object of page to move to.
   * @param state Internal state used by this page.
   * @param replace Whether it replaces current page in history.
   */
  public async navigate<
    Params extends Record<string, string>,
    PD extends PageData,
    State
  >(
    route: Route<Params, PD, State> | null,
    params: Params,
    page: PageData | null,
    state: State,
    historyFlag: HistoryUpdate,
  ): Promise<void> {
    // update history.
    if (history != null) {
      if (page != null) {
        const { path, title } = getHistoryInfo(page);
        if (historyFlag === 'replace') {
          history.replace(path, { params, page });
        } else if (historyFlag === 'push') {
          history.push(path, { params, page });
        }
        document.title = title;
      }
    }
    this.runtime.stores.page.updatePage(route, params, page, state);
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

interface HistoryInfo {
  /**
   * Path of this page.
   */
  path: string;
  /**
   * Title for this page.
   */
  title: string;
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
      };
    }
    case 'new': {
      return {
        path: '/new',
        title: serviceName,
      };
    }
    case 'counter': {
      return {
        path: `/${page.content.id}`,
        title: page.content.title,
      };
    }
  }
}
