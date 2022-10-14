import { useState, useEffect } from 'react';

/**
 * 是否显示树形结构插件
 */
export function useVisibleTree() {
  const [visible, setVisible] = useState();
 
  useEffect(() => {
    const hasBranchSelectDom =
      ['.qa-branches-select', '.js-project-refs-dropdown']
        .map(selectors => document.querySelector(selectors))
        .filter(Boolean).length > 0;
    const hasNavSidebar = !!document.querySelector('.nav-sidebar');

    setVisible(hasBranchSelectDom && hasNavSidebar);
  }, [window.location.pathname]);

  return visible;
}
