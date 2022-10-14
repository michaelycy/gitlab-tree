import React, { useState, useEffect, useRef, useCallback } from 'react';
import { connect } from 'react-redux';

import Loader from '../../components/loader';
import TreeItem from '../../components/tree-item';
import { useURLDetails } from '../../hooks/use-url-details';
import { getInitialTree, openDir, closeDir } from '../../../../../event/src/actions/API';
import { setClicked } from '../../../../../event/src/actions/UI';

import './styles.css';

function TreeList({
  firstPageLoad,
  setFirstPageLoad,
  tabId,
  tree,
  width,
  clicked,
  setClicked,
  getInitialTree,
  closeDir,
}) {
  const [loading, setLoading] = useState(true);
  const [rendering, setRendering] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const initialMount = useRef(true);
  const URLDetails = useURLDetails();

  const shouldGetTree = () => {
    if (!(tree && tree[tabId])) {
      return true;
    }

    if (clicked) {
      return false;
    }

    return firstPageLoad;
  };

  useEffect(() => {
    if (URLDetails.baseRemovedURL.length === 0) {
      setRendering(false);
      setScrolling(false);
    } else {
      setRendering(true);
      setScrolling(true);
    }

    if (shouldGetTree()) {
      getInitialTree(
        URLDetails.dirURLParam,
        { ref: URLDetails.branchNameURL },
        {
          repoName: URLDetails.dirFormatted,
          branchName: URLDetails.branchName,
          tabId,
        }
      );
    }
    setFirstPageLoad(false);
  }, []);
  console.log(URLDetails.warehouse);
  useEffect(() => {
    if (initialMount.current && shouldGetTree()) {
      initialMount.current = false;
    } else if (loading && tree && tree[tabId]) {
      setLoading(false);
    }
  }, [tree[tabId]]);

  if (loading)
    return (
      <div className="spantree-loader-wrapper">
        <Loader size="64px" />
      </div>
    );

  const closeDirectory = path => {
    closeDir(path, {
      repoName: URLDetails.dirFormatted,
      branchName: URLDetails.branchName,
      tabId,
    });
  };

  const openDirectory = path => {
    openDir(
      URLDetails.dirURLParam,
      path,
      {
        ref: URLDetails.branchNameURL,
        path: encodeURIComponent(path.join('/')),
      },
      {
        repoName: URLDetails.dirFormatted,
        branchName: URLDetails.branchName,
        path: path,
        tabId,
      }
    );
  };

  const onRenderingChange = renderState => {
    setRendering(renderState);
  };

  const treeItem = tree[tabId];
  return (
    <div className="spantree-tree-list">
      <ul className="spantree-parent-list">
        {Object.keys(treeItem).map(key => (
          <TreeItem
            width={width}
            key={key}
            name={treeItem[key].name}
            isTree={treeItem[key].isTree}
            path={treeItem[key].path}
            children={treeItem[key].children}
            open={openDirectory}
            close={closeDirectory}
            remainingURL={URLDetails.baseRemovedURL}
            onRenderingChange={onRenderingChange}
            setClicked={setClicked}
            scrolling={scrolling}
            setScrolling={setScrolling}
          />
        ))}
      </ul>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    tree: state.tree,
    width: state.width,
    clicked: state.clicked,
  };
};

const mapDispatchToProps = { getInitialTree, closeDir, setClicked };

export default connect(mapStateToProps, mapDispatchToProps)(TreeList);
