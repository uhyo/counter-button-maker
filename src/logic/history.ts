import { createBrowserHistory } from 'history';

export const history =
  'undefined' !== typeof window && window.history
    ? createBrowserHistory()
    : null;
