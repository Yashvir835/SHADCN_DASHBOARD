'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import gsap from 'gsap';

// Define the sequence of pages for navigation.
const pages = [
  '/landingPage',
  '/landingPage/overView',
  '/landingPage/Mission',
  '/landingPage/Programs',
  '/landingPage/Updates'
];

// Threshold (in pixels) for the swipe/wheel gesture so that only intentional large movements are recognized.
const SWIPE_THRESHOLD = 50;
// Buffer used to determine if the user is near the bottom of the container for a downward swipe.
const SCROLL_BUFFER_DOWN = 5;
// Buffer used to check if the container is at the very top.
const SCROLL_BUFFER_UP = 10;

export default function PageTransitionLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number>(0);
  // Flag to prevent starting a new navigation animation while another is in progress.
  const isAnimatingRef = useRef(false);

  /**
   * navigate: Initiates the page transition animation and routes to the target page.
   *
   * @param direction - 'next' for forward navigation, 'prev' for backward navigation.
   */
  const navigate = (direction: 'next' | 'prev') => {
    // Prevent navigation if an animation is already running.
    if (isAnimatingRef.current) return;

    const currentIndex = pages.indexOf(pathname || '');
    if (currentIndex === -1) return;

    // Determine the target page index based on the direction.
    const targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    // If the target index is out of bounds, do not navigate.
    if (targetIndex < 0 || targetIndex >= pages.length) return;

    // Set the flag to indicate that an animation is in progress.
    isAnimatingRef.current = true;
    // Animate the container element before navigation.
    gsap.to(containerRef.current, {
      opacity: 0,
      y: direction === 'next' ? -30 : 30,
      duration: 0.5,
      ease: 'power3.inOut',
      onComplete: () => {
        // After the exit animation completes, navigate to the target route.
        router.push(pages[targetIndex]);
      },
    });
  };

  /**
   * checkDownScrollPosition: Determines whether the container's current scroll position
   * qualifies for triggering a downward (next page) transition.
   *
   * @returns {boolean} - Returns true if the user is near the bottom of the container.
   */
  const checkDownScrollPosition = () => {
    const container = containerRef.current;
    if (!container) return false;

    const { scrollTop, clientHeight, scrollHeight } = container;
    // Return true if the bottom of the visible area is within SCROLL_BUFFER_DOWN of the total scrollable height.
    return scrollTop + clientHeight >= scrollHeight - SCROLL_BUFFER_DOWN;
  };

  /**
   * handleWheel: Processes mouse wheel events (from a laptop trackpad or mouse wheel)
   * to enable page transitions for intentional swipes.
   *
   * For downward scrolls: if the user is near the bottom, navigate to the next page.
   * For upward scrolls: only trigger navigation to the previous page if the container is at the very top.
   *
   * @param e - The WheelEvent triggered by the user's scroll action.
   */
  const handleWheel = (e: WheelEvent) => {
    if (!containerRef.current || isAnimatingRef.current) return;

    // Determine swipe direction based on the deltaY value.
    const direction = e.deltaY > 0 ? 'down' : 'up';
    // Only consider events with a large enough delta to avoid reacting to minor scrolls.
    if (Math.abs(e.deltaY) < SWIPE_THRESHOLD) return;

    const container = containerRef.current;

    if (direction === 'down') {
      // For a downward scroll, trigger navigation only if the user is near the bottom.
      if (checkDownScrollPosition()) {
        e.preventDefault();
        navigate('next');
      }
    } else {
      // For an upward scroll, allow navigation only if the container is at the very top.
      if (container.scrollTop <= SCROLL_BUFFER_UP) {
        e.preventDefault();
        navigate('prev');
      }
    }
  };

  /**
   * handleTouchStart: Captures the starting Y-coordinate when a touch event begins.
   *
   * @param e - The TouchEvent triggered when the user touches the screen.
   */
  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
  };

  /**
   * handleTouchEnd: Processes the touch end event to determine swipe direction and trigger navigation.
   * On mobile, upward swipes always trigger navigation (preventing pull-to-refresh or reload).
   *
   * @param e - The TouchEvent triggered when the user lifts their finger.
   */
  const handleTouchEnd = (e: TouchEvent) => {
    if (!containerRef.current || isAnimatingRef.current) return;

    const touchEnd = e.changedTouches[0].clientY;
    const delta = touchStart - touchEnd;

    // If the swipe distance is less than the threshold, ignore the gesture.
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;

    if (delta > 0) {
      // For a downward swipe, trigger navigation only if the user is near the bottom.
      if (checkDownScrollPosition()) {
        e.preventDefault();
        navigate('next');
      }
    } else {
      // For an upward swipe, always prevent default behavior and navigate to the previous page.
      e.preventDefault();
      navigate('prev');
    }
  };

  /**
   * useEffect: Adds event listeners for wheel and touch events when the component mounts,
   * and cleans them up when the component unmounts or dependencies change.
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Add event listeners for desktop (wheel) and mobile (touch) events.
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchend', handleTouchEnd);

    // Cleanup event listeners when the component unmounts or dependencies change.
    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [touchStart, pathname]);

  /**
   * useEffect: Triggers a fade-in animation for the container element each time the route (pathname) changes.
   * The navigation lock is only released after the animation completes.
   */
  useEffect(() => {
    // Start the fade-in animation. Notice that we do not immediately reset isAnimatingRef;
    // instead, we wait until the animation has completed.
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power3.inOut',
        onComplete: () => {
          // Now that the fade-in is complete, allow scrolling and further navigation.
          isAnimatingRef.current = false;
        }
      }
    );
  }, [pathname]);

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-y-auto">
      {children}
    </div>
  );
}
