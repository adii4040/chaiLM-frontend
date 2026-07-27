import React from 'react';
import { Trash2, Video, Globe, FileText, Clock, ArrowRight } from 'lucide-react';
import type { WorkspaceSummaryItem } from '../../modules/session/dto/sessionDto';

interface WorkspaceCardProps {
  session: WorkspaceSummaryItem;
  onOpenWorkspace: (sessionId: string) => void;
  onDeleteWorkspace: (sessionId: string, title: string, e: React.MouseEvent) => void;
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
  return (
    <div
      onClick={() => onOpenWorkspace(session.sessionId)}
      className="bg-chailm-panel border border-chailm-border hover:border-chailm-accentBlue/50 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all cursor-pointer group hover:shadow-[0_4px_20px_-2px_rgba(168,199,250,0.08)] relative"
    >
      {/* Top Card Header */}
      <div className="space-y-2">
        <div className="flex items-start justify-between space-x-2">
          <h3 className="text-sm font-medium text-chailm-textMain group-hover:text-chailm-accentBlue transition-colors line-clamp-1">
            {session.title}
          </h3>

          {/* Quick Action Options */}
          <button
            onClick={(e) => onDeleteWorkspace(session.sessionId, session.title, e)}
            title="Delete Workspace"
            className="text-chailm-textMuted hover:text-rose-400 p-1 hover:bg-chailm-hover rounded-lg transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center space-x-2 font-mono text-[10px] text-chailm-textMuted">
          <span>ID: {session.sessionId.length > 22 ? `${session.sessionId.substring(0, 20)}...` : session.sessionId}</span>
        </div>
      </div>

      {/* Sources Summary List */}
      <div className="space-y-2 pt-2 border-t border-chailm-border/60">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-chailm-textMuted font-medium">Indexed Sources</span>
          <span className="font-mono text-[10px] text-chailm-accentBlue bg-chailm-accentBlue/10 px-2 py-0.5 rounded-full border border-chailm-accentBlue/20">
            {session.sourceCount} {session.sourceCount === 1 ? 'Source' : 'Sources'}
          </span>
        </div>

        {session.sourcesSummary && session.sourcesSummary.length > 0 ? (
          <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
            {session.sourcesSummary.map((src, idx) => (
              <div
                key={idx}
                className="flex items-center space-x-2 text-xs bg-chailm-card p-2 rounded-xl border border-chailm-border/80"
              >
                {src.sourceType === 'youtube' ? (
                  <Video className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                ) : src.sourceType === 'website' ? (
                  <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                )}
                <span className="text-chailm-textMuted truncate text-[11px]">
                  {src.title}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-chailm-textMuted italic py-2">
            No sources indexed yet
          </div>
        )}
      </div>

      {/* Card Footer Metadata */}
      <div className="pt-3 border-t border-chailm-border/60 flex items-center justify-between text-[11px] text-chailm-textMuted">
        <span className="flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>Updated {formatRelativeTime(session.updatedAt)}</span>
        </span>

        <span className="text-chailm-accentBlue group-hover:translate-x-1 transition-transform flex items-center space-x-1 text-xs font-medium">
          <span>Open</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
}
