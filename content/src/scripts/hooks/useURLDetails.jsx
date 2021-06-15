import { useEffect, useState } from 'react';
import { fetchURLDetails } from '../utils/url';

export const useURLDetails = () => {
  const [detail, setDetail] = useState(fetchURLDetails());

  useEffect(() => {
    const data = fetchURLDetails();
    setDetail(data);
  }, [window.location.pathname]);

  return detail;
};
