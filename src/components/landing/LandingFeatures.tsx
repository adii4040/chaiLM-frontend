import { Layers, Video, FileCheck } from 'lucide-react';

export default function LandingFeatures() {
  return (
    <section id="features" className="max-w-6xl mx-auto px-6 space-y-12">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-normal text-chailm-textMain tracking-tight">
          The Precision Grounding Architecture
        </h2>
        <p className="text-xs sm:text-sm text-chailm-textMuted max-w-xl mx-auto">
          Built for zero hallucination research across heterogeneous video streams and documents.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Feature 1 */}
        <div className="bg-chailm-panel border border-chailm-border hover:border-chailm-accentBlue/40 rounded-3xl p-6 space-y-4 transition-all hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)]">
          <div className="w-10 h-10 rounded-2xl bg-chailm-card border border-chailm-border flex items-center justify-center text-chailm-accentBlue">
            <Layers className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-chailm-textMain">Session-Isolated Workspaces</h3>
            <p className="text-xs text-chailm-textMuted leading-relaxed">
              Index multiple YouTube videos and PDF documents into dedicated session scopes to prevent cross-topic context bleed.
            </p>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="bg-chailm-panel border border-chailm-border hover:border-chailm-accentBlue/40 rounded-3xl p-6 space-y-4 transition-all hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)]">
          <div className="w-10 h-10 rounded-2xl bg-chailm-card border border-chailm-border flex items-center justify-center text-rose-400">
            <Video className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-chailm-textMain">Deep Temporal Video Indexing</h3>
            <p className="text-xs text-chailm-textMuted leading-relaxed">
              Maps spoken dialogue and visual themes to exact second-level video timestamps for instant playback verification.
            </p>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="bg-chailm-panel border border-chailm-border hover:border-chailm-accentBlue/40 rounded-3xl p-6 space-y-4 transition-all hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.5)]">
          <div className="w-10 h-10 rounded-2xl bg-chailm-card border border-chailm-border flex items-center justify-center text-amber-400">
            <FileCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-chailm-textMain">Page-Level Citation Verification</h3>
            <p className="text-xs text-chailm-textMuted leading-relaxed">
              Every claim in synthesized executive summaries is anchored to page-specific excerpts in uploaded PDF documents.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
