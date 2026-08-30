import { useState, type ElementType } from "react";
import { motion } from "framer-motion";
import {
  Layers,
  Video,
  FileText,
  Sparkles,
  HelpCircle,
  Headphones,
  Share2,
  BookOpen,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import {
  colors,
  serif,
  mono,
  EASE,
  clamp1,
  clamp2,
  clamp3,
  WAVE_HEIGHTS,
  useInterval,
} from "./tokens";

export interface StudioItem {
  id: string;
  type: string;
  icon: ElementType;
  title: string;
  sourceType: "pdf" | "video";
  difficulty: string | null;
  meta: string;
  preview: any;
}

export const STUDIO_ITEMS: StudioItem[] = [
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
      root: "Transformer Attention",
      branches: [
        { label: "Background & Context", sub: ["Quadratic Complexity", "SRAM Memory Bandwidth"] },
        { label: "Key Mechanism", sub: ["FlashAttention Tiling", "KV-Cache Management"] },
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
      front: "What problem does FlashAttention solve during inference?",
      back: "Tiles the softmax computation across GPU SRAM, reducing memory read/write bottlenecks by 3x.",
      hint: "Think about memory bandwidth vs pure compute speed.",
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
      summary: "An organized breakdown of every major theme, argument, and supporting formula from your source — ready to review before an exam.",
      takeaway: "The primary computational bottleneck shifts from matrix multiplications to memory transfers.",
      glossary: { term: "KV-Cache", def: "Key-Value tensor buffer stored in GPU VRAM for fast auto-regressive decoding." },
    },
  },
];

function renderPreview(item: StudioItem) {
  switch (item.id) {
    case "quiz":
      return (
        <div className="space-y-2">
          <p className="text-xs font-medium" style={{ color: colors.slate, ...clamp2 }}>{item.preview.question}</p>
          {item.preview.options.map((opt: string, i: number) => (
            <div
              key={i}
              className="flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-md transition-colors"
              style={{
                background: i === item.preview.correct ? colors.verifiedSoft : colors.surface2,
                border: `1px solid ${i === item.preview.correct ? colors.verifiedBorder : colors.hairline}`,
                color: i === item.preview.correct ? colors.verified : colors.slate,
              }}
            >
              {i === item.preview.correct ? <CheckCircle2 size={13} className="shrink-0" /> : <span className="w-3 text-center shrink-0 font-semibold">{String.fromCharCode(65 + i)}</span>}
              <span style={clamp1}>{opt}</span>
            </div>
          ))}
          <div className="flex items-start gap-1.5 pt-1.5 mt-1" style={{ borderTop: `1px dashed ${colors.hairline}` }}>
            <span className="text-xs font-semibold shrink-0" style={{ color: colors.cobalt }}>Why:</span>
            <span className="text-xs" style={{ color: colors.slateFaint, ...clamp2 }}>{item.preview.explanation}</span>
          </div>
        </div>
      );
    case "audio":
      return (
        <div className="flex flex-col gap-2.5 h-full justify-center">
          {item.preview.dialogue.map((d: any, i: number) => (
            <div key={i} className="flex items-start gap-2">
              <span
                className="text-xs font-semibold px-1.5 py-0.5 rounded shrink-0"
                style={{ background: i === 0 ? colors.cobaltSoft : colors.verifiedSoft, color: i === 0 ? colors.cobalt : colors.verified }}
              >
                {d.speaker}
              </span>
              <p className="text-xs leading-relaxed" style={{ color: colors.slate, ...clamp2 }}>{d.text}</p>
            </div>
          ))}
          <div className="flex items-end justify-center gap-1.5 h-7 mt-1">
            {WAVE_HEIGHTS.slice(0, 10).map((h, i) => (
              <span
                key={i}
                className="waveform-bar"
                style={{ width: 3.5, borderRadius: 2, height: `${h}%`, background: colors.hairlineStrong, animationDelay: `${i * 0.08}s` }}
              />
            ))}
          </div>
        </div>
      );
    case "mindmap":
      return (
        <div className="flex flex-col gap-2 h-full">
          <div className="px-3 py-1.5 rounded-lg text-xs font-semibold text-center w-full" style={{ ...clamp1, background: colors.cobaltSoft, color: colors.cobalt, border: `1px solid ${colors.hairlineStrong}` }}>
            {item.preview.root}
          </div>
          <div className="flex flex-col gap-2 mt-1">
            {item.preview.branches.map((b: any, i: number) => (
              <div key={i}>
                <div className="text-xs font-medium px-2 py-1 rounded-md mb-1" style={{ ...clamp1, background: colors.surface2, border: `1px solid ${colors.hairline}`, color: colors.ink }}>
                  {b.label}
                </div>
                <div className="flex flex-col gap-1 pl-3" style={{ borderLeft: `1.5px solid ${colors.hairlineStrong}` }}>
                  {b.sub.map((s: string, j: number) => (
                    <div key={j} className="text-xs px-2 py-0.5 rounded" style={{ ...clamp1, background: colors.paper, border: `1px solid ${colors.hairline}`, color: colors.slate }}>
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
        <div className="flex flex-col gap-2 h-full justify-center">
          <div className="rounded-lg p-3 text-xs leading-relaxed" style={{ background: colors.surface2, border: `1px solid ${colors.hairline}`, color: colors.ink, ...clamp3 }}>
            {item.preview.front}
          </div>
          <p className="text-[11px] italic px-1" style={{ color: colors.slateFaint, ...clamp1 }}>Hint: {item.preview.hint}</p>
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: colors.verifiedSoft }}>
              <ArrowRight size={10} style={{ color: colors.verified, transform: "rotate(90deg)" }} />
            </div>
          </div>
          <div className="rounded-lg p-3 text-xs leading-relaxed" style={{ background: colors.surface2, border: `1px solid ${colors.verifiedBorder}`, color: colors.slate, ...clamp3 }}>
            {item.preview.back}
          </div>
        </div>
      );
    case "studyguide":
      return (
        <div className="flex flex-col gap-2.5 h-full overflow-hidden">
          <p className="text-xs leading-relaxed" style={{ color: colors.slate, ...clamp2 }}>{item.preview.summary}</p>
          <div className="flex items-start gap-1.5 text-xs font-medium" style={{ color: colors.verified }}>
            <Sparkles size={13} className="shrink-0 mt-0.5" />
            <span style={clamp2}>{item.preview.takeaway}</span>
          </div>
          <div className="text-xs px-2.5 py-2 rounded-md overflow-hidden" style={{ background: colors.surface2, border: `1px solid ${colors.hairline}` }}>
            <span style={{ color: colors.cobalt, fontWeight: 600 }}>{item.preview.glossary.term}: </span>
            <span className="text-xs text-[#5C6169] leading-relaxed block mt-0.5" style={clamp2}>
              {item.preview.glossary.def}
            </span>
          </div>
        </div>
      );
    default:
      return null;
  }
}

export function StudioCard({ item, active }: { item: StudioItem; active: boolean }) {
  const Icon = item.icon;
  const SourceIcon = item.sourceType === "video" ? Video : FileText;
  return (
    <div
      className="h-full rounded-2xl p-6 pl-8 flex flex-col select-none relative"
      style={{
        background: colors.surface,
        border: `1px solid ${active ? colors.hairlineStrong : colors.hairline}`,
        boxShadow: active ? "0 30px 70px -24px rgba(20,23,26,0.24)" : "0 10px 26px -16px rgba(20,23,26,0.12)",
      }}
    >
      <div
        className="absolute left-0 top-6 bottom-6 w-1.5 rounded-r-full"
        style={{ background: item.sourceType === "video" ? colors.cobalt : colors.verified }}
      />
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: colors.cobaltSoft }}>
            <Icon size={16} style={{ color: colors.cobalt }} />
          </div>
          <span className="text-xs font-semibold tracking-wider" style={{ ...mono, color: colors.cobalt }}>
            {item.type.toUpperCase()}
          </span>
        </div>
        {item.difficulty && (
          <span className="text-xs px-2 py-0.5 rounded-full font-medium shrink-0" style={{ background: colors.verifiedSoft, color: colors.verified, border: `1px solid ${colors.verifiedBorder}` }}>
            {item.difficulty}
          </span>
        )}
      </div>
      <h4 className="text-base font-semibold mb-3 leading-snug" style={{ ...serif, color: colors.ink, ...clamp2 }}>
        {item.title}
      </h4>
      <div className="flex-1 min-h-0">{renderPreview(item)}</div>
      <div className="pt-3.5 mt-3 text-xs flex items-center gap-1.5 font-medium" style={{ borderTop: `1px solid ${colors.hairline}`, color: colors.slateFaint }}>
        <SourceIcon size={12} className="shrink-0" /> {item.meta}
      </div>
    </div>
  );
}

export function StudioCoverflow({ reducedMotion }: { reducedMotion: boolean }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const N = STUDIO_ITEMS.length;

  useInterval(() => setActive((a) => (a + 1) % N), 2400, !reducedMotion && !paused);

  return (
    <div className="w-full">
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
            translateVw = 0; scale = reducedMotion ? 1 : 1.05; rotateY = 0; translateZ = reducedMotion ? 0 : 70; blur = 0; opacity = 1;
          } else if (abs === 1) {
            translateVw = sign * 24; scale = 0.82; rotateY = sign * -28; translateZ = -100; blur = 2; opacity = 0.55;
          } else {
            translateVw = sign * 42; scale = 0.62; rotateY = sign * -30; translateZ = -220; blur = 5; opacity = 0.16;
          }

          return (
            <motion.div
              key={item.id}
              onClick={() => setActive(i)}
              className="absolute top-1/2 left-1/2 cursor-pointer"
              animate={{
                transform: `translate(-50%, -50%) translateX(${translateVw}vw) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                filter: `blur(${blur}px)`,
                opacity,
              }}
              transition={{ duration: reducedMotion ? 0.2 : 0.7, ease: EASE }}
              style={{
                width: 340,
                height: 420,
                zIndex: 100 - abs,
                pointerEvents: abs > 2 ? "none" : "auto",
              }}
            >
              <StudioCard item={item} active={abs === 0} />
            </motion.div>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-2 mt-8 relative z-10">
        {STUDIO_ITEMS.map((item, i) => (
          <button
            key={item.id}
            onClick={() => setActive(i)}
            aria-label={`Show ${item.type}`}
            className="h-1.5 rounded-full transition-all duration-300 cursor-pointer"
            style={{ width: active === i ? 22 : 6, background: active === i ? colors.cobalt : colors.hairlineStrong }}
          />
        ))}
      </div>
    </div>
  );
}

export function StudioSection({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <section id="studio" className="py-28 overflow-hidden relative" style={{ borderTop: `1px solid ${colors.hairline}` }}>
      <div className="max-w-4xl mx-auto px-6 mb-16 text-center">
        <p className="text-xs font-semibold tracking-[0.18em] mb-3 uppercase" style={{ ...mono, color: colors.slateFaint }}>
          STUDIO ARTIFACTS
        </p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight mb-4" style={{ ...serif, color: colors.ink }}>
          One verified source, five ways to master it.
        </h2>
        <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: colors.slate }}>
          Transform your grounded sources into multi-format learning artifacts — from interactive quizzes and flashcards to structured study guides and two-host audio overviews.
        </p>
      </div>

      <div style={{ width: "100vw", marginLeft: "calc(50% - 50vw)", marginRight: "calc(50% - 50vw)" }}>
        <StudioCoverflow reducedMotion={reducedMotion} />
      </div>
    </section>
  );
}

