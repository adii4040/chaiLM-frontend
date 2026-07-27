import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, RefreshCw } from 'lucide-react';
import LeftSidebar from '../components/LeftSidebar';
import ChatBox, { type ChatMessage } from '../components/ChatBox';
import RightPlayerSidebar, { type ActiveMediaState } from '../components/RightPlayerSidebar';
import { useGetSessionData } from '../modules/session/query/useGetSessionData';
import { useGetSessionSources } from '../modules/indexer/query/useGetSessionSources';
import { useQueryWorkspace } from '../modules/query/mutation/useQueryWorkspace';

function generateRandomSessionId(): string {
  const uuid = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2, 11);
  return `session-${uuid}`;
}

export default function WorkspacePage() {
  const { sessionId: routeSessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const sessionId = routeSessionId || 'session_demo_1';

  // Active Media Player State (Right Sidebar)
  const [activeMedia, setActiveMedia] = useState<ActiveMediaState | null>(null);

  // Selected Sources for RAG Query payload
  const [selectedSourceUrls, setSelectedSourceUrls] = useState<string[]>([]);

  // Chat Messages State
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Add Source Modal State
  const [showAddModal, setShowAddModal] = useState(false);

  // Hydrate full session data (sources + chat history) from MongoDB
  const {
    data: sessionDataRes,
    isLoading: isLoadingSessionData,
    refetch: refetchSessionData,
  } = useGetSessionData(sessionId);

  // Fallback sources fetcher
  const {
    data: sessionSourcesData,
    isLoading: isLoadingSources,
    refetch: refetchSources,
  } = useGetSessionSources(sessionId);

  // Populate state upon session hydration from MongoDB
  useEffect(() => {
    if (sessionDataRes?.data) {
      const { history } = sessionDataRes.data;
      if (Array.isArray(history)) {
        const formattedMessages: ChatMessage[] = history.map((msg) => {
          const timeStr = msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : new Date().toLocaleTimeString();
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
                answer: msg.answer || { summary: '', segments: [] },
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
  }, [sessionDataRes]);

  // RAG Query Mutation
  const { mutate: queryWorkspace, isPending: isQuerying } = useQueryWorkspace();

  const sources = sessionDataRes?.data?.sources?.length
    ? sessionDataRes.data.sources
    : sessionSourcesData?.data?.sources || [];

  const handleToggleSourceSelect = (url: string) => {
    setSelectedSourceUrls((prev) =>
      prev.includes(url) ? prev.filter((item) => item !== url) : [...prev, url]
    );
  };

  const handleSelectAllSources = () => {
    const allUrls = sources.map((s) => s.sourceUrl).filter(Boolean);
    setSelectedSourceUrls(allUrls);
  };

  const handleClearSourceSelection = () => {
    setSelectedSourceUrls([]);
  };

  const handleCreateNewSessionRoute = () => {
    const newSession = generateRandomSessionId();
    setMessages([]);
    setActiveMedia(null);
    setSelectedSourceUrls([]);
    navigate(`/workspace/${newSession}`);
  };

  const handleIndexingSuccess = () => {
    refetchSources();
    refetchSessionData();
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

    const allSourceUrls = sources.map((s) => s.sourceUrl).filter(Boolean);
    const effectiveSelectedSourceIds =
      selectedSourceUrls.length > 0 ? selectedSourceUrls : allSourceUrls;

    queryWorkspace(
      {
        query: userQueryText,
        sessionId,
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
          refetchSessionData();
        },
      }
    );
  };

  const handleMediaClick = (media: ActiveMediaState) => {
    setActiveMedia(media);
  };



  const sessionTitle = sessionDataRes?.data?.title || 'Untitled Workspace';
  const activeCount = selectedSourceUrls.length;

  return (
    <div className="flex flex-col h-screen w-screen bg-chailm-bg text-chailm-textMain overflow-hidden font-sans">
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
            Session: {sessionId}
          </span>
        </div>

        {/* Right Header Action Bar */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleCreateNewSessionRoute}
            title="Create New Session"
            className="flex items-center space-x-1.5 bg-chailm-card hover:bg-chailm-hover px-3 py-1.5 rounded-full text-xs font-medium text-chailm-textMain border border-chailm-border transition-all cursor-pointer"
          >
            <RefreshCw className="w-3 h-3 text-chailm-textMuted" />
            <span>New Session</span>
          </button>

          <div className="flex items-center space-x-2 bg-chailm-card px-3 py-1 rounded-full border border-chailm-border text-xs text-chailm-textMuted">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Grounding Scope:</span>
            <span className="text-chailm-textMain font-medium">{activeCount} of {sources.length} sources active</span>
          </div>

          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1.5 bg-chailm-card hover:bg-chailm-hover px-3 py-1.5 rounded-full text-xs font-medium text-chailm-textMain border border-chailm-border transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-chailm-accentBlue" />
            <span>Add Source</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 1. Left Sidebar: Knowledge Sources & Checkboxes */}
        <LeftSidebar
          sessionId={sessionId}
          sources={sources}
          selectedSourceUrls={selectedSourceUrls}
          onToggleSourceSelect={handleToggleSourceSelect}
          onSelectAllSources={handleSelectAllSources}
          onClearSourceSelection={handleClearSourceSelection}
          isLoadingSources={isLoadingSources || isLoadingSessionData}
          onNewSession={handleCreateNewSessionRoute}
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
          sessionTitle={sessionTitle}
          messages={messages}
          isQuerying={isQuerying}
          onSendQuery={handleSendQuery}
          onMediaClick={handleMediaClick}
          onOpenAddSource={() => setShowAddModal(true)}
        />

        {/* 3. Right Sidebar: In-App YouTube & Document Media Player */}
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
