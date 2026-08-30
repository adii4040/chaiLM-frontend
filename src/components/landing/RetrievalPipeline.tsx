import React, { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  Sparkles,
  Compass,
  GitBranch,
  BrainCircuit,
  Layers,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Database,
  Terminal,
  Activity,
} from "lucide-react";
import { colors, serif, mono, EASE, spotlightMove } from "./tokens";
import { SectionEyebrow } from "./SharedAtoms";

interface PipelineStep {
  n: string;
  label: string;
  badge: string;
  icon: React.ElementType;
  headline: string;
  detail: string;
  techCode: string;
  artifact: {
    tag: string;
    title: string;
    render: () => React.ReactNode;
  };
}

const PIPELINE_STEPS: PipelineStep[] = [
  {
    n: "01",
    label: "Query Rewrite",
    badge: "Semantic Expansion",
    icon: Sparkles,
    headline: "Translates and clarifies raw user intent",
    detail: "Reformulates ambiguous phrasing, removes conversational noise, and generates high-signal keyword search variants to maximize initial candidate recall.",
    techCode: "translateQuery(q) → q_rewritten",
    artifact: {
      tag: "STAGE_01 · QUERY_TRANSLATION",
      title: "Before & After Query Expansion",
      render: () => (
        <div className="space-y-3">
          <div className="rounded-lg p-3 bg-[#F5F6F4] border border-[#E2E4E1]">
            <div className="text-[11px] font-semibold text-[#5C6169] mb-1 flex items-center gap-1.5" style={mono}>
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> RAW USER QUERY
            </div>
            <p className="text-xs text-[#14171A] font-medium">"why is flashattn so fast on gpu?"</p>
          </div>
          <div className="flex items-center justify-center">
            <ArrowRight size={14} className="text-[#1F7A5C] rotate-90 md:rotate-0" />
          </div>
          <div className="rounded-lg p-3 bg-[#1F7A5C]/10 border border-[#1F7A5C]/30">
            <div className="text-[11px] font-semibold text-[#1F7A5C] mb-1 flex items-center gap-1.5" style={mono}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#1F7A5C]" /> REWRITTEN HIGH-SIGNAL VECTOR
            </div>
            <p className="text-xs text-[#14171A] font-medium leading-relaxed">
              "FlashAttention memory bandwidth IO tiling optimization SRAM GPU VRAM complexity"
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {["#FlashAttention", "#SRAM_IO", "#MemoryBound", "#GPU_Tiling"].map((t) => (
                <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-white text-[#1F7A5C] font-semibold border border-[#1F7A5C]/20" style={mono}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      ),
    },
  },
  {
    n: "02",
    label: "Step-Back Prompting",
    badge: "Conceptual Abstraction",
    icon: Compass,
    headline: "Identifies the broader underlying principle",
    detail: "Steps back from hyper-specific edge questions to retrieve fundamental domain context, ensuring answers capture foundational theory.",
    techCode: "generateStepBack(q) → q_abstract",
    artifact: {
      tag: "STAGE_02 · CONCEPTUAL_LADDER",
      title: "High-Level Domain Abstraction",
      render: () => (
        <div className="space-y-3">
          <div className="rounded-lg p-3 bg-[#F5F6F4] border border-[#E2E4E1]">
            <div className="text-[11px] font-semibold text-[#5C6169] mb-1" style={mono}>
              SPECIFIC INQUIRY
            </div>
            <p className="text-xs text-[#14171A]">"What causes KV-cache VRAM spike at 128k context?"</p>
          </div>
          <div className="pl-3 border-l-2 border-[#1E2A5E]/40 space-y-1">
            <div className="text-[11px] font-semibold text-[#1E2A5E]" style={mono}>
              STEP-BACK PRINCIPLE
            </div>
            <div className="rounded-lg p-3 bg-[#1E2A5E]/5 border border-[#1E2A5E]/20">
              <p className="text-xs font-semibold text-[#14171A] leading-relaxed">
                "Transformer Attention Complexity &amp; Auto-Regressive Sequence Memory Scaling"
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] px-2.5 py-1 rounded bg-[#E2E4E1]/60 text-[#5C6169]" style={mono}>
            <span>Scope: Core Architecture</span>
            <span className="font-bold text-[#1E2A5E]">Broad Principle Recall</span>
          </div>
        </div>
      ),
    },
  },
  {
    n: "03",
    label: "Sub-Questions",
    badge: "Multi-Angle Split",
    icon: GitBranch,
    headline: "Decomposes into 3–5 targeted vectors",
    detail: "Breaks complex inquiries into distinct sub-problems, searching independently across isolated vector partitions in parallel.",
    techCode: "decompose(q) → [sub_1, sub_2, sub_3]",
    artifact: {
      tag: "STAGE_03 · PARALLEL_DECOMPOSITION",
      title: "3 Parallel Search Threads Dispatched",
      render: () => (
        <div className="space-y-2">
          {[
            { id: "Q1", q: "What is the mathematical formulation of Self-Attention memory?", hits: "8 chunks" },
            { id: "Q2", q: "How does GPU SRAM differ from high-bandwidth HBM memory?", hits: "6 chunks" },
            { id: "Q3", q: "What benchmark speedups does FlashAttention-2 demonstrate?", hits: "9 chunks" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-[#F5F6F4] border border-[#E2E4E1] text-xs">
              <div className="flex items-center gap-2 overflow-hidden pr-2">
                <span className="w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] bg-[#1E2A5E] text-white shrink-0" style={mono}>
                  {item.id}
                </span>
                <span className="truncate text-[#14171A] font-medium">{item.q}</span>
              </div>
              <span className="text-[11px] font-semibold text-[#1F7A5C] shrink-0" style={mono}>
                {item.hits}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] font-semibold text-[#1E2A5E]" style={mono}>
            <Database size={12} /> 23 Total Candidates Gathered from Qdrant
          </div>
        </div>
      ),
    },
  },
  {
    n: "04",
    label: "HyDE Generation",
    badge: "Hypothetical Embeddings",
    icon: BrainCircuit,
    headline: "Hallucinates the ideal answer passage",
    detail: "Synthesizes a plausible reference excerpt so embedding vectors match against document answer space rather than question space.",
    techCode: "generateHyDE(q) → e_hypothetical",
    artifact: {
      tag: "STAGE_04 · HYDE_SYNTHESIS",
      title: "Simulated Reference Excerpt",
      render: () => (
        <div className="space-y-2.5">
          <div className="rounded-lg p-3 bg-[#F5F6F4] border border-[#E2E4E1] relative">
            <div className="text-[10px] font-bold text-[#5C6169] uppercase tracking-wider mb-1 flex items-center justify-between" style={mono}>
              <span>Plausible Reference Passage</span>
              <span className="text-[#1F7A5C] bg-[#1F7A5C]/10 px-1.5 py-0.5 rounded">Vector Alignment: 94.2%</span>
            </div>
            <p className="text-xs text-[#5C6169] italic leading-relaxed">
              "FlashAttention computes exact attention by tiling Q, K, and V blocks across fast on-chip SRAM, eliminating intermediate N×N softmax matrix reads/writes to slow GPU HBM..."
            </p>
          </div>
          <div className="flex items-center justify-between text-[11px] px-2.5 py-1.5 rounded bg-[#1F7A5C]/10 border border-[#1F7A5C]/20 text-[#1F7A5C] font-semibold" style={mono}>
            <span>Cosine Vector Space Target</span>
            <span>Answer-to-Answer Matching</span>
          </div>
        </div>
      ),
    },
  },
  {
    n: "05",
    label: "Reciprocal Rank Fusion",
    badge: "Candidate Merging",
    icon: Layers,
    headline: "Fuses parallel search streams into one pool",
    detail: "Scores candidates across all query variants using 1 / (60 + rank), ensuring high-consensus chunks naturally bubble to the top.",
    techCode: "RRF(p) = Σ (1 / (60 + rank(p)))",
    artifact: {
      tag: "STAGE_05 · RRF_RANK_MERGER",
      title: "Consensus Score Fusion Table",
      render: () => (
        <div className="space-y-1.5">
          <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] text-[10px] font-bold text-[#5C6169] px-2 py-1 bg-[#E2E4E1]/50 rounded" style={mono}>
            <span>CHUNK</span>
            <span>Q1 RANK</span>
            <span>Q2 RANK</span>
            <span className="text-right text-[#1E2A5E]">RRF SCORE</span>
          </div>
          {[
            { id: "PDF p.12 [SRAM]", q1: "#1", q2: "#2", rrf: "0.0328", win: true },
            { id: "Video 14:22 [Tiling]", q1: "#3", q2: "#1", rrf: "0.0319", win: true },
            { id: "PDF p.15 [IO Model]", q1: "#2", q2: "#4", rrf: "0.0305", win: true },
            { id: "Web Doc [A100 Specs]", q1: "#9", q2: "#8", rrf: "0.0195", win: false },
          ].map((row, i) => (
            <div
              key={i}
              className={`grid grid-cols-[1.5fr_1fr_1fr_1fr] text-xs px-2 py-1.5 rounded items-center ${
                row.win ? "bg-white border border-[#E2E4E1] font-medium" : "opacity-50 text-[11px]"
              }`}
            >
              <span className="truncate text-[#14171A]">{row.id}</span>
              <span className="text-[#5C6169]">{row.q1}</span>
              <span className="text-[#5C6169]">{row.q2}</span>
              <span className="text-right font-bold text-[#1E2A5E]" style={mono}>
                {row.rrf}
              </span>
            </div>
          ))}
        </div>
      ),
    },
  },
  {
    n: "06",
    label: "Cohere Rerank v3.5",
    badge: "Cross-Encoder Precision",
    icon: ShieldCheck,
    headline: "Deep semantic cross-attention selection",
    detail: "Evaluates exact sentence-level relevance between query and context, outputting the 5 highest-confidence golden chunks for final synthesis.",
    techCode: "cohere.rerank(query, docs, top_n: 5)",
    artifact: {
      tag: "STAGE_06 · CROSS_ENCODER_TOP5",
      title: "Final Golden Context Retrieved",
      render: () => (
        <div className="space-y-1.5">
          {[
            { title: "SRAM Tiling & IO-Aware Algorithm (PDF Page 12)", score: "98.6%" },
            { title: "Transformer Scaling Bottlenecks (Video [00:14:22])", score: "95.4%" },
            { title: "Standard GPU Memory Hierarchy vs SRAM (PDF Page 15)", score: "92.1%" },
            { title: "Benchmarking Forward & Backward Passes (Web Doc)", score: "89.3%" },
            { title: "KV-Cache Memory Footprint Optimization (Video [00:32:10])", score: "86.5%" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#1F7A5C]/30 text-xs shadow-xs"
            >
              <div className="flex items-center gap-2 truncate pr-2">
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] bg-[#1F7A5C] text-white shrink-0 font-bold">
                  {i + 1}
                </span>
                <span className="truncate text-[#14171A] font-medium">{item.title}</span>
              </div>
              <span className="text-xs font-bold text-[#1F7A5C] shrink-0" style={mono}>
                {item.score}
              </span>
            </div>
          ))}
        </div>
      ),
    },
  },
];

export function RetrievalPipeline({ reducedMotion }: { reducedMotion: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 65%", "end 80%"],
  });

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    restDelta: 0.001,
  });

  // Balanced sinusoidal wave that flows between left and right pairs
  const curvedPathD =
    "M 50 0 " +
    "C 90 150, 10 300, 50 450 " +
    "C 90 600, 10 750, 50 900 " +
    "C 90 1050, 10 1200, 50 1350 " +
    "C 90 1500, 10 1650, 50 1800 " +
    "C 90 1950, 20 2050, 50 2150";

  return (
    <section
      id="pipeline"
      ref={containerRef}
      className="px-6 py-32 relative overflow-hidden"
      style={{
        borderTop: `1px solid ${colors.hairline}`,
        background: "#ECEEEA",
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="max-w-2xl mb-24 text-left">
          <SectionEyebrow>HOW IT'S VERIFIED</SectionEyebrow>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight mb-4"
            style={{ ...serif, color: colors.ink }}
          >
            Every answer survives a six-stage retrieval pipeline before it reaches you.
          </h2>
          <p className="text-base md:text-lg leading-relaxed" style={{ color: colors.slate }}>
            A scroll-driven multi-angle pipeline ensuring zero hallucinations through structured verification, reciprocal rank fusion, and cross-encoder reranking.
          </p>
        </div>

        {/* Pipeline Body */}
        <div className="relative">
          {/* Central Curving Spine (Desktop) */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-24 pointer-events-none z-0">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 2150"
              fill="none"
              preserveAspectRatio="none"
            >
              {/* Background Guideline Track */}
              <path
                d={curvedPathD}
                stroke={colors.hairlineStrong}
                strokeWidth="2.5"
                strokeDasharray="6 8"
                strokeLinecap="round"
              />

              {/* Active Verified Track */}
              <motion.path
                d={curvedPathD}
                stroke={colors.verified}
                strokeWidth="4"
                strokeLinecap="round"
                style={{
                  pathLength: reducedMotion ? 1 : pathLength,
                }}
              />
            </svg>
          </div>

          {/* Left Curving Spine (Mobile/Tablet) */}
          <div className="lg:hidden absolute left-4 top-0 bottom-0 w-8 pointer-events-none z-0">
            <svg
              className="w-full h-full"
              viewBox="0 0 32 2150"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M 16 0 C 30 180, 2 360, 16 540 C 30 720, 2 900, 16 1080 C 30 1260, 2 1440, 16 1620 C 30 1800, 10 1920, 16 2150"
                stroke={colors.hairlineStrong}
                strokeWidth="2"
                strokeDasharray="4 6"
              />
              <motion.path
                d="M 16 0 C 30 180, 2 360, 16 540 C 30 720, 2 900, 16 1080 C 30 1260, 2 1440, 16 1620 C 30 1800, 10 1920, 16 2150"
                stroke={colors.verified}
                strokeWidth="3.5"
                strokeLinecap="round"
                style={{
                  pathLength: reducedMotion ? 1 : pathLength,
                }}
              />
            </svg>
          </div>

          {/* 6 Step Rows (Card on one side, Live Inspector on the other) */}
          <div className="space-y-20 lg:space-y-28 relative z-10">
            {PIPELINE_STEPS.map((step, i) => {
              const isEven = i % 2 === 0;
              const Icon = step.icon;

              return (
                <div
                  key={step.n}
                  className="relative flex flex-col lg:flex-row items-stretch lg:items-center gap-6 lg:gap-14"
                >
                  {/* Central Node Badge (Desktop) */}
                  <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 items-center justify-center">
                    <motion.div
                      initial={reducedMotion ? false : { scale: 0.6, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, margin: "-120px" }}
                      transition={{ duration: 0.45, ease: EASE }}
                      className="w-11 h-11 rounded-full flex items-center justify-center shadow-md bg-white cursor-default"
                      style={{
                        border: `2.5px solid ${colors.verified}`,
                      }}
                    >
                      <span
                        className="text-xs font-bold"
                        style={{ ...mono, color: colors.verified }}
                      >
                        {step.n}
                      </span>
                    </motion.div>
                  </div>

                  {/* Left Column (Card if isEven, Inspector if !isEven) */}
                  <div className={`w-full lg:w-1/2 pl-12 lg:pl-0 ${isEven ? "order-1" : "order-2 lg:order-1"}`}>
                    {isEven ? (
                      /* Concept Card (Left side) */
                      <motion.div
                        initial={reducedMotion ? false : { opacity: 0, x: -25, y: 15 }}
                        whileInView={{ opacity: 1, x: 0, y: 0 }}
                        viewport={{ once: true, margin: "-120px" }}
                        transition={{ duration: 0.6, ease: EASE }}
                        onMouseMove={spotlightMove}
                        className="rounded-2xl p-6 md:p-7 spotlight-card relative h-full bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                        style={{
                          border: `1px solid ${colors.hairlineStrong}`,
                          boxShadow: "0 8px 26px -8px rgba(20,23,26,0.08)",
                        }}
                      >
                        <div className="flex items-center justify-between gap-3 mb-3.5">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                              style={{ background: colors.cobaltSoft }}
                            >
                              <Icon size={16} style={{ color: colors.cobalt }} />
                            </div>
                            <span
                              className="text-xs font-semibold uppercase tracking-wider"
                              style={{ ...mono, color: colors.cobalt }}
                            >
                              {step.label}
                            </span>
                          </div>
                          <span
                            className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full shrink-0"
                            style={{
                              background: colors.verifiedSoft,
                              color: colors.verified,
                              border: `1px solid ${colors.verifiedBorder}`,
                            }}
                          >
                            {step.badge}
                          </span>
                        </div>

                        <h4
                          className="text-base md:text-lg font-semibold mb-2 leading-snug"
                          style={{ ...serif, color: colors.ink }}
                        >
                          {step.headline}
                        </h4>

                        <p className="text-sm leading-relaxed mb-4" style={{ color: colors.slate }}>
                          {step.detail}
                        </p>

                        <div
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium"
                          style={{
                            background: colors.surface2,
                            border: `1px solid ${colors.hairline}`,
                            color: colors.slate,
                            ...mono,
                          }}
                        >
                          <CheckCircle2 size={13} style={{ color: colors.verified }} className="shrink-0" />
                          <span className="truncate">{step.techCode}</span>
                        </div>
                      </motion.div>
                    ) : (
                      /* Live Step Inspector (Left side) */
                      <motion.div
                        initial={reducedMotion ? false : { opacity: 0, x: -25, y: 15 }}
                        whileInView={{ opacity: 1, x: 0, y: 0 }}
                        viewport={{ once: true, margin: "-120px" }}
                        transition={{ duration: 0.6, ease: EASE }}
                        className="rounded-2xl p-6 bg-white border border-[#CBCFC9] shadow-md h-full flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E2E4E1]">
                          <span className="text-[11px] font-bold text-[#1E2A5E] flex items-center gap-1.5" style={mono}>
                            <Terminal size={12} /> {step.artifact.tag}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-[#1F7A5C]/10 text-[#1F7A5C]">
                            LIVE VERIFIED
                          </span>
                        </div>
                        <div className="flex-1 my-1">{step.artifact.render()}</div>
                        <div className="pt-2.5 mt-2 border-t border-[#E2E4E1] flex items-center justify-between text-[11px] text-[#93968F]" style={mono}>
                          <span>Artifact: {step.artifact.title}</span>
                          <span className="text-[#1F7A5C] flex items-center gap-1">
                            <Activity size={12} /> OK (200)
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Right Column (Inspector if isEven, Card if !isEven) */}
                  <div className={`w-full lg:w-1/2 pl-12 lg:pl-0 ${isEven ? "order-2" : "order-1 lg:order-2"}`}>
                    {!isEven ? (
                      /* Concept Card (Right side) */
                      <motion.div
                        initial={reducedMotion ? false : { opacity: 0, x: 25, y: 15 }}
                        whileInView={{ opacity: 1, x: 0, y: 0 }}
                        viewport={{ once: true, margin: "-120px" }}
                        transition={{ duration: 0.6, ease: EASE }}
                        onMouseMove={spotlightMove}
                        className="rounded-2xl p-6 md:p-7 spotlight-card relative h-full bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                        style={{
                          border: `1px solid ${colors.hairlineStrong}`,
                          boxShadow: "0 8px 26px -8px rgba(20,23,26,0.08)",
                        }}
                      >
                        <div className="flex items-center justify-between gap-3 mb-3.5">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                              style={{ background: colors.cobaltSoft }}
                            >
                              <Icon size={16} style={{ color: colors.cobalt }} />
                            </div>
                            <span
                              className="text-xs font-semibold uppercase tracking-wider"
                              style={{ ...mono, color: colors.cobalt }}
                            >
                              {step.label}
                            </span>
                          </div>
                          <span
                            className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full shrink-0"
                            style={{
                              background: colors.verifiedSoft,
                              color: colors.verified,
                              border: `1px solid ${colors.verifiedBorder}`,
                            }}
                          >
                            {step.badge}
                          </span>
                        </div>

                        <h4
                          className="text-base md:text-lg font-semibold mb-2 leading-snug"
                          style={{ ...serif, color: colors.ink }}
                        >
                          {step.headline}
                        </h4>

                        <p className="text-sm leading-relaxed mb-4" style={{ color: colors.slate }}>
                          {step.detail}
                        </p>

                        <div
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium"
                          style={{
                            background: colors.surface2,
                            border: `1px solid ${colors.hairline}`,
                            color: colors.slate,
                            ...mono,
                          }}
                        >
                          <CheckCircle2 size={13} style={{ color: colors.verified }} className="shrink-0" />
                          <span className="truncate">{step.techCode}</span>
                        </div>
                      </motion.div>
                    ) : (
                      /* Live Step Inspector (Right side) */
                      <motion.div
                        initial={reducedMotion ? false : { opacity: 0, x: 25, y: 15 }}
                        whileInView={{ opacity: 1, x: 0, y: 0 }}
                        viewport={{ once: true, margin: "-120px" }}
                        transition={{ duration: 0.6, ease: EASE }}
                        className="rounded-2xl p-6 bg-white border border-[#CBCFC9] shadow-md h-full flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E2E4E1]">
                          <span className="text-[11px] font-bold text-[#1E2A5E] flex items-center gap-1.5" style={mono}>
                            <Terminal size={12} /> {step.artifact.tag}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-[#1F7A5C]/10 text-[#1F7A5C]">
                            LIVE VERIFIED
                          </span>
                        </div>
                        <div className="flex-1 my-1">{step.artifact.render()}</div>
                        <div className="pt-2.5 mt-2 border-t border-[#E2E4E1] flex items-center justify-between text-[11px] text-[#93968F]" style={mono}>
                          <span>Artifact: {step.artifact.title}</span>
                          <span className="text-[#1F7A5C] flex items-center gap-1">
                            <Activity size={12} /> OK (200)
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
