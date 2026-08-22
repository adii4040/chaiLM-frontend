import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, LogOut, User as UserIcon } from 'lucide-react';
import LeftSidebar from '../components/LeftSidebar';
import ChatBox, { type ChatMessage } from '../components/ChatBox';
import RightPlayerSidebar, { type ActiveMediaState } from '../components/RightPlayerSidebar';
import { useGetWorkspaceData } from '../modules/workspace/query/useGetWorkspaceData';
import { useQueryWorkspace } from '../modules/query/mutation/useQueryWorkspace';
import useCurrentUser from '../modules/auth/query/useCurrentUser';
import { useLogout } from '../modules/auth/mutation/useLogout';

export default function WorkspacePage() {
  const { workspaceId: paramWorkspaceId, sessionId: paramSessionId } = useParams<{
    workspaceId?: string;
    sessionId?: string;
  }>();
  const navigate = useNavigate();

  const workspaceId = paramWorkspaceId || paramSessionId || '';

  // Active Media Player State (Right Sidebar)
  const [activeMedia, setActiveMedia] = useState<ActiveMediaState | null>(null);

  // Selected Sources for RAG Query payload (strictly sourceIds)
  const [selectedSourceIds, setSelectedSourceIds] = useState<string[]>([]);

  // Chat Messages State
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Add Source Modal State
  const [showAddModal, setShowAddModal] = useState(false);

  // Hydrate full workspace data (sources + chat history) from MongoDB
  const {
    data: workspaceDataRes,
    isLoading: isLoadingWorkspaceData,
    refetch: refetchWorkspaceData,
  } = useGetWorkspaceData(workspaceId);

  // Populate state upon workspace hydration from MongoDB
  useEffect(() => {
    if (workspaceDataRes?.data) {
      const { history } = workspaceDataRes.data;
      if (Array.isArray(history)) {
        const formattedMessages: ChatMessage[] = history.map((msg) => {
          const timeStr = msg.createdAt
            ? new Date(msg.createdAt).toLocaleTimeString()
            : new Date().toLocaleTimeString();

          if (msg.role === 'user') {
            return {
              id: msg.id,
              role: 'user',
              text: msg.query || '',
              timestamp: timeStr,
            };
          } else {
            return {
              id: msg.id,
              role: 'assistant',
              queryData: {
                query: '',
                answer: msg.answer || { overallSummary: '', sections: [] },
                translations: { rewritten: '', stepBack: '', subQueries: [] },
                sources: msg.sources || [],
              },
              timestamp: timeStr,
            };
          }
        });
        setMessages(formattedMessages);
      }
    }
  }, [workspaceDataRes]);

  // RAG Query Mutation
  const { mutate: queryWorkspace, isPending: isQuerying } = useQueryWorkspace();

  const sources = workspaceDataRes?.data?.sources || [];

  const handleToggleSourceSelect = (sourceId: string) => {
    setSelectedSourceIds((prev) =>
      prev.includes(sourceId)
        ? prev.filter((item) => item !== sourceId)
        : [...prev, sourceId]
    );
  };

  const handleSelectAllSources = () => {
    const allIds = sources.map((s) => s.sourceId).filter(Boolean);
    setSelectedSourceIds(allIds);
  };

  const handleClearSourceSelection = () => {
    setSelectedSourceIds([]);
  };

  const handleIndexingSuccess = () => {
    refetchWorkspaceData();
  };

  const handleSendQuery = (userQueryText: string) => {
    const userMsgId = `user-${Date.now()}`;
    const nowTime = new Date().toLocaleTimeString();

    const userMessage: ChatMessage = {
      id: userMsgId,
      role: 'user',
      text: userQueryText,
      timestamp: nowTime,
    };

    setMessages((prev) => [...prev, userMessage]);

    // Send strictly sourceIds
    const allSourceIds = sources.map((s) => s.sourceId).filter(Boolean);
    const effectiveSelectedSourceIds =
      selectedSourceIds.length > 0 ? selectedSourceIds : allSourceIds;

    queryWorkspace(
      {
        query: userQueryText,
        workspaceId,
        selectedSourceIds: effectiveSelectedSourceIds,
      },
      {
        onSuccess: (res) => {
          const assistantMsg: ChatMessage = {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            queryData: res.data,
            timestamp: new Date().toLocaleTimeString(),
          };
          setMessages((prev) => [...prev, assistantMsg]);
          refetchWorkspaceData();
        },
      }
    );
  };

  const handleMediaClick = (media: ActiveMediaState) => {
    setActiveMedia(media);
  };

  const workspaceTitle = workspaceDataRes?.data?.title || 'Untitled Workspace';
  const activeCount = selectedSourceIds.length > 0 ? selectedSourceIds.length : sources.length;

  const { data: userData } = useCurrentUser();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const user = userData?.user;

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        navigate('/login');
      },
    });
  };

  return (
    <div className="flex flex-col h-screen bg-chailm-bg text-chailm-textMain font-sans overflow-hidden selection:bg-chailm-accentBlue/20 selection:text-white">
      {/* TOP HEADER */}
      <header className="h-14 bg-chailm-panel border-b border-chailm-border px-4 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/workspace')}
            className="font-semibold text-chailm-textMain text-lg tracking-tight hover:text-chailm-accentBlue transition-colors cursor-pointer"
            title="Back to Workspaces Dashboard"
          >
            <span>chaiLM</span>
          </button>
          <span className="text-[10px] text-chailm-textMuted font-mono bg-chailm-bg border border-chailm-border px-2.5 py-0.5 rounded-full">
            Workspace: {workspaceId ? (workspaceId.length > 18 ? `${workspaceId.substring(0, 16)}...` : workspaceId) : 'Demo'}
          </span>
        </div>

        {/* Right Header Action Bar */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-chailm-card px-3 py-1 rounded-full border border-chailm-border text-xs text-chailm-textMuted">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Grounding Scope:</span>
            <span className="text-chailm-textMain font-medium">
              {activeCount} of {sources.length} sources active
            </span>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1.5 bg-chailm-card hover:bg-chailm-hover px-3 py-1.5 rounded-full text-xs font-medium text-chailm-textMain border border-chailm-border transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-chailm-accentBlue" />
            <span>Add Source</span>
          </button>

          {user && (
            <div className="flex items-center space-x-2 border-l border-chailm-border pl-3">
              <div className="flex items-center space-x-2 bg-chailm-card px-2.5 py-1 rounded-full border border-chailm-border text-xs">
                <div className="w-5 h-5 rounded-full bg-chailm-accentBlue/20 border border-chailm-accentBlue/40 flex items-center justify-center text-chailm-accentBlue font-semibold text-[10px]">
                  {user.fullname ? user.fullname.charAt(0).toUpperCase() : <UserIcon className="w-3 h-3" />}
                </div>
                <span className="text-chailm-textMain font-medium max-w-[100px] truncate">
                  {user.fullname}
                </span>
              </div>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                title="Logout"
                className="p-1.5 text-chailm-textMuted hover:text-rose-400 hover:bg-rose-500/10 rounded-full border border-chailm-border transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 1. Left Sidebar: Knowledge Sources & Grounding Checkboxes */}
        <LeftSidebar
          workspaceId={workspaceId}
          sources={sources}
          selectedSourceIds={selectedSourceIds}
          onToggleSourceSelect={handleToggleSourceSelect}
          onSelectAllSources={handleSelectAllSources}
          onClearSourceSelection={handleClearSourceSelection}
          isLoadingSources={isLoadingWorkspaceData}
          onIndexingSuccess={handleIndexingSuccess}
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
          onSelectSourceMedia={(src) =>
            setActiveMedia({
              sourceType: src.sourceType,
              sourceUrl: src.sourceUrl,
              title: src.title,
              cloudinaryUrl: src.cloudinaryUrl,
              startSeconds: src.startSeconds || 0,
              formattedTimestamp: src.formattedTimestamp || '00:00:00',
              pageNumber: src.pageNumber,
              videoId: src.videoId,
            })
          }
        />

        {/* 2. Center Panel: NotebookLM Chat Box */}
        <ChatBox
          sessionTitle={workspaceTitle}
          messages={messages}
          isQuerying={isQuerying}
          onSendQuery={handleSendQuery}
          onMediaClick={handleMediaClick}
          onOpenAddSource={() => setShowAddModal(true)}
        />

        {/* 3. Right Sidebar: In-App YouTube, PDF & Document Media Player */}
        {activeMedia && (
          <RightPlayerSidebar
            media={activeMedia}
            onClose={() => setActiveMedia(null)}
          />
        )}
      </div>
    </div>
  );
}
