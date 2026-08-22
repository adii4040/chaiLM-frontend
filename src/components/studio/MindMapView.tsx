import { useState } from 'react';
import { Network, ChevronDown, ChevronRight, GitBranch, Sparkles } from 'lucide-react';
import type { MindMapData } from '../../modules/studio/dto/studioDto';

interface MindMapViewProps {
  data: MindMapData;
}

export default function MindMapView({ data }: MindMapViewProps) {
  const root = data.rootNode;
  const branches = root?.branches || [];
  const [expandedBranches, setExpandedBranches] = useState<Record<number, boolean>>(() => {
    const init: Record<number, boolean> = {};
    branches.forEach((_, idx) => {
      init[idx] = true;
    });
    return init;
  });

  const toggleBranch = (idx: number) => {
    setExpandedBranches((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const expandAll = () => {
    const all: Record<number, boolean> = {};
    branches.forEach((_, idx) => {
      all[idx] = true;
    });
    setExpandedBranches(all);
  };

  const collapseAll = () => {
    setExpandedBranches({});
  };

  const branchColors = [
    'border-blue-500/30 text-blue-400 bg-blue-500/10',
    'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    'border-amber-500/30 text-amber-400 bg-amber-500/10',
    'border-purple-500/30 text-purple-400 bg-purple-500/10',
    'border-rose-500/30 text-rose-400 bg-rose-500/10',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs font-mono text-chailm-textMuted">
          <Network className="w-4 h-4 text-chailm-accentBlue" />
          <span>{branches.length} Primary Conceptual Branches</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={expandAll}
            className="px-3 py-1.5 rounded-xl bg-chailm-card hover:bg-chailm-hover border border-chailm-border text-[11px] font-mono text-chailm-textMuted hover:text-chailm-textMain cursor-pointer"
          >
            Expand All
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="px-3 py-1.5 rounded-xl bg-chailm-card hover:bg-chailm-hover border border-chailm-border text-[11px] font-mono text-chailm-textMuted hover:text-chailm-textMain cursor-pointer"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Central Root Node */}
      <div className="bg-chailm-panel border border-chailm-accentBlue/40 rounded-3xl p-6 shadow-xl relative overflow-hidden text-center">
        <div className="brand-gradient-bar h-1 w-full absolute top-0 left-0"></div>
        <span className="text-[10px] font-mono text-chailm-accentBlue uppercase tracking-wider flex items-center justify-center space-x-1 mb-1">
          <Sparkles className="w-3 h-3" />
          <span>Central Core Node</span>
        </span>
        <h2 className="text-base md:text-lg font-semibold text-chailm-textMain">
          {root?.label || data.mapTitle}
        </h2>
      </div>

      {/* Primary & Sub Branches Tree */}
      <div className="space-y-4">
        {branches.map((branch, bIdx) => {
          const isExpanded = expandedBranches[bIdx] ?? true;
          const colorClass = branchColors[bIdx % branchColors.length];

          return (
            <div
              key={bIdx}
              className="bg-chailm-panel border border-chailm-border rounded-3xl overflow-hidden shadow-xs"
            >
              {/* Branch Header */}
              <button
                type="button"
                onClick={() => toggleBranch(bIdx)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-chailm-hover/50 transition cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <span className={`px-2.5 py-1 rounded-xl text-xs font-mono font-semibold border ${colorClass}`}>
                    Branch {bIdx + 1}
                  </span>
                  <h3 className="text-xs md:text-sm font-medium text-chailm-textMain">
                    {branch.label}
                  </h3>
                </div>

                <div className="flex items-center space-x-2 text-chailm-textMuted">
                  <span className="text-[10px] font-mono">
                    {branch.subBranches?.length || 0} sub-nodes
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </div>
              </button>

              {/* Sub Branches & Key Details */}
              {isExpanded && branch.subBranches && branch.subBranches.length > 0 && (
                <div className="p-5 pt-0 border-t border-chailm-border/60">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
                    {branch.subBranches.map((sub, sIdx) => (
                      <div
                        key={sIdx}
                        className="bg-chailm-card/70 border border-chailm-border/70 rounded-2xl p-4 space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <GitBranch className="w-3.5 h-3.5 text-chailm-accentBlue shrink-0" />
                          <h4 className="text-xs font-semibold text-chailm-textMain truncate">
                            {sub.label}
                          </h4>
                        </div>

                        {sub.keyDetails && sub.keyDetails.length > 0 && (
                          <ul className="space-y-1 pl-4 text-xs text-chailm-textMuted">
                            {sub.keyDetails.map((detail, dIdx) => (
                              <li key={dIdx} className="list-disc leading-relaxed">
                                {detail}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
