import thunk from 'redux-thunk';
import { createStore } from 'redux';
import { TabIdentifier } from 'chrome-tab-identifier';
import { wrapStore, applyMiddleware } from 'webext-redux';

import rootReducer from './reducers';

const tabIdentifier = new TabIdentifier();
const store = createStore(rootReducer, {});

wrapStore(applyMiddleware(store, thunk));