import { useEffect, useRef } from 'react';

export function useScrollAnimation() {
  const elementsRef = useRef<HTMLElement[]>([]);

  const registerElement = (el: HTMLElement | null) => {
    if (el && !elementsRef.current.includes(el)) {
      elementsRef.current.push(el);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target); // Trigger once
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    elementsRef.current.forEach((el) => {
      if (el) {
        // Initial state
        el.classList.add('reveal-on-scroll');
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return registerElement;
}
