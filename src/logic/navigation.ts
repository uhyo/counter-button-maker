import { pageStore, counterStore } from '../store';
import { fetchCounterPageContent } from './counter';
import { history } from './history';
import { handleError } from './error';
import { PageData, CounterPageData } from '../defs/page';
import { serviceName } from '../defs/service';
import { Router } from '../layout/router';
import { Routing } from './routing';
import {
  makeCounterStream,
  CounterEvent,
  CounterStream,
} from './counter/stream';

/**
 * Router for navigation.
 */
export const router = new Routing();
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
    beforeMove: async ({ id }) => {
      // Fetch page data for it.
      const content = await fetchCounterPageContent(id);
      return {
        page: 'counter',
        content,
      };
    },
    beforeEnter: async ({ id }) => {
      // Prepare counter stream.
      const stream = makeCounterStream(id);
      stream.emitter.on('count', ({ count }: CounterEvent) => {
        counterStore.updateCount(count);
      });
      return { stream };
    },
    beforeLeave: async (_, _2, { stream }) => {
      // stop stream when leaving page.
      stream.close();
    },
  },
);

/**
 * Move to given path.
 */
export async function move(pathname: string) {
  const res = router.route(pathname);
  if (res == null) {
    // TODO
    navigate(null, null, true);
    return;
  }
  const route = res.route;
  const page = await route.beforeMove(res.params);
  const state = await route.beforeEnter(res.params, page);

  navigate(page, state, true);
}

/**
 * Initialize the page store
 * using `location` information.
 */
export async function initFromLocation() {
  const { pathname } = location;

  await move(pathname);
}

/**
 * Navigate to given page.
 * @param page Object of page to move to.
 * @param state Internal state used by this page.
 * @param replace Whether it replaces current page in history.
 */
export async function navigate(
  page: PageData | null,
  state: any,
  replace: boolean,
): Promise<void> {
  // update history.
  if (page != null) {
    const { path, title } = getHistoryInfo(page);
    console.log('hist!', path, page);
    if (replace) {
      history.replace(path, page);
    } else {
      history.push(path, page);
    }
    document.title = title;
  }
  pageStore.updatePage(page);
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
