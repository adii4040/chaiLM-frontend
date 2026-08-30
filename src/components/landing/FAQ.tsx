import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { colors, serif, mono, EASE } from "./tokens";
import { SectionEyebrow } from "./SharedAtoms";

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

function FAQItem({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: typeof FAQ_ITEMS[0];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div style={{ borderBottom: `1px solid ${colors.hairline}` }}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-5 text-left cursor-pointer"
      >
        <span className="flex items-baseline gap-3">
          <span className="text-xs font-semibold" style={{ ...mono, color: colors.slateFaint }}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-medium text-base" style={{ color: colors.ink }}>
            {item.q}
          </span>
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
          style={{ border: `1px solid ${colors.hairlineStrong}` }}
        >
          <Plus size={12} style={{ color: colors.ink }} />
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="text-sm leading-relaxed pb-5 pl-8 pr-8" style={{ color: colors.slate }}>
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ({ reducedMotion }: { reducedMotion: boolean }) {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section id="faq" className="px-6 py-24" style={{ borderTop: `1px solid ${colors.hairline}` }}>
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: EASE }}
        className="max-w-3xl mx-auto"
      >
        <div className="mb-10">
          <SectionEyebrow>FAQ</SectionEyebrow>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight" style={{ ...serif, color: colors.ink }}>
            Frequently asked questions.
          </h2>
        </div>
        <div style={{ borderTop: `1px solid ${colors.hairline}` }}>
          {FAQ_ITEMS.map((item, i) => (
            <FAQItem
              key={item.q}
              item={item}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
