import React, { useState, useEffect } from 'react';
import { Plus, FileText, Video, Globe, RefreshCw, Folder, Layers, Clock, Search, CheckSquare, Square } from 'lucide-react';
import type { SessionSourceItem, SourceType } from '../modules/indexer/dto/indexerDto';
import type { SourceItem } from '../modules/query/dto/queryDto';
import type { ActiveMediaState } from './RightPlayerSidebar';
import { useIndexDocument } from '../modules/indexer/mutation/useIndexDocument';
import { extractYouTubeVideoId } from '../utils/helpers';

interface LeftSidebarProps {
  sessionId: string;
  sources: SessionSourceItem[];
  retrievedSources?: SourceItem[];
  selectedSourceUrls: string[];
  onToggleSourceSelect: (url: string) => void;
  onSelectAllSources: () => void;
  onClearSourceSelection: () => void;
  isLoadingSources: boolean;
  onNewSession: () => void;
  onIndexingSuccess: () => void;
  onSelectSourceMedia: (media: ActiveMediaState) => void;
}

export default function LeftSidebar({
  sessionId,
  sources,
  retrievedSources = [],
  selectedSourceUrls,
  onToggleSourceSelect,
  onSelectAllSources,
  onClearSourceSelection,
  isLoadingSources,
  onNewSession,
  onIndexingSuccess,
  onSelectSourceMedia,
}: LeftSidebarProps) {
  const [activeTab, setActiveTab] = useState<'sources' | 'retrieved'>('sources');
  const [showAddModal, setShowAddModal] = useState(false);
  const [indexType, setIndexType] = useState<SourceType>('pdf');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const { mutate: indexDocument, isPending: isIndexing, error: indexError } = useIndexDocument();

  // Automatically switch to 'retrieved' tab when new retrieved context sources arrive
  useEffect(() => {
    if (retrievedSources.length > 0) {
      setActiveTab('retrieved');
    }
  }, [retrievedSources]);

  const handleIndexSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (indexType === 'pdf') {
      if (!file) return alert('Please select a PDF file');
      indexDocument(
        { type: 'pdf', file, sessionId },
        {
          onSuccess: () => {
            setFile(null);
            setShowAddModal(false);
            onIndexingSuccess();
          },
        }
      );
    } else {
      if (!url.trim()) return alert('Please enter a valid URL');
      indexDocument(
        { type: indexType, url: url.trim(), sessionId },
        {
          onSuccess: () => {
            setUrl('');
            setShowAddModal(false);
            onIndexingSuccess();
          },
        }
      );
    }
  };

  const allSelected = sources.length > 0 && selectedSourceUrls.length === sources.length;

  return (
    <aside className="w-80 bg-slate-950 border-r border-slate-800 flex flex-col h-full shrink-0">
      {/* App & Session Header */}
      <div className="p-4 border-b border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Folder className="w-5 h-5 text-emerald-400" />
            <h1 className="font-bold text-lg text-white">Notebook RAG</h1>
          </div>
          <button
            onClick={onNewSession}
            title="Create New Session"
            className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded border border-slate-800 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-slate-900 p-2 rounded border border-slate-800 text-xs text-slate-400 font-mono flex items-center justify-between">
          <span className="truncate">{sessionId}</span>
        </div>
      </div>

      {/* Action Button: Add Source */}
      <div className="p-3 border-b border-slate-800">
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/30 transition"
        >
          <Plus className="w-4 h-4" />
          Add Source
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950 px-2 pt-2 gap-1 text-xs">
        <button
          onClick={() => setActiveTab('sources')}
          className={`flex-1 py-2 px-3 rounded-t-lg font-medium flex items-center justify-center gap-1.5 transition ${
            activeTab === 'sources'
              ? 'bg-slate-900 text-white border-t border-x border-slate-800'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Sources ({sources.length})
        </button>

        <button
          onClick={() => setActiveTab('retrieved')}
          className={`flex-1 py-2 px-3 rounded-t-lg font-medium flex items-center justify-center gap-1.5 transition relative ${
            activeTab === 'retrieved'
              ? 'bg-slate-900 text-white border-t border-x border-slate-800'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          Retrieved ({retrievedSources.length})
          {retrievedSources.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse absolute top-1 right-2" />
          )}
        </button>
      </div>

      {/* Tab Content 1: Workspace Sources */}
      {activeTab === 'sources' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          <div className="flex justify-between items-center text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            <span>Indexed Session Sources</span>
            {sources.length > 0 && (
              <button
                type="button"
                onClick={allSelected ? onClearSourceSelection : onSelectAllSources}
                className="text-[10px] text-emerald-400 hover:underline capitalize normal-case font-mono font-normal cursor-pointer"
              >
                {allSelected ? 'Deselect All' : 'Select All'}
              </button>
            )}
          </div>

          {isLoadingSources ? (
            <p className="text-xs text-slate-500 italic">Loading sources...</p>
          ) : sources.length > 0 ? (
            <div className="space-y-2">
              {sources.map((src, idx) => {
                const type = src.sourceType.toLowerCase();
                const isSelected = selectedSourceUrls.includes(src.sourceUrl);

                return (
                  <div
                    key={idx}
                    onClick={() =>
                      onSelectSourceMedia({
                        sourceType: src.sourceType,
                        sourceUrl: src.sourceUrl,
                        title: src.title,
                        cloudinaryUrl: src.cloudinaryUrl,
                      })
                    }
                    className={`p-3 bg-slate-900/80 hover:bg-slate-900 border rounded-lg cursor-pointer transition space-y-1 group flex items-start gap-2.5 ${
                      isSelected
                        ? 'border-emerald-500/80 bg-emerald-950/20'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Source Selection Checkbox */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSourceSelect(src.sourceUrl);
                      }}
                      className="pt-0.5 text-slate-400 hover:text-emerald-400 cursor-pointer shrink-0"
                      title={isSelected ? 'Deselect for RAG search' : 'Select for RAG search'}
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-600 hover:text-slate-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-medium">
                        {type === 'youtube' && <Video className="w-4 h-4 text-red-400 shrink-0" />}
                        {type === 'pdf' && <FileText className="w-4 h-4 text-amber-400 shrink-0" />}
                        {type === 'website' && <Globe className="w-4 h-4 text-blue-400 shrink-0" />}
                        <span className="text-slate-200 group-hover:text-white truncate font-medium">
                          {src.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate font-mono">{src.sourceUrl}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 bg-slate-900/40 rounded border border-dashed border-slate-800 text-center space-y-1">
              <p className="text-xs text-slate-400 font-medium">No sources added yet</p>
              <p className="text-[11px] text-slate-500">Upload a PDF or add YouTube/Web link to begin</p>
            </div>
          )}
        </div>
      )}

      {/* Tab Content 2: Retrieved Context Sources (Query Chunks) */}
      {activeTab === 'retrieved' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Retrieved Context Sources
            </h2>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">
              {retrievedSources.length} Chunks
            </span>
          </div>

          {retrievedSources.length > 0 ? (
            <div className="space-y-3">
              {retrievedSources.map((src, idx) => {
                const type = src.sourceType.toLowerCase();
                const videoId = src.videoId || extractYouTubeVideoId(src.sourceUrl);
                const startSecs = src.timestamp?.startSeconds || 0;

                return (
                  <div
                    key={idx}
                    className="p-3 bg-slate-900/90 border border-slate-800 rounded-lg space-y-2 text-xs shadow-sm hover:border-slate-700 transition"
                  >
                    <div className="flex justify-between items-center text-slate-400 font-mono text-[11px]">
                      <div className="flex items-center gap-1.5 truncate pr-2">
                        {type === 'youtube' && <Video className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                        {type === 'pdf' && <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                        {type === 'website' && <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                        <span className="truncate text-white font-medium">{src.title}</span>
                      </div>
                      {src.rerankScore !== undefined && (
                        <span className="text-emerald-400 text-[10px]">
                          Score: {src.rerankScore.toFixed(3)}
                        </span>
                      )}
                    </div>

                    <p className="text-slate-300 font-sans text-[11px] leading-relaxed line-clamp-3 bg-slate-950/60 p-2 rounded border border-slate-900">
                      {src.text}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        onSelectSourceMedia({
                          sourceType: src.sourceType,
                          sourceUrl: src.sourceUrl,
                          title: src.title,
                          videoId: videoId,
                          startSeconds: startSecs,
                          formattedTimestamp: src.timestamp?.formattedTimestamp || null,
                          pageNumber: src.pageNumber || null,
                        })
                      }
                      className="w-full py-1 px-2.5 bg-slate-950 hover:bg-slate-800 text-emerald-400 border border-slate-800 hover:border-emerald-500 rounded text-[11px] font-mono flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Clock className="w-3 h-3" />
                      {type === 'youtube'
                        ? `Play at Timestamp [${src.timestamp?.formattedTimestamp || '00:00:00'}]`
                        : type === 'pdf'
                        ? `View PDF Page ${src.pageNumber || 1}`
                        : 'View Source Link'}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 bg-slate-900/40 rounded border border-dashed border-slate-800 text-center space-y-1">
              <p className="text-xs text-slate-400 font-medium">No retrieved context yet</p>
              <p className="text-[11px] text-slate-500">Ask a RAG question in the chat to see relevant context passages</p>
            </div>
          )}
        </div>
      )}

      {/* Modal / Drawer for Add Source */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-semibold text-white">Add New Knowledge Source</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleIndexSubmit} className="space-y-4">
              <div className="flex gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                {(['pdf', 'youtube', 'website'] as SourceType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setIndexType(t)}
                    className={`flex-1 py-1.5 rounded capitalize font-medium transition ${
                      indexType === t ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {indexType === 'pdf' ? (
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">PDF File</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-white hover:file:bg-slate-700"
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">
                    {indexType === 'youtube' ? 'YouTube Video URL' : 'Website URL'}
                  </label>
                  <input
                    type="url"
                    placeholder={
                      indexType === 'youtube'
                        ? 'https://www.youtube.com/watch?v=...'
                        : 'https://example.com'
                    }
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              {indexError && (
                <p className="text-xs text-red-400 bg-red-950/50 p-2 rounded border border-red-900">
                  {indexError.message}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isIndexing}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold rounded transition"
                >
                  {isIndexing ? 'Indexing...' : 'Add & Index'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </aside>
  );
}
