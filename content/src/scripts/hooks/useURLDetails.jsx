import { useEffect, useState } from 'react';
import { fetchURLDetails } from '../utils/url';

// eslint-disable-next-line import/prefer-default-export
export const useURLDetails = () => {
  const [detail, setDetail] = useState(fetchURLDetails());

  useEffect(() => {
    const data = fetchURLDetails();
    setDetail(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.pathname]);

  return detail;
};
