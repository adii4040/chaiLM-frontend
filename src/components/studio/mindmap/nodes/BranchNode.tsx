import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import { GitBranch, ChevronDown, ChevronRight } from 'lucide-react';
import { THEMES, type BranchPalette, type MindMapTheme } from '../mindMapTheme';
import { mono } from '../../../landing/tokens';

export interface BranchNodeData extends Record<string, unknown> {
  label: string;
  branchIndex: number;
  subCount: number;
  isExpanded: boolean;
  onToggle: (idx: number) => void;
  palette: BranchPalette;
  orientation: 'LR' | 'TB';
  theme: MindMapTheme;
}

export function BranchNode({ data }: NodeProps<Node<BranchNodeData>>) {
  const isHorizontal = data.orientation === 'LR';
  const { palette } = data;
  const t = THEMES[data.theme || 'light'];

  return (
    <div
      onClick={() => {
        if (data.subCount > 0) {
          data.onToggle(data.branchIndex);
        }
      }}
      className={`w-[260px] ${t.branchCard} rounded-2xl border shadow-xs hover:shadow-md transition-all relative overflow-hidden ${
        data.subCount > 0 ? 'cursor-pointer hover:border-purple-400' : ''
      }`}
      style={{ borderColor: palette.stroke }}
    >
      <div className={`h-1 w-full ${palette.accentBar} absolute top-0 left-0 right-0`} />

      <Handle
        type="target"
        position={isHorizontal ? Position.Left : Position.Top}
        className="w-2.5! h-2.5! bg-gray-400! border-2! border-white! dark:border-slate-800! shadow-xs"
      />

      <div className="p-3.5 space-y-2">
        <div className="flex items-center justify-between">
          <span
            className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md border flex items-center gap-1 ${palette.badge}`}
            style={mono}
          >
            <GitBranch className="w-3 h-3" />
            <span>Branch {data.branchIndex + 1}</span>
          </span>

          {data.subCount > 0 && (
            <div
              className={`flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full border ${t.branchSubCountBg} ${t.branchSubCountText} font-semibold transition shadow-2xs`}
              title={data.isExpanded ? 'Collapse sub-nodes' : 'Expand sub-nodes'}
            >
              <span>{data.subCount}</span>
              {data.isExpanded ? (
                <ChevronDown className="w-3 h-3 opacity-70" />
              ) : (
                <ChevronRight className="w-3 h-3 opacity-70" />
              )}
            </div>
          )}
        </div>

        <h3 className={`text-xs font-bold ${t.branchText} leading-snug line-clamp-2`}>
          {data.label}
        </h3>
      </div>

      {data.isExpanded && data.subCount > 0 && (
        <Handle
          type="source"
          position={isHorizontal ? Position.Right : Position.Bottom}
          style={{ backgroundColor: palette.primary }}
          className="w-3! h-3! border-2! border-white! dark:border-slate-800! shadow-xs hover:scale-125 transition-transform"
        />
      )}
    </div>
  );
}
