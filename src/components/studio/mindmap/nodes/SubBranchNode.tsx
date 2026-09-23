import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import { THEMES, type BranchPalette, type MindMapTheme } from '../mindMapTheme';

export interface SubBranchNodeData extends Record<string, unknown> {
  label: string;
  keyDetails: string[];
  palette: BranchPalette;
  orientation: 'LR' | 'TB';
  theme: MindMapTheme;
}

export function SubBranchNode({ data }: NodeProps<Node<SubBranchNodeData>>) {
  const isHorizontal = data.orientation === 'LR';
  const { palette } = data;
  const t = THEMES[data.theme || 'light'];

  return (
    <div
      className={`w-[280px] ${t.subCard} rounded-xl border ${t.subCardBorder} shadow-xs hover:shadow-md transition-all p-3 space-y-2 relative`}
      style={{ borderLeftColor: palette.primary, borderLeftWidth: '3.5px' }}
    >
      <Handle
        type="target"
        position={isHorizontal ? Position.Left : Position.Top}
        style={{ backgroundColor: palette.primary }}
        className="w-2.5! h-2.5! border-2! border-white! dark:border-slate-800! shadow-xs"
      />

      <div className="flex items-start gap-1.5">
        <span className={`w-2 h-2 rounded-full shrink-0 mt-1 ${palette.dot}`} />
        <h4 className={`font-bold ${t.subText} text-xs leading-snug`}>
          {data.label}
        </h4>
      </div>

      {data.keyDetails && data.keyDetails.length > 0 && (
        <ul className={`space-y-1 pl-3.5 border-t ${t.detailBorder} pt-2`}>
          {data.keyDetails.map((detail, idx) => (
            <li key={idx} className={`text-[11px] ${t.detailText} list-disc leading-relaxed`}>
              {detail}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
