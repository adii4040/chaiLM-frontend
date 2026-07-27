import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

  // Extract latest retrieved context sources from the most recent query response
  const latestAssistantMsg = [...messages].reverse().find((m) => m.role === 'assistant' && m.queryData);
  const retrievedSources = latestAssistantMsg?.queryData?.sources || [];

  return (
    <div className="flex h-screen w-screen bg-slate-900 text-slate-100 overflow-hidden font-sans">
      {/* 1. Left Sidebar: Knowledge Sources & Checkboxes */}
      <LeftSidebar
        sessionId={sessionId}
        sources={sources}
        retrievedSources={retrievedSources}
        selectedSourceUrls={selectedSourceUrls}
        onToggleSourceSelect={handleToggleSourceSelect}
        onSelectAllSources={handleSelectAllSources}
        onClearSourceSelection={handleClearSourceSelection}
        isLoadingSources={isLoadingSources || isLoadingSessionData}
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
