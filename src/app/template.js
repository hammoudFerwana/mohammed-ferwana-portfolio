'use client';

import { useState, useEffect } from 'react';

// Module-level flag: persists across client-side route navigations in SPA lifecycle
let isFirstLoad = true;

export default function Template({ children }) {
  // On SSR and initial client load, animate is false (immediate paint, 0 fade delay for hero/LCP)
  // On subsequent client-side navigations, isFirstLoad is false, so newly mounted Template starts with animate = true
  const [animate] = useState(() => !isFirstLoad);

  useEffect(() => {
    isFirstLoad = false;
  }, []);

  return (
    <div className={animate ? 'animate-page-fade motion-reduce:animate-none' : undefined}>
      {children}
    </div>
  );
}
