import { useState } from 'react';
import { Network, ChevronDown, ChevronRight, GitBranch, Sparkles } from 'lucide-react';
import type { MindMapData } from '../../modules/studio/dto/studioDto';
import { colors, mono } from '../landing/tokens';

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

  const branchStyles = [
    { badge: 'bg-blue-100 text-blue-800 border-blue-300', dot: 'bg-blue-600', icon: 'text-blue-600' },
    { badge: 'bg-emerald-100 text-emerald-800 border-emerald-300', dot: 'bg-emerald-600', icon: 'text-emerald-600' },
    { badge: 'bg-amber-100 text-amber-800 border-amber-300', dot: 'bg-amber-600', icon: 'text-amber-600' },
    { badge: 'bg-purple-100 text-purple-800 border-purple-300', dot: 'bg-purple-600', icon: 'text-purple-600' },
    { badge: 'bg-rose-100 text-rose-800 border-rose-300', dot: 'bg-rose-600', icon: 'text-rose-600' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#5C6169]" style={mono}>
          <Network className="w-4 h-4 text-purple-600" />
          <span>{branches.length} Conceptual Branches</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={expandAll}
            className="px-3 py-1.5 rounded-full bg-white hover:bg-[#F5F6F4] border border-[#CBCFC9] text-[11px] font-mono font-semibold text-[#14171A] cursor-pointer shadow-xs"
          >
            Expand All
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="px-3 py-1.5 rounded-full bg-white hover:bg-[#F5F6F4] border border-[#CBCFC9] text-[11px] font-mono font-semibold text-[#14171A] cursor-pointer shadow-xs"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Central Root Node */}
      <div
        className="bg-white rounded-3xl p-6 shadow-sm relative overflow-hidden text-center"
        style={{ border: `1.5px solid ${colors.hairlineStrong}` }}
      >
        <div className="h-1 w-full bg-purple-600 absolute top-0 left-0 right-0" />
        <span className="text-[10px] font-mono font-bold text-purple-700 uppercase tracking-wider flex items-center justify-center space-x-1 mb-1" style={mono}>
          <Sparkles className="w-3 h-3 text-purple-600" />
          <span>Central Knowledge Core</span>
        </span>
        <h2 className="text-base md:text-lg font-bold text-[#14171A]">
          {root?.label || data.mapTitle}
        </h2>
      </div>

      {/* Primary & Sub Branches Tree */}
      <div className="space-y-4">
        {branches.map((branch, bIdx) => {
          const isExpanded = expandedBranches[bIdx] ?? true;
          const style = branchStyles[bIdx % branchStyles.length];

          return (
            <div
              key={bIdx}
              className="bg-white border border-[#CBCFC9] rounded-3xl overflow-hidden shadow-xs hover:border-purple-300 transition-all"
            >
              {/* Branch Header */}
              <button
                type="button"
                onClick={() => toggleBranch(bIdx)}
                className="w-full p-4.5 flex items-center justify-between text-left hover:bg-[#FAFBF9] transition cursor-pointer"
              >
                <div className="flex items-center space-x-3 min-w-0 pr-2">
                  <div className={`p-1.5 rounded-xl border flex items-center justify-center ${style.badge}`}>
                    <GitBranch className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs md:text-sm font-bold text-[#14171A] truncate">
                      {branch.label}
                    </h3>
                    <span className="text-[11px] font-mono text-[#5C6169]" style={mono}>
                      {branch.subBranches?.length || 0} Sub-nodes
                    </span>
                  </div>
                </div>

                <div className="p-1 rounded-lg bg-[#F5F6F4] text-[#5C6169]">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </div>
              </button>

              {/* Sub Branches & Concepts */}
              {isExpanded && branch.subBranches && branch.subBranches.length > 0 && (
                <div className="p-5 pt-0 border-t space-y-3" style={{ borderColor: colors.hairline }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
                    {branch.subBranches.map((sub, sIdx) => (
                      <div
                        key={sIdx}
                        className="bg-[#FAFBF9] p-3.5 rounded-2xl border border-[#E2E4E1] space-y-2 text-xs hover:border-[#CBCFC9] transition"
                      >
                        <div className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`} />
                          <h4 className="font-bold text-[#14171A] text-xs">
                            {sub.label}
                          </h4>
                        </div>

                        {sub.keyDetails && sub.keyDetails.length > 0 && (
                          <ul className="space-y-1 pl-4">
                            {sub.keyDetails.map((detail, dIdx) => (
                              <li key={dIdx} className="text-[11px] text-[#5C6169] list-disc leading-relaxed">
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
