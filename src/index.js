import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App.jsx';
import { store } from 'reduxes/store.jsx';
import './index.less';


if (process.env.NODE_ENV !== 'production') {
   console.log(process.env);
 }

const render = App => {
  ReactDOM.render((
    <Provider store={store}>
      <App />
    </Provider>
  ), document.getElementById('root'));
}

render(App)

if (module.hot) {
  module.hot.accept('./App', (App) => render(App))
}
