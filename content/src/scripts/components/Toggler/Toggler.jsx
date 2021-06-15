import React from 'react';
import RightSvg from '../../svgs/Right';

import './styles.css';

function Toggle({ pinned, handleClick }) {
  return (
    <div className='spantree-toggler' onClick={handleClick}>
      Gitlab-Tree
      <RightSvg className='right-icon' />
    </div>
  );
}

export default Toggle;
