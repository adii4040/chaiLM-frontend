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
    <div className="min-h-screen flex flex-col bg-chailm-bg text-chailm-textMain font-sans selection:bg-chailm-accentBlue/20 selection:text-white">
      {/* TOP HEADER */}
      <DashboardHeader onOpenCreateModal={() => setIsCreateModalOpen(true)} />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 space-y-8">
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
          <div className="py-20 text-center text-chailm-textMuted italic text-xs">
            Loading workspaces...
          </div>
        ) : filteredSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSessions.map((session) => (
              <WorkspaceCard
                key={session.workspaceId || session.sessionId}
                session={session}
                onOpenWorkspace={handleOpenWorkspace}
                onDeleteWorkspace={handleDelete}
              />
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
