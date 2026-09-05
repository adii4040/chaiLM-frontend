import React, { useState, useEffect, useRef } from 'react';
import { Play, FileText, CheckCircle2, Sparkles, Clock, Database, Plus, Globe, BookOpen, Search, Loader2 } from 'lucide-react';
import type { QueryResultData, AnswerCitation } from '../modules/query/dto/queryDto';
import type { IndexResultData } from '../modules/indexer/dto/indexerDto';
import type { ActiveMediaState } from './RightPlayerSidebar';
import { extractYouTubeVideoId } from '../utils/helpers';
import { colors, mono, serif } from './landing/tokens';

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
    text: 'Searching indexed knowledge sources...',
    subText: 'Retrieving relevant passages and contextual evidence',
  },
  {
    icon: Database,
    text: 'Analyzing content & synthesizing evidence...',
    subText: 'Connecting key insights across grounding sources',
  },
  {
    icon: Sparkles,
    text: 'Formulating structured answer...',
    subText: 'Generating executive summary & grounding citations',
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
      autoPlay: true,
    });
  };

  const CurrentLoadingStageIcon = LOADING_STAGES[loadingStageIdx].icon;

  return (
    <main
      className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0"
      style={{ background: colors.paper }}
    >
      {/* Messages Stream Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-6 md:p-8 space-y-7 max-w-4xl mx-auto w-full scroll-smooth"
      >
        {/* Header Welcome Prompt */}
        <div className="border-b pb-5 space-y-1.5" style={{ borderColor: colors.hairline }}>
          <h1
            className="text-2xl md:text-3xl font-medium tracking-tight text-[#14171A]"
            style={serif}
          >
            {sessionTitle}
          </h1>
          <p className="text-xs text-[#5C6169] leading-relaxed">
            Query across active YouTube videos, PDF documents, and web articles with source-grounded citations.
          </p>
        </div>

        {messages.length === 0 && !isQuerying ? (
          <div className="py-16 flex flex-col items-center justify-center text-center p-8 space-y-3">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xs"
              style={{ background: colors.verifiedSoft, color: colors.verified }}
            >
              <Sparkles className="w-7 h-7" />
            </div>
            <h2 className="text-base font-semibold text-[#14171A]">chaiLM Grounded Knowledge Query</h2>
            <p className="text-[#5C6169] text-xs max-w-sm leading-relaxed">
              Ask questions to generate structured executive summaries, segmented breakdowns, and precise clickable timestamps.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            if (msg.role === 'user') {
              return (
                <div key={msg.id} className="flex justify-end animate-in fade-in slide-in-from-bottom-1 duration-200">
                  <div className="flex items-start space-x-2 max-w-xl">
                    <div
                      className="px-4 py-3 rounded-2xl rounded-tr-none text-xs font-medium text-[#14171A] shadow-xs"
                      style={{
                        background: '#FFFFFF',
                        border: `1px solid ${colors.hairlineStrong}`,
                      }}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                      <span className="block text-[10px] text-[#93968F] mt-2 text-right font-mono" style={mono}>
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
                  <div
                    className="bg-white rounded-2xl rounded-tl-none p-5 max-w-xl space-y-3 shadow-sm text-xs"
                    style={{ border: `1px solid ${colors.hairlineStrong}` }}
                  >
                    <div className="flex items-center gap-2 text-[#1F7A5C] font-semibold text-xs" style={mono}>
                      <CheckCircle2 className="w-4 h-4 text-[#1F7A5C]" />
                      DOCUMENT INDEXED SUCCESSFULLY
                    </div>

                    {videoId && (
                      <div className="relative rounded-xl overflow-hidden border border-[#CBCFC9] bg-black group">
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
                              autoPlay: true,
                            })
                          }
                          className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/60 transition group-hover:scale-105 cursor-pointer"
                        >
                          <div className="w-12 h-12 bg-[#1F7A5C] rounded-full flex items-center justify-center text-white shadow-xl">
                            <Play className="w-6 h-6 ml-0.5 text-white fill-current" />
                          </div>
                        </button>
                      </div>
                    )}

                    <div className="space-y-1">
                      <h4 className="font-semibold text-[#14171A] text-sm">{data.title || 'Knowledge Source'}</h4>
                      <div className="flex flex-wrap items-center gap-2 text-[10px] text-[#5C6169]" style={mono}>
                        <span
                          className="px-2 py-0.5 rounded-full uppercase font-bold"
                          style={{
                            background: colors.verifiedSoft,
                            color: colors.verified,
                            border: `1px solid ${colors.verifiedBorder}`,
                          }}
                        >
                          {data.type}
                        </span>
                        <span>Status: {data.status}</span>
                      </div>
                    </div>

                    <p className="text-[#5C6169] text-[11px] leading-relaxed">
                      Source registered in workspace. Retrieval &amp; outline ready.
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
                <div key={msg.id} className="space-y-5 animate-in fade-in duration-200">
                  {/* Executive Overview Box */}
                  {overallSummary && (
                    <div
                      className="bg-white rounded-2xl p-5 space-y-2.5 shadow-sm relative overflow-hidden"
                      style={{ border: `1px solid ${colors.hairlineStrong}` }}
                    >
                      <div className="h-[3px] w-full bg-[#1F7A5C] absolute top-0 left-0 right-0" />
                      <div className="text-xs font-bold text-[#1F7A5C] uppercase tracking-wider flex items-center space-x-2 pt-1" style={mono}>
                        <Sparkles className="w-4 h-4" />
                        <span>SYNTHESIZED EXECUTIVE SUMMARY</span>
                      </div>
                      <p className="text-xs text-[#14171A] leading-relaxed whitespace-pre-wrap">
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
                          className="bg-white rounded-2xl p-5 space-y-3 shadow-xs"
                          style={{ border: `1px solid ${colors.hairlineStrong}` }}
                        >
                          <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: colors.hairline }}>
                            <div className="flex items-center space-x-2 text-xs font-semibold text-[#14171A]">
                              <BookOpen className="w-3.5 h-3.5 text-[#1F7A5C]" />
                              <span>{section.sectionTitle}</span>
                            </div>
                          </div>

                          {section.summary && (
                            <p className="text-xs text-[#5C6169] italic leading-relaxed">
                              {section.summary}
                            </p>
                          )}

                          {section.segments && section.segments.length > 0 && (
                            <div className="space-y-2 pt-1">
                              {section.segments.map((seg, segIdx) => (
                                <div
                                  key={segIdx}
                                  className="p-3.5 rounded-xl text-xs leading-relaxed text-[#14171A]"
                                  style={{
                                    background: colors.surface2,
                                    border: `1px solid ${colors.hairline}`,
                                  }}
                                >
                                  <span>{seg.content}</span>
                                  {seg.citation && (
                                    <button
                                      type="button"
                                      onClick={() => handleCitationClick(seg.citation!, resData.sources)}
                                      className={`inline-flex items-center space-x-1.5 ml-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono transition-all border cursor-pointer font-bold ${
                                        seg.citation.sourceType === 'youtube'
                                          ? 'bg-red-50 hover:bg-red-100 text-red-600 border-red-200'
                                          : seg.citation.sourceType === 'pdf'
                                          ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'
                                          : 'bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200'
                                      }`}
                                    >
                                      {seg.citation.sourceType === 'youtube' ? (
                                        <>
                                          <Play className="w-2.5 h-2.5 text-red-600 fill-current" />
                                          <span>[{seg.citation.formattedTimestamp || `${seg.citation.startSeconds}s`}]</span>
                                        </>
                                      ) : seg.citation.sourceType === 'pdf' ? (
                                        <>
                                          <FileText className="w-2.5 h-2.5 text-amber-600" />
                                          <span>[Page {seg.citation.pageNumber || 1}]</span>
                                        </>
                                      ) : (
                                        <>
                                          <Globe className="w-2.5 h-2.5 text-blue-600" />
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
                      <div className="text-xs font-semibold text-[#5C6169] uppercase tracking-wider" style={mono}>Key Findings</div>
                      <div className="space-y-2">
                        {legacySegments.map((segment, idx) => (
                          <div
                            key={idx}
                            className="bg-white p-4 rounded-2xl text-xs leading-relaxed"
                            style={{ border: `1px solid ${colors.hairlineStrong}` }}
                          >
                            <span>{segment.content}</span>
                            {segment.citation && (
                              <button
                                type="button"
                                onClick={() => handleCitationClick(segment.citation!, resData.sources)}
                                className="inline-flex items-center space-x-1.5 ml-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono transition-all border cursor-pointer bg-[#1F7A5C]/10 text-[#1F7A5C] border-[#1F7A5C]/30 hover:bg-[#1F7A5C]/20"
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
                    <div className="pt-4 border-t space-y-3" style={{ borderColor: colors.hairline }}>
                      <div className="text-xs font-bold text-[#5C6169] uppercase tracking-wider flex items-center space-x-1.5" style={mono}>
                        <Database className="w-3.5 h-3.5 text-[#1F7A5C]" />
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
                                  autoPlay: Boolean(chunk.timestamp && chunk.sourceType?.toLowerCase() === 'youtube'),
                                })
                              }
                              className="p-3.5 rounded-2xl bg-white border hover:border-[#1F7A5C] transition-all duration-200 cursor-pointer space-y-2 group text-xs shadow-xs"
                              style={{ borderColor: colors.hairlineStrong }}
                            >
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-semibold text-[#14171A] truncate max-w-[160px]">
                                  {chunk.title}
                                </span>
                                {chunk.rerankScore !== undefined && (
                                  <span
                                    className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                    style={{
                                      background: colors.verifiedSoft,
                                      color: colors.verified,
                                      border: `1px solid ${colors.verifiedBorder}`,
                                    }}
                                  >
                                    Score: {chunk.rerankScore.toFixed(3)}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-[#5C6169] line-clamp-2 leading-relaxed">
                                "{chunk.text}"
                              </p>
                              {chunk.timestamp && chunk.sourceType?.toLowerCase() === 'youtube' && (
                                <div className="text-[11px] font-semibold text-[#1F7A5C] flex items-center space-x-1 group-hover:underline pt-1">
                                  <Clock className="w-3 h-3" />
                                  <span>Seek to [{chunk.timestamp.formattedTimestamp}]</span>
                                </div>
                              )}
                              {chunk.sourceType?.toLowerCase() === 'pdf' && chunk.pageNumber && (
                                <div className="text-[11px] font-semibold text-[#1F7A5C] flex items-center space-x-1 group-hover:underline pt-1">
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
            <div
              className="bg-white rounded-2xl p-5 space-y-3 shadow-md relative overflow-hidden"
              style={{ border: `1px solid ${colors.verified}` }}
            >
              <div className="h-0.5 w-full bg-[#1F7A5C] absolute top-0 left-0"></div>

              <div className="flex items-center space-x-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: colors.verifiedSoft, color: colors.verified }}
                >
                  <CurrentLoadingStageIcon className="w-4 h-4 animate-pulse" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-[#14171A]">
                      {LOADING_STAGES[loadingStageIdx].text}
                    </span>
                    <span className="flex space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1F7A5C] animate-ping"></span>
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-[#5C6169] truncate" style={mono}>
                    {LOADING_STAGES[loadingStageIdx].subText}
                  </p>
                </div>
              </div>

              {/* Shimmering Executive Summary Skeletons */}
              <div className="space-y-2 pt-2 border-t" style={{ borderColor: colors.hairline }}>
                <div className="h-3 w-3/4 rounded-full bg-[#F0F1EE] animate-pulse"></div>
                <div className="h-3 w-full rounded-full bg-[#F0F1EE] animate-pulse"></div>
                <div className="h-3 w-5/6 rounded-full bg-[#F0F1EE] animate-pulse"></div>
              </div>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input Bar */}
      <div className="p-6 shrink-0" style={{ background: colors.paper }}>
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div
            className="bg-white rounded-3xl p-3 shadow-md relative overflow-hidden space-y-2 transition-all"
            style={{
              border: `1px solid ${isQuerying ? colors.verified : colors.hairlineStrong}`,
            }}
          >
            {/* Top Custom Brand Accent Line */}
            <div
              className="h-1 w-full absolute top-0 left-0"
              style={{
                background: `linear-gradient(90deg, ${colors.cobalt} 0%, ${colors.verified} 100%)`,
              }}
            />

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isQuerying ? "Synthesizing answer..." : "Ask a question about your active workspace content..."}
              disabled={isQuerying}
              className="w-full px-4 pt-3 pb-1 bg-transparent border-none text-xs md:text-sm text-[#14171A] placeholder:text-[#93968F] focus:outline-none font-sans disabled:opacity-60"
            />

            {/* Bottom Action Controls Inside Input Bar */}
            <div className="flex items-center justify-between px-3 pb-1">
              <div className="flex items-center space-x-2 text-xs">
                {onOpenAddSource && (
                  <button
                    type="button"
                    onClick={onOpenAddSource}
                    disabled={isQuerying}
                    className="p-2 bg-[#F5F6F4] hover:bg-[#E2E4E1] text-[#5C6169] hover:text-[#14171A] rounded-full border border-[#CBCFC9] flex items-center justify-center cursor-pointer disabled:opacity-40 transition-all shadow-2xs"
                    title="Add Knowledge Source"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                )}
                {isQuerying && (
                  <div
                    className="flex items-center space-x-1.5 text-[11px] font-mono px-3 py-1 rounded-full"
                    style={{
                      ...mono,
                      background: colors.verifiedSoft,
                      color: colors.verified,
                      border: `1px solid ${colors.verifiedBorder}`,
                    }}
                  >
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={!inputText.trim() || isQuerying}
                className="px-4 py-2 bg-[#F5F6F4] hover:bg-[#E2E4E1] disabled:opacity-40 text-[#14171A] rounded-full text-xs font-medium border border-[#CBCFC9] flex items-center space-x-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <span>{isQuerying ? 'Analyzing...' : 'Run Query'}</span>
                <kbd
                  className="text-[10px] text-[#5C6169] px-1.5 py-0.5 rounded-md font-mono"
                  style={{ ...mono, background: '#FFFFFF', border: `1px solid ${colors.hairline}` }}
                >
                  ↵
                </kbd>
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
