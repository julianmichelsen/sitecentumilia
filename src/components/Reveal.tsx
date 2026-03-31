'use client';

import { useEffect, useRef, useState } from 'react';

export default function Reveal({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${isVisible ? 'reveal-active' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
