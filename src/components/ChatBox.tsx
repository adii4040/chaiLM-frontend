import React, { useState } from 'react';
import { Send, Play, FileText, CheckCircle2, Sparkles, Clock, Globe } from 'lucide-react';
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
  messages: ChatMessage[];
  isQuerying: boolean;
  onSendQuery: (query: string) => void;
  onMediaClick: (media: ActiveMediaState) => void;
}

export default function ChatBox({
  messages,
  isQuerying,
  onSendQuery,
  onMediaClick,
}: ChatBoxProps) {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isQuerying) return;
    onSendQuery(inputText.trim());
    setInputText('');
  };

  return (
    <main className="flex-1 flex flex-col h-full bg-slate-900 overflow-hidden relative">
      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-emerald-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">ChaiLM Workspace RAG</h2>
            <p className="text-slate-400 text-sm max-w-md">
              Ask any question about your indexed YouTube video transcripts, PDFs, or websites.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            if (msg.role === 'user') {
              return (
                <div key={msg.id} className="flex justify-end">
                  <div className="bg-emerald-600 text-white p-4 rounded-2xl rounded-tr-none max-w-2xl text-sm shadow-md">
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <span className="block text-[10px] text-emerald-200 mt-2 text-right">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            }

            if (msg.role === 'system_index' && msg.indexData) {
              const data = msg.indexData;
              const videoId = data.sourceType === 'youtube' ? extractYouTubeVideoId(data.sourceUrl) : null;

              return (
                <div key={msg.id} className="flex justify-start">
                  <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-none p-5 max-w-xl space-y-3 shadow-lg text-sm">
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      Document Successfully Indexed
                    </div>

                    {/* YouTube Video Thumbnail Card */}
                    {videoId && (
                      <div className="relative rounded-lg overflow-hidden border border-slate-700 bg-black group">
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
                          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white shadow-xl">
                            <Play className="w-6 h-6 ml-0.5" />
                          </div>
                        </button>
                      </div>
                    )}

                    <div className="space-y-1">
                      <h4 className="font-semibold text-white text-base">{data.title}</h4>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono">
                        <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-700 uppercase font-bold text-emerald-400">
                          {data.sourceType}
                        </span>
                        <span>{data.chunksIndexed} Indexed Chunks</span>
                      </div>
                    </div>

                    <p className="text-slate-300 text-xs leading-relaxed">
                      This content is now vectorized and ready for question-answering in your workspace.
                    </p>
                  </div>
                </div>
              );
            }

            if (msg.role === 'assistant' && msg.queryData) {
              const resData = msg.queryData;
              return (
                <div key={msg.id} className="flex justify-start">
                  <div className="bg-slate-800/90 border border-slate-700 rounded-2xl rounded-tl-none p-6 max-w-3xl space-y-6 shadow-xl text-sm w-full">
                    {/* Summary */}
                    <div className="space-y-2">
                      <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> Answer Summary
                      </h3>
                      <p className="text-slate-200 text-sm leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                        {resData.answer.summary}
                      </p>
                    </div>

                    {/* Key Takeaways & Clickable Timestamps */}
                    {resData.answer.segments.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-white">Key Takeaways & Citations</h4>
                        <div className="space-y-2">
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
                              <div
                                key={idx}
                                className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2"
                              >
                                <p className="text-slate-300 leading-relaxed text-sm">{segment.content}</p>

                                {cit && (
                                  <div className="pt-1">
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
                                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 border border-slate-700 hover:border-emerald-500 rounded text-xs font-mono font-medium transition group cursor-pointer"
                                    >
                                      <Clock className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                                      <span>Citation: {cit.sourceType.toUpperCase()}</span>
                                      {cit.pageNumber !== null && <span>| Page {cit.pageNumber}</span>}
                                      {cit.formattedTimestamp && <span>| Timestamp [{cit.formattedTimestamp}]</span>}
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Retrieved Sources */}
                    {resData.sources.length > 0 && (
                      <div className="space-y-3 border-t border-slate-700/60 pt-4">
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Retrieved Context Sources ({resData.sources.length})
                        </h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                          {resData.sources.map((src, idx) => {
                            const videoId = src.videoId || extractYouTubeVideoId(src.sourceUrl);
                            const startSecs = src.timestamp?.startSeconds || 0;

                            return (
                              <div
                                key={idx}
                                className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs space-y-1"
                              >
                                <div className="flex justify-between items-center text-slate-400 font-mono text-[11px]">
                                  <div className="flex items-center gap-1.5 truncate">
                                    {src.sourceType.toLowerCase() === 'youtube' && <Play className="w-3 h-3 text-red-400" />}
                                    {src.sourceType.toLowerCase() === 'pdf' && <FileText className="w-3 h-3 text-amber-400" />}
                                    {src.sourceType.toLowerCase() === 'website' && <Globe className="w-3 h-3 text-blue-400" />}
                                    <span className="truncate text-white font-medium">{src.title}</span>
                                  </div>
                                  {src.rerankScore !== undefined && <span>Score: {src.rerankScore.toFixed(3)}</span>}
                                </div>

                                <p className="text-slate-300 font-sans italic line-clamp-2">{src.text}</p>

                                {src.timestamp?.formattedTimestamp && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      onMediaClick({
                                        sourceType: src.sourceType,
                                        sourceUrl: src.sourceUrl,
                                        title: src.title,
                                        videoId: videoId,
                                        startSeconds: startSecs,
                                        formattedTimestamp: src.timestamp?.formattedTimestamp,
                                      })
                                    }
                                    className="text-emerald-400 hover:text-emerald-300 font-mono text-[11px] flex items-center gap-1 mt-1 hover:underline cursor-pointer"
                                  >
                                    <Clock className="w-3 h-3" />
                                    Play at Timestamp [{src.timestamp.formattedTimestamp}]
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            }

            return null;
          })
        )}
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-slate-800 bg-slate-950">
        <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto flex items-center">
          <input
            type="text"
            placeholder="Ask a question about your indexed workspace content..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isQuerying}
            className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-emerald-500 rounded-full py-3.5 pl-5 pr-14 text-sm text-white focus:outline-none shadow-inner transition"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isQuerying}
            className="absolute right-2 p-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-full transition shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </main>
  );
}
