import * as React from 'react';
import { Stores } from '.';

export const { Provider, Consumer } = React.createContext<Stores | null>(null);
