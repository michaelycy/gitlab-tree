import React from 'react';
import { render } from 'react-dom';
import { Store } from 'webext-redux';
import { Provider } from 'react-redux';

import App from './components/app/App';

const proxyStore = new Store();

proxyStore.ready().then(() => {
  render(
    <Provider store={proxyStore}>
      <App />
    </Provider>,
    document.getElementById('app')
  );
});

export default proxyStore;
