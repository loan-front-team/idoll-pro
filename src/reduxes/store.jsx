import {
  createStore,
  applyMiddleware,
  compose
} from 'redux';
import thunk from 'redux-thunk';
import reducer from 'reduxes/reducer.jsx';

const reduxDevtools = window.devToolsExtension ? window.devToolsExtension() : f => f;
export const store = createStore(reducer, compose(
  applyMiddleware(thunk),
  reduxDevtools
));
