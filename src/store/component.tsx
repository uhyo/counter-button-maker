import * as React from 'react';
import { Stores } from '.';

// XXX This is a type cheat but...
export const { Provider, Consumer } = React.createContext<Stores>(null as any);
