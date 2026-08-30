import { colors, serif, mono } from "./tokens";

export function LandingFooter() {
  return (
    <footer className="px-6 py-8" style={{ borderTop: `1px solid ${colors.hairline}` }}>
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs font-medium" style={{ color: colors.slateFaint }}>
        <div style={serif}>
          chai<span style={{ color: colors.verified }}>LM</span> — Multimodal Video &amp; Document Intelligence
        </div>
        <div className="flex gap-5 flex-wrap" style={mono}>
          <span>Vector Index: Qdrant</span>
          <span>Reranker: Cohere</span>
          <span>Synthesizer: GPT-4o-mini</span>
        </div>
      </div>
    </footer>
  );
}
