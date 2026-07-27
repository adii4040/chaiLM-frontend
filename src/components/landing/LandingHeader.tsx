import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function LandingHeader() {
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-chailm-panel/80 backdrop-blur-md border-b border-chailm-border sticky top-0 z-50 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <span className="font-semibold text-chailm-textMain text-xl tracking-tight">chaiLM</span>
      </div>

      <div className="hidden md:flex items-center space-x-8 text-xs font-medium text-chailm-textMuted">
        <a href="#features" className="hover:text-chailm-textMain transition-colors">
          Architecture
        </a>
        <a href="#sandbox" className="hover:text-chailm-textMain transition-colors">
          Interactive Demo
        </a>
        <a href="#stack" className="hover:text-chailm-textMain transition-colors">
          Tech Stack
        </a>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate('/workspace')}
          className="flex items-center space-x-2 bg-chailm-accentBlue/10 hover:bg-chailm-accentBlue/20 text-chailm-accentBlue px-4 py-2 rounded-full text-xs font-medium border border-chailm-accentBlue/30 transition-all cursor-pointer"
        >
          <span>Launch Workspace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
}
