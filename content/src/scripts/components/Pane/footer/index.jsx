import React from 'react';

import HalfSvg from '../../../svgs/Half';
import { switchTheme } from '../../../utils/themeList';

import './index.css';

export default () => (
  <div className="gitlab-tree-pane-footer">
    <span
      onClick={() => {
        switchTheme();
        // setTimeout(() => {
        //   setHeaderStyle(getHeaderStyles(options));
        // }, 100);
      }}
      className="gitlab-tree-close-button">
      <HalfSvg />
    </span>
  </div>
);
