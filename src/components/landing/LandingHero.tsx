import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import { colors, serif, mono, EASE } from "./tokens";
import { MagneticButton, Pill, ExhibitStamp } from "./SharedAtoms";
import { StudioCoverflow } from "./StudioCoverflow";

const HEADLINE = [
  { text: "Turn" }, { text: "any" }, { text: "video," }, { text: "PDF," }, { text: "or" }, { text: "article" },
  { text: "into", accent: false }, { text: "active", accent: true }, { text: "intelligence.", accent: true },
];

export function LandingHero({ reducedMotion }: { reducedMotion: boolean }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  };

  return (
    <section className="relative pt-16 pb-20 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <Pill style={{ marginBottom: 28 }}>
            <span className={`w-2 h-2 rounded-full ${reducedMotion ? "" : "pulse-dot"}`} style={{ background: colors.verified }} />
            <span style={mono} className="font-medium">Source-Grounded Multi-Modal Research Engine</span>
          </Pill>
        </motion.div>

        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-4xl md:text-6xl font-medium tracking-tight leading-[1.08] mb-7 text-left"
          style={{ ...serif, color: colors.ink }}
        >
          {HEADLINE.map((w, i) => (
            <motion.span
              key={i}
              variants={itemVariants}
              className="inline-block"
              style={w.accent ? { color: colors.verified } : {}}
            >
              {w.text}&nbsp;
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
          className="text-lg max-w-2xl mb-8 leading-relaxed"
          style={{ color: colors.slate }}
        >
          ChaiLM ingests your PDFs, YouTube lectures, and web articles into one workspace, then answers with citations you can click — a page number
          <ExhibitStamp small> Page 12 </ExhibitStamp>
          {" "}or a video timestamp
          <ExhibitStamp small> 00:14:22 </ExhibitStamp>
          {" "}that jumps straight to the source.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75, ease: EASE }}
          className="flex flex-wrap items-center gap-4 mb-16"
        >
          <MagneticButton to="/signup" reducedMotion={reducedMotion} style={{ background: colors.cobalt, color: "#fff" }}>
            Get Started for Free <ArrowRight size={16} />
          </MagneticButton>
          <MagneticButton href="#demo" reducedMotion={reducedMotion} style={{ border: `1px solid ${colors.hairlineStrong}`, color: colors.ink }}>
            <PlayCircle size={16} /> Explore Live Sandbox
          </MagneticButton>
        </motion.div>
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
