import { Terminal, ExternalLink } from 'lucide-react';
import type { SandboxDemo, SandboxTakeaway } from './types';

interface LandingSandboxProps {
  demos: SandboxDemo[];
  activeDemo: SandboxDemo;
  onSelectDemo: (demo: SandboxDemo) => void;
  onCitationClick: (takeaway: SandboxTakeaway) => void;
}

export default function LandingSandbox({
  demos,
  activeDemo,
  onSelectDemo,
  onCitationClick,
}: LandingSandboxProps) {
  return (
    <section id="sandbox" className="max-w-5xl mx-auto px-6 space-y-8">
      <div className="bg-chailm-panel border border-chailm-border rounded-3xl p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-chailm-border pb-6">
          <div>
            <h2 className="text-xl font-normal text-chailm-textMain tracking-tight">
              Interactive Query Sandbox
            </h2>
            <p className="text-xs text-chailm-textMuted mt-1">
              Test preset workspace queries across indexed YouTube and PDF sources.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center space-x-2">
            {demos.map((demo) => (
              <button
                key={demo.id}
                onClick={() => {
                  onSelectDemo(demo);
                  onCitationClick(demo.takeaways[0]);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  activeDemo.id === demo.id
                    ? 'bg-chailm-accentBlue/20 text-chailm-accentBlue border border-chailm-accentBlue/40'
                    : 'bg-chailm-card text-chailm-textMuted hover:text-chailm-textMain border border-chailm-border'
                }`}
              >
                {demo.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sandbox Output Display */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-xs font-mono text-chailm-textMuted">
            <Terminal className="w-4 h-4 text-chailm-accentBlue" />
            <span>QUERY: "{activeDemo.query}"</span>
          </div>

          <div className="bg-chailm-bg border border-chailm-border rounded-2xl p-5 space-y-4 text-xs">
            <div className="space-y-1">
              <span className="font-semibold text-chailm-accentBlue uppercase text-[10px]">
                Executive Summary
              </span>
              <p className="text-chailm-textMain leading-relaxed">{activeDemo.summary}</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-chailm-border">
              <span className="font-semibold text-chailm-textMuted uppercase text-[10px]">
                Verified Evidence & Citations
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeDemo.takeaways.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => onCitationClick(item)}
                    className="p-3 bg-chailm-card border border-chailm-border hover:border-chailm-accentBlue/40 rounded-xl space-y-2 cursor-pointer transition-all"
                  >
                    <p className="text-chailm-textMuted leading-relaxed">{item.text}</p>
                    <span className="inline-flex items-center space-x-1 text-[11px] font-mono text-chailm-accentBlue font-medium">
                      <ExternalLink className="w-3 h-3" />
                      <span>{item.citation}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
