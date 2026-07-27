import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LeftSidebar from '../components/LeftSidebar';
import ChatBox, { type ChatMessage } from '../components/ChatBox';
import RightPlayerSidebar, { type ActiveMediaState } from '../components/RightPlayerSidebar';
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

  // Chat Messages State
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Fetch indexed sources for this session from backend
  const {
    data: sessionSourcesData,
    isLoading: isLoadingSources,
    refetch: refetchSources,
  } = useGetSessionSources(sessionId);

  // RAG Query Mutation
  const { mutate: queryWorkspace, isPending: isQuerying } = useQueryWorkspace();

  const handleCreateNewSessionRoute = () => {
    const newSession = generateRandomSessionId();
    setMessages([]);
    setActiveMedia(null);
    navigate(`/workspace/${newSession}`);
  };

  const handleIndexingSuccess = () => {
    refetchSources();
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

    queryWorkspace(
      { query: userQueryText, sessionId },
      {
        onSuccess: (res) => {
          const assistantMsg: ChatMessage = {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            queryData: res.data,
            timestamp: new Date().toLocaleTimeString(),
          };
          setMessages((prev) => [...prev, assistantMsg]);
        },
      }
    );
  };

  const handleMediaClick = (media: ActiveMediaState) => {
    setActiveMedia(media);
  };

  const sources = sessionSourcesData?.data?.sources || [];

  // Extract latest retrieved context sources from the most recent query response
  const latestAssistantMsg = [...messages].reverse().find((m) => m.role === 'assistant' && m.queryData);
  const retrievedSources = latestAssistantMsg?.queryData?.sources || [];

  return (
    <div className="flex h-screen w-screen bg-slate-900 text-slate-100 overflow-hidden font-sans">
      {/* 1. Left Sidebar: Knowledge Sources & Retrieved Context Chunks */}
      <LeftSidebar
        sessionId={sessionId}
        sources={sources}
        retrievedSources={retrievedSources}
        isLoadingSources={isLoadingSources}
        onNewSession={handleCreateNewSessionRoute}
        onIndexingSuccess={handleIndexingSuccess}
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
        messages={messages}
        isQuerying={isQuerying}
        onSendQuery={handleSendQuery}
        onMediaClick={handleMediaClick}
      />

      {/* 3. Right Sidebar: In-App YouTube & Document Media Player */}
      {activeMedia && (
        <RightPlayerSidebar
          media={activeMedia}
          onClose={() => setActiveMedia(null)}
        />
      )}
    </div>
  );
}
