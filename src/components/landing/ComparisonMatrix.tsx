import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Minus } from "lucide-react";
import { colors, serif, mono, EASE } from "./tokens";
import { SectionEyebrow } from "./SharedAtoms";

const COMPARISON_ROWS = [
  { label: "Direct YouTube timestamp seek", chailm: { state: "yes", text: "Native — jumps to cited second" }, other: { state: "partial", text: "Transcript-grounded citations" } },
  { label: "Hinglish / phonetic retrieval", chailm: { state: "yes", text: "Dedicated phonetic-to-Devanagari mapping" }, other: { state: "partial", text: "80+ languages; no phonetic mapping" } },
  { label: "PDF + YouTube + Web, unified workspace", chailm: { state: "yes", text: "Unified" }, other: { state: "yes", text: "Supported" } },
  { label: "Flashcards, quizzes & mind maps", chailm: { state: "yes", text: "Built-in Studio" }, other: { state: "yes", text: "Built-in Studio" } },
  { label: "Two-host audio overview", chailm: { state: "yes", text: "Supported" }, other: { state: "yes", text: "Supported" } },
  { label: "Multi-stage retrieval pipeline", chailm: { state: "yes", text: "Query expansion → Step-back → HyDE → RRF → Rerank" }, other: { state: "none", text: "Not publicly documented" } },
];

function StateMark({ state }: { state: string }) {
  if (state === "yes") return <CheckCircle2 size={15} style={{ color: colors.verified, flexShrink: 0 }} />;
  if (state === "partial") return <span className="w-[15px] h-[15px] rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold" style={{ border: `1.5px solid ${colors.hairlineStrong}`, color: colors.slateFaint }}>~</span>;
  return <Minus size={15} style={{ color: colors.slateFaint, flexShrink: 0 }} />;
}

export function ComparisonMatrix({ reducedMotion }: { reducedMotion: boolean }) {
  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: EASE,
        staggerChildren: 0.07, // Fast sequential cascade
        delayChildren: 0.08,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -16, y: 6 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.36,
        ease: EASE,
      },
    },
  };

  return (
    <section id="compare" className="px-6 py-24" style={{ borderTop: `1px solid ${colors.hairline}` }}>
      <div className="max-w-5xl mx-auto">
        <div className="max-w-2xl mb-12">
          <SectionEyebrow>WHY CHAILM IS DIFFERENT</SectionEyebrow>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-3" style={{ ...serif, color: colors.ink }}>
            Compared to Gemini Notebook.
          </h2>
          <p style={{ color: colors.slate }}>
            Gemini Notebook is a strong product — this is where ChaiLM's RAG implementation differs with precise deep-linking and multi-angle retrieval.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial={reducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="rounded-xl overflow-hidden shadow-sm"
          style={{ border: `1px solid ${colors.hairline}`, background: colors.surface }}
        >
          {/* Table Header */}
          <div
            className="grid grid-cols-[1fr_auto_auto] md:grid-cols-[2fr_1.2fr_1.2fr] text-xs font-semibold px-5 py-3.5"
            style={{
              background: colors.surface2,
              color: colors.slateFaint,
              ...mono,
              borderBottom: `1px solid ${colors.hairline}`,
            }}
          >
            <span>CAPABILITY</span>
            <span style={{ color: colors.cobalt }}>CHAILM</span>
            <span>GEMINI NOTEBOOK</span>
          </div>

          {/* Staggered Animated Table Rows */}
          {COMPARISON_ROWS.map((row, i) => (
            <motion.div
              key={row.label}
              variants={rowVariants}
              className="grid grid-cols-[1fr_auto_auto] md:grid-cols-[2fr_1.2fr_1.2fr] px-5 py-4 items-start gap-3 transition-colors duration-150 hover:bg-[#F5F6F4]/80"
              style={{
                borderBottom: i < COMPARISON_ROWS.length - 1 ? `1px solid ${colors.hairline}` : "none",
              }}
            >
              <span className="text-sm font-medium pr-2" style={{ color: colors.ink }}>
                {row.label}
              </span>
              <span className="flex items-start gap-1.5 text-xs font-medium" style={{ color: colors.slate }}>
                <StateMark state={row.chailm.state} /> <span className="hidden md:inline">{row.chailm.text}</span>
              </span>
              <span className="flex items-start gap-1.5 text-xs font-medium" style={{ color: colors.slate }}>
                <StateMark state={row.other.state} /> <span className="hidden md:inline">{row.other.text}</span>
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
