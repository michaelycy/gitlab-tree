import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'webext-redux';

// eslint-disable-next-line import/no-cycle
import App from './containers/app';
import { OptionsProvider } from './contexts/options-context';
import './rewrite.css';

const proxyStore = new Store();

const anchor = document.createElement('div');
anchor.id = 'rcr-anchor';

if (document.querySelector('.layout-page') !== null) {
  document
    .querySelector('.layout-page')
    .insertBefore(anchor, document.querySelector('.layout-page').childNodes[0]);

  proxyStore
    .ready()
    // 挂载 tree 型插件
    .then(() =>
      ReactDOM.render(
        <Provider store={proxyStore}>
          <OptionsProvider>
            <App />
          </OptionsProvider>
        </Provider>,
        document.getElementById('rcr-anchor')
      )
    )
    .catch(err => {
      throw new Error(err);
    });
}
export default proxyStore;
