import { pageStore } from '../store';
import { fetchCounterPageContent } from './page';
import { history } from './history';
import { handleError } from './error';
import { PageData } from '../defs/page';
import { serviceName } from '../defs/service';

/**
 * Initialize the page store
 * using `location` information.
 */
export function initFromLocation() {
  const { pathname } = location;
  let r;
  if (pathname === '/') {
    // move to top page.
    navigate(
      {
        page: 'top',
      },
      true,
    );
  } else if ((r = pathname.match(/^\/([-_a-zA-Z0-9]{4,})$/))) {
    // If it is already opened, do not perform network stuff.
    const { page } = pageStore;
    if (page != null && page.page === 'counter' && page.content.id === r[1]) {
      return;
    }
    // else, fetch data for this counter page.
    navigateToCounterPage(r[1], true).catch(handleError);
  } else {
    // TODO
    navigate(null, true);
  }
}
/**
 * Navigate to a counter page.
 */
export async function navigateToCounterPage(
  id: string,
  replace: boolean = false,
) {
  const content = await fetchCounterPageContent(id);
  navigate(
    {
      page: 'counter',
      content,
    },
    replace,
  );
}

/**
 * Navigate to given page.
 * @param page Object of page to move to.
 * @param replace Whether it replaces current page in history.
 */
export async function navigate(
  page: PageData | null,
  replace: boolean,
): Promise<void> {
  // update history.
  if (page != null) {
    const { path, title } = getHistoryInfo(page);
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
