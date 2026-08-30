import { useState, useEffect, useRef, useMemo } from "react";
import {
  Layers,
  Video,
  ShieldCheck,
  ArrowRight,
  PlayCircle,
  Database,
  Cpu,
  Cloud,
  FileText,
  Sparkles,
  HelpCircle,
  Headphones,
  Share2,
  BookOpen,
  CheckCircle2,
  Globe2,
  GitBranch,
  Plus,
  Minus,
  GraduationCap,
  Microscope,
  Code2,
  Mic2,
  Briefcase,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Design tokens — "Exhibit": light, ledger/paper, restrained color   */
/* ------------------------------------------------------------------ */
const colors = {
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

const serif = { fontFamily: "'Fraunces', ui-serif, Georgia, serif" };
const sans = { fontFamily: "'Inter', system-ui, sans-serif" };
const mono = { fontFamily: "'JetBrains Mono', ui-monospace, monospace" };
const EASE = "cubic-bezier(0.16,1,0.3,1)";
const clamp1 = { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" };
const clamp2 = { display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" };
const clamp3 = { display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" };
const WAVE_HEIGHTS = [40, 70, 55, 90, 60, 35, 80, 50, 65, 45, 75, 55];

/* ------------------------------------------------------------------ */
/* Hooks                                                               */
/* ------------------------------------------------------------------ */
function usePrefersReducedMotion() {
  return useMemo(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
}

function useReveal(threshold = 0.2) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function useInterval(callback, delay, enabled) {
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

function spotlightMove(e) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  el.style.setProperty("--my", `${e.clientY - rect.top}px`);
}

/* ------------------------------------------------------------------ */
/* Shared UI atoms                                                     */
/* ------------------------------------------------------------------ */
function MagneticButton({ href = "#", children, className = "", style: styleProp = {}, reducedMotion, ...props }) {
  const ref = useRef(null);
  function onMouseMove(e) {
    if (reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    ref.current.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  }
  function onMouseLeave() {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  }
  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-transform duration-150 ${className}`}
      style={{ willChange: "transform", transitionTimingFunction: EASE, ...styleProp }}
      {...props}
    >
      {children}
    </a>
  );
}

function Pill({ children, style, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${className}`}
      style={{ border: `1px solid ${colors.hairlineStrong}`, color: colors.slate, background: colors.surface, ...style }}
    >
      {children}
    </span>
  );
}

/* The signature element: every citation renders as an exhibit tab / stamp. */
function ExhibitStamp({ children, pulse, small }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[4px] font-semibold exhibit-stamp ${small ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"} ${pulse ? "stamp-in" : ""}`}
      style={{ ...mono, color: colors.verified, background: colors.verifiedSoft, border: `1px solid ${colors.verifiedBorder}` }}
    >
      <span className="exhibit-notch" aria-hidden="true" />
      {children}
    </span>
  );
}

function SectionEyebrow({ children }) {
  return (
    <p className="text-xs font-semibold tracking-[0.18em] mb-3" style={{ ...mono, color: colors.slateFaint }}>
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Ambient / chrome                                                    */
/* ------------------------------------------------------------------ */
function AmbientBackground({ reducedMotion }) {
  const wrapRef = useRef(null);
  useEffect(() => {
    if (reducedMotion) return;
    let raf = null;
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

function ScrollProgress() {
  const barRef = useRef(null);
  useEffect(() => {
    let raf = null;
    function update() {
      const scrollTop = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const pct = height > 0 ? (scrollTop / height) * 100 : 0;
      if (barRef.current) barRef.current.style.width = pct + "%";
      raf = null;
    }
    function onScroll() {
      if (!raf) raf = requestAnimationFrame(update);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-[60]" style={{ background: colors.hairline }}>
      <div ref={barRef} className="h-full" style={{ width: "0%", background: colors.cobalt }} />
    </div>
  );
}

function NavLink({ children, href }) {
  return (
    <a href={href} className="relative group py-1 text-sm" style={{ color: colors.slate }}>
      <span className="group-hover:text-current transition-colors" style={{ color: "inherit" }}>{children}</span>
      <span
        className="absolute left-0 -bottom-0.5 h-px w-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
        style={{ background: colors.cobalt }}
      />
    </a>
  );
}

function Nav({ reducedMotion }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur" style={{ background: "rgba(245,246,244,0.82)", borderBottom: `1px solid ${colors.hairline}` }}>
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2 text-lg font-bold" style={serif}>
          chai<span style={{ color: colors.verified }}>LM</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <NavLink href="#how">How It Works</NavLink>
          <NavLink href="#pipeline">Retrieval Pipeline</NavLink>
          <NavLink href="#compare">Comparison</NavLink>
          <NavLink href="#faq">FAQ</NavLink>
        </nav>
        <div className="flex items-center gap-4">
          <a href="#" className="text-sm hidden sm:inline hover:opacity-70 transition-opacity" style={{ color: colors.slate }}>Sign In</a>
          <MagneticButton href="#" reducedMotion={reducedMotion} style={{ background: colors.cobalt, color: "#fff", padding: "0.5rem 1.1rem" }}>
            Get Started <ArrowRight size={14} />
          </MagneticButton>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                 */
/* ------------------------------------------------------------------ */
const HEADLINE = [
  { text: "Turn" }, { text: "any" }, { text: "video," }, { text: "PDF," }, { text: "or" }, { text: "article" },
  { text: "into", accent: false }, { text: "active", accent: true }, { text: "intelligence.", accent: true },
];

const STUDIO_ITEMS = [
  {
    id: "quiz",
    type: "Quiz",
    icon: HelpCircle,
    title: "Auto-Generated Knowledge Quiz",
    sourceType: "pdf",
    difficulty: "Medium",
    meta: "8 questions",
    preview: {
      question: "Which mechanism allows a model to weigh the relevance of different input tokens?",
      options: ["Attention", "Pooling", "Dropout", "Normalization"],
      correct: 0,
      explanation: "Attention assigns learned weights across tokens, letting the model focus on the most relevant context.",
    },
  },
  {
    id: "audio",
    type: "Audio Overview",
    icon: Headphones,
    title: "Two-Host Podcast Breakdown",
    sourceType: "video",
    difficulty: null,
    meta: "~18 min · 24 exchanges",
    preview: {
      dialogue: [
        { speaker: "Host A", tone: "enthusiastic", text: "This source makes a pretty bold claim right out of the gate — let's unpack it." },
        { speaker: "Host B", tone: "analytical", text: "Right, and the supporting evidence actually holds up when you dig into it." },
      ],
    },
  },
  {
    id: "mindmap",
    type: "Mind Map",
    icon: Share2,
    title: "Visual Concept Map",
    sourceType: "video",
    difficulty: null,
    meta: "6 branches",
    preview: {
      root: "Core Topic",
      branches: [
        { label: "Background & Context", sub: ["Origins", "Key Definitions"] },
        { label: "Key Mechanism", sub: ["How It Works", "Why It Matters"] },
      ],
    },
  },
  {
    id: "flashcards",
    type: "Flashcards",
    icon: Layers,
    title: "Spaced-Repetition Flashcard Deck",
    sourceType: "pdf",
    difficulty: "Easy",
    meta: "12 cards",
    preview: {
      front: "What problem does this section's core method solve?",
      back: "A concise, source-grounded definition — generated automatically for quick recall.",
      hint: "Think about the limitation of the previous approach.",
    },
  },
  {
    id: "studyguide",
    type: "Study Guide",
    icon: BookOpen,
    title: "Structured Study Guide",
    sourceType: "pdf",
    difficulty: null,
    meta: "6 key themes",
    preview: {
      summary: "An organized breakdown of every major theme, argument, and supporting detail from your source — ready to review before an exam or meeting.",
      takeaway: "The strongest supporting evidence appears in the middle third of the source.",
      glossary: { term: "Key Term", def: "A concise definition pulled straight from context." },
    },
  },
];

function renderPreview(item) {
  switch (item.id) {
    case "quiz":
      return (
        <div className="space-y-1.5">
          <p className="text-xs mb-2" style={{ color: colors.slate, ...clamp2 }}>{item.preview.question}</p>
          {item.preview.options.map((opt, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-md"
              style={{
                background: i === item.preview.correct ? colors.verifiedSoft : colors.surface2,
                border: `1px solid ${i === item.preview.correct ? colors.verifiedBorder : colors.hairline}`,
                color: i === item.preview.correct ? colors.verified : colors.slate,
              }}
            >
              {i === item.preview.correct ? <CheckCircle2 size={12} style={{ flexShrink: 0 }} /> : <span className="w-3 text-center flex-shrink-0">{String.fromCharCode(65 + i)}</span>}
              <span style={clamp1}>{opt}</span>
            </div>
          ))}
          <div className="flex items-start gap-1.5 pt-1 mt-1" style={{ borderTop: `1px dashed ${colors.hairline}` }}>
            <span className="text-xs font-semibold flex-shrink-0" style={{ color: colors.cobalt }}>Why:</span>
            <span className="text-xs" style={{ color: colors.slateFaint, ...clamp2 }}>{item.preview.explanation}</span>
          </div>
        </div>
      );
    case "audio":
      return (
        <div className="flex flex-col gap-2.5 h-full justify-center">
          {item.preview.dialogue.map((d, i) => (
            <div key={i} className="flex items-start gap-2">
              <span
                className="text-xs font-semibold px-1.5 py-0.5 rounded flex-shrink-0"
                style={{ background: i === 0 ? colors.cobaltSoft : colors.verifiedSoft, color: i === 0 ? colors.cobalt : colors.verified }}
              >
                {d.speaker}
              </span>
              <p className="text-xs leading-relaxed" style={{ color: colors.slate, ...clamp2 }}>{d.text}</p>
            </div>
          ))}
          <div className="flex items-end justify-center gap-1 h-6 mt-1">
            {WAVE_HEIGHTS.slice(0, 10).map((h, i) => (
              <span
                key={i}
                className="waveform-bar"
                style={{ width: 3, borderRadius: 2, height: `${h}%`, background: colors.hairlineStrong, animationDelay: `${i * 0.08}s` }}
              />
            ))}
          </div>
        </div>
      );
    case "mindmap":
      return (
        <div className="flex flex-col gap-2 h-full">
          <div className="px-3 py-1.5 rounded-lg text-xs font-medium text-center w-full" style={{ ...clamp1, background: colors.cobaltSoft, color: colors.cobalt, border: `1px solid ${colors.hairlineStrong}` }}>
            {item.preview.root}
          </div>
          <div className="flex flex-col gap-2 mt-1">
            {item.preview.branches.map((b, i) => (
              <div key={i}>
                <div className="text-xs font-medium px-2 py-1 rounded-md mb-1" style={{ ...clamp1, background: colors.surface2, border: `1px solid ${colors.hairline}`, color: colors.ink }}>
                  {b.label}
                </div>
                <div className="flex flex-col gap-1 pl-3" style={{ borderLeft: `1px solid ${colors.hairlineStrong}` }}>
                  {b.sub.map((s, j) => (
                    <div key={j} className="text-xs px-2 py-1 rounded" style={{ ...clamp1, background: colors.paper, border: `1px solid ${colors.hairline}`, color: colors.slate }}>
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    case "flashcards":
      return (
        <div className="flex flex-col gap-1.5 h-full justify-center">
          <div className="rounded-lg p-3 text-xs" style={{ background: colors.surface2, border: `1px solid ${colors.hairline}`, color: colors.ink, ...clamp3 }}>{item.preview.front}</div>
          <p className="text-xs italic px-1" style={{ color: colors.slateFaint, ...clamp1 }}>Hint: {item.preview.hint}</p>
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: colors.verifiedSoft }}>
              <ArrowRight size={11} style={{ color: colors.verified, transform: "rotate(90deg)" }} />
            </div>
          </div>
          <div className="rounded-lg p-3 text-xs" style={{ background: colors.surface2, border: `1px solid ${colors.verifiedBorder}`, color: colors.slate, ...clamp3 }}>{item.preview.back}</div>
        </div>
      );
    case "studyguide":
      return (
        <div className="flex flex-col gap-2.5 h-full">
          <p className="text-xs leading-relaxed" style={{ color: colors.slate, ...clamp2 }}>{item.preview.summary}</p>
          <div className="flex items-start gap-1.5 text-xs" style={{ color: colors.verified }}>
            <Sparkles size={12} style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={clamp2}>{item.preview.takeaway}</span>
          </div>
          <div className="text-xs px-2.5 py-1.5 rounded-md" style={{ background: colors.surface2, border: `1px solid ${colors.hairline}` }}>
            <span style={{ color: colors.cobalt, fontWeight: 600 }}>{item.preview.glossary.term}: </span>
            <span style={{ color: colors.slate, ...clamp1 }}>{item.preview.glossary.def}</span>
          </div>
        </div>
      );
    default:
      return null;
  }
}

function StudioCard({ item, active }) {
  const Icon = item.icon;
  const SourceIcon = item.sourceType === "video" ? Video : FileText;
  return (
    <div
      className="h-full rounded-2xl p-6 pl-8 flex flex-col select-none relative"
      style={{
        background: colors.surface,
        border: `1px solid ${active ? colors.hairlineStrong : colors.hairline}`,
        boxShadow: active ? "0 30px 70px -24px rgba(20,23,26,0.28)" : "0 10px 26px -16px rgba(20,23,26,0.16)",
      }}
    >
      {/* folder-tab source marker */}
      <div
        className="absolute left-0 top-6 bottom-6 w-1.5 rounded-r-full"
        style={{ background: item.sourceType === "video" ? colors.cobalt : colors.verified }}
      />
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: colors.cobaltSoft }}>
            <Icon size={17} style={{ color: colors.cobalt }} />
          </div>
          <span className="text-xs font-semibold tracking-wide" style={{ ...mono, color: colors.cobalt }}>{item.type.toUpperCase()}</span>
        </div>
        {item.difficulty && (
          <span className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0" style={{ background: colors.verifiedSoft, color: colors.verified, border: `1px solid ${colors.verifiedBorder}` }}>
            {item.difficulty}
          </span>
        )}
      </div>
      <h4 className="text-base font-semibold mb-4 leading-snug" style={{ ...serif, color: colors.ink, ...clamp2 }}>{item.title}</h4>
      <div className="flex-1 min-h-0">{renderPreview(item)}</div>
      <div className="pt-4 mt-4 text-xs flex items-center gap-1.5" style={{ borderTop: `1px solid ${colors.hairline}`, color: colors.slateFaint }}>
        <SourceIcon size={12} style={{ flexShrink: 0 }} /> {item.meta}
      </div>
    </div>
  );
}

function StudioCoverflow({ reducedMotion }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const N = STUDIO_ITEMS.length;

  useInterval(() => setActive((a) => (a + 1) % N), 2000, !reducedMotion && !paused);

  return (
    <div>
      <div
        className="relative w-full"
        style={{ perspective: 1800, height: 500, overflowX: "hidden", overflowY: "visible" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {STUDIO_ITEMS.map((item, i) => {
          let diff = i - active;
          if (diff > N / 2) diff -= N;
          if (diff < -N / 2) diff += N;
          const abs = Math.abs(diff);
          const sign = Math.sign(diff);
          let translateVw = 0, scale = 1, rotateY = 0, translateZ = 0, blur = 0, opacity = 1;
          if (abs === 0) {
            translateVw = 0; scale = reducedMotion ? 1 : 1.06; rotateY = 0; translateZ = reducedMotion ? 0 : 70; blur = 0; opacity = 1;
          } else if (abs === 1) {
            translateVw = sign * 24; scale = 0.82; rotateY = sign * -28; translateZ = -100; blur = 3; opacity = 0.5;
          } else {
            translateVw = sign * 42; scale = 0.62; rotateY = sign * -30; translateZ = -220; blur = 6; opacity = 0.16;
          }
          return (
            <div
              key={item.id}
              onClick={() => setActive(i)}
              className="absolute top-1/2 left-1/2 cursor-pointer transition-all"
              style={{
                width: 340,
                height: 420,
                transform: `translate(-50%, -50%) translateX(${translateVw}vw) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                filter: `blur(${blur}px)`,
                opacity,
                zIndex: 100 - abs,
                transitionDuration: reducedMotion ? "200ms" : "700ms",
                transitionTimingFunction: EASE,
                pointerEvents: abs > 2 ? "none" : "auto",
              }}
            >
              <StudioCard item={item} active={abs === 0} />
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-2 mt-8 relative z-10">
        {STUDIO_ITEMS.map((item, i) => (
          <button
            key={item.id}
            onClick={() => setActive(i)}
            aria-label={`Show ${item.type}`}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{ width: active === i ? 18 : 6, background: active === i ? colors.cobalt : colors.hairlineStrong }}
          />
        ))}
      </div>
    </div>
  );
}

function Hero({ reducedMotion }) {
  return (
    <section className="relative pt-16 pb-20 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        <Pill style={{ marginBottom: 28 }} className={reducedMotion ? "" : "word-reveal"}>
          <span className={`w-1.5 h-1.5 rounded-full ${reducedMotion ? "" : "pulse-dot"}`} style={{ background: colors.verified }} />
          <span style={mono}>Source-Grounded Multi-Modal Research Engine</span>
        </Pill>

        <h1 className="text-4xl md:text-6xl font-medium tracking-tight leading-[1.08] mb-7 text-left" style={{ ...serif, color: colors.ink }}>
          {HEADLINE.map((w, i) => (
            <span
              key={i}
              className={reducedMotion ? "" : "word-reveal"}
              style={{
                display: "inline-block",
                animationDelay: reducedMotion ? "0ms" : `${120 + i * 80}ms`,
                opacity: reducedMotion ? 1 : undefined,
                ...(w.accent ? { color: colors.verified } : {}),
              }}
            >
              {w.text}&nbsp;
            </span>
          ))}
        </h1>

        <p className={`text-lg max-w-2xl mb-6 leading-relaxed ${reducedMotion ? "" : "word-reveal"}`} style={{ color: colors.slate, animationDelay: reducedMotion ? "0ms" : "760ms" }}>
          ChaiLM ingests your PDFs, YouTube lectures, and web articles into one workspace, then answers with citations you can click — a page number
          <ExhibitStamp small>{" "}Page 12{" "}</ExhibitStamp>
          {" "}or a video timestamp
          <ExhibitStamp small>{" "}00:14:22{" "}</ExhibitStamp>
          {" "}that jumps straight to the source.
        </p>

        <div className={`flex flex-wrap items-center gap-4 mb-16 ${reducedMotion ? "" : "word-reveal"}`} style={{ animationDelay: reducedMotion ? "0ms" : "900ms" }}>
          <MagneticButton href="#" reducedMotion={reducedMotion} style={{ background: colors.cobalt, color: "#fff" }}>
            Get Started for Free <ArrowRight size={16} />
          </MagneticButton>
          <MagneticButton href="#demo" reducedMotion={reducedMotion} style={{ border: `1px solid ${colors.hairlineStrong}`, color: colors.ink }}>
            <PlayCircle size={16} /> Explore Live Sandbox
          </MagneticButton>
        </div>
      </div>

      <div style={{ width: "100vw", marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)" }}>
        <p className="text-center text-xs font-semibold tracking-[0.18em] mb-8" style={{ color: colors.slateFaint, ...mono }}>
          STUDIO · ONE SOURCE, FIVE FORMATS
        </p>
        <StudioCoverflow reducedMotion={reducedMotion} />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* How It Works — 4 numbered exhibit tabs, staggered scroll reveal    */
/* ------------------------------------------------------------------ */
const HOW_IT_WORKS = [
  { n: "01", icon: FileText, title: "Upload any content", desc: "Drop in a PDF research paper, paste a YouTube lecture URL, or insert a web article — all into one workspace." },
  { n: "02", icon: Sparkles, title: "Ask anything", desc: "Type questions in plain English or Hinglish. ChaiLM expands your query from five distinct retrieval angles." },
  { n: "03", icon: ShieldCheck, title: "Verify with citations", desc: "Read concise takeaways backed by clickable video timestamps and PDF page badges." },
  { n: "04", icon: BookOpen, title: "Master in the Studio", desc: "One click generates complete Study Guides, Flashcards, Mind Maps, and Audio Overviews." },
];

function HowItWorks({ reducedMotion }) {
  const [ref, visible] = useReveal(0.15);
  const show = reducedMotion || visible;
  return (
    <section id="how" ref={ref} className="px-6 py-24" style={{ borderTop: `1px solid ${colors.hairline}` }}>
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-14">
          <SectionEyebrow>HOW IT WORKS</SectionEyebrow>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight" style={{ ...serif, color: colors.ink }}>
            From raw source to verified answer, in four steps.
          </h2>
        </div>
        <div className="grid md:grid-cols-4 gap-px" style={{ background: colors.hairline, border: `1px solid ${colors.hairline}` }}>
          {HOW_IT_WORKS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.n}
                className="p-6 transition-all duration-700"
                style={{
                  background: colors.surface,
                  opacity: show ? 1 : 0,
                  transform: show ? "translateY(0)" : "translateY(16px)",
                  transitionDelay: reducedMotion ? "0ms" : `${i * 130}ms`,
                  transitionTimingFunction: EASE,
                }}
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs font-semibold" style={{ ...mono, color: colors.slateFaint }}>{step.n}</span>
                  <Icon size={16} style={{ color: colors.verified }} />
                </div>
                <h3 className="font-semibold mb-2" style={{ color: colors.ink }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: colors.slate }}>{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Retrieval Pipeline — the signature "exhibit chain", sequential      */
/* scroll-triggered reveal of each verification stage                  */
/* ------------------------------------------------------------------ */
const PIPELINE_STAGES = [
  { label: "Query Rewrite", detail: "Reformulates your question for maximal keyword clarity." },
  { label: "Step-Back", detail: "Identifies the higher-level concept behind the question." },
  { label: "Sub-Questions", detail: "Decomposes into 3–5 targeted retrieval angles." },
  { label: "HyDE", detail: "Generates a hypothetical ideal passage to guide vector matching." },
  { label: "RRF Fusion", detail: "Fuses parallel candidates via reciprocal rank fusion." },
  { label: "Cohere Rerank", detail: "Cross-encoder reranking selects the top 5 golden chunks." },
];

function usePipelineReveal(count, reducedMotion) {
  const ref = useRef(null);
  const [step, setStep] = useState(reducedMotion ? count : 0);
  useEffect(() => {
    if (reducedMotion) return;
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          obs.disconnect();
          let i = 0;
          const id = setInterval(() => {
            i += 1;
            setStep(i);
            if (i >= count) clearInterval(id);
          }, 260);
        }
      },
      { threshold: 0.35 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [count, reducedMotion]);
  return [ref, step];
}

function RetrievalPipeline({ reducedMotion }) {
  const [ref, step] = usePipelineReveal(PIPELINE_STAGES.length, reducedMotion);
  return (
    <section id="pipeline" ref={ref} className="px-6 py-24" style={{ borderTop: `1px solid ${colors.hairline}`, background: colors.surface2 }}>
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-14">
          <SectionEyebrow>HOW IT'S VERIFIED</SectionEyebrow>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-3" style={{ ...serif, color: colors.ink }}>
            Every answer survives a six-stage retrieval pipeline before it reaches you.
          </h2>
          <p style={{ color: colors.slate }}>Source-grounded answers, paired with citations so you can verify the underlying evidence yourself.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 md:gap-2">
          {PIPELINE_STAGES.map((s, i) => {
            const revealed = i < step;
            return (
              <div key={s.label} className="flex-1">
                <div
                  className="rounded-lg px-4 py-4 h-full transition-all"
                  style={{
                    background: colors.surface,
                    border: `1px solid ${revealed ? colors.verifiedBorder : colors.hairline}`,
                    opacity: revealed ? 1 : 0.35,
                    transform: revealed ? "scale(1)" : "scale(0.96)",
                    transitionDuration: "420ms",
                    transitionTimingFunction: EASE,
                  }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                      style={{ background: revealed ? colors.verified : colors.hairlineStrong, transitionDuration: "300ms" }}
                    >
                      {revealed && <CheckCircle2 size={12} color="#fff" style={{ display: "block" }} />}
                    </span>
                    <span className="text-xs font-semibold" style={{ ...mono, color: revealed ? colors.verified : colors.slateFaint }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold mb-1" style={{ color: colors.ink }}>{s.label}</h4>
                  <p className="text-xs leading-relaxed hidden md:block" style={{ color: colors.slate }}>{s.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Comparison Matrix — vs Gemini Notebook                              */
/* ------------------------------------------------------------------ */
const COMPARISON_ROWS = [
  { label: "Direct YouTube timestamp seek", chailm: { state: "yes", text: "Native — jumps to cited second" }, other: { state: "partial", text: "Transcript-grounded citations" } },
  { label: "Hinglish / phonetic retrieval", chailm: { state: "yes", text: "Dedicated phonetic-to-Devanagari mapping" }, other: { state: "partial", text: "80+ languages; no equivalent documented" } },
  { label: "PDF + YouTube + Web, unified workspace", chailm: { state: "yes", text: "Unified" }, other: { state: "yes", text: "Supported" } },
  { label: "Flashcards, quizzes & mind maps", chailm: { state: "yes", text: "Built-in Studio" }, other: { state: "yes", text: "Built-in Studio" } },
  { label: "Two-host audio overview", chailm: { state: "yes", text: "Supported" }, other: { state: "yes", text: "Supported" } },
  { label: "Multi-stage retrieval pipeline", chailm: { state: "yes", text: "Query expansion → Step-back → HyDE → RRF → Rerank" }, other: { state: "none", text: "Not publicly documented" } },
];

function StateMark({ state }) {
  if (state === "yes") return <CheckCircle2 size={15} style={{ color: colors.verified, flexShrink: 0 }} />;
  if (state === "partial") return <span className="w-[15px] h-[15px] rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold" style={{ border: `1.5px solid ${colors.hairlineStrong}`, color: colors.slateFaint }}>~</span>;
  return <Minus size={15} style={{ color: colors.slateFaint, flexShrink: 0 }} />;
}

function ComparisonMatrix({ reducedMotion }) {
  const [ref, visible] = useReveal(0.1);
  const show = reducedMotion || visible;
  return (
    <section id="compare" ref={ref} className="px-6 py-24" style={{ borderTop: `1px solid ${colors.hairline}` }}>
      <div className="max-w-5xl mx-auto">
        <div className="max-w-2xl mb-12">
          <SectionEyebrow>WHY CHAILM IS DIFFERENT</SectionEyebrow>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-3" style={{ ...serif, color: colors.ink }}>
            Compared to Gemini Notebook.
          </h2>
          <p style={{ color: colors.slate }}>
            Gemini Notebook (the renamed NotebookLM) is a strong, capable product — this is where ChaiLM's implementation differs, not a claim of across-the-board superiority.
          </p>
        </div>

        <div
          className="rounded-xl overflow-hidden transition-all duration-700"
          style={{ border: `1px solid ${colors.hairline}`, background: colors.surface, opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(16px)", transitionTimingFunction: EASE }}
        >
          <div className="grid grid-cols-[1fr_auto_auto] md:grid-cols-[2fr_1.2fr_1.2fr] text-xs font-semibold px-5 py-3" style={{ background: colors.surface2, color: colors.slateFaint, ...mono, borderBottom: `1px solid ${colors.hairline}` }}>
            <span>CAPABILITY</span>
            <span style={{ color: colors.cobalt }}>CHAILM</span>
            <span>GEMINI NOTEBOOK</span>
          </div>
          {COMPARISON_ROWS.map((row, i) => (
            <div
              key={row.label}
              className="grid grid-cols-[1fr_auto_auto] md:grid-cols-[2fr_1.2fr_1.2fr] px-5 py-4 items-start gap-3 transition-all"
              style={{
                borderBottom: i < COMPARISON_ROWS.length - 1 ? `1px solid ${colors.hairline}` : "none",
                opacity: show ? 1 : 0,
                transform: show ? "translateY(0)" : "translateY(10px)",
                transitionDuration: "500ms",
                transitionDelay: reducedMotion ? "0ms" : `${i * 70}ms`,
                transitionTimingFunction: EASE,
              }}
            >
              <span className="text-sm font-medium pr-2" style={{ color: colors.ink }}>{row.label}</span>
              <span className="flex items-start gap-1.5 text-xs" style={{ color: colors.slate }}>
                <StateMark state={row.chailm.state} /> <span className="hidden md:inline">{row.chailm.text}</span>
              </span>
              <span className="flex items-start gap-1.5 text-xs" style={{ color: colors.slate }}>
                <StateMark state={row.other.state} /> <span className="hidden md:inline">{row.other.text}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Personas — real target audiences from the product brief             */
/* ------------------------------------------------------------------ */
const PERSONAS = {
  students: {
    label: "Students & Exam Aspirants",
    icon: GraduationCap,
    query: "Summarize the key differentiators of TCP vs UDP for my networking exam.",
    summary: "TCP guarantees ordered, reliable delivery via handshakes and retransmission, while UDP trades reliability for lower latency and overhead.",
    evidence: [
      { text: "TCP establishes a connection through a three-way handshake before any data transfer begins.", badge: "Lecture 04 · 00:22:10" },
      { text: "UDP omits acknowledgment and retransmission, making it preferable for real-time streaming.", badge: "p. 118" },
    ],
  },
  researchers: {
    label: "Researchers & Academics",
    icon: Microscope,
    query: "How do these three papers differ in their approach to catastrophic forgetting?",
    summary: "Paper A relies on replay buffers, Paper B on elastic weight consolidation, and Paper C on architectural isolation between tasks.",
    evidence: [
      { text: "Elastic weight consolidation penalizes changes to parameters identified as important for prior tasks.", badge: "p. 6" },
      { text: "Replay-based methods interleave a subset of prior task data during subsequent training.", badge: "p. 14" },
    ],
  },
  engineers: {
    label: "Software Engineers & Devs",
    icon: Code2,
    query: "What's the difference between server components and client components in this framework talk?",
    summary: "Server components render on the server with zero client JS by default; client components hydrate in the browser and can hold interactive state.",
    evidence: [
      { text: "Server components can access backend resources directly without exposing an API layer.", badge: "Conf Talk · 00:31:47" },
      { text: "Interactivity such as onClick handlers requires opting into a client component boundary.", badge: "Conf Talk · 00:38:02" },
    ],
  },
  creators: {
    label: "Content Creators & Podcasters",
    icon: Mic2,
    query: "Give me a chapter timeline for this 90-minute interview I'm scripting show notes for.",
    summary: "The interview breaks into four natural chapters: origin story, the pivot, the current product, and lessons learned.",
    evidence: [
      { text: "The guest describes the initial failed prototype starting around the eight-minute mark.", badge: "00:08:15" },
      { text: "The pivot decision is discussed in detail roughly a third of the way through the recording.", badge: "00:29:40" },
    ],
  },
  analysts: {
    label: "Product & Business Analysts",
    icon: Briefcase,
    query: "What did the CFO say about gross margin trends across the last two earnings calls?",
    summary: "Gross margin expanded modestly quarter-over-quarter, attributed to infrastructure cost optimization rather than pricing changes.",
    evidence: [
      { text: "Management attributed margin improvement primarily to renegotiated cloud infrastructure contracts.", badge: "Q2 Transcript · p. 4" },
      { text: "No pricing changes were implemented during the reporting period, per the CFO's remarks.", badge: "Q3 Transcript · p. 2" },
    ],
  },
};

function InteractiveDemo({ reducedMotion }) {
  const [ref, visible] = useReveal();
  const [tab, setTab] = useState("students");
  const show = reducedMotion || visible;

  return (
    <section id="demo" ref={ref} className="px-6 py-24" style={{ borderTop: `1px solid ${colors.hairline}`, background: colors.surface2 }}>
      <div className="max-w-4xl mx-auto">
        <div className="max-w-2xl mb-10">
          <SectionEyebrow>BUILT FOR HOW YOU ACTUALLY WORK</SectionEyebrow>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight" style={{ ...serif, color: colors.ink }}>
            One engine, five very different workspaces.
          </h2>
        </div>
        <div
          className="rounded-2xl p-6 md:p-8 transition-all duration-700"
          style={{ background: colors.surface, border: `1px solid ${colors.hairline}`, opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(20px)", transitionTimingFunction: EASE }}
        >
          <div className="flex gap-2 flex-wrap mb-6">
            {Object.entries(PERSONAS).map(([key, p]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300"
                style={{ background: tab === key ? colors.cobaltSoft : "transparent", border: `1px solid ${tab === key ? colors.cobalt : colors.hairline}`, color: tab === key ? colors.cobalt : colors.slate }}
              >
                <p.icon size={13} /> {p.label}
              </button>
            ))}
          </div>

          <div key={tab} className="space-y-4" style={{ animation: reducedMotion ? "none" : "fadeInUp 0.5s " + EASE }}>
            <div className="text-sm flex items-start gap-2" style={{ color: colors.slateFaint, ...mono }}>
              <span style={{ color: colors.cobalt }}>{">_"}</span> QUERY: "{PERSONAS[tab].query}"
            </div>

            <div className="rounded-lg p-5" style={{ background: colors.surface2, border: `1px solid ${colors.hairline}` }}>
              <div className="text-xs font-semibold tracking-wide mb-2" style={{ color: colors.cobalt }}>EXECUTIVE SUMMARY</div>
              <p className="text-sm leading-relaxed mb-5" style={{ color: colors.slate }}>{PERSONAS[tab].summary}</p>
              <div className="text-xs font-semibold tracking-wide mb-3" style={{ color: colors.slateFaint }}>VERIFIED EVIDENCE &amp; CITATIONS</div>
              <div className="grid md:grid-cols-2 gap-3">
                {PERSONAS[tab].evidence.map((e) => (
                  <div key={e.badge} onMouseMove={spotlightMove} className="rounded-lg p-4 spotlight-card transition-transform duration-300 hover:-translate-y-0.5" style={{ background: colors.surface, border: `1px solid ${colors.hairline}` }}>
                    <p className="text-sm mb-3" style={{ color: colors.ink }}>{e.text}</p>
                    <ExhibitStamp>{e.badge}</ExhibitStamp>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Tech stack strip + closing CTA                                      */
/* ------------------------------------------------------------------ */
const STACK = [
  { icon: Database, label: "Qdrant Vector DB" },
  { icon: Cpu, label: "Cohere Rerank v3.5" },
  { icon: Sparkles, label: "OpenAI Structured Outputs" },
  { icon: Cloud, label: "Cloudinary Storage" },
  { icon: Globe2, label: "Cheerio Web Loader" },
  { icon: GitBranch, label: "Inngest Workflows" },
];

function Marquee({ reducedMotion }) {
  const items = reducedMotion ? STACK : [...STACK, ...STACK];
  return (
    <div className="relative overflow-hidden py-2 mb-16" style={{ maskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)", WebkitMaskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)" }}>
      <div className={`flex gap-3 w-max ${reducedMotion ? "flex-wrap justify-center w-full" : "marquee-track"}`}>
        {items.map((s, i) => (
          <div key={i} onMouseMove={spotlightMove} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm spotlight-card shrink-0" style={{ background: colors.surface, border: `1px solid ${colors.hairline}` }}>
            <s.icon size={15} style={{ color: colors.cobalt }} /> {s.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function TechStack({ reducedMotion }) {
  const [ref, visible] = useReveal();
  const show = reducedMotion || visible;
  return (
    <section id="stack" ref={ref} className="px-6 py-24" style={{ borderTop: `1px solid ${colors.hairline}` }}>
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-xs font-semibold tracking-[0.18em] mb-6" style={{ color: colors.slateFaint, ...mono }}>ENTERPRISE INFRASTRUCTURE FOUNDATION</p>
        <Marquee reducedMotion={reducedMotion} />
        <div
          className="rounded-2xl p-10 md:p-14 transition-all duration-700"
          style={{ background: colors.ink, border: `1px solid ${colors.ink}`, opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(20px)", transitionTimingFunction: EASE }}
        >
          <h3 className="text-2xl md:text-3xl font-medium mb-3" style={{ ...serif, color: "#F5F6F4" }}>Ready to explore grounded workspace intelligence?</h3>
          <p className="mb-8" style={{ color: "rgba(245,246,244,0.65)" }}>Create your first isolated session and index YouTube videos or PDFs in seconds.</p>
          <MagneticButton href="#" reducedMotion={reducedMotion} style={{ background: colors.verified, color: "#fff" }}>
            Launch Workspace Dashboard <ArrowRight size={16} />
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ — accordion, ledger-style rules                                 */
/* ------------------------------------------------------------------ */
const FAQ_ITEMS = [
  {
    q: "How does ChaiLM prevent AI hallucinations?",
    a: "ChaiLM uses a multi-stage retrieval pipeline — HyDE query translation, Reciprocal Rank Fusion across parallel search variants, and Cohere cross-encoder reranking. The LLM is strictly constrained via Zod schemas to only answer from verified source passages.",
  },
  {
    q: "Can I use YouTube videos in Hindi or Hinglish?",
    a: "Yes. ChaiLM's query translation engine generates phonetic transliterations in both Devanagari and Latin script, letting you ask questions in English and accurately retrieve concepts spoken in Hindi.",
  },
  {
    q: "Is my data separated and private?",
    a: "Every workspace is logically and cryptographically partitioned by user ID and workspace ID in both MongoDB and the Qdrant vector database.",
  },
  {
    q: "Can I jump directly to the video moment on YouTube?",
    a: "Yes. Every video takeaway includes an exact timestamp citation, e.g. 00:14:22. Clicking it opens the interactive player and starts playback at that exact second.",
  },
];

function useAutoHeight(isOpen) {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    setHeight(isOpen ? ref.current.scrollHeight : 0);
  }, [isOpen]);
  return [ref, height];
}

function FAQItem({ item, index, isOpen, onToggle }) {
  const [ref, height] = useAutoHeight(isOpen);
  return (
    <div style={{ borderBottom: `1px solid ${colors.hairline}` }}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className="flex items-baseline gap-3">
          <span className="text-xs font-semibold" style={{ ...mono, color: colors.slateFaint }}>{String(index + 1).padStart(2, "0")}</span>
          <span className="font-medium" style={{ color: colors.ink }}>{item.q}</span>
        </span>
        <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300" style={{ border: `1px solid ${colors.hairlineStrong}`, transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}>
          <Plus size={12} style={{ color: colors.ink }} />
        </span>
      </button>
      <div style={{ height, overflow: "hidden", transition: `height 350ms ${EASE}` }}>
        <p ref={ref} className="text-sm leading-relaxed pb-5 pl-8 pr-8" style={{ color: colors.slate }}>{item.a}</p>
      </div>
    </div>
  );
}

function FAQ({ reducedMotion }) {
  const [openIndex, setOpenIndex] = useState(0);
  const [ref, visible] = useReveal(0.1);
  const show = reducedMotion || visible;
  return (
    <section id="faq" ref={ref} className="px-6 py-24" style={{ borderTop: `1px solid ${colors.hairline}` }}>
      <div
        className="max-w-3xl mx-auto transition-all duration-700"
        style={{ opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(16px)", transitionTimingFunction: EASE }}
      >
        <div className="mb-10">
          <SectionEyebrow>FAQ</SectionEyebrow>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight" style={{ ...serif, color: colors.ink }}>
            Frequently asked questions.
          </h2>
        </div>
        <div style={{ borderTop: `1px solid ${colors.hairline}` }}>
          {FAQ_ITEMS.map((item, i) => (
            <FAQItem key={item.q} item={item} index={i} isOpen={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? -1 : i)} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                               */
/* ------------------------------------------------------------------ */
function Footer() {
  return (
    <footer className="px-6 py-8" style={{ borderTop: `1px solid ${colors.hairline}` }}>
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs" style={{ color: colors.slateFaint }}>
        <div style={serif}>chai<span style={{ color: colors.verified }}>LM</span> — Multimodal Video &amp; Document Intelligence</div>
        <div className="flex gap-5" style={mono}>
          <span>Vector Index: Qdrant</span>
          <span>Reranker: Cohere</span>
          <span>Synthesizer: GPT-4o-mini</span>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Root                                                                 */
/* ------------------------------------------------------------------ */
export default function ChaiLMLanding() {
  const reducedMotion = usePrefersReducedMotion();
  return (
    <div style={{ ...sans, background: colors.paper, color: colors.ink, minHeight: "100vh", position: "relative", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px);} to { opacity: 1; transform: translateY(0);} }
        @keyframes wordReveal { from { opacity: 0; transform: translateY(14px); filter: blur(6px);} to { opacity: 1; transform: translateY(0); filter: blur(0);} }
        .word-reveal { animation: wordReveal 0.7s cubic-bezier(0.16,1,0.3,1) both; }
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
      <AmbientBackground reducedMotion={reducedMotion} />
      <ScrollProgress />
      <div style={{ position: "relative", zIndex: 2 }}>
        <Nav reducedMotion={reducedMotion} />
        <Hero reducedMotion={reducedMotion} />
        <HowItWorks reducedMotion={reducedMotion} />
        <RetrievalPipeline reducedMotion={reducedMotion} />
        <ComparisonMatrix reducedMotion={reducedMotion} />
        <InteractiveDemo reducedMotion={reducedMotion} />
        <TechStack reducedMotion={reducedMotion} />
        <FAQ reducedMotion={reducedMotion} />
        <Footer />
      </div>
    </div>
  );
}
