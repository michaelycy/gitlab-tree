import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'webext-redux';

import App from './containers/app/App';
import { OptionsProvider } from './contexts/OptionsContext';

const proxyStore = new Store();
import './rewrite.css';

const anchor = document.createElement('div');
anchor.id = 'rcr-anchor';

if (document.querySelector('.layout-page') !== null) {
  document
    .querySelector('.layout-page')
    .insertBefore(anchor, document.querySelector('.layout-page').childNodes[0]);

  proxyStore
    .ready()
    .then(() => {
      // 挂载 tree 型插件
      ReactDOM.render(
        <Provider store={proxyStore}>
          <OptionsProvider>
            <App />
          </OptionsProvider>
        </Provider>,
        document.getElementById('rcr-anchor')
      );
    })
    .catch((err) => {
      throw new Error(err);
    });
}

export default proxyStore;
