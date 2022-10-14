import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import Backdrop from '../../backdrop';
import SearchBarResult from './result';
import { getSearchTerms } from '../../../../../../event/src/actions/API';
import { fetchURLDetails } from '../../../utils/url';
import useEventListener from '../../../hooks/use-event-listener';

import './index.css';

function SearchBar({ worker, showSearchBar, setShowSearchBar, searchTerms, options }) {
  const [searchResults, setSearchResults] = useState([]);
  const [searchFor, setSearchFor] = useState('');
  const [activeResult, setActiveResult] = useState(0);
  const [resultsLoading, setResultsLoading] = useState(0);
  const [debounceTimerId, setDebounceTimerId] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const workerCall = () => {
    worker.postMessage({
      searchTerms,
      URLDetails: fetchURLDetails(),
      query: searchFor.replace(/ /g, ''),
    });
  };

  const debouncedWorkerCall = () => {
    if (debounceTimerId) {
      clearTimeout(debounceTimerId);
    } else {
      setResultsLoading(loading => loading + 1);
    }

    setDebounceTimerId(
      setTimeout(() => {
        workerCall();
        setDebounceTimerId(null);
      }, 500)
    );
  };

  const isMac = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'].reduce(
    (accumulator, currentValue) => {
      const { platform } = window.navigator;

      return platform.indexOf(currentValue) !== -1 || accumulator;
    },
    false
  );
  const defaultOptions = { 'auto-theme': false, 'compatibility-mode': true };
  Object.keys(defaultOptions).forEach(key => {
    if (key in options) {
      defaultOptions[key] = options[key];
    }
  });

  useEffect(() => {
    const URLDetails = fetchURLDetails();
    getSearchTerms({
      repoName: URLDetails.dirFormatted,
      branchName: URLDetails.branchName,
      compatibilityMode:
        'compatibility-mode' in defaultOptions && defaultOptions['compatibility-mode'],
    });

    worker.addEventListener('message', event => {
      const searchResultsFromWorker = event.data;
      setSearchResults(searchResultsFromWorker);
      setResultsLoading(rLoading => rLoading - 1);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRedirect = (id, inNewTab) => {
    const { dirFormatted, branchName } = fetchURLDetails();
    let finalURL = null;
    if ('compatibility-mode' in defaultOptions && defaultOptions['compatibility-mode']) {
      finalURL = `${window.location.origin}/${dirFormatted}/blob/${branchName}/${encodeURI(
        searchResults[id]
      )}`;
    } else {
      finalURL = `${window.location.origin}/${dirFormatted}/-/blob/${branchName}/${encodeURI(
        searchResults[id]
      )}`;
    }
    if (inNewTab) {
      window.open(finalURL, '_blank');
      // for overwriting default behavior on Firefox
      window.focus();
    } else {
      window.location.href = finalURL;
    }
  };

  const handleKeyDown = useCallback(
    event => {
      const isActionKey = isMac ? event.metaKey : event.ctrlKey;
      if (isActionKey && (event.key === 'p' || event.key === 'P')) {
        event.preventDefault();
        setShowSearchBar(true);
      } else if (isActionKey && event.key === 'Enter' && showSearchBar) {
        handleRedirect(activeResult, true);
      } else if (event.key === 'Enter' && showSearchBar) {
        handleRedirect(activeResult, false);
      } else if (event.key === 'ArrowUp' && showSearchBar) {
        event.preventDefault();
        setActiveResult(result => (searchResults.length + result - 1) % searchResults.length);
      } else if (event.key === 'ArrowDown' && showSearchBar) {
        event.preventDefault();
        setActiveResult(result => (result + 1) % searchResults.length);
      } else if (event.key === 'Escape' && showSearchBar) {
        setShowSearchBar(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showSearchBar, activeResult, searchResults]
  );

  useEventListener('keydown', handleKeyDown);

  useEffect(() => {
    setResultsLoading(loading => loading + 1);
    workerCall();
  }, [workerCall]);

  useEffect(() => {
    setActiveResult(0);
    debouncedWorkerCall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFor.replace(/ /g, '')]);

  useEffect(() => {
    const activeItem = document.querySelector('.spantree-result-active');
    if (activeItem) {
      activeItem.scrollIntoView({
        behavior: 'auto', // Defines the transition animation.
        block: 'nearest', // Defines vertical alignment.
        inline: 'start', // Defines horizontal alignment.
      });
    }
  }, [activeResult]);

  if (!showSearchBar) return null;

  return (
    <>
      <Backdrop showSearchBar={showSearchBar} setShowSearchBar={setShowSearchBar} />
      <div className="spantree-search">
        <div className="spantree-search-bar">
          <input
            type="text"
            value={searchFor}
            placeholder="🔍  Search in Repository Branch"
            onChange={e => setSearchFor(e.target.value)}
          />
        </div>
        <div
          className={classnames('spantree-search-results', {
            'spantree-results-loading': resultsLoading > 0,
          })}>
          {searchResults.map((resultTerm, index) => (
            <SearchBarResult
              key={index.toString()}
              index={index}
              query={searchFor.replace(/ /g, '')}
              term={resultTerm}
              activeResult={activeResult}
              setActiveResult={setActiveResult}
              resultsLoading={resultsLoading}
              handleRedirect={handleRedirect}
            />
          ))}
        </div>
        <div className="spantree-search-help">
          <span className="spantree-search-help-item">
            <code>
              {isMac ? <span className="spantree-search-help-item-icon">⌘</span> : 'Ctrl'}
              <span> + P</span>
            </code>
            to Search
          </span>
          <span className="spantree-search-help-item">
            <code>{isMac ? 'return' : 'Enter'}</code>
            <span> to Open</span>
          </span>
          <span className="spantree-search-help-item">
            <code>
              {isMac ? <span className="spantree-search-help-item-icon">⌘</span> : 'Ctrl'}
              <span style={{ paddingLeft: 5 }}>{isMac ? 'return' : 'Enter'}</span>
            </code>
            to Open in New Tab
          </span>
        </div>
      </div>
    </>
  );
}

const mapStateToProps = state => ({
  searchTerms: state.searchTerms,
  options: state.options,
});

const mapDispatchToProps = { getSearchTerms };

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
