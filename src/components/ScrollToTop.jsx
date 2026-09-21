import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll the main window to the top
    window.scrollTo(0, 0);

    // Reset scroll positions of any scrollable container elements (e.g. DashboardLayout main panel)
    const scrollContainers = document.querySelectorAll('.overflow-y-auto, main');
    scrollContainers.forEach((container) => {
      container.scrollTop = 0;
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
