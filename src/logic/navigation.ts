import { fetchCounterPageContent } from './counter';
import { history } from './history';
import { handleError } from './error';
import { PageData, CounterPageData } from '../defs/page';
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

export class Navigation {
  protected router: Routing;
  constructor(protected runtime: Runtime, public readonly server: boolean) {
    const {
      stores: { counter: counterStore },
    } = runtime;
    // Construct a router.
    const router = (this.router = new Routing());
    router.add('/', {
      beforeMove: async () => {
        return {
          page: 'top',
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
            page.content.docid,
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
  }
  /**
   * Move to given path.
   */
  public async move(pathname: string) {
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
      this.navigate(null, {}, null, null, true);
      return;
    }
    const route = res.route;
    const page = await route.beforeMove(runtime, res.params);
    const state = await route.beforeEnter(runtime, res.params, page);

    this.navigate(route, res.params, page, state, true);
  }

  /**
   * Initialize the page store
   * using `location` information.
   */
  public async initFromLocation() {
    const { pathname } = location;

    await this.move(pathname);
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
    replace: boolean,
  ): Promise<void> {
    // update history.
    if (history != null) {
      if (page != null) {
        const { path, title } = getHistoryInfo(page);
        if (replace) {
          history.replace(path, page);
        } else {
          history.push(path, page);
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
    case 'counter': {
      return {
        path: `/${page.content.id}`,
        title: page.content.title,
      };
    }
  }
}
