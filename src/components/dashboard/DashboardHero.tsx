import { Layers } from 'lucide-react';

interface DashboardHeroProps {
  totalCount: number;
}

export default function DashboardHero({ totalCount }: DashboardHeroProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-chailm-border pb-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-normal text-chailm-textMain tracking-tight">
          Your Workspaces
        </h1>
        <p className="text-xs text-chailm-textMuted leading-relaxed">
          Select an active session to query YouTube videos and PDF documents, or create a new session.
        </p>
      </div>

      {/* Total Summary Pill */}
      <div className="flex items-center space-x-2 bg-chailm-panel px-4 py-2 rounded-2xl border border-chailm-border text-xs text-chailm-textMuted self-start md:self-auto">
        <Layers className="w-4 h-4 text-chailm-accentBlue" />
        <span>Total Workspaces:</span>
        <span className="text-chailm-textMain font-mono font-bold">{totalCount}</span>
      </div>
    </div>
  );
}
