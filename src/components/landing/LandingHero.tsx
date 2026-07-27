import { useNavigate } from 'react-router-dom';
import { ArrowRight, PlayCircle } from 'lucide-react';

export default function LandingHero() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 text-center">
      {/* Top Badge */}
      <div className="inline-flex items-center space-x-2 bg-chailm-panel px-4 py-1.5 rounded-full border border-chailm-border text-xs text-chailm-textMuted">
        <span className="w-2 h-2 rounded-full bg-chailm-accentBlue animate-pulse"></span>
        <span>Temporal Video & Document Intelligence</span>
      </div>

      {/* Headline */}
      <div className="space-y-4 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-6xl font-normal tracking-tight leading-tight text-chailm-textMain">
          Ground your research in <span className="text-chailm-accentBlue italic">video</span> and{' '}
          <span className="text-chailm-accentBlue italic">document</span> intelligence.
        </h1>
        <p className="text-sm sm:text-base text-chailm-textMuted max-w-2xl mx-auto leading-relaxed font-normal">
          Index YouTube videos and technical PDFs into unified session workspaces. Receive synthesized answers backed by second-level video frame offsets and page-accurate citations.
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="flex items-center justify-center space-x-4 pt-2">
        <button
          onClick={() => navigate('/workspace')}
          className="px-6 py-3 bg-chailm-accentBlue/15 hover:bg-chailm-accentBlue/25 text-chailm-accentBlue font-medium rounded-full text-xs border border-chailm-accentBlue/40 transition-all shadow-xl flex items-center space-x-2 cursor-pointer"
        >
          <span>Open Workspace Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <a
          href="#sandbox"
          className="px-6 py-3 bg-chailm-card hover:bg-chailm-hover text-chailm-textMain font-medium rounded-full text-xs border border-chailm-border transition-all cursor-pointer flex items-center space-x-2"
        >
          <PlayCircle className="w-4 h-4 text-chailm-accentBlue" />
          <span>Try Interactive Sandbox</span>
        </a>
      </div>
    </div>
  );
}
