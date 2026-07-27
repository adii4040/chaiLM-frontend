import { Sparkles, Play, Video, FileText } from 'lucide-react';
import type { InspectorState } from './types';

interface LandingMockupProps {
  activeInspector: InspectorState;
  onSelectInspector: (inspector: InspectorState) => void;
}

export default function LandingMockup({ activeInspector, onSelectInspector }: LandingMockupProps) {
  return (
    <div className="pt-8 max-w-5xl mx-auto">
      <div className="bg-chailm-panel border border-chailm-border rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden text-left shadow-[0_0_32px_-4px_rgba(168,199,250,0.12)]">
        {/* Brand Top Gradient */}
        <div className="brand-gradient-bar h-1 w-full absolute top-0 left-0"></div>

        {/* Window Bar Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-chailm-border/60 text-xs text-chailm-textMuted">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
            <span className="ml-2 font-mono text-[11px] text-chailm-textMuted">
              session-439713ce-cb96
            </span>
          </div>

          <div className="flex items-center space-x-2 font-mono text-[11px]">
            <span className="text-emerald-400">● Grounding Scope Active</span>
          </div>
        </div>

        {/* Dual Pane Interactive Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Query & Synthesized Answer (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* User Query */}
            <div className="flex justify-end">
              <div className="bg-chailm-hover border border-chailm-border px-4 py-2.5 rounded-2xl text-xs font-medium text-chailm-textMain">
                What are the core bottlenecks in scaling Transformer context windows?
              </div>
            </div>

            {/* Executive Summary Card */}
            <div className="bg-chailm-card border border-chailm-border rounded-2xl p-4 space-y-2">
              <div className="text-[11px] font-medium text-chailm-accentBlue uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Executive Summary</span>
              </div>
              <p className="text-xs text-chailm-textMain leading-relaxed">
                Standard Transformer self-attention requires quadratic memory growth relative to sequence length, necessitating specialized kernel tiling algorithms like FlashAttention for scalable long-context processing.
              </p>
            </div>

            {/* Key Findings with Interactive Citations */}
            <div className="space-y-2">
              <div className="text-[11px] font-semibold text-chailm-textMuted uppercase tracking-wider">
                Grounded Evidence
              </div>

              <div className="space-y-2 text-xs leading-relaxed">
                <div className="bg-chailm-card p-3 rounded-xl border border-chailm-border flex flex-col space-y-2">
                  <span>
                    Self-attention matrix computation scales quadratically O(N²) with sequence length, creating severe VRAM bottlenecks during inference.
                  </span>
                  <div>
                    <button
                      onClick={() =>
                        onSelectInspector({
                          type: 'youtube',
                          videoId: 'zjkBMFhNj_g',
                          timeSec: 862,
                          formattedTime: '00:14:22',
                          title: 'Transformer Architecture & Scalable Attention Mechanics',
                        })
                      }
                      className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full text-[11px] font-mono cursor-pointer transition-all"
                    >
                      <Play className="w-3 h-3 text-rose-400" />
                      <span>[00:14:22] Jump to Video Frame</span>
                    </button>
                  </div>
                </div>

                <div className="bg-chailm-card p-3 rounded-xl border border-chailm-border flex flex-col space-y-2">
                  <span>
                    FlashAttention memory optimizations tile matrix multiplication to reduce SRAM memory access overhead by up to 3x.
                  </span>
                  <div>
                    <button
                      onClick={() =>
                        onSelectInspector({
                          type: 'youtube',
                          videoId: 'zjkBMFhNj_g',
                          timeSec: 1930,
                          formattedTime: '00:32:10',
                          title: 'Transformer Architecture & Scalable Attention Mechanics',
                        })
                      }
                      className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full text-[11px] font-mono cursor-pointer transition-all"
                    >
                      <Play className="w-3 h-3 text-rose-400" />
                      <span>[00:32:10] Jump to Video Frame</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Media Player Inspector (5 cols) */}
          <div className="lg:col-span-5 bg-chailm-card border border-chailm-border rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-medium border-b border-chailm-border/60 pb-2">
              <div className="flex items-center space-x-2 truncate">
                {activeInspector.type === 'youtube' ? (
                  <Video className="w-4 h-4 text-rose-400 shrink-0" />
                ) : (
                  <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                )}
                <span className="truncate text-chailm-textMain">{activeInspector.title}</span>
              </div>
            </div>

            {activeInspector.type === 'youtube' ? (
              <div className="space-y-3">
                <div className="aspect-video bg-black rounded-xl border border-chailm-border overflow-hidden">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube-nocookie.com/embed/${activeInspector.videoId}?start=${activeInspector.timeSec}&autoplay=1`}
                    title="YouTube player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-chailm-textMuted">SYNCED_OFFSET</span>
                  <span className="text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                    {activeInspector.formattedTime} ({activeInspector.timeSec}s)
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-chailm-bg border border-chailm-border rounded-xl p-6 text-center space-y-2 min-h-[180px] flex flex-col justify-center items-center">
                <FileText className="w-8 h-8 text-amber-400" />
                <div className="text-xs font-medium text-chailm-textMain">
                  Document Page {activeInspector.page}
                </div>
                <div className="text-[11px] text-chailm-textMuted">
                  Direct PDF page reference synchronized
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
