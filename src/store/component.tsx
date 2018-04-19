import * as React from 'react';
import { Stores } from '.';
import { counterStore, pageStore } from './stores';

export const { Provider, Consumer } = React.createContext<Stores>({
  counter: counterStore,
  page: pageStore,
});
