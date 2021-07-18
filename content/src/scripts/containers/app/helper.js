export function openTreeExtension(width) {
  document.querySelector('header').style.left = `${width}px`;
  document.querySelector('body').style.marginLeft = `${width}px`;
  document.querySelector('body').style.overflowX = 'auto';

  if (document.querySelector('.nav-sidebar')) {
    document.querySelector('.nav-sidebar').style.left = `${width}px`;
  }
}

export const closeTreeExtension = () => {
  document.querySelector('header').style.left = '0';
  document.querySelector('body').style.marginLeft = '0';
  document.querySelector('body').style.overflowX = '';

  if (document.querySelector('.nav-sidebar')) {
    document.querySelector('.nav-sidebar').style.left = '0';
  }
};
