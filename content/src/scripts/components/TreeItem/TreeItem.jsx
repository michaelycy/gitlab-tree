import React, { useEffect, useState, useContext } from 'react';

import { OptionsContext } from '../../contexts/OptionsContext';
import { fetchURLDetails } from '../../utils/url';
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
      let activeIconName = remainingURL.split('/')[0];
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
    } else {
      return { urlRemaining: '', isItemActive };
    }
  };

  const tryTreeItemActiveAfterReload = () => {
    let isItemActive = false;

    if (remainingURL.length !== 0) {
      let activeIconName = remainingURL.split('/')[0];
      let urlRemaining = remainingURL.substring(activeIconName.length + 1);

      if (decodeURIComponent(activeIconName) === name) {
        if (urlRemaining.length === 0) {
          isItemActive = true;
        }
      } else {
        urlRemaining = '';
      }
      return { urlRemaining, isItemActive };
    } else {
      return { urlRemaining: '', isItemActive };
    }
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
  }, []);

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
  }, [opening]);

  return (
    <li>
      <div
        className={opening ? 'spantree-tree-element opening' : 'spantree-tree-element'}
        onClick={handleClick}>
        <div
          className={
            treeItemActive.isItemActive
              ? 'spantree-full-width-row spantree-active-row'
              : 'spantree-full-width-row'
          }></div>
        <div className='spantree-tree-icon'>
          {isTree ? (
            isTree.isOpen ? (
              <i className='tree-arrow-down-icon spantree-arrow' />
            ) : (
              <i className='tree-arrow-right-icon spantree-arrow' />
            )
          ) : null}
        </div>
        <div className='spantree-file-icon'>
          <i className={fileIcons.getClassWithColor(name, isTree)} />
        </div>
        <div className='spantree-item-name'>{name}</div>
      </div>
      {isTree && isTree.isOpen && (
        <ul className='spantree-child-list'>
          {Object.keys(children).map((key) => (
            <TreeItem
              key={key}
              width={width}
              name={children[key].name}
              isTree={children[key].isTree}
              path={children[key].path}
              children={children[key].children}
              open={open}
              close={close}
              remainingURL={treeItemActive.urlRemaining}
              onRenderingChange={onRenderingChange}
              setClicked={setClicked}
              scrolling={scrolling}
              setScrolling={setScrolling}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default TreeItem;
