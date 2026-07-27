import React, { useState } from 'react';
import { Play, FileText, CheckCircle2, Sparkles, Clock, Database, Plus } from 'lucide-react';
import type { QueryResultData } from '../modules/query/dto/queryDto';
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

export default function ChatBox({
  sessionTitle = 'Untitled Workspace',
  messages,
  isQuerying,
  onSendQuery,
  onMediaClick,
  onOpenAddSource,
}: ChatBoxProps) {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isQuerying) return;
    onSendQuery(inputText.trim());
    setInputText('');
  };

  return (
    <main className="flex-1 flex flex-col h-full bg-chailm-bg overflow-hidden relative min-w-0">
      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 max-w-4xl mx-auto w-full">
        {/* Header Welcome Prompt */}
        <div className="border-b border-chailm-border pb-6 space-y-2">
          <h1 className="text-2xl font-normal text-chailm-textMain tracking-tight">
            {sessionTitle}
          </h1>
          <p className="text-xs text-chailm-textMuted leading-relaxed">
            Query across active YouTube video transcripts and PDF documents with second-level timestamps and page references.
          </p>
        </div>

        {messages.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center p-8 space-y-3">
            <div className="w-12 h-12 bg-chailm-card rounded-full flex items-center justify-center text-chailm-accentBlue border border-chailm-border">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-sm font-semibold text-chailm-textMain">ChaiLM Workspace RAG</h2>
            <p className="text-chailm-textMuted text-xs max-w-xs leading-relaxed">
              Ask any question about your indexed YouTube video transcripts, PDFs, or websites to see grounded responses.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            if (msg.role === 'user') {
              return (
                <div key={msg.id} className="flex justify-end">
                  <div className="flex items-start space-x-2 max-w-xl">
                    <div className="bg-chailm-hover border border-chailm-border px-4 py-3 rounded-2xl rounded-tr-none text-xs font-medium text-chailm-textMain shadow-sm">
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      <span className="block text-[10px] text-chailm-textMuted mt-2 text-right">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }

            if (msg.role === 'system_index' && msg.indexData) {
              const data = msg.indexData;
              const videoId = data.sourceType === 'youtube' ? extractYouTubeVideoId(data.sourceUrl) : null;

              return (
                <div key={msg.id} className="flex justify-start">
                  <div className="bg-chailm-panel border border-chailm-border rounded-2xl rounded-tl-none p-5 max-w-xl space-y-3 shadow-lg text-xs">
                    <div className="flex items-center gap-2 text-chailm-accentBlue font-semibold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Document Successfully Indexed
                    </div>

                    {/* YouTube Video Thumbnail Card */}
                    {videoId && (
                      <div className="relative rounded-2xl overflow-hidden border border-chailm-border bg-black group">
                        <img
                          src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                          alt={data.title}
                          className="w-full h-44 object-cover group-hover:opacity-90 transition"
                        />
                        <button
                          onClick={() =>
                            onMediaClick({
                              sourceType: 'youtube',
                              sourceUrl: data.sourceUrl,
                              title: data.title,
                              videoId: videoId,
                              startSeconds: 0,
                              formattedTimestamp: '00:00:00',
                            })
                          }
                          className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/60 transition group-hover:scale-105"
                        >
                          <div className="w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center text-white shadow-xl">
                            <Play className="w-6 h-6 ml-0.5 text-white fill-current" />
                          </div>
                        </button>
                      </div>
                    )}

                    <div className="space-y-1">
                      <h4 className="font-semibold text-chailm-textMain text-sm">{data.title}</h4>
                      <div className="flex flex-wrap items-center gap-2 text-[10px] text-chailm-textMuted font-mono">
                        <span className="bg-chailm-bg px-2 py-0.5 rounded-full border border-chailm-border uppercase font-semibold text-chailm-accentBlue">
                          {data.sourceType}
                        </span>
                        <span>{data.chunksIndexed} Indexed Chunks</span>
                      </div>
                    </div>

                    <p className="text-chailm-textMuted text-[11px] leading-relaxed">
                      This content is now vectorized and ready for question-answering in your workspace.
                    </p>
                  </div>
                </div>
              );
            }

            if (msg.role === 'assistant' && msg.queryData) {
              const resData = msg.queryData;
              return (
                <div key={msg.id} className="space-y-6">
                  {/* Executive Overview Box */}
                  <div className="bg-chailm-panel border border-chailm-border rounded-2xl p-5 space-y-2">
                    <div className="text-xs font-medium text-chailm-accentBlue uppercase tracking-wider flex items-center space-x-2">
                      <Sparkles className="w-4 h-4" />
                      <span>Executive Summary</span>
                    </div>
                    <p className="text-xs text-chailm-textMain leading-relaxed whitespace-pre-wrap">
                      {resData.answer.summary}
                    </p>
                  </div>

                  {/* Findings Prose Content with Inline Citations */}
                  {resData.answer.segments.length > 0 && (
                    <div className="space-y-3">
                      <div className="text-xs font-semibold text-chailm-textMuted uppercase tracking-wider">Key Findings & Evidence</div>
                      
                      <div className="space-y-3 text-xs leading-relaxed text-chailm-textMain prose-editorial">
                        {resData.answer.segments.map((segment, idx) => {
                          const cit = segment.citation;
                          let videoId: string | null = null;
                          let startSecs = 0;

                          let matchingSource = null;
                          if (cit) {
                            startSecs = cit.startSeconds || 0;

                            matchingSource = resData.sources.find(
                              (s) => s.sourceType.toLowerCase() === cit.sourceType.toLowerCase()
                            ) || resData.sources[0];

                            if (matchingSource?.sourceType.toLowerCase() === 'youtube') {
                              videoId = matchingSource.videoId || extractYouTubeVideoId(matchingSource.sourceUrl);
                            }
                          }

                          const sourceUrl = matchingSource?.sourceUrl || '';
                          const cloudinaryUrl = matchingSource?.cloudinaryUrl || (sourceUrl.startsWith('http') ? sourceUrl : null);
                          const title = matchingSource?.title || 'Knowledge Source';

                          return (
                            <div key={idx} className="bg-chailm-panel p-4 rounded-2xl border border-chailm-border">
                              <span>{segment.content}</span>
                              
                              {/* Inline Citation Badges */}
                              {cit && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    onMediaClick({
                                      sourceType: cit.sourceType,
                                      sourceUrl: sourceUrl,
                                      cloudinaryUrl: cloudinaryUrl,
                                      title: title,
                                      videoId: videoId,
                                      startSeconds: startSecs,
                                      formattedTimestamp: cit.formattedTimestamp,
                                      pageNumber: cit.pageNumber,
                                    })
                                  }
                                  className={`inline-flex items-center space-x-1.5 ml-2 px-2.5 py-1 rounded-full text-[10px] font-mono transition-all border cursor-pointer ${
                                    cit.sourceType === 'youtube'
                                      ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border-rose-500/30'
                                      : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
                                  }`}
                                >
                                  {cit.sourceType === 'youtube' ? (
                                    <>
                                      <Play className="w-2.5 h-2.5 text-rose-400" />
                                      <span>[{cit.formattedTimestamp}]</span>
                                    </>
                                  ) : (
                                    <>
                                      <FileText className="w-2.5 h-2.5 text-amber-400" />
                                      <span>[Page {cit.pageNumber}]</span>
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Retrieved Context Sources Grid */}
                  {resData.sources.length > 0 && (
                    <div className="pt-4 border-t border-chailm-border space-y-3">
                      <div className="text-xs font-semibold text-chailm-textMuted uppercase tracking-wider flex items-center space-x-1.5">
                        <Database className="w-3.5 h-3.5 text-chailm-accentBlue" />
                        <span>Retrieved Context Sources ({resData.sources.length})</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {resData.sources.map((chunk, idx) => {
                          const videoId = chunk.videoId || extractYouTubeVideoId(chunk.sourceUrl);
                          const startSecs = chunk.timestamp?.startSeconds || 0;
                          const cloudinaryUrl = chunk.cloudinaryUrl || (chunk.sourceUrl.startsWith('http') ? chunk.sourceUrl : null);

                          return (
                            <div 
                              key={idx}
                              onClick={() => onMediaClick({
                                sourceType: chunk.sourceType,
                                sourceUrl: chunk.sourceUrl,
                                cloudinaryUrl: cloudinaryUrl,
                                title: chunk.title,
                                videoId: videoId,
                                startSeconds: startSecs,
                                formattedTimestamp: chunk.timestamp?.formattedTimestamp || null,
                                pageNumber: chunk.pageNumber || null,
                              })}
                              className="p-3.5 rounded-2xl bg-chailm-panel border border-chailm-border hover:border-chailm-accentBlue/50 transition-all cursor-pointer space-y-2 group text-xs"
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
                              {chunk.timestamp && chunk.sourceType.toLowerCase() === 'youtube' && (
                                <div className="text-[11px] font-medium text-chailm-accentBlue flex items-center space-x-1 group-hover:underline pt-1">
                                  <Clock className="w-3 h-3" />
                                  <span>Play at Timestamp [{chunk.timestamp.formattedTimestamp}]</span>
                                </div>
                              )}
                              {chunk.sourceType.toLowerCase() === 'pdf' && chunk.pageNumber && (
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
      </div>

      {/* Input Bar */}
      <div className="p-6 bg-chailm-bg shrink-0">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="bg-chailm-panel border border-chailm-border rounded-3xl p-2 shadow-2xl relative overflow-hidden space-y-2">
            
            {/* Top Custom Brand Accent Line */}
            <div className="brand-gradient-bar h-1 w-full absolute top-0 left-0"></div>

            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask a question about your active workspace content..."
              disabled={isQuerying}
              className="w-full px-4 pt-3 pb-1 bg-transparent border-none text-xs text-chailm-textMain placeholder-chailm-textMuted focus:outline-none font-sans"
            />

            {/* Bottom Action Controls Inside Input Bar */}
            <div className="flex items-center justify-between px-3 pb-1">
              <div className="flex items-center space-x-2 text-xs">
                {onOpenAddSource && (
                  <button 
                    type="button" 
                    onClick={onOpenAddSource}
                    className="p-2 bg-chailm-card hover:bg-chailm-hover text-chailm-textMuted hover:text-chailm-textMain rounded-full border border-chailm-border flex items-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button 
                type="submit"
                disabled={!inputText.trim() || isQuerying}
                className="px-4 py-2 bg-chailm-card hover:bg-chailm-hover disabled:opacity-40 text-chailm-textMain rounded-full text-xs font-medium border border-chailm-border flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <span>{isQuerying ? 'Running...' : 'Run'}</span>
                <kbd className="text-[10px] text-chailm-textMuted font-mono bg-chailm-bg px-1.5 py-0.5 rounded-md">Ctrl ↵</kbd>
              </button>
            </div>

          </div>
        </form>
      </div>
    </main>
  );
}
