// eslint-disable-next-line import/prefer-default-export
export const getHeaderStyles = options => {
  if ('auto-theme' in options && options['auto-theme']) {
    const header = {};
    const headerDom = document.querySelector('header');
    const computedStyle = window.getComputedStyle(headerDom);
    const fetchedValue = computedStyle.getPropertyValue('background-color');
    const height = computedStyle.getPropertyValue('height');
    const minHeight = computedStyle.getPropertyValue('min-height');

    if (fetchedValue && fetchedValue.length > 0) {
      header.backgroundColor = fetchedValue;
    }

    if (height) {
      header.height = height;
    }

    if (minHeight) {
      header.minHeight = minHeight;
    }

    return header;
  }

  return {};
};
