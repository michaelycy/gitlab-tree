import React from 'react';

function Repo({ style, className }) {
  return (
    <svg
      className={className}
      width="1em"
      height="1em"
      fill="currentColor"
      viewBox="0 0 12 16"
      style={style}>
      <path d="M4 9H3V8h1v1zm0-3H3v1h1V6zm0-2H3v1h1V4zm0-2H3v1h1V2zm8-1v12c0 .55-.45 1-1 1H6v2l-1.5-1.5L3 16v-2H1c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h10c.55 0 1 .45 1 1zm-1 10H1v2h2v-1h3v1h5v-2zm0-10H2v9h9V1z" />
    </svg>
  );
}

export default Repo;
