import React, { useEffect, useState, useContext } from 'react';
import classnames from 'classnames';
import { OptionsContext } from '../../contexts/OptionsContext';
import { useURLDetails } from '../../hooks/useURLDetails';
import fileIcons from '../../utils/file-icons';

import './styles.css';

function TreeItem({
  width,
  name,
  isTree,
  path,
  close,
  open,
  children,
  remainingURL,
  onRenderingChange,
  setClicked,
  scrolling,
  setScrolling,
}) {
  const [opening, setOpening] = useState(false);
  const { options } = useContext(OptionsContext);
  const URLDetails = useURLDetails();

  const handleClick = () => {
    if (isTree) {
      if (isTree.isOpen) {
        close(path);
      } else {
        open(path);
      }
    } else {
      setClicked(true);
      const { branchName, dirFormatted } = URLDetails;

      if ('compatibility-mode' in options && options['compatibility-mode']) {
        window.location.href = `${
          window.location.origin
        }/${dirFormatted}/blob/${branchName}/${path.join('/')}`;
      } else {
        window.location.href = `${
          window.location.origin
        }/${dirFormatted}/-/blob/${branchName}/${path.join('/')}`;
      }
    }
  };

  const tryTreeItemActiveBeforeReload = () => {
    let isItemActive = false;
    if (remainingURL.length !== 0) {
      const activeIconName = remainingURL.split('/')[0];
      let urlRemaining = remainingURL.substring(activeIconName.length + 1);

      if (decodeURIComponent(activeIconName) === name) {
        if (isTree && !isTree.isOpen) {
          isTree.isOpen = true;
          open(path);
          setOpening(true);
        }
        if (urlRemaining.length === 0) {
          isItemActive = true;
          onRenderingChange(false);
          setClicked(false);
        }
      } else {
        urlRemaining = '';
      }
      return { urlRemaining, isItemActive };
    }
    return { urlRemaining: '', isItemActive };
  };

  const tryTreeItemActiveAfterReload = () => {
    let isItemActive = false;

    if (remainingURL.length !== 0) {
      const activeIconName = remainingURL.split('/')[0];
      let urlRemaining = remainingURL.substring(activeIconName.length + 1);

      if (decodeURIComponent(activeIconName) === name) {
        if (urlRemaining.length === 0) {
          isItemActive = true;
        }
      } else {
        urlRemaining = '';
      }
      return { urlRemaining, isItemActive };
    }
    return { urlRemaining: '', isItemActive };
  };

  let treeItemActive = null;
  if (URLDetails.baseRemovedURL.length === 0) {
    treeItemActive = tryTreeItemActiveBeforeReload();
  } else {
    treeItemActive = tryTreeItemActiveAfterReload();
  }

  useEffect(() => {
    if (treeItemActive.isItemActive) {
      setOpening(true);
    }
  }, [treeItemActive.isItemActive]);

  useEffect(() => {
    if (opening && scrolling) {
      const treeList = document.querySelector('.spantree-tree-list');
      const openingItem = document.querySelector('.opening');
      document
        .querySelector('.spantree-tree-list')
        .scrollTo(openingItem.offsetLeft - 25, openingItem.offsetTop - treeList.clientHeight / 2);
      setOpening(false);
      if (treeItemActive.isItemActive) {
        setScrolling(false);
      }
    }
  }, [opening, scrolling, setScrolling, treeItemActive.isItemActive]);

  return (
    <li>
      <div
        className={opening ? 'spantree-tree-element opening' : 'spantree-tree-element'}
        onClick={handleClick}>
        <div
          className={classnames('spantree-full-width-row', {
            'spantree-active-row': treeItemActive.isItemActive,
          })}
        />
        <div className="spantree-tree-icon">
          {isTree ? (
            <i
              className={classnames('spantree-arrow', {
                'tree-arrow-down-icon': isTree.isOpen,
                'tree-arrow-right-icon': !isTree.isOpen,
              })}
            />
          ) : null}
        </div>
        <div className="spantree-file-icon">
          <i className={fileIcons.getClassWithColor(name, isTree)} />
        </div>
        <div className="spantree-item-name">{name}</div>
      </div>
      {isTree && isTree.isOpen && (
        <ul className="spantree-child-list">
          {Object.keys(children).map(key => (
            <TreeItem
              key={key}
              width={width}
              name={children[key].name}
              isTree={children[key].isTree}
              path={children[key].path}
              open={open}
              close={close}
              remainingURL={treeItemActive.urlRemaining}
              onRenderingChange={onRenderingChange}
              setClicked={setClicked}
              scrolling={scrolling}
              setScrolling={setScrolling}>
              {children[key].children}
            </TreeItem>
          ))}
        </ul>
      )}
    </li>
  );
}

export default TreeItem;
