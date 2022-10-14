import React, { useContext, useState, useEffect } from 'react';
import classnames from 'classnames';

import RepoSvg from '../../../svgs/Repo';
import BranchSvg from '../../../svgs/Branch';
import SearchSvg from '../../../svgs/Search';
import PushpinSvg from '../../../svgs/Pushpin';
import { fetchURLDetails } from '../../../utils/url';
import { OptionsContext } from '../../../contexts/options-context';
import { getHeaderStyles } from './helper';

// import WebWorker from './WebWorker';
// import SearchBar from '../search-bar';
// import searchBarWorkerJS from '../../utils/searchBarWorker';

import './index.css';

export default ({ width, toggleOpened, setShowSearchBarTrue }) => {
  const { options } = useContext(OptionsContext);
  const [headerStyle, setHeaderStyle] = useState(getHeaderStyles(options));

  useEffect(() => {
    const headerBgStyle = getHeaderStyles(options);

    setHeaderStyle(headerBgStyle);
  }, [options]);

  const { dirFormatted, branchName } = fetchURLDetails();

  return (
    <div className="gitlab-tree-pane-header" style={headerStyle}>
      <div className="gitlab-tree-spread">
        <div className="gitlab-tree-pane-details">
          <RepoSvg style={{ verticalAlign: 'middle', marginRight: '5px' }} />
          {dirFormatted}
        </div>

        <div className="gitlab-tree-pane-icons">
          <span onClick={toggleOpened} className={classnames('gitlab-tree-close-button', 'pinned')}>
            <PushpinSvg />
          </span>
        </div>
      </div>

      <div className="gitlab-tree-spread branch-warp">
        <div className="gitlab-tree-pane-details" style={{ width: `${width - 12}px` }}>
          <BranchSvg
            style={{
              verticalAlign: 'middle',
              fontSize: '12px',
              marginRight: '5px',
            }}
          />
          {branchName}
        </div>
        <span onClick={setShowSearchBarTrue} className="gitlab-tree-search-button">
          <SearchSvg />
        </span>
      </div>
    </div>
  );
};
