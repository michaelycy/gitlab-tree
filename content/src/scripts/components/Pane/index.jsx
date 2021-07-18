import React from 'react';

import TreeList from '../../containers/tree-list';
import Resizer from '../../containers/resizer';
import PanHeader from './header';
import PanFooter from './footer';

import './styles.css';

function Pane({
  tabId,
  toggleOpened,
  width,
  firstPageLoad,
  setFirstPageLoad,
  setShowSearchBarTrue,
}) {
  return (
    <div className="gitlab-tree-pane" style={{ width: `${width}px` }}>
      <div className="gitlab-tree-pane-main">
        {/* 头部操作区 */}
        <PanHeader
          width={width}
          toggleOpened={toggleOpened}
          setShowSearchBarTrue={setShowSearchBarTrue}
        />

        {/* 树形区域 */}
        <div className="gitlab-tree-tree-body">
          {tabId ? (
            <TreeList
              firstPageLoad={firstPageLoad}
              setFirstPageLoad={setFirstPageLoad}
              tabId={tabId}
            />
          ) : null}
        </div>

        {/* 底部操作栏 */}
        <PanFooter />
      </div>
      <Resizer />
    </div>
  );
}

export default Pane;
