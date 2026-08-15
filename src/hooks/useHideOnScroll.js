import { useState, useEffect, useRef } from 'react';

const useHideOnScroll = (ref = null, threshold = 50) => {
  const [isVisible, setIsVisible] = useState(true);
  const prevScrollY = useRef(0);
  const accumulatedScroll = useRef(0);

  useEffect(() => {
    const target = ref?.current || window;
    
    const getScrollY = () => {
      if (target === window) return window.scrollY;
      return target.scrollTop;
    };

    const handleScroll = () => {
      const currentScrollY = getScrollY();
      const diff = currentScrollY - prevScrollY.current;
      
      // Update prevScrollY
      prevScrollY.current = currentScrollY;

      // When at top, always visible
      if (currentScrollY <= 0) {
          setIsVisible(true);
          accumulatedScroll.current = 0;
          return;
      }

      // Reset accumulation if direction changes
      if ((diff > 0 && accumulatedScroll.current < 0) || (diff < 0 && accumulatedScroll.current > 0)) {
          accumulatedScroll.current = 0;
      }

      accumulatedScroll.current += diff;

      if (accumulatedScroll.current > threshold) {
          setIsVisible(false);
          accumulatedScroll.current = 0;
      } else if (accumulatedScroll.current < -threshold) {
          setIsVisible(true);
          accumulatedScroll.current = 0;
      }
    };

    // Need initial scroll position
    prevScrollY.current = getScrollY();

    target.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      target.removeEventListener('scroll', handleScroll);
    };
  }, [ref, threshold]);

  return isVisible;
};

export default useHideOnScroll;
