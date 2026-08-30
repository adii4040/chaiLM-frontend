import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Plus,
  LogOut,
  User as UserIcon,
  MessageSquare,
  Sparkles,
  Sidebar as SidebarIcon,
  ChevronDown,
  FolderKanban,
  CheckCircle2,
} from 'lucide-react';
import LeftSidebar from '../components/LeftSidebar';
import ChatBox, { type ChatMessage } from '../components/ChatBox';
import RightPlayerSidebar, { type ActiveMediaState } from '../components/RightPlayerSidebar';
import AddSourceModal from '../components/AddSourceModal';
import { StudioCanvas, StudioGeneratorModal } from '../components/studio';
import { useGetWorkspaceData } from '../modules/workspace/query/useGetWorkspaceData';
import { useQueryWorkspace } from '../modules/query/mutation/useQueryWorkspace';
import { useGetStudioArtifacts } from '../modules/studio/query/useGetStudioArtifacts';
import type { StudioArtifact, StudioArtifactType } from '../modules/studio/dto/studioDto';
import useCurrentUser from '../modules/auth/query/useCurrentUser';
import { useLogout } from '../modules/auth/mutation/useLogout';
import { colors, serif, mono } from '../components/landing/tokens';

export default function WorkspacePage() {
  const {
    workspaceId: paramWorkspaceId,
    sessionId: paramSessionId,
    featureType: paramFeatureType,
    artifactId: paramArtifactId,
  } = useParams<{
    workspaceId?: string;
    sessionId?: string;
    featureType?: string;
    artifactId?: string;
  }>();

  const navigate = useNavigate();
  const location = useLocation();

  const workspaceId = paramWorkspaceId || paramSessionId || '';

  // Route-driven state:
  const isStudioRoute = location.pathname.includes('/studio');
  const workspaceMode: 'chat' | 'studio' = isStudioRoute ? 'studio' : 'chat';
  const selectedStudioFeature: StudioArtifactType =
    (paramFeatureType as StudioArtifactType) || 'study_guide';

  // Active Media Player State (Right Sidebar Source Preview)
  const [activeMedia, setActiveMedia] = useState<ActiveMediaState | null>(null);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

  // Active Studio Artifact State
  const [activeArtifact, setActiveArtifact] = useState<StudioArtifact | null>(null);

  // Studio Generator Modal State
  const [showStudioModal, setShowStudioModal] = useState(false);
  const [studioModalType, setStudioModalType] = useState<StudioArtifactType>('study_guide');
  const [studioModalSourceId, setStudioModalSourceId] = useState<string | undefined>(undefined);

  // Selected Sources for RAG Query payload (strictly sourceIds)
  const [selectedSourceIds, setSelectedSourceIds] = useState<string[]>([]);

  // Chat Messages State
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Add Source Modal State
  const [showAddModal, setShowAddModal] = useState(false);

  // User Profile Dropdown Menu State
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Hydrate full workspace data (sources + chat history) from MongoDB
  const {
    data: workspaceDataRes,
    isLoading: isLoadingWorkspaceData,
    refetch: refetchWorkspaceData,
  } = useGetWorkspaceData(workspaceId);

  // Hydrate Studio Artifacts
  const {
    data: artifactsRes,
    isLoading: isLoadingArtifacts,
    refetch: refetchArtifacts,
  } = useGetStudioArtifacts(workspaceId);

  const artifacts = artifactsRes?.artifacts || [];

  // Sync active artifact from URL paramArtifactId whenever artifacts or route changes
  useEffect(() => {
    if (paramArtifactId && artifacts.length > 0) {
      const match = artifacts.find(
        (a) => a.artifactId === paramArtifactId || (a as any)._id === paramArtifactId
      );
      if (match) {
        setActiveArtifact(match);
      }
    } else if (!paramArtifactId) {
      setActiveArtifact(null);
    }
  }, [paramArtifactId, artifacts]);

  // Populate chat state upon workspace hydration from MongoDB
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
    setIsRightSidebarOpen(true);
  };

  // Route-driven mode switching
  const handleSwitchToChat = () => {
    navigate(`/workspace/${workspaceId}`);
  };

  const handleSwitchToStudio = () => {
    navigate(`/workspace/${workspaceId}/studio/${selectedStudioFeature}`);
  };

  const handleSelectStudioFeature = (feature: StudioArtifactType) => {
    navigate(`/workspace/${workspaceId}/studio/${feature}`);
  };

  const handleSelectArtifact = (artifact: StudioArtifact | null) => {
    if (artifact) {
      const artId = artifact.artifactId || (artifact as any)._id;
      navigate(`/workspace/${workspaceId}/studio/${artifact.type}/${artId}`);
    } else {
      navigate(`/workspace/${workspaceId}/studio/${selectedStudioFeature}`);
    }
  };

  const handleOpenStudioModal = (type?: StudioArtifactType, sourceId?: string) => {
    if (type) setStudioModalType(type);
    else setStudioModalType(selectedStudioFeature);
    if (sourceId) setStudioModalSourceId(sourceId);
    else setStudioModalSourceId(undefined);
    setShowStudioModal(true);
  };

  const handleArtifactCreated = (newArtifact: StudioArtifact) => {
    refetchArtifacts();
    const artId = newArtifact.artifactId || (newArtifact as any)._id;
    navigate(`/workspace/${workspaceId}/studio/${newArtifact.type}/${artId}`);
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

  const isAnyModalOpen = showAddModal || showStudioModal;

  return (
    <div
      className="flex flex-col h-screen font-sans overflow-hidden relative"
      style={{
        background: colors.paper,
        color: colors.ink,
      }}
    >
      {/* WRAPPER FOR FULL WORKSPACE UI (BLURS COMPLETELY WHEN MODAL IS ACTIVE) */}
      <div
        className={`flex flex-col h-full overflow-hidden transition-[filter] duration-300 ${
          isAnyModalOpen ? 'blur-[4px] pointer-events-none select-none' : ''
        }`}
      >
        {/* TOP NAVBAR */}
        <header
          className="h-16 px-5 flex items-center justify-between shrink-0 select-none z-30 backdrop-blur-md"
          style={{
            background: 'rgba(255, 255, 255, 0.94)',
            borderBottom: `1px solid ${colors.hairline}`,
          }}
        >
          {/* Left: Brand & Mode Switcher */}
          <div className="flex items-center space-x-5">
            <button
              onClick={() => navigate('/workspaces')}
              className="text-xl font-bold tracking-tight transition-opacity hover:opacity-80 cursor-pointer flex items-center gap-1.5"
              style={serif}
              title="Workspaces Dashboard"
            >
              chai<span style={{ color: colors.verified }}>LM</span>
            </button>

            {/* Mode Switcher in Navbar */}
            <div
              className="flex p-1 rounded-full text-xs font-semibold"
              style={{
                background: colors.surface2,
                border: `1px solid ${colors.hairline}`,
              }}
            >
              <button
                type="button"
                onClick={handleSwitchToChat}
                className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer flex items-center space-x-1.5 text-xs font-medium ${
                  workspaceMode === 'chat'
                    ? 'bg-white shadow-xs text-[#14171A] font-semibold'
                    : 'text-[#5C6169] hover:text-[#14171A]'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" style={{ color: workspaceMode === 'chat' ? colors.verified : undefined }} />
                <span>Chat &amp; RAG</span>
              </button>

              <button
                type="button"
                onClick={handleSwitchToStudio}
                className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer flex items-center space-x-1.5 text-xs font-medium ${
                  workspaceMode === 'studio'
                    ? 'bg-white shadow-xs text-[#14171A] font-semibold'
                    : 'text-[#5C6169] hover:text-[#14171A]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#1F7A5C]" />
                <span>Studio Mode</span>
              </button>
            </div>
          </div>

          {/* Right Header Action Bar */}
          <div className="flex items-center space-x-3">
            {/* Grounding Counter */}
            <div
              className="hidden lg:inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{
                background: colors.verifiedSoft,
                color: colors.verified,
                border: `1px solid ${colors.verifiedBorder}`,
                ...mono,
              }}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                {activeCount} of {sources.length} active
              </span>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
              style={{ background: colors.verified }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Source</span>
            </button>

            {/* Toggle Right Preview Sidebar */}
            <button
              onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                isRightSidebarOpen
                  ? 'bg-white text-[#1F7A5C] border-[#1F7A5C] shadow-xs'
                  : 'text-[#5C6169] hover:text-[#14171A] border-[#E2E4E1] hover:bg-white'
              }`}
              title="Toggle Right Source Preview"
            >
              <SidebarIcon className="w-4 h-4" />
            </button>

            {/* User Profile Dropdown */}
            {user && (
              <div className="relative border-l pl-3" style={{ borderColor: colors.hairline }}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 px-2.5 py-1.5 rounded-full text-xs transition-all cursor-pointer select-none bg-white shadow-xs hover:border-[#1F7A5C]"
                  style={{ border: `1px solid ${colors.hairlineStrong}` }}
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] text-white"
                    style={{ background: colors.cobalt }}
                  >
                    {user.fullname ? user.fullname.charAt(0).toUpperCase() : <UserIcon className="w-3 h-3" />}
                  </div>
                  <span className="text-[#14171A] font-semibold max-w-[110px] truncate hidden md:inline">
                    {user.fullname}
                  </span>
                  <ChevronDown
                    className={`w-3 h-3 text-[#5C6169] transition-transform duration-200 ${
                      isUserMenuOpen ? 'rotate-180 text-[#1F7A5C]' : ''
                    }`}
                  />
                </button>

                {isUserMenuOpen && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsUserMenuOpen(false)}
                    />

                    {/* Dropdown Menu */}
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                      style={{ border: `1px solid ${colors.hairlineStrong}` }}
                    >
                      <div className="px-4 py-2.5 border-b space-y-0.5" style={{ borderColor: colors.hairline }}>
                        <p className="text-xs font-semibold text-[#14171A] truncate">
                          {user.fullname}
                        </p>
                        {user.email && (
                          <p className="text-[11px] text-[#5C6169] font-mono truncate" style={mono}>
                            {user.email}
                          </p>
                        )}
                      </div>

                      <div className="p-1.5 space-y-1 text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            navigate('/workspaces');
                          }}
                          className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-[#14171A] hover:bg-[#F5F6F4] hover:text-[#1F7A5C] transition cursor-pointer text-left font-medium"
                        >
                          <FolderKanban className="w-3.5 h-3.5 text-[#1F7A5C]" />
                          <span>All Workspaces</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            handleLogout();
                          }}
                          disabled={isLoggingOut}
                          className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 transition cursor-pointer text-left font-medium disabled:opacity-50"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </header>

        {/* WORKSPACE BODY */}
        <div className="flex flex-1 overflow-hidden" style={{ background: colors.paper }}>
          {/* 1. Left Sidebar: Knowledge Sources & Studio Features */}
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
            artifacts={artifacts}
            selectedStudioFeature={selectedStudioFeature}
            onSelectStudioFeature={handleSelectStudioFeature}
            onSelectSourceMedia={(src) => {
              setActiveMedia({
                sourceType: src.sourceType,
                sourceUrl: src.sourceUrl,
                title: src.title,
                cloudinaryUrl: src.cloudinaryUrl,
                startSeconds: src.startSeconds || 0,
                formattedTimestamp: src.formattedTimestamp || '00:00:00',
                pageNumber: src.pageNumber,
                videoId: src.videoId,
              });
              setIsRightSidebarOpen(true);
            }}
          />

          {/* 2. Center Panel: Switched by Mode & Route */}
          {workspaceMode === 'chat' ? (
            <ChatBox
              sessionTitle={workspaceTitle}
              messages={messages}
              isQuerying={isQuerying}
              onSendQuery={handleSendQuery}
              onMediaClick={handleMediaClick}
              onOpenAddSource={() => setShowAddModal(true)}
            />
          ) : (
            <StudioCanvas
              workspaceId={workspaceId}
              sources={sources}
              artifacts={artifacts}
              isLoadingArtifacts={isLoadingArtifacts}
              selectedFeature={selectedStudioFeature}
              activeArtifact={activeArtifact}
              onSelectArtifact={handleSelectArtifact}
              onOpenCreateModal={handleOpenStudioModal}
            />
          )}

          {/* 3. Right Sidebar: Source Preview Accordion */}
          {isRightSidebarOpen && (
            <RightPlayerSidebar
              media={activeMedia}
              sources={sources}
              selectedSourceIds={selectedSourceIds}
              onClose={() => setIsRightSidebarOpen(false)}
            />
          )}
        </div>
      </div>

      {/* TOP-LEVEL INGEST KNOWLEDGE SOURCE MODAL (BLURS FULL PAGE BEHIND IT) */}
      <AddSourceModal
        workspaceId={workspaceId}
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleIndexingSuccess}
      />

      {/* TOP-LEVEL STUDIO GENERATOR MODAL */}
      <StudioGeneratorModal
        workspaceId={workspaceId}
        sources={sources}
        artifactType={studioModalType}
        defaultSourceId={studioModalSourceId}
        isOpen={showStudioModal}
        onClose={() => setShowStudioModal(false)}
        onSuccess={handleArtifactCreated}
      />
    </div>
  );
}
