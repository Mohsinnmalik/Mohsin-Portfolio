"use client";

import { useState, useEffect } from "react";

/**
 * Single source of truth for mobile detection across all 3D components.
 * Detects mobile using window.innerWidth < 768.
 *
 * On mobile:
 *  - Disable post-processing
 *  - Disable mouse parallax
 *  - Force pixelRatio to 1
 *  - Force frameloop to "demand" always
 *
 * On desktop:
 *  - Full post-processing
 *  - Lerped mouse parallax
 *  - frameloop switches via IntersectionObserver
 */
export function useMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check(); // Run immediately on mount
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}
