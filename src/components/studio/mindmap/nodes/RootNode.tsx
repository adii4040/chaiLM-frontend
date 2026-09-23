import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import { Sparkles } from 'lucide-react';
import { THEMES, type MindMapTheme } from '../mindMapTheme';
import { mono } from '../../../landing/tokens';

export interface RootNodeData extends Record<string, unknown> {
  title: string;
  branchCount: number;
  totalSubNodes: number;
  orientation: 'LR' | 'TB';
  theme: MindMapTheme;
}

export function RootNode({ data }: NodeProps<Node<RootNodeData>>) {
  const isHorizontal = data.orientation === 'LR';
  const t = THEMES[data.theme || 'light'];

  return (
    <div
      className={`w-[320px] ${t.rootCard} rounded-2xl border-2 ${t.rootBorder} shadow-md p-4 text-center relative overflow-hidden transition-all hover:shadow-lg`}
    >
      <div className="h-1.5 w-full bg-linear-to-r from-purple-600 via-indigo-600 to-blue-600 absolute top-0 left-0 right-0" />

      <div className="pt-1 pb-1">
        <span
          className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 mb-2"
          style={mono}
        >
          <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" />
          <span>Central Knowledge Core</span>
        </span>

        <h2 className={`text-sm md:text-base font-bold ${t.rootText} line-clamp-2 leading-snug px-1`}>
          {data.title}
        </h2>

        <div className="mt-2.5 flex items-center justify-center gap-2 text-[11px] font-mono opacity-80" style={mono}>
          <span className={`px-2 py-0.5 rounded-md ${t.buttonBg} border ${t.subCardBorder} ${t.buttonText}`}>
            {data.branchCount} Branches
          </span>
          <span className={t.detailText}>•</span>
          <span className={`px-2 py-0.5 rounded-md ${t.buttonBg} border ${t.subCardBorder} ${t.buttonText}`}>
            {data.totalSubNodes} Sub-topics
          </span>
        </div>
      </div>

      <Handle
        type="source"
        position={isHorizontal ? Position.Right : Position.Bottom}
        className="w-3.5! h-3.5! bg-purple-600! border-2! border-white! dark:border-slate-800! shadow-sm hover:scale-125 transition-transform"
      />
    </div>
  );
}
