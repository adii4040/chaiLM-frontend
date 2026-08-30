import { useState } from "react";
import { motion } from "framer-motion";
import {
  Layers,
  ShieldCheck,
  Sparkles,
  Play,
  Video,
  CheckCircle2,
} from "lucide-react";
import { colors, serif, mono, EASE, spotlightMove } from "./tokens";
import { SectionEyebrow } from "./SharedAtoms";

const FEATURES = [
  {
    icon: Layers,
    title: "One workspace, every format",
    desc: "PDFs, YouTube lectures, and web articles live side by side in a single research workspace — no switching tools to cross-reference a claim.",
  },
  {
    icon: ShieldCheck,
    title: "Every answer, traceable",
    desc: "Nothing is asserted without a source. Each takeaway carries a clickable page number or video timestamp back to where it came from.",
  },
  {
    icon: Sparkles,
    title: "Beyond a single answer",
    desc: "The same grounded source material can become a study guide, a quiz, a mind map, or a two-host audio overview — on demand, in the Studio.",
  },
];

interface VideoCitation {
  timeSec: number;
  formattedTime: string;
  claim: string;
  topic: string;
}

const CITATIONS: VideoCitation[] = [
  {
    timeSec: 862,
    formattedTime: "00:14:22",
    claim: "Self-attention matrix computation scales quadratically O(N²) with sequence length, creating severe VRAM bottlenecks during inference.",
    topic: "Quadratic Attention Scaling",
  },
  {
    timeSec: 1930,
    formattedTime: "00:32:10",
    claim: "FlashAttention memory optimizations tile matrix multiplication to reduce SRAM memory access overhead by up to 3x.",
    topic: "SRAM IO-Aware Tiling",
  },
];

export function WhatIsChaiLM({ reducedMotion }: { reducedMotion: boolean }) {
  const [activeCitation, setActiveCitation] = useState<VideoCitation>(CITATIONS[0]);
  const videoId = "zjkBMFhNj_g"; // Andrej Karpathy: Let's build GPT from scratch

  const cardVariants = {
    hidden: { opacity: 0, y: 28, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.55,
        ease: EASE,
      },
    },
  };

  return (
    <section
      id="what-is-chailm"
      className="px-6 py-28 relative overflow-hidden"
      style={{ borderTop: `1px solid ${colors.hairline}` }}
    >
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Section Header with smooth in-view fade */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="max-w-3xl text-left"
        >
          <SectionEyebrow>WHAT IS CHAILM</SectionEyebrow>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight mb-4 leading-tight"
            style={{ ...serif, color: colors.ink }}
          >
            The autonomous multi-modal research &amp; knowledge engine.
          </h2>
          <p className="text-base md:text-lg leading-relaxed" style={{ color: colors.slate }}>
            ChaiLM reads your sources so you don't have to guess — it ingests documents, video, and the web into a single citation-grounded workspace, built for research, coursework, and professional review alike.
          </p>
        </motion.div>

        {/* 3 Square Cards Row with smooth staggered scroll reveals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                variants={cardVariants}
                initial={reducedMotion ? false : "hidden"}
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: reducedMotion ? 0 : i * 0.12 }}
                whileHover={
                  reducedMotion
                    ? {}
                    : {
                        y: -5,
                        transition: { duration: 0.25, ease: EASE },
                      }
                }
                onMouseMove={spotlightMove}
                className="group p-8 rounded-2xl spotlight-card bg-white border border-[#CBCFC9] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between min-h-[250px] relative overflow-hidden"
              >
                {/* Top green slide-in bar on hover */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#1F7A5C] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                <div>
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#1F7A5C] group-hover:scale-110 shadow-xs"
                    style={{ background: colors.verifiedSoft }}
                  >
                    <Icon size={19} className="text-[#1F7A5C] group-hover:text-white transition-colors duration-200" />
                  </div>

                  <h3
                    className="font-semibold text-lg mb-2.5 transition-colors duration-200 group-hover:text-[#1E2A5E]"
                    style={{ color: colors.ink }}
                  >
                    {f.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-[#5C6169]">
                    {f.desc}
                  </p>
                </div>

                <div className="pt-4 mt-2 border-t border-[#E2E4E1] flex items-center gap-1.5 text-xs text-[#1F7A5C] font-semibold" style={mono}>
                  <CheckCircle2 size={13} /> Built-in Grounding
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Live Interactive Query & Andrej Karpathy Video Player Showcase with smooth scroll reveal */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 35, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
          onMouseMove={spotlightMove}
          className="rounded-3xl p-6 md:p-9 spotlight-card bg-white border border-[#CBCFC9] shadow-xl overflow-hidden relative"
        >
          {/* Top verified bar */}
          <div className="h-1 w-full bg-[#1F7A5C] absolute top-0 left-0 right-0" />

          {/* Window Header */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E2E4E1] text-xs text-[#5C6169]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#1F7A5C] inline-block" />
              <span className="ml-2 font-mono text-[11px] font-semibold text-[#14171A]">
                session-karpathy-attention-mechanics
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="text-[#1F7A5C] font-bold">● Multi-Modal Grounding Active</span>
            </div>
          </div>

          {/* 2-Column Dual Pane */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Query & Synthesis (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              {/* User Query Bubble */}
              <div className="flex justify-end">
                <div className="bg-[#F0F1EE] border border-[#CBCFC9] px-4 py-3 rounded-2xl text-xs md:text-sm font-medium text-[#14171A] shadow-xs">
                  "What are the core bottlenecks in scaling Transformer context windows?"
                </div>
              </div>

              {/* Synthesized Executive Summary */}
              <div className="bg-[#F5F6F4] border border-[#E2E4E1] rounded-2xl p-4 md:p-5 space-y-2">
                <div className="text-[11px] font-bold text-[#1F7A5C] uppercase tracking-wider flex items-center gap-1.5" style={mono}>
                  <Sparkles size={14} />
                  <span>SYNTHESIZED EXECUTIVE TAKEAWAY</span>
                </div>
                <p className="text-xs md:text-sm text-[#14171A] leading-relaxed">
                  Standard Transformer self-attention scales quadratically with sequence length $O(N^2)$, causing severe GPU memory bandwidth bottlenecks during inference that require specialized memory tiling algorithms like FlashAttention.
                </p>
              </div>

              {/* Grounded Evidence Citations */}
              <div className="space-y-3">
                <div className="text-[11px] font-bold text-[#5C6169] uppercase tracking-wider" style={mono}>
                  GROUNDED CITATIONS (CLICK TO SEEK VIDEO)
                </div>

                <div className="space-y-2.5">
                  {CITATIONS.map((cit) => {
                    const isSelected = activeCitation.timeSec === cit.timeSec;
                    return (
                      <div
                        key={cit.timeSec}
                        onClick={() => setActiveCitation(cit)}
                        className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col gap-2 ${
                          isSelected
                            ? "bg-[#1F7A5C]/10 border-[#1F7A5C] shadow-xs"
                            : "bg-white border-[#E2E4E1] hover:border-[#CBCFC9]"
                        }`}
                      >
                        <p className="text-xs text-[#14171A] leading-relaxed">
                          {cit.claim}
                        </p>
                        <div className="flex items-center justify-between pt-1">
                          <button
                            type="button"
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                              isSelected
                                ? "bg-[#1F7A5C] text-white shadow-xs"
                                : "bg-[#1F7A5C]/15 text-[#1F7A5C] hover:bg-[#1F7A5C]/25"
                            }`}
                          >
                            <Play size={11} className={isSelected ? "fill-white" : "fill-[#1F7A5C]"} />
                            <span>[{cit.formattedTime}] Seek Video Frame</span>
                          </button>
                          <span className="text-[11px] text-[#5C6169]" style={mono}>
                            {cit.topic}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Interactive YouTube Player (5 cols) */}
            <div className="lg:col-span-5 rounded-2xl p-4 bg-[#F5F6F4] border border-[#E2E4E1] space-y-3">
              <div className="flex items-center justify-between text-xs font-medium border-b border-[#E2E4E1] pb-2.5">
                <div className="flex items-center gap-2 truncate">
                  <Video className="w-4 h-4 text-red-500 shrink-0" />
                  <span className="truncate text-[#14171A] font-semibold text-xs">
                    Andrej Karpathy: Let's build GPT from scratch
                  </span>
                </div>
              </div>

              {/* Responsive Embedded YouTube Iframe */}
              <div className="aspect-video bg-black rounded-xl border border-[#CBCFC9] overflow-hidden shadow-inner">
                <iframe
                  key={activeCitation.timeSec}
                  className="w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${videoId}?start=${activeCitation.timeSec}&autoplay=1`}
                  title="Andrej Karpathy YouTube Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Synced Offset Details */}
              <div className="flex items-center justify-between text-xs font-mono pt-1">
                <span className="text-[#5C6169] text-[11px]">SYNCED_TIMESTAMP</span>
                <span className="text-[#1F7A5C] font-bold bg-[#1F7A5C]/15 px-2.5 py-0.5 rounded-full border border-[#1F7A5C]/30 text-xs">
                  ⏱ {activeCitation.formattedTime} ({activeCitation.timeSec}s)
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
