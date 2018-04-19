import { pageStore } from '../store';
import { fetchCounterPageContent } from './page';
import { handleError } from './error';

/**
 * Initialize the page store
 * using `location` information.
 */
export function initFromLocation() {
  const { pathname } = location;
  let r;
  if (pathname === '/') {
    // move to top page.
    pageStore.updatePage({
      page: 'top',
    });
  } else if ((r = pathname.match(/^\/([-_a-zA-Z0-9]{4,})$/))) {
    // If it is already opened, do not perform network stuff.
    const { page } = pageStore;
    if (page != null && page.page === 'counter' && page.content.id === r[1]) {
      return;
    }
    // else, fetch data for this counter page.
    fetchCounterPageContent(r[1])
      .then(content => {
        pageStore.updatePage({
          page: 'counter',
          content,
        });
      })
      .catch(handleError);
  } else {
    // TODO
    pageStore.updatePage(null);
  }
}
/**
 * Navigate to a counter page.
 */
export async function navigateToCounterPage(id: string) {
  const content = await fetchCounterPageContent(id);
  pageStore.updatePage({
    page: 'counter',
    content,
  });
}
