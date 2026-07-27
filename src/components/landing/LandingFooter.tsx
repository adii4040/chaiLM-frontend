export default function LandingFooter() {
  return (
    <footer className="border-t border-chailm-border py-8 px-6 text-xs text-chailm-textMuted bg-chailm-panel">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-chailm-textMain">chaiLM</span>
          <span>— Multimodal Video & Document Intelligence</span>
        </div>

        <div className="flex items-center space-x-6 font-mono text-[11px]">
          <span>Vector Index: Qdrant</span>
          <span>Reranker: Cohere</span>
          <span>Synthesizer: GPT-4o-mini</span>
        </div>
      </div>
    </footer>
  );
}
