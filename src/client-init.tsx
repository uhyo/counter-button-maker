import * as React from 'react';
import { render } from 'react-dom';
import { App } from './index';
import { initFromLocation } from './logic/navigation';

const appArea = document.getElementById('app');

render(<App />, appArea);

initFromLocation();
