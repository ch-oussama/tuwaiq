"use client";

import { ReactLenis } from 'lenis/react';
import { ReactNode } from 'react';

export function LenisProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.5,
        smoothWheel: true,
        orientation: 'vertical',
        gestureOrientation: 'vertical',
      }}
    >
      {children}
    </ReactLenis>
  );
}
