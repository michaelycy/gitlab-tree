import React, { useState, useEffect, useContext } from 'react';
import { TabIdentifierClient } from 'chrome-tab-identifier';

import RepoSvg from '../../svgs/Repo';
import HalfSvg from '../../svgs/Half';
import PushpinSvg from '../../svgs/Pushpin';
import BranchSvg from '../../svgs/Branch';
import SearchSvg from '../../svgs/Search';
import TreeList from '../../containers/TreeList/TreeList';
import Resizer from '../../containers/Resizer';
import { OptionsContext } from '../../contexts/OptionsContext';
import { fetchURLDetails } from '../../utils/url';
import { switchTheme } from '../../utils/themeList';
import getHeaderStyles from '../../utils/header-nav';
import useEventListener from '../../utils/useEventListener';
import classnames from 'classnames';

import './styles.css';

const tabIdClient = new TabIdentifierClient();

function Pane({
  toggleOpened,
  width,
  firstPageLoad,
  setFirstPageLoad,
  setShowSearchBarTrue,
  reloading,
  setReloading,
}) {
  const { options } = useContext(OptionsContext);
  const [tabId, setTabId] = useState();
  const [headerStyle, setHeaderStyle] = useState(getHeaderStyles(options));

  useEffect(() => {
    tabIdClient.getTabId().then((tab) => {
      setTabId(tab);
    });
  }, []);

  useEffect(() => {
    if (reloading) {
      setReloading(false);
    }
  }, [reloading]);

  useEventListener('popstate', () => {
    setReloading(true);
  });

  useEffect(() => {
    const headerBgStyle = getHeaderStyles(options);

    setHeaderStyle(headerBgStyle);
  }, [options]);

  const URLDetails = fetchURLDetails();

  return (
    <div className='spantree-tree-pane' style={{ width: `${width}px` }}>
      <div className='spantree-pane-main'>
        <div className='spantree-pane-header' style={headerStyle}>
          <div className='spantree-spread'>
            <div className='spantree-pane-details'>
              <RepoSvg style={{ verticalAlign: 'middle', marginRight: '5px' }} />
              {URLDetails.dirFormatted}
            </div>

            <div className='spantree-pane-icons'>
              <span
                onClick={toggleOpened}
                className={classnames('spantree-close-button', {
                  pinned: true,
                })}>
                <PushpinSvg />
              </span>
            </div>
          </div>

          <div className='spantree-spread branch-warp'>
            <div className='spantree-pane-details' style={{ width: `${width - 12}px` }}>
              <BranchSvg
                style={{
                  verticalAlign: 'middle',
                  fontSize: '12px',
                  marginRight: '5px',
                }}
              />
              {URLDetails.branchName}
            </div>
            <span onClick={setShowSearchBarTrue} className='spantree-search-button'>
              <SearchSvg />
            </span>
          </div>
        </div>

        <div className='spantree-tree-body'>
          {tabId ? (
            <TreeList
              firstPageLoad={firstPageLoad}
              setFirstPageLoad={setFirstPageLoad}
              tabId={tabId}
            />
          ) : null}
        </div>
        <div className='spantree-tree-footer'>
          <span
            onClick={() => {
              switchTheme();
              setTimeout(() => {
                setHeaderStyle(getHeaderStyles(options));
              }, 100);
            }}
            className='spantree-close-button'>
            <HalfSvg />
          </span>
        </div>
      </div>
      <Resizer />
    </div>
  );
}

export default Pane;
