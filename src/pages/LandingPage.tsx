import React from "react";
import {
  usePrefersReducedMotion,
  colors,
  sans,
  AmbientBackground,
  ScrollProgress,
  LandingNav,
  LandingHero,
  HowItWorks,
  RetrievalPipeline,
  ComparisonMatrix,
  InteractiveDemo,
  TechStack,
  FAQ,
  LandingFooter,
} from "../components/landing";

export default function LandingPage() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div
      style={{
        ...sans,
        background: colors.paper,
        color: colors.ink,
        minHeight: "100vh",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        @keyframes pulseDot { 0%,100% { transform: scale(1); opacity: 1;} 50% { transform: scale(1.5); opacity: 0.55;} }
        .pulse-dot { animation: pulseDot 2s ease-in-out infinite; }
        @keyframes stampIn { 0% { transform: scale(1.35); opacity: 0; } 70% { transform: scale(0.97); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        .stamp-in { animation: stampIn 0.4s cubic-bezier(0.16,1,0.3,1) both; }
        .exhibit-stamp { transition: transform 160ms cubic-bezier(0.16,1,0.3,1); }
        .exhibit-stamp:hover { transform: scale(1.04); }
        .exhibit-notch { width: 4px; height: 4px; border-radius: 50%; background: currentColor; opacity: 0.55; flex-shrink: 0; }
        @keyframes marquee { from { transform: translateX(0);} to { transform: translateX(-50%);} }
        .marquee-track { animation: marquee 28s linear infinite; }
        .marquee-track:hover { animation-play-state: paused; }
        @keyframes waveBounce { 0%,100% { transform: scaleY(0.35);} 50% { transform: scaleY(1);} }
        .waveform-bar { transform-origin: center; animation: waveBounce 1.1s ease-in-out infinite; }
        .spotlight-card { position: relative; }
        .spotlight-card::before {
          content: ''; position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
          background: radial-gradient(220px circle at var(--mx,50%) var(--my,50%), rgba(30,42,94,0.06), transparent 70%);
          opacity: 0; transition: opacity 0.3s ease;
        }
        .spotlight-card:hover::before { opacity: 1; }
        ::selection { background: rgba(31,122,92,0.22); }
      `}</style>

      {/* Ambient background & scroll progress */}
      <AmbientBackground reducedMotion={reducedMotion} />
      <ScrollProgress />

      {/* Page Sections */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <LandingNav reducedMotion={reducedMotion} />
        <LandingHero reducedMotion={reducedMotion} />
        <HowItWorks reducedMotion={reducedMotion} />
        <RetrievalPipeline reducedMotion={reducedMotion} />
        <ComparisonMatrix reducedMotion={reducedMotion} />
        <InteractiveDemo reducedMotion={reducedMotion} />
        <TechStack reducedMotion={reducedMotion} />
        <FAQ reducedMotion={reducedMotion} />
        <LandingFooter />
      </div>
    </div>
  );
}
