import axiosOriginal from 'axios';

import * as types from '../../types/API';
import store from '../../../../content/src/scripts';
import axios from '../../../axios';

export const getInitialTree = (id, params, reducerDetails) => {
  const url = `${id}/repository/tree`;

  axios
    .get(url, { params: { ...params, per_page: 10000 } })
    .then(res => {
      store.dispatch({
        type: types.FETCH_TREE,
        payload: res.data,
        reducerDetails,
      });
    })
    .catch(_err => {});
};

export const openDir = (id, path, params, reducerDetails) => {
  store.dispatch({
    type: types.OPEN_DIR,
    payload: path,
    reducerDetails,
  });

  const url = `${id}/repository/tree?per_page=10000`;

  axios
    .get(url, { params: { ...params, per_page: 10000 } })
    .then(res => {
      store.dispatch({
        type: types.UPDATE_TREE,
        payload: res.data,
        reducerDetails,
      });
    })
    .catch(_err => {});
};

export const closeDir = (path, reducerDetails) => {
  store.dispatch({
    type: types.CLOSE_DIR,
    payload: path,
    reducerDetails,
  });
};

export const getSearchTerms = reducerDetails => {
  let url = `${window.location.origin}/${reducerDetails.repoName}/`;
  if (!reducerDetails.compatibilityMode) {
    url += '-/';
  }
  url += `files/${reducerDetails.branchName}?format=json`;

  axiosOriginal
    .get(url)
    .then(res => {
      store.dispatch({
        type: types.FETCH_SEARCH_TERMS,
        payload: res.data,
        reducerDetails,
      });
    })
    .catch(_err => {});
};
