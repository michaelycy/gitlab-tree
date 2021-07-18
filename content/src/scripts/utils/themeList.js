import { EXTENSION_ID, GITLAB_TREE_THEME_LIST } from '../constants';
import { browserKey } from './browser';

const insertCSS = isDisabled => {
  // Insert CSS into Head
  const darkGitlab = document.createElement('link');
  darkGitlab.id = 'gitlab-tree-theme';
  darkGitlab.disabled = isDisabled;
  darkGitlab.rel = 'stylesheet';
  darkGitlab.type = 'text/css';
  darkGitlab.href = `${browserKey()}-extension://${EXTENSION_ID}/libs/gitlab-dark.css`;
  document.querySelector('head').appendChild(darkGitlab);
};

// eslint-disable-next-line import/prefer-default-export
export const switchTheme = () => {
  const domain = window.location.origin;
  const themeList = JSON.parse(localStorage.getItem(GITLAB_TREE_THEME_LIST)) || {};

  if (domain in themeList) {
    const alteredValue = !themeList[domain];
    themeList[domain] = alteredValue;
    if (document.getElementById('gitlab-tree-theme') === null) {
      insertCSS(!alteredValue);
    } else {
      document.getElementById('gitlab-tree-theme').disabled = !alteredValue;
    }
  } else {
    themeList[domain] = true;
    if (document.getElementById('gitlab-tree-theme') === null) {
      insertCSS(false);
    } else {
      document.getElementById('gitlab-tree-theme').disabled = false;
    }
  }

  localStorage.setItem(GITLAB_TREE_THEME_LIST, JSON.stringify(themeList));
};
