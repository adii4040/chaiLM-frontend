import { Layers } from 'lucide-react';
import { colors, serif, mono } from '../landing/tokens';

interface DashboardHeroProps {
  totalCount: number;
}

export default function DashboardHero({ totalCount }: DashboardHeroProps) {
  return (
    <div
      className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6"
      style={{ borderBottom: `1px solid ${colors.hairline}` }}
    >
      <div className="space-y-1.5 text-left">
        <h1
          className="text-3xl md:text-4xl font-medium tracking-tight"
          style={{ ...serif, color: colors.ink }}
        >
          Your Workspaces
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: colors.slate }}>
          Select an active session to query YouTube videos, PDFs, and documentation, or create a new session.
        </p>
      </div>

      {/* Total Summary Pill */}
      <div
        className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold self-start md:self-auto"
        style={{
          background: colors.verifiedSoft,
          color: colors.verified,
          border: `1px solid ${colors.verifiedBorder}`,
          ...mono,
        }}
      >
        <Layers className="w-3.5 h-3.5" />
        <span>TOTAL WORKSPACES:</span>
        <span className="font-bold">{totalCount}</span>
      </div>
    </div>
  );
}
