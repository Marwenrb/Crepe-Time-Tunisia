import { useState } from "react";

/**
 * Returns true if the user has requested reduced motion via the OS setting.
 * Reads the media query once at mount — no event listener overhead.
 */
export function useReducedMotion(): boolean {
  const [reduced] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  return reduced;
}
