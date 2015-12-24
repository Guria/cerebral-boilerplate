import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'cerebral-router';
import controller from './controller';
import {Container} from 'cerebral-react';

import Home from './modules/Home';
import homeSignals from './modules/Home/signals';
import Hoodie from './modules/Hoodie';

homeSignals(controller);

Hoodie(controller);

Router(controller, {
  '/': 'colorChanged'
}, {
  mapper: {
    query: true
  }
});

ReactDOM.render(<Container controller={controller}><Home /></Container>, document.getElementById('root'));
