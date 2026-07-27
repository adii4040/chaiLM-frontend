import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, X, Layers, Trash2, ArrowRight, Video, FileText, Globe, Clock, FolderOpen, FolderPlus, Info } from 'lucide-react';
import { useGetAllSessions } from '../modules/session/query/useGetAllSessions';
import { useDeleteSession } from '../modules/session/mutation/useDeleteSession';
import type { WorkspaceSummaryItem } from '../modules/session/dto/sessionDto';

function generateRandomSessionId(): string {
  const uuid = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2, 11);
  return `session-${uuid}`;
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

export default function WorkspaceDashboardPage() {
  const navigate = useNavigate();
  const { data: response, isLoading } = useGetAllSessions();
  const { mutate: deleteSession } = useDeleteSession();

  const sessions: WorkspaceSummaryItem[] = response?.data || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'updatedAt' | 'sources' | 'title'>('updatedAt');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenWorkspace = (sessionId: string) => {
    navigate(`/workspace/${sessionId}`);
  };

  const handleCreateSessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSessionId = generateRandomSessionId();
    setIsCreateModalOpen(false);
    showNotification(`Navigating to new workspace...`);
    navigate(`/workspace/${newSessionId}`);
  };

  const handleDelete = (sessionId: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete workspace "${title}"?`)) {
      deleteSession(sessionId, {
        onSuccess: () => {
          showNotification(`Workspace "${title}" deleted.`);
        },
      });
    }
  };

  const filteredSessions = sessions
    .filter((s) => {
      const titleMatch = s.title.toLowerCase().includes(searchQuery.toLowerCase());
      const sourceMatch = (s.sourcesSummary || []).some((src) =>
        src.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return titleMatch || sourceMatch;
    })
    .sort((a, b) => {
      if (sortBy === 'updatedAt') return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      if (sortBy === 'sources') return b.sourceCount - a.sourceCount;
      return a.title.localeCompare(b.title);
    });

  return (
    <div className="min-h-screen flex flex-col bg-chailm-bg text-chailm-textMain font-sans selection:bg-chailm-accentBlue/20 selection:text-white">
      {/* TOP HEADER */}
      <header className="h-14 bg-chailm-panel border-b border-chailm-border px-6 flex items-center justify-between shrink-0 select-none sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-chailm-textMain text-lg tracking-tight">chaiLM</span>
          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-chailm-card text-chailm-textMuted border border-chailm-border">
            Workspace Manager
          </span>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2 bg-chailm-accentBlue/10 hover:bg-chailm-accentBlue/20 text-chailm-accentBlue px-4 py-1.5 rounded-full text-xs font-medium border border-chailm-accentBlue/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Workspace</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 space-y-8">
        {/* HERO BAR & STATS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-chailm-border pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-normal text-chailm-textMain tracking-tight">
              Your Workspaces
            </h1>
            <p className="text-xs text-chailm-textMuted leading-relaxed">
              Select an active session to query grounded transcripts and PDF documents, or create a new session.
            </p>
          </div>

          {/* Total Summary Pill */}
          <div className="flex items-center space-x-2 bg-chailm-panel px-4 py-2 rounded-2xl border border-chailm-border text-xs text-chailm-textMuted self-start md:self-auto">
            <Layers className="w-4 h-4 text-chailm-accentBlue" />
            <span>Total Workspaces:</span>
            <span className="text-chailm-textMain font-mono font-bold">{sessions.length}</span>
          </div>
        </div>

        {/* SEARCH & SORT BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Bar Input */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-chailm-textMuted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search workspaces or sources..."
              className="w-full pl-10 pr-4 py-2 bg-chailm-panel border border-chailm-border rounded-full text-xs text-chailm-textMain placeholder-chailm-textMuted focus:outline-none focus:border-chailm-accentBlue font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-chailm-textMuted hover:text-chailm-textMain cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center space-x-2 text-xs text-chailm-textMuted w-full sm:w-auto justify-end">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'updatedAt' | 'sources' | 'title')}
              className="bg-chailm-panel border border-chailm-border text-chailm-textMain rounded-xl px-3 py-1.5 focus:outline-none focus:border-chailm-accentBlue text-xs cursor-pointer"
            >
              <option value="updatedAt">Recently Updated</option>
              <option value="sources">Source Count</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* WORKSPACES GRID */}
        {isLoading ? (
          <div className="py-20 text-center text-chailm-textMuted italic text-xs">
            Loading workspaces...
          </div>
        ) : filteredSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSessions.map((session) => (
              <div
                key={session.sessionId}
                onClick={() => handleOpenWorkspace(session.sessionId)}
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
                      onClick={(e) => handleDelete(session.sessionId, session.title, e)}
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
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="bg-chailm-panel border border-chailm-border rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto my-12">
            <div className="w-12 h-12 rounded-2xl bg-chailm-card border border-chailm-border text-chailm-accentBlue flex items-center justify-center mx-auto">
              <FolderOpen className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-chailm-textMain">No workspaces found</h3>
              <p className="text-xs text-chailm-textMuted leading-relaxed">
                {searchQuery
                  ? `No active sessions matched "${searchQuery}". Try searching for another keyword or create a new workspace.`
                  : 'No active workspaces found. Create your first workspace session below.'}
              </p>
            </div>
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 bg-chailm-card hover:bg-chailm-hover text-chailm-textMain text-xs rounded-full border border-chailm-border transition-all cursor-pointer"
              >
                Clear Search
              </button>
            ) : (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 bg-chailm-accentBlue/10 hover:bg-chailm-accentBlue/20 text-chailm-accentBlue text-xs rounded-full border border-chailm-accentBlue/30 transition-all cursor-pointer"
              >
                Create Workspace
              </button>
            )}
          </div>
        )}
      </main>

      {/* CREATE WORKSPACE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-chailm-panel border border-chailm-border rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative overflow-hidden">
            {/* Brand Top Line */}
            <div className="brand-gradient-bar h-1 w-full absolute top-0 left-0"></div>

            <div className="flex items-center justify-between border-b border-chailm-border pb-3">
              <div className="flex items-center space-x-2">
                <FolderPlus className="w-4 h-4 text-chailm-accentBlue" />
                <h3 className="font-semibold text-chailm-textMain text-sm">Create New Workspace</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-chailm-textMuted hover:text-chailm-textMain cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSessionSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-chailm-textMuted mb-1 font-mono text-[11px]">Workspace Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Legal Research & Transcripts"
                  className="w-full px-4 py-2.5 bg-chailm-bg border border-chailm-border rounded-xl text-chailm-textMain placeholder-chailm-textMuted focus:outline-none focus:border-chailm-accentBlue font-sans text-xs"
                  autoFocus
                />
              </div>

              <p className="text-[11px] text-chailm-textMuted leading-relaxed">
                Creating a new workspace generates an isolated grounding context session. You can index YouTube videos and PDF documents inside.
              </p>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-chailm-textMuted hover:text-chailm-textMain text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-chailm-accentBlue/10 hover:bg-chailm-accentBlue/20 text-chailm-accentBlue font-medium rounded-full text-xs border border-chailm-accentBlue/30 transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <span>Create Session</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification Alert */}
      {notification && (
        <div className="fixed bottom-6 right-6 bg-chailm-panel border border-chailm-accentBlue/40 text-chailm-textMain px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-medium z-50 animate-in fade-in slide-in-from-bottom-2">
          <Info className="w-4 h-4 text-chailm-accentBlue" />
          <span>{notification}</span>
        </div>
      )}
    </div>
  );
}
