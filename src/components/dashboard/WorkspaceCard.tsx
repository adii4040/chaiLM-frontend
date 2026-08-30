import React from 'react';
import { Trash2, Video, Globe, FileText, Clock, ArrowRight } from 'lucide-react';
import type { WorkspaceSummaryItem } from '../../modules/workspace/dto/workspaceDto';
import { colors, mono, spotlightMove } from '../landing/tokens';

interface WorkspaceCardProps {
  session: WorkspaceSummaryItem;
  onOpenWorkspace: (workspaceId: string) => void;
  onDeleteWorkspace: (workspaceId: string, title: string, e: React.MouseEvent) => void;
}

function formatRelativeTime(isoString: string): string {
  if (!isoString) return 'Recently';
  const date = new Date(isoString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function WorkspaceCard({
  session,
  onOpenWorkspace,
  onDeleteWorkspace,
}: WorkspaceCardProps) {
  const id = session.workspaceId || session.sessionId || '';

  return (
    <div
      onClick={() => onOpenWorkspace(id)}
      onMouseMove={spotlightMove}
      className="bg-white rounded-2xl p-6 flex flex-col justify-between space-y-4 transition-all duration-300 cursor-pointer group hover:shadow-xl hover:-translate-y-1 relative overflow-hidden spotlight-card"
      style={{
        border: `1px solid ${colors.hairlineStrong}`,
        boxShadow: '0 4px 18px -6px rgba(20,23,26,0.06)',
      }}
    >
      {/* Top sliding green indicator line on hover */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#1F7A5C] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

      {/* Top Card Header */}
      <div className="space-y-2">
        <div className="flex items-start justify-between space-x-2">
          <h3 className="text-base font-semibold text-[#14171A] group-hover:text-[#1E2A5E] transition-colors line-clamp-1">
            {session.title}
          </h3>

          {/* Quick Delete Action */}
          <button
            onClick={(e) => onDeleteWorkspace(id, session.title, e)}
            title="Delete Workspace"
            className="text-[#93968F] hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 cursor-pointer shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-2 text-[10px] text-[#93968F]" style={mono}>
          <span>ID: {id.length > 22 ? `${id.substring(0, 20)}...` : id}</span>
        </div>
      </div>

      {/* Sources Summary List */}
      <div className="space-y-2.5 pt-3 border-t" style={{ borderColor: colors.hairline }}>
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#5C6169] font-medium">Indexed Sources</span>
          <span
            className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
            style={{
              ...mono,
              background: colors.verifiedSoft,
              color: colors.verified,
              border: `1px solid ${colors.verifiedBorder}`,
            }}
          >
            {session.sourceCount} {session.sourceCount === 1 ? 'Source' : 'Sources'}
          </span>
        </div>

        {session.sourcesSummary && session.sourcesSummary.length > 0 ? (
          <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
            {session.sourcesSummary.map((src, idx) => (
              <div
                key={src.sourceId || idx}
                className="flex items-center space-x-2 text-xs p-2 rounded-xl border transition-colors"
                style={{
                  background: colors.surface2,
                  borderColor: colors.hairline,
                }}
              >
                {src.sourceType === 'youtube' ? (
                  <Video className="w-3.5 h-3.5 text-red-500 shrink-0" />
                ) : src.sourceType === 'website' ? (
                  <Globe className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                )}
                <span className="text-[#14171A] truncate text-xs font-medium">
                  {src.title}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-[#93968F] italic py-2">
            No sources indexed yet
          </div>
        )}
      </div>

      {/* Card Footer Metadata */}
      <div className="pt-3 border-t flex items-center justify-between text-xs text-[#5C6169]" style={{ borderColor: colors.hairline }}>
        <span className="flex items-center space-x-1.5 text-[11px]">
          <Clock className="w-3.5 h-3.5 text-[#93968F]" />
          <span>Updated {formatRelativeTime(session.updatedAt)}</span>
        </span>

        <span className="text-[#1F7A5C] group-hover:translate-x-1 transition-transform flex items-center space-x-1 font-semibold text-xs">
          <span>Open Workspace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
}
