import { useEffect } from 'react';


const useInfiniteScroll = (loadMore, hasMore = true, deps = []) => {
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
        hasMore
      ) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loadMore, ...deps]);
};

export default useInfiniteScroll;
