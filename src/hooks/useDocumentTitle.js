import { useEffect } from 'react';

export const useDocumentTitle = (title) => {
  useEffect(() => {
    const originalTitle = document.title;
    if (title) {
      document.title = `${title} | E-Commerce`;
    } else {
      document.title = 'E-Commerce | Shop Smarter. Live Better.';
    }

    return () => {
      document.title = originalTitle;
    };
  }, [title]);
};

export default useDocumentTitle;
