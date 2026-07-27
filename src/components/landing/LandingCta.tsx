import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function LandingCta() {
  const navigate = useNavigate();

  return (
    <section className="max-w-4xl mx-auto px-6 text-center pt-8">
      <div className="bg-chailm-panel border border-chailm-border rounded-3xl p-10 space-y-6 relative overflow-hidden shadow-[0_0_32px_-4px_rgba(168,199,250,0.12)]">
        <div className="brand-gradient-bar h-1 w-full absolute top-0 left-0"></div>

        <div className="space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl font-normal text-chailm-textMain tracking-tight">
            Ready to explore grounded workspace intelligence?
          </h2>
          <p className="text-xs text-chailm-textMuted leading-relaxed">
            Create your first isolated session and index YouTube videos or PDFs in seconds.
          </p>
        </div>

        <button
          onClick={() => navigate('/workspace')}
          className="px-8 py-3.5 bg-chailm-accentBlue/20 hover:bg-chailm-accentBlue/30 text-chailm-accentBlue font-medium rounded-full text-xs border border-chailm-accentBlue/50 transition-all cursor-pointer inline-flex items-center space-x-2 shadow-xl"
        >
          <span>Launch Workspace Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
