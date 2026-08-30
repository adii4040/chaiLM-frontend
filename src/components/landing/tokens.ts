import { useMemo, useEffect, useRef } from "react";

/* ------------------------------------------------------------------ */
/* Design tokens — "Exhibit": light, ledger/paper, restrained color   */
/* ------------------------------------------------------------------ */
export const colors = {
  paper: "#F5F6F4",
  surface: "#FFFFFF",
  surface2: "#F0F1EE",
  hairline: "#E2E4E1",
  hairlineStrong: "#CBCFC9",
  ink: "#14171A",
  slate: "#5C6169",
  slateFaint: "#93968F",
  cobalt: "#1E2A5E",
  cobaltSoft: "rgba(30,42,94,0.07)",
  cobaltBorder: "rgba(30,42,94,0.22)",
  verified: "#1F7A5C",
  verifiedSoft: "rgba(31,122,92,0.09)",
  verifiedBorder: "rgba(31,122,92,0.35)",
};

export const serif = { fontFamily: "'Fraunces', ui-serif, Georgia, serif" };
export const sans = { fontFamily: "'Inter', system-ui, sans-serif" };
export const mono = { fontFamily: "'JetBrains Mono', ui-monospace, monospace" };
export const EASE = [0.16, 1, 0.3, 1] as const;

export const clamp1 = { whiteSpace: "nowrap" as const, overflow: "hidden" as const, textOverflow: "ellipsis" as const };
export const clamp2 = { display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" as const };
export const clamp3 = { display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" as const, overflow: "hidden" as const };
export const WAVE_HEIGHTS = [40, 70, 55, 90, 60, 35, 80, 50, 65, 45, 75, 55];

export function usePrefersReducedMotion() {
  return useMemo(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
}

export function useInterval(callback: () => void, delay: number | null, enabled: boolean) {
  const savedRef = useRef(callback);
  useEffect(() => {
    savedRef.current = callback;
  });
  useEffect(() => {
    if (!enabled || delay == null) return;
    const id = setInterval(() => savedRef.current(), delay);
    return () => clearInterval(id);
  }, [delay, enabled]);
}

export function spotlightMove(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  el.style.setProperty("--my", `${e.clientY - rect.top}px`);
}
