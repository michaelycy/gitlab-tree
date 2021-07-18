import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { TabIdentifierClient } from 'chrome-tab-identifier';

import { EXTENSION_ID } from '../../constants';
import Pane from '../../components/pane';
import Toggler from '../../components/toggler';
import { browserKey } from '../../utils/browser';
import useEventListener from '../../hooks/useEventListener';
import { useVisibleTree } from '../../hooks/use-visible-tree';
import { openTreeExtension, closeTreeExtension } from './helper';
// eslint-disable-next-line import/no-cycle
import { toggleOpened } from '../../../../../event/src/actions/UI';

import './index.css';

const importFileIconCSS = `${browserKey()}-extension://${EXTENSION_ID}/libs/file-icons.css`;
const parentDom = document.querySelector('body');
const tabIdClient = new TabIdentifierClient();
// const searchBarWorker = new WebWorker(searchBarWorkerJS);

const App = props => {
  const rcrAnchorDom = document.getElementById('rcr-anchor');
  const [tabId, setTabId] = useState();
  const [reloading, setReloading] = useState(true);
  const [firstPageLoad, setFirstPageLoad] = useState(true);
  // const [showSearchBar, setShowSearchBar] = useState(false);

  const shouldVisibleTree = useVisibleTree();

  const onToggleOpenedThisTab = useCallback(() => {
    props.toggleOpened({ tabId });
  }, [tabId, props]);

  useEffect(() => {
    tabIdClient.getTabId().then(tab => setTabId(tab));
  }, []);

  useEventListener('popstate', () => {
    setReloading(true);
  });

  useEffect(() => {
    if (tabId && props.opened[tabId] && shouldVisibleTree) {
      openTreeExtension(props.width);
    } else {
      closeTreeExtension();
    }
  }, [tabId, props, shouldVisibleTree]);

  if (!tabId) {
    return null;
  }

  if (!shouldVisibleTree) {
    if (props.opened[tabId]) {
      onToggleOpenedThisTab();
    }
    closeTreeExtension();
    return null;
  }
  const { opened, width, pinned } = props;

  return (
    <React.Fragment>
      <link rel="stylesheet" type="text/css" href={importFileIconCSS} />
      {ReactDOM.createPortal(
        opened[tabId] ? (
          <Pane
            tabId={tabId}
            toggleOpened={onToggleOpenedThisTab}
            width={width}
            firstPageLoad={firstPageLoad}
            setFirstPageLoad={setFirstPageLoad}
            reloading={reloading}
            setReloading={setReloading}
          />
        ) : (
          <Toggler handleClick={onToggleOpenedThisTab} pinned={pinned} />
        ),
        opened[tabId] ? parentDom : rcrAnchorDom
      )}

      {/* <SearchBar
        worker={searchBarWorker}
        showSearchBar={showSearchBar}
        setShowSearchBar={setShowSearchBar}
      /> */}
    </React.Fragment>
  );
};

const mapStateToProps = state => ({
  opened: state.opened,
  pinned: state.pinned,
  width: state.width,
});

const mapDispatchToProps = { toggleOpened };

export default connect(mapStateToProps, mapDispatchToProps)(App);
