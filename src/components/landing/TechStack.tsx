import { motion } from "framer-motion";
import {
  Database,
  Cpu,
  Sparkles,
  Cloud,
  Globe2,
  GitBranch,
  ArrowRight,
} from "lucide-react";
import { colors, serif, mono, EASE, spotlightMove } from "./tokens";
import { MagneticButton } from "./SharedAtoms";

const STACK = [
  { icon: Database, label: "Qdrant Vector DB" },
  { icon: Cpu, label: "Cohere Rerank v3.5" },
  { icon: Sparkles, label: "OpenAI Structured Outputs" },
  { icon: Cloud, label: "Cloudinary Storage" },
  { icon: Globe2, label: "Firecrawl Web Crawler" },
  { icon: GitBranch, label: "Inngest Workflows" },
];

function Marquee({ reducedMotion }: { reducedMotion: boolean }) {
  const items = reducedMotion ? STACK : [...STACK, ...STACK];
  return (
    <div
      className="relative overflow-hidden py-2 mb-16"
      style={{
        maskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)",
      }}
    >
      <div className={`flex gap-3 w-max ${reducedMotion ? "flex-wrap justify-center w-full" : "marquee-track"}`}>
        {items.map((s, i) => (
          <div
            key={i}
            onMouseMove={spotlightMove}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium spotlight-card shrink-0"
            style={{ background: colors.surface, border: `1px solid ${colors.hairline}` }}
          >
            <s.icon size={15} style={{ color: colors.cobalt }} /> {s.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export function TechStack({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <section id="stack" className="px-6 py-24" style={{ borderTop: `1px solid ${colors.hairline}` }}>
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-xs font-semibold tracking-[0.18em] mb-6" style={{ color: colors.slateFaint, ...mono }}>
          ENTERPRISE INFRASTRUCTURE FOUNDATION
        </p>
        <Marquee reducedMotion={reducedMotion} />
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="rounded-2xl p-10 md:p-14"
          style={{ background: colors.ink, border: `1px solid ${colors.ink}` }}
        >
          <h3 className="text-2xl md:text-3xl font-medium mb-3" style={{ ...serif, color: "#F5F6F4" }}>
            Ready to explore grounded workspace intelligence?
          </h3>
          <p className="mb-8 text-sm md:text-base max-w-xl mx-auto" style={{ color: "rgba(245,246,244,0.7)" }}>
            Create your first isolated session and index YouTube videos or PDFs in seconds.
          </p>
          <MagneticButton to="/workspace" reducedMotion={reducedMotion} style={{ background: colors.verified, color: "#fff" }}>
            Launch Workspace Dashboard <ArrowRight size={16} />
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
