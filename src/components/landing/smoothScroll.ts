import { animate } from "framer-motion";
import { EASE } from "./tokens";

/**
 * Smoothly scrolls to a target Y position or element selector using Framer Motion spring / easing animation.
 */
export function framerSmoothScrollTo(target: string | number, offset: number = 80) {
  if (typeof window === "undefined") return;

  let targetY = 0;

  if (typeof target === "number") {
    targetY = target;
  } else if (typeof target === "string") {
    if (!target.startsWith("#")) return;
    const element = document.querySelector(target) as HTMLElement | null;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    targetY = window.scrollY + rect.top - offset;
  }

  const startY = window.scrollY;

  // Animate window scrollY with Framer Motion spring physics
  animate(startY, targetY, {
    duration: 0.85,
    ease: EASE,
    onUpdate: (latest) => {
      window.scrollTo(0, latest);
    },
  });
}
