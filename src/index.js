import React from 'react';
import ReactDOM from 'react-dom';

import App from './App.jsx';
import './index.less';

const render = App => {
  ReactDOM.render((
    <App />
  ), document.getElementById('root'));
}

render(App)

if (module.hot) {
  module.hot.accept('./App', (App) => render(App))
}
