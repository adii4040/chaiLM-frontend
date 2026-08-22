import React, { useState, useEffect, useRef } from 'react';
import { Play, FileText, CheckCircle2, Sparkles, Clock, Database, Plus, Globe, BookOpen, Search, Loader2 } from 'lucide-react';
import type { QueryResultData, AnswerCitation } from '../modules/query/dto/queryDto';
import type { IndexResultData } from '../modules/indexer/dto/indexerDto';
import type { ActiveMediaState } from './RightPlayerSidebar';
import { extractYouTubeVideoId } from '../utils/helpers';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system_index';
  text?: string;
  queryData?: QueryResultData;
  indexData?: IndexResultData;
  timestamp: string;
}

interface ChatBoxProps {
  sessionTitle?: string;
  messages: ChatMessage[];
  isQuerying: boolean;
  onSendQuery: (query: string) => void;
  onMediaClick: (media: ActiveMediaState) => void;
  onOpenAddSource?: () => void;
}

const LOADING_STAGES = [
  {
    icon: Search,
    text: 'Searching indexed workspace sources...',
    subText: 'Scanning document excerpts & video segments',
  },
  {
    icon: Database,
    text: 'Analyzing content & extracting evidence...',
    subText: 'Connecting findings across relevant sources',
  },
  {
    icon: Sparkles,
    text: 'Formulating answer with citations...',
    subText: 'Structuring summary & precise source references',
  },
];

export default function ChatBox({
  sessionTitle = 'Untitled Workspace',
  messages,
  isQuerying,
  onSendQuery,
  onMediaClick,
  onOpenAddSource,
}: ChatBoxProps) {
  const [inputText, setInputText] = useState('');
  const [loadingStageIdx, setLoadingStageIdx] = useState(0);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Reliable scroll-to-bottom helper
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior,
      });
    }
    messagesEndRef.current?.scrollIntoView({ behavior, block: 'end' });
  };

  // Cycle through thinking stages during active query
  useEffect(() => {
    if (!isQuerying) {
      setLoadingStageIdx(0);
      return;
    }

    const interval = setInterval(() => {
      setLoadingStageIdx((prev) => (prev + 1) % LOADING_STAGES.length);
    }, 2800);

    return () => clearInterval(interval);
  }, [isQuerying]);

  // Scroll to bottom immediately and on delayed tick to fully reveal loader height
  useEffect(() => {
    scrollToBottom('smooth');
    const timer = setTimeout(() => {
      scrollToBottom('smooth');
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, isQuerying, loadingStageIdx]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isQuerying) return;
    onSendQuery(inputText.trim());
    setInputText('');
  };

  const handleCitationClick = (cit: AnswerCitation, sources: any[]) => {
    let videoId: string | null = null;
    let startSecs = cit.startSeconds || 0;

    let matchingSource = null;
    if (cit.sourceId) {
      matchingSource = sources.find(
        (s) => s.sourceId === cit.sourceId || s._id === cit.sourceId
      );
    }

    if (!matchingSource && cit.sourceUrl) {
      matchingSource = sources.find(
        (s) => s.sourceUrl === cit.sourceUrl || s.url === cit.sourceUrl
      );
    }

    if (!matchingSource && cit.sourceType) {
      matchingSource = sources.find(
        (s) => s.sourceType?.toLowerCase() === cit.sourceType?.toLowerCase()
      );
    }

    if (!matchingSource && sources.length > 0) {
      matchingSource = sources[0];
    }

    const effectiveSourceUrl = cit.sourceUrl || matchingSource?.sourceUrl || '';
    const effectiveCloudinaryUrl = matchingSource?.cloudinaryUrl || (effectiveSourceUrl.startsWith('http') ? effectiveSourceUrl : null);
    const title = matchingSource?.title || 'Knowledge Source';

    if (cit.sourceType === 'youtube' || matchingSource?.sourceType?.toLowerCase() === 'youtube') {
      videoId = matchingSource?.videoId || extractYouTubeVideoId(effectiveSourceUrl);
    }

    onMediaClick({
      sourceType: cit.sourceType || matchingSource?.sourceType || 'website',
      sourceUrl: effectiveSourceUrl,
      cloudinaryUrl: effectiveCloudinaryUrl,
      title: title,
      videoId: videoId,
      startSeconds: startSecs,
      formattedTimestamp: cit.formattedTimestamp || null,
      pageNumber: cit.pageNumber || null,
    });
  };

  const CurrentLoadingStageIcon = LOADING_STAGES[loadingStageIdx].icon;

  return (
    <main className="flex-1 flex flex-col h-full bg-chailm-bg overflow-hidden relative min-w-0">
      {/* Messages Stream Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-8 space-y-8 max-w-4xl mx-auto w-full scroll-smooth"
      >
        {/* Header Welcome Prompt */}
        <div className="border-b border-chailm-border pb-6 space-y-2">
          <h1 className="text-2xl font-normal text-chailm-textMain tracking-tight">
            {sessionTitle}
          </h1>
          <p className="text-xs text-chailm-textMuted leading-relaxed">
            Query across active YouTube videos, PDF documents, and websites with grounded citations and source breakdowns.
          </p>
        </div>

        {messages.length === 0 && !isQuerying ? (
          <div className="py-12 flex flex-col items-center justify-center text-center p-8 space-y-3">
            <div className="w-12 h-12 bg-chailm-card rounded-full flex items-center justify-center text-chailm-accentBlue border border-chailm-border shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-sm font-semibold text-chailm-textMain">chaiLM Workspace Intelligence</h2>
            <p className="text-chailm-textMuted text-xs max-w-sm leading-relaxed">
              Ask questions to generate structured executive summaries, segmented breakdowns, and precise citations.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            if (msg.role === 'user') {
              return (
                <div key={msg.id} className="flex justify-end animate-in fade-in slide-in-from-bottom-1 duration-200">
                  <div className="flex items-start space-x-2 max-w-xl">
                    <div className="bg-chailm-hover border border-chailm-border px-4 py-3 rounded-2xl rounded-tr-none text-xs font-medium text-chailm-textMain shadow-sm">
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                      <span className="block text-[10px] text-chailm-textMuted mt-2 text-right font-mono">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }

            if (msg.role === 'system_index' && msg.indexData) {
              const data = msg.indexData;
              const videoId = data.type === 'youtube' && data.sourceUrl ? extractYouTubeVideoId(data.sourceUrl) : null;

              return (
                <div key={msg.id} className="flex justify-start animate-in fade-in duration-200">
                  <div className="bg-chailm-panel border border-chailm-border rounded-2xl rounded-tl-none p-5 max-w-xl space-y-3 shadow-lg text-xs">
                    <div className="flex items-center gap-2 text-chailm-accentBlue font-semibold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Document Successfully Ingested
                    </div>

                    {videoId && (
                      <div className="relative rounded-2xl overflow-hidden border border-chailm-border bg-black group">
                        <img
                          src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                          alt={data.title || 'YouTube Video'}
                          className="w-full h-44 object-cover group-hover:opacity-90 transition"
                        />
                        <button
                          onClick={() =>
                            onMediaClick({
                              sourceType: 'youtube',
                              sourceUrl: data.sourceUrl || '',
                              title: data.title || 'YouTube Source',
                              videoId: videoId,
                              startSeconds: 0,
                              formattedTimestamp: '00:00:00',
                            })
                          }
                          className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/60 transition group-hover:scale-105 cursor-pointer"
                        >
                          <div className="w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center text-white shadow-xl">
                            <Play className="w-6 h-6 ml-0.5 text-white fill-current" />
                          </div>
                        </button>
                      </div>
                    )}

                    <div className="space-y-1">
                      <h4 className="font-semibold text-chailm-textMain text-sm">{data.title || 'Knowledge Source'}</h4>
                      <div className="flex flex-wrap items-center gap-2 text-[10px] text-chailm-textMuted font-mono">
                        <span className="bg-chailm-bg px-2 py-0.5 rounded-full border border-chailm-border uppercase font-semibold text-chailm-accentBlue">
                          {data.type}
                        </span>
                        <span>Status: {data.status}</span>
                      </div>
                    </div>

                    <p className="text-chailm-textMuted text-[11px] leading-relaxed">
                      Source registered in workspace. Retrieval & outline ready.
                    </p>
                  </div>
                </div>
              );
            }

            if (msg.role === 'assistant' && msg.queryData) {
              const resData = msg.queryData;
              const overallSummary = resData.answer?.overallSummary || resData.answer?.summary || '';
              const sections = resData.answer?.sections || [];
              const legacySegments = resData.answer?.segments || [];

              return (
                <div key={msg.id} className="space-y-6 animate-in fade-in duration-200">
                  {/* Executive Overview Box */}
                  {overallSummary && (
                    <div className="bg-chailm-panel border border-chailm-border rounded-2xl p-5 space-y-2 shadow-sm">
                      <div className="text-xs font-medium text-chailm-accentBlue uppercase tracking-wider flex items-center space-x-2">
                        <Sparkles className="w-4 h-4" />
                        <span>Executive Summary</span>
                      </div>
                      <p className="text-xs text-chailm-textMain leading-relaxed whitespace-pre-wrap">
                        {overallSummary}
                      </p>
                    </div>
                  )}

                  {/* Section-by-Section Breakdown */}
                  {sections.length > 0 ? (
                    <div className="space-y-4">
                      {sections.map((section, sIdx) => (
                        <div
                          key={sIdx}
                          className="bg-chailm-panel/80 border border-chailm-border rounded-2xl p-5 space-y-3 shadow-sm"
                        >
                          <div className="flex items-center justify-between border-b border-chailm-border/60 pb-2">
                            <div className="flex items-center space-x-2 text-xs font-semibold text-chailm-textMain">
                              <BookOpen className="w-3.5 h-3.5 text-chailm-accentBlue" />
                              <span>{section.sectionTitle}</span>
                            </div>
                          </div>

                          {section.summary && (
                            <p className="text-xs text-chailm-textMuted italic leading-relaxed">
                              {section.summary}
                            </p>
                          )}

                          {section.segments && section.segments.length > 0 && (
                            <div className="space-y-2 pt-1">
                              {section.segments.map((seg, segIdx) => (
                                <div
                                  key={segIdx}
                                  className="bg-chailm-card/70 p-3.5 rounded-xl border border-chailm-border/70 text-xs leading-relaxed text-chailm-textMain"
                                >
                                  <span>{seg.content}</span>
                                  {seg.citation && (
                                    <button
                                      type="button"
                                      onClick={() => handleCitationClick(seg.citation!, resData.sources)}
                                      className={`inline-flex items-center space-x-1.5 ml-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono transition-all border cursor-pointer ${
                                        seg.citation.sourceType === 'youtube'
                                          ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border-rose-500/30'
                                          : seg.citation.sourceType === 'pdf'
                                          ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
                                          : 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border-blue-500/30'
                                      }`}
                                    >
                                      {seg.citation.sourceType === 'youtube' ? (
                                        <>
                                          <Play className="w-2.5 h-2.5 text-rose-400" />
                                          <span>[{seg.citation.formattedTimestamp || `${seg.citation.startSeconds}s`}]</span>
                                        </>
                                      ) : seg.citation.sourceType === 'pdf' ? (
                                        <>
                                          <FileText className="w-2.5 h-2.5 text-amber-400" />
                                          <span>[Page {seg.citation.pageNumber || 1}]</span>
                                        </>
                                      ) : (
                                        <>
                                          <Globe className="w-2.5 h-2.5 text-blue-400" />
                                          <span>[Web Source]</span>
                                        </>
                                      )}
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : legacySegments.length > 0 ? (
                    <div className="space-y-3">
                      <div className="text-xs font-semibold text-chailm-textMuted uppercase tracking-wider">Key Findings</div>
                      <div className="space-y-2">
                        {legacySegments.map((segment, idx) => (
                          <div key={idx} className="bg-chailm-panel p-4 rounded-2xl border border-chailm-border text-xs leading-relaxed">
                            <span>{segment.content}</span>
                            {segment.citation && (
                              <button
                                type="button"
                                onClick={() => handleCitationClick(segment.citation!, resData.sources)}
                                className="inline-flex items-center space-x-1.5 ml-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono transition-all border cursor-pointer bg-chailm-accentBlue/10 text-chailm-accentBlue border-chailm-accentBlue/20 hover:bg-chailm-accentBlue/20"
                              >
                                <span>[Citation]</span>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {/* Retrieved Grounding Context Sources Grid */}
                  {resData.sources && resData.sources.length > 0 && (
                    <div className="pt-4 border-t border-chailm-border space-y-3">
                      <div className="text-xs font-semibold text-chailm-textMuted uppercase tracking-wider flex items-center space-x-1.5">
                        <Database className="w-3.5 h-3.5 text-chailm-accentBlue" />
                        <span>Retrieved Context Sources ({resData.sources.length})</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {resData.sources.map((chunk, idx) => {
                          const videoId = chunk.videoId || extractYouTubeVideoId(chunk.sourceUrl);
                          const startSecs = chunk.timestamp?.startSeconds || 0;
                          const cloudinaryUrl = chunk.cloudinaryUrl || (chunk.sourceUrl?.startsWith('http') ? chunk.sourceUrl : null);

                          return (
                            <div
                              key={idx}
                              onClick={() =>
                                onMediaClick({
                                  sourceType: chunk.sourceType,
                                  sourceUrl: chunk.sourceUrl,
                                  cloudinaryUrl: cloudinaryUrl,
                                  title: chunk.title,
                                  videoId: videoId,
                                  startSeconds: startSecs,
                                  formattedTimestamp: chunk.timestamp?.formattedTimestamp || null,
                                  pageNumber: chunk.pageNumber || null,
                                })
                              }
                              className="p-3.5 rounded-2xl bg-chailm-panel border border-chailm-border hover:border-chailm-accentBlue/50 transition-all cursor-pointer space-y-2 group text-xs shadow-xs"
                            >
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-medium text-chailm-textMain truncate max-w-[150px]">
                                  {chunk.title}
                                </span>
                                {chunk.rerankScore !== undefined && (
                                  <span className="font-mono text-[10px] text-chailm-accentBlue font-semibold bg-chailm-accentBlue/10 px-2 py-0.5 rounded-full border border-chailm-accentBlue/20">
                                    Score: {chunk.rerankScore.toFixed(3)}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-chailm-textMuted line-clamp-2 leading-relaxed">
                                "{chunk.text}"
                              </p>
                              {chunk.timestamp && chunk.sourceType?.toLowerCase() === 'youtube' && (
                                <div className="text-[11px] font-medium text-chailm-accentBlue flex items-center space-x-1 group-hover:underline pt-1">
                                  <Clock className="w-3 h-3" />
                                  <span>Play at Timestamp [{chunk.timestamp.formattedTimestamp}]</span>
                                </div>
                              )}
                              {chunk.sourceType?.toLowerCase() === 'pdf' && chunk.pageNumber && (
                                <div className="text-[11px] font-medium text-chailm-accentBlue flex items-center space-x-1 group-hover:underline pt-1">
                                  <FileText className="w-3 h-3" />
                                  <span>View PDF Page {chunk.pageNumber}</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return null;
          })
        )}

        {/* Dynamic Thinking & Loading State */}
        {isQuerying && (
          <div className="space-y-4 pt-2 pb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Status Pulse Banner */}
            <div className="bg-chailm-panel border border-chailm-accentBlue/40 rounded-2xl p-5 space-y-3 shadow-xl chailm-glow relative overflow-hidden">
              {/* Subtle top animated gradient bar */}
              <div className="brand-gradient-bar h-0.5 w-full absolute top-0 left-0"></div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-chailm-accentBlue/15 border border-chailm-accentBlue/30 flex items-center justify-center text-chailm-accentBlue shrink-0">
                  <CurrentLoadingStageIcon className="w-4 h-4 animate-pulse text-chailm-accentBlue" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-chailm-textMain">
                      {LOADING_STAGES[loadingStageIdx].text}
                    </span>
                    <span className="flex space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-chailm-accentBlue animate-ping"></span>
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-chailm-textMuted truncate">
                    {LOADING_STAGES[loadingStageIdx].subText}
                  </p>
                </div>
              </div>

              {/* Shimmering Executive Summary Skeletons */}
              <div className="space-y-2 pt-2 border-t border-chailm-border/60">
                <div className="h-3.5 w-3/4 rounded-full chailm-shimmer bg-chailm-card"></div>
                <div className="h-3.5 w-full rounded-full chailm-shimmer bg-chailm-card"></div>
                <div className="h-3.5 w-5/6 rounded-full chailm-shimmer bg-chailm-card"></div>
              </div>
            </div>

            {/* Shimmering Section Skeletons */}
            <div className="bg-chailm-panel/60 border border-chailm-border rounded-2xl p-5 space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-md chailm-shimmer bg-chailm-card"></div>
                <div className="h-4 w-48 rounded-full chailm-shimmer bg-chailm-card"></div>
              </div>
              <div className="space-y-2 pl-6">
                <div className="h-3 w-full rounded-full chailm-shimmer bg-chailm-card"></div>
                <div className="h-3 w-4/5 rounded-full chailm-shimmer bg-chailm-card"></div>
              </div>

              {/* Shimmering Citation Chips */}
              <div className="flex gap-2 pt-1 pl-6">
                <div className="h-5 w-24 rounded-full chailm-shimmer bg-chailm-card border border-chailm-border"></div>
                <div className="h-5 w-28 rounded-full chailm-shimmer bg-chailm-card border border-chailm-border"></div>
              </div>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input Bar */}
      <div className="p-6 bg-chailm-bg shrink-0">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div
            className={`bg-chailm-panel border rounded-3xl p-2 shadow-2xl relative overflow-hidden space-y-2 transition-all ${
              isQuerying ? 'border-chailm-accentBlue/40 chailm-glow' : 'border-chailm-border'
            }`}
          >
            {/* Top Custom Brand Accent Line */}
            <div className="brand-gradient-bar h-1 w-full absolute top-0 left-0"></div>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isQuerying ? "Synthesizing answer..." : "Ask a question about your active workspace content..."}
              disabled={isQuerying}
              className="w-full px-4 pt-3 pb-1 bg-transparent border-none text-xs text-chailm-textMain placeholder-chailm-textMuted focus:outline-none font-sans disabled:opacity-60"
            />

            {/* Bottom Action Controls Inside Input Bar */}
            <div className="flex items-center justify-between px-3 pb-1">
              <div className="flex items-center space-x-2 text-xs">
                {onOpenAddSource && (
                  <button
                    type="button"
                    onClick={onOpenAddSource}
                    disabled={isQuerying}
                    className="p-2 bg-chailm-card hover:bg-chailm-hover text-chailm-textMuted hover:text-chailm-textMain rounded-full border border-chailm-border flex items-center space-x-1 cursor-pointer disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                )}
                {isQuerying && (
                  <div className="flex items-center space-x-1.5 text-[11px] font-mono text-chailm-accentBlue bg-chailm-accentBlue/10 px-3 py-1 rounded-full border border-chailm-accentBlue/20">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={!inputText.trim() || isQuerying}
                className="px-4 py-2 bg-chailm-card hover:bg-chailm-hover disabled:opacity-40 text-chailm-textMain rounded-full text-xs font-medium border border-chailm-border flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <span>{isQuerying ? 'Analyzing...' : 'Run Query'}</span>
                <kbd className="text-[10px] text-chailm-textMuted font-mono bg-chailm-bg px-1.5 py-0.5 rounded-md">↵</kbd>
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
