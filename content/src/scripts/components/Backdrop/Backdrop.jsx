import React from 'react';

import './styles.css';

function Backdrop({ showSearchBar, setShowSearchBar }) {
  return showSearchBar ? (
    <div className="spantree-backdrop" onClick={() => setShowSearchBar(false)} />
  ) : null;
}

export default Backdrop;
