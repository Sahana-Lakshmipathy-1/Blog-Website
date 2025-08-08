import { useEffect } from 'react';
// hasMore checks if the data is available or not
// loadMore is the function that calls to load More

const useInfiniteScroll = (loadMore, hasMore = true, deps = []) => {
  useEffect(() => {
    // This function is called every time the user scrolls
    const handleScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;

      // If we're near the bottom and there is more to load
      if (nearBottom && hasMore) {
        loadMore(); // Trigger loading of more content
      }
    };

    // Attach the scroll event listener to the window
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener when component unmounts or dependencies change
    return () => window.removeEventListener('scroll', handleScroll);
    
  }, [hasMore, loadMore, ...deps]);
};

export default useInfiniteScroll;
