import { useEffect, useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { colors } from "./tokens";

export function AmbientBackground({ reducedMotion }: { reducedMotion: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    let raf: number | null = null;
    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        if (wrapRef.current) wrapRef.current.style.transform = `translateY(${window.scrollY * 0.05}px)`;
        raf = null;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reducedMotion]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div ref={wrapRef}>
        <div
          className="absolute w-[700px] h-[700px] rounded-full"
          style={{ background: "rgba(30,42,94,0.05)", filter: "blur(140px)", top: "-14%", left: "-10%" }}
        />
        <div
          className="absolute w-[560px] h-[560px] rounded-full"
          style={{ background: "rgba(31,122,92,0.05)", filter: "blur(140px)", bottom: "-8%", right: "-8%" }}
        />
      </div>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(20,23,26,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(20,23,26,0.028) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "linear-gradient(180deg, black, transparent 70%)",
          WebkitMaskImage: "linear-gradient(180deg, black, transparent 70%)",
        }}
      />
    </div>
  );
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="fixed top-0 left-0 right-0 h-[2.5px] z-[60] bg-[#E2E4E1]/80">
      <motion.div
        className="h-full origin-left"
        style={{ scaleX, background: colors.cobalt }}
      />
    </div>
  );
}
