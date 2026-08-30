import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderOpen } from 'lucide-react';
import { useGetAllWorkspaces } from '../modules/workspace/query/useGetAllWorkspaces';
import { useCreateWorkspace } from '../modules/workspace/mutation/useCreateWorkspace';
import { useDeleteWorkspace } from '../modules/workspace/mutation/useDeleteWorkspace';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardHero from '../components/dashboard/DashboardHero';
import DashboardControls from '../components/dashboard/DashboardControls';
import WorkspaceCard from '../components/dashboard/WorkspaceCard';
import CreateWorkspaceModal from '../components/dashboard/CreateWorkspaceModal';
import DashboardNotification from '../components/dashboard/DashboardNotification';
import type { WorkspaceSummaryItem } from '../modules/workspace/dto/workspaceDto';
import { colors } from '../components/landing/tokens';

export default function WorkspaceDashboardPage() {
  const navigate = useNavigate();
  const { data: response, isLoading } = useGetAllWorkspaces();
  const { mutate: createWorkspace, isPending: isCreating } = useCreateWorkspace();
  const { mutate: deleteWorkspace } = useDeleteWorkspace();

  const sessions: WorkspaceSummaryItem[] = response?.data || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'updatedAt' | 'sources' | 'title'>('updatedAt');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenWorkspace = (workspaceId: string) => {
    navigate(`/workspace/${workspaceId}`);
  };

  const handleCreateWorkspaceSubmit = (title: string) => {
    createWorkspace(
      { title },
      {
        onSuccess: (res) => {
          setIsCreateModalOpen(false);
          showNotification(`Workspace "${res.data.title}" created successfully!`);
          navigate(`/workspace/${res.data.workspaceId}`);
        },
        onError: (err: any) => {
          showNotification(err?.message || 'Failed to create workspace');
        },
      }
    );
  };

  const handleDelete = (workspaceId: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete workspace "${title}"?`)) {
      deleteWorkspace(workspaceId, {
        onSuccess: () => {
          showNotification(`Workspace "${title}" deleted.`);
        },
        onError: (err: any) => {
          showNotification(err?.message || 'Failed to delete workspace');
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
    <div
      className="min-h-screen flex flex-col font-sans"
      style={{
        background: colors.paper,
        color: colors.ink,
      }}
    >
      {/* TOP HEADER */}
      <DashboardHeader onOpenCreateModal={() => setIsCreateModalOpen(true)} />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10 space-y-8">
        {/* HERO BAR & STATS */}
        <DashboardHero totalCount={sessions.length} />

        {/* SEARCH & SORT BAR */}
        <DashboardControls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* WORKSPACES GRID */}
        {isLoading ? (
          <div className="py-24 text-center text-[#5C6169] italic text-xs">
            Loading workspaces...
          </div>
        ) : filteredSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              <WorkspaceCard
                key={session.workspaceId || session.sessionId}
                session={session}
                onOpenWorkspace={handleOpenWorkspace}
                onDeleteWorkspace={handleDelete}
              />
            ))}

            {/* Create New Workspace Card at the end of grid */}
            <div
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-white/60 hover:bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3 transition-all duration-300 cursor-pointer group hover:shadow-xl hover:-translate-y-1 relative overflow-hidden min-h-[240px]"
              style={{
                border: `2px dashed ${colors.hairlineStrong}`,
              }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-[#1F7A5C] shadow-xs"
                style={{ background: colors.verifiedSoft }}
              >
                <FolderOpen className="w-6 h-6 text-[#1F7A5C] group-hover:text-white transition-colors duration-200" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-[#14171A] group-hover:text-[#1F7A5C] transition-colors">
                  Create New Workspace
                </h3>
                <p className="text-xs text-[#5C6169] max-w-[220px] leading-relaxed">
                  Start an isolated grounding session to index YouTube videos, PDFs & web articles
                </p>
              </div>
              <span
                className="text-[11px] font-semibold px-3 py-1 rounded-full text-[#1F7A5C] bg-[#1F7A5C]/10 border border-[#1F7A5C]/20 group-hover:bg-[#1F7A5C] group-hover:text-white transition-all font-mono"
              >
                + New Session
              </span>
            </div>
          </div>
        ) : (
          /* Empty Search State */
          <div
            className="bg-white rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto my-12 shadow-sm"
            style={{ border: `1px solid ${colors.hairlineStrong}` }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto"
              style={{ background: colors.verifiedSoft, color: colors.verified }}
            >
              <FolderOpen className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-semibold text-[#14171A]">No workspaces found</h3>
              <p className="text-xs text-[#5C6169] leading-relaxed">
                {searchQuery
                  ? `No active sessions matched "${searchQuery}". Try searching for another keyword or create a new workspace.`
                  : 'No active workspaces found. Create your first workspace session below.'}
              </p>
            </div>
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="px-5 py-2 bg-[#F0F1EE] hover:bg-[#E2E4E1] text-[#14171A] text-xs font-semibold rounded-full transition-all cursor-pointer"
              >
                Clear Search
              </button>
            ) : (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-5 py-2.5 text-white text-xs font-medium rounded-full transition-all cursor-pointer shadow-xs hover:shadow-md hover:-translate-y-0.5"
                style={{ background: colors.verified }}
              >
                Create Workspace
              </button>
            )}
          </div>
        )}
      </main>

      {/* CREATE WORKSPACE MODAL */}
      <CreateWorkspaceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateWorkspaceSubmit}
        isSubmitting={isCreating}
      />

      {/* Toast Notification Alert */}
      <DashboardNotification message={notification} />
    </div>
  );
}
