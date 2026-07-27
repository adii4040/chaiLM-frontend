import { Database, Cpu, Sparkles, Cloud } from 'lucide-react';

export default function LandingTechStack() {
  return (
    <section id="stack" className="max-w-4xl mx-auto px-6 text-center space-y-6">
      <span className="text-xs font-mono text-chailm-textMuted uppercase tracking-wider">
        Enterprise Infrastructure Foundation
      </span>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono text-chailm-textMuted">
        <div className="p-4 bg-chailm-panel border border-chailm-border rounded-2xl flex items-center justify-center space-x-2">
          <Database className="w-4 h-4 text-chailm-accentBlue" />
          <span>Qdrant Vector DB</span>
        </div>
        <div className="p-4 bg-chailm-panel border border-chailm-border rounded-2xl flex items-center justify-center space-x-2">
          <Cpu className="w-4 h-4 text-chailm-accentBlue" />
          <span>Cohere Rerank v3.5</span>
        </div>
        <div className="p-4 bg-chailm-panel border border-chailm-border rounded-2xl flex items-center justify-center space-x-2">
          <Sparkles className="w-4 h-4 text-chailm-accentBlue" />
          <span>OpenAI Structured</span>
        </div>
        <div className="p-4 bg-chailm-panel border border-chailm-border rounded-2xl flex items-center justify-center space-x-2">
          <Cloud className="w-4 h-4 text-chailm-accentBlue" />
          <span>Cloudinary Storage</span>
        </div>
      </div>
    </section>
  );
}
