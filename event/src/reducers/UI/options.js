import { OPTIONS_CHANGED } from '../../types/UI';

const localKey = '__CHROME-EXTENSIONS-SPANTREE-OPTIONS__';
const initialState = JSON.parse(localStorage.getItem(localKey)) || {};

export default (state = initialState, action) => {
  switch (action.type) {
    case OPTIONS_CHANGED:
      localStorage.setItem(localKey, JSON.stringify(action.payload));
      return action.payload;

    default:
      return state;
  }
};
