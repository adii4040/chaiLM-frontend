import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Microscope,
  Code2,
  Mic2,
  Briefcase,
} from "lucide-react";
import { colors, serif, mono, EASE, spotlightMove } from "./tokens";
import { SectionEyebrow, ExhibitStamp } from "./SharedAtoms";

interface PersonaData {
  label: string;
  icon: React.ElementType;
  query: string;
  summary: string;
  evidence: { text: string; badge: string }[];
}

const PERSONAS: Record<string, PersonaData> = {
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

export function InteractiveDemo({ reducedMotion }: { reducedMotion: boolean }) {
  const [tab, setTab] = useState<string>("students");

  return (
    <section id="demo" className="px-6 py-24" style={{ borderTop: `1px solid ${colors.hairline}`, background: colors.surface2 }}>
      <div className="max-w-4xl mx-auto">
        <div className="max-w-2xl mb-10">
          <SectionEyebrow>BUILT FOR HOW YOU ACTUALLY WORK</SectionEyebrow>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight" style={{ ...serif, color: colors.ink }}>
            One engine, five very different workspaces.
          </h2>
        </div>
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="rounded-2xl p-6 md:p-8"
          style={{ background: colors.surface, border: `1px solid ${colors.hairline}` }}
        >
          <div className="flex gap-2 flex-wrap mb-6">
            {Object.entries(PERSONAS).map(([key, p]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer"
                style={{
                  background: tab === key ? colors.cobaltSoft : "transparent",
                  border: `1px solid ${tab === key ? colors.cobalt : colors.hairline}`,
                  color: tab === key ? colors.cobalt : colors.slate,
                }}
              >
                <p.icon size={14} /> {p.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="space-y-4"
            >
              <div className="text-sm flex items-start gap-2" style={{ color: colors.slateFaint, ...mono }}>
                <span style={{ color: colors.cobalt }}>{">_"}</span> QUERY: "{PERSONAS[tab].query}"
              </div>

              <div className="rounded-lg p-5" style={{ background: colors.surface2, border: `1px solid ${colors.hairline}` }}>
                <div className="text-xs font-semibold tracking-wider mb-2" style={{ color: colors.cobalt }}>EXECUTIVE SUMMARY</div>
                <p className="text-sm leading-relaxed mb-5" style={{ color: colors.slate }}>{PERSONAS[tab].summary}</p>
                <div className="text-xs font-semibold tracking-wider mb-3" style={{ color: colors.slateFaint }}>VERIFIED EVIDENCE &amp; CITATIONS</div>
                <div className="grid md:grid-cols-2 gap-3">
                  {PERSONAS[tab].evidence.map((e) => (
                    <div
                      key={e.badge}
                      onMouseMove={spotlightMove}
                      className="rounded-lg p-4 spotlight-card transition-transform duration-200 hover:-translate-y-0.5"
                      style={{ background: colors.surface, border: `1px solid ${colors.hairline}` }}
                    >
                      <p className="text-sm mb-3" style={{ color: colors.ink }}>{e.text}</p>
                      <ExhibitStamp>{e.badge}</ExhibitStamp>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
