import { motion } from "framer-motion";
import {
  FileText,
  Sparkles,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  ArrowDown,
} from "lucide-react";
import { colors, serif, mono, EASE, spotlightMove } from "./tokens";
import { SectionEyebrow } from "./SharedAtoms";

const HOW_IT_WORKS = [
  {
    n: "01",
    icon: FileText,
    title: "Upload any content",
    desc: "Drop in a PDF research paper, paste a YouTube lecture URL, or insert a web article — all into one isolated workspace.",
    tag: "PDFs · YouTube · Web",
  },
  {
    n: "02",
    icon: Sparkles,
    title: "Ask anything",
    desc: "Type questions in plain English or Hinglish. ChaiLM expands your query from five distinct semantic retrieval angles.",
    tag: "5-Angle Query Expansion",
  },
  {
    n: "03",
    icon: ShieldCheck,
    title: "Verify with citations",
    desc: "Read concise takeaways backed by clickable video timestamp badges and PDF page numbers.",
    tag: "Timestamp Deep-Links",
  },
  {
    n: "04",
    icon: BookOpen,
    title: "Master in the Studio",
    desc: "One click generates complete Study Guides, Flashcard decks, Mind Maps, Quizzes, and Audio Overviews.",
    tag: "5 Studio Artifacts",
  },
];

export function HowItWorks({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <section id="how" className="px-6 py-24" style={{ borderTop: `1px solid ${colors.hairline}` }}>
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-14">
          <SectionEyebrow>HOW IT WORKS</SectionEyebrow>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight" style={{ ...serif, color: colors.ink }}>
            From raw source to verified answer, in four steps.
          </h2>
        </div>

        {/* 4 Steps Grid with Animated Arrow Connectors */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4 relative">
          {HOW_IT_WORKS.map((step, i) => {
            const Icon = step.icon;
            const isLast = i === HOW_IT_WORKS.length - 1;

            return (
              <div key={step.n} className="relative flex flex-col">
                <motion.div
                  initial={reducedMotion ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={
                    reducedMotion
                      ? {}
                      : {
                          y: -5,
                          transition: { duration: 0.25, ease: EASE },
                        }
                  }
                  transition={{ duration: 0.55, delay: reducedMotion ? 0 : i * 0.1, ease: EASE }}
                  onMouseMove={spotlightMove}
                  className="group relative p-7 rounded-2xl spotlight-card transition-all duration-300 hover:shadow-xl hover:z-20 cursor-default flex flex-col justify-between h-full overflow-hidden"
                  style={{
                    background: colors.surface,
                    border: `1px solid ${colors.hairline}`,
                    boxShadow: "0 4px 20px -8px rgba(20,23,26,0.06)",
                  }}
                >
                  {/* Sliding green top indicator: slides in on hover, stays while hovered, retreats on leave */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[3.5px] bg-[#1F7A5C] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left pointer-events-none"
                  />

                  <div>
                    {/* Header: Step Number & Icon */}
                    <div className="flex items-center justify-between mb-5">
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#F0F1EE] text-[#5C6169] transition-colors duration-200 group-hover:bg-[#1F7A5C]/15 group-hover:text-[#1F7A5C]"
                        style={mono}
                      >
                        STEP {step.n}
                      </span>
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:bg-[#1F7A5C] group-hover:scale-110 shadow-xs"
                        style={{ background: colors.verifiedSoft }}
                      >
                        <Icon size={17} className="text-[#1F7A5C] group-hover:text-white transition-colors duration-200" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3
                      className="font-semibold text-base md:text-lg mb-2.5 transition-colors duration-200 group-hover:text-[#1E2A5E]"
                      style={{ color: colors.ink }}
                    >
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm leading-relaxed text-[#5C6169] mb-4">
                      {step.desc}
                    </p>
                  </div>

                  {/* Bottom Feature Tag */}
                  <div className="pt-3 border-t border-[#E2E4E1] flex items-center justify-between text-xs">
                    <span className="text-[11px] font-semibold text-[#1F7A5C]" style={mono}>
                      {step.tag}
                    </span>
                  </div>
                </motion.div>

                {/* Arrow Connector between steps */}
                {!isLast && (
                  <>
                    {/* Desktop Right Arrow */}
                    <div className="hidden md:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-30 pointer-events-none items-center justify-center">
                      <div className="w-7 h-7 rounded-full bg-white border border-[#CBCFC9] shadow-sm flex items-center justify-center text-[#5C6169]">
                        <ArrowRight size={13} className="text-[#1F7A5C]" />
                      </div>
                    </div>

                    {/* Mobile Down Arrow */}
                    <div className="md:hidden flex justify-center my-2 pointer-events-none">
                      <div className="w-6 h-6 rounded-full bg-white border border-[#CBCFC9] shadow-sm flex items-center justify-center text-[#1F7A5C]">
                        <ArrowDown size={12} />
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
