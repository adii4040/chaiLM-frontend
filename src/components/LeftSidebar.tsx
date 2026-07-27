import React, { useState } from 'react';
import { FileText, Video, Globe } from 'lucide-react';
import type { SessionSourceItem, SourceType } from '../modules/indexer/dto/indexerDto';
import type { ActiveMediaState } from './RightPlayerSidebar';
import { useIndexDocument } from '../modules/indexer/mutation/useIndexDocument';

interface LeftSidebarProps {
  sessionId: string;
  sources: SessionSourceItem[];
  selectedSourceUrls: string[];
  onToggleSourceSelect: (url: string) => void;
  onSelectAllSources: () => void;
  onClearSourceSelection: () => void;
  isLoadingSources: boolean;
  onNewSession: () => void;
  onIndexingSuccess: () => void;
  onSelectSourceMedia: (media: ActiveMediaState) => void;
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
}

export default function LeftSidebar({
  sessionId,
  sources,
  selectedSourceUrls,
  onToggleSourceSelect,
  onSelectAllSources,
  onClearSourceSelection,
  isLoadingSources,
  onIndexingSuccess,
  onSelectSourceMedia,
  showAddModal,
  setShowAddModal,
}: LeftSidebarProps) {
  const [indexType, setIndexType] = useState<SourceType>('pdf');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const { mutate: indexDocument, isPending: isIndexing, error: indexError } = useIndexDocument();

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
    <aside className="w-72 bg-chailm-panel border-r border-chailm-border flex flex-col h-full shrink-0">
      {/* Header */}
      <div className="p-3 border-b border-chailm-border flex items-center justify-between">
        <span className="text-xs font-semibold text-chailm-textMain">Indexed Session Sources</span>
        <span className="font-mono text-[10px] text-chailm-accentBlue bg-chailm-accentBlue/10 px-2 py-0.5 rounded-full border border-chailm-accentBlue/20">
          {sources.length} Total
        </span>
      </div>

      {/* Sources Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        <div className="flex justify-between items-center text-[10px] font-semibold text-chailm-textMuted uppercase tracking-wider">
          <span>Grounding Checkbox</span>
          {sources.length > 0 && (
            <button
              type="button"
              onClick={allSelected ? onClearSourceSelection : onSelectAllSources}
              className="text-[10px] text-chailm-accentBlue hover:underline capitalize normal-case font-mono font-normal cursor-pointer"
            >
              {allSelected ? 'Deselect All' : 'Select All'}
            </button>
          )}
        </div>

        {isLoadingSources ? (
          <p className="text-xs text-chailm-textMuted italic">Loading sources...</p>
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
                  className={`p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                    isSelected 
                      ? 'bg-chailm-card border-chailm-border' 
                      : 'bg-transparent border-transparent opacity-40 hover:opacity-70'
                  }`}
                >
                  <div className="flex items-start justify-between space-x-2">
                    <div className="flex items-center space-x-2 min-w-0">
                      {type === 'youtube' ? (
                        <Video className="w-4 h-4 text-rose-400 shrink-0" />
                      ) : (
                        <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                      )}
                      <span className="text-xs font-medium text-chailm-textMain truncate">{src.title}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        e.stopPropagation();
                        onToggleSourceSelect(src.sourceUrl);
                      }}
                      className="mt-0.5 rounded border-chailm-border bg-chailm-panel text-chailm-accentBlue focus:ring-0 h-4 w-4 cursor-pointer shrink-0"
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-chailm-textMuted font-mono">
                    <span className="truncate max-w-[150px]">{src.sourceUrl}</span>
                    <span className="uppercase">{src.sourceType}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 bg-chailm-card/40 rounded-2xl border border-dashed border-chailm-border text-center space-y-1.5">
            <p className="text-xs text-chailm-textMain font-medium">No sources added yet</p>
            <p className="text-[10px] text-chailm-textMuted font-sans">Add YouTube or PDF sources using top Add button.</p>
          </div>
        )}
      </div>

      {/* Modal for Add Source */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-chailm-panel border border-chailm-border rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-chailm-border pb-3">
              <h3 className="font-semibold text-chailm-textMain text-sm">Ingest Knowledge Source</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-chailm-textMuted hover:text-chailm-textMain cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleIndexSubmit} className="space-y-4">
              <div className="flex gap-2 bg-chailm-bg p-1 rounded-2xl border border-chailm-border text-xs">
                {(['pdf', 'youtube', 'website'] as SourceType[]).map((t) => {
                  let activeClass = '';
                  if (indexType === t) {
                    if (t === 'youtube') activeClass = 'bg-rose-500/10 border-rose-500/30 text-rose-300';
                    else if (t === 'pdf') activeClass = 'bg-amber-500/10 border-amber-500/30 text-amber-300';
                    else activeClass = 'bg-blue-500/10 border-blue-500/30 text-blue-300';
                  } else {
                    activeClass = 'bg-transparent border-transparent text-chailm-textMuted hover:text-chailm-textMain';
                  }

                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setIndexType(t)}
                      className={`flex-1 py-1.5 rounded-xl capitalize font-medium transition border cursor-pointer flex items-center justify-center gap-1 ${activeClass}`}
                    >
                      {t === 'youtube' && <Video className="w-3.5 h-3.5" />}
                      {t === 'pdf' && <FileText className="w-3.5 h-3.5" />}
                      {t === 'website' && <Globe className="w-3.5 h-3.5" />}
                      <span>{t}</span>
                    </button>
                  );
                })}
              </div>

              {indexType === 'pdf' ? (
                <div className="space-y-1 text-xs">
                  <label className="text-[11px] font-mono text-chailm-textMuted">PDF File</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="block w-full text-[11px] text-chailm-textMuted file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border file:border-chailm-border file:text-xs file:font-semibold file:bg-chailm-card file:text-chailm-textMain hover:file:bg-chailm-hover file:cursor-pointer"
                  />
                </div>
              ) : (
                <div className="space-y-1 text-xs">
                  <label className="text-[11px] font-mono text-chailm-textMuted">
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
                    className="w-full bg-chailm-bg border border-chailm-border rounded-xl px-3 py-2 text-[11px] text-chailm-textMain focus:outline-none focus:border-chailm-accentBlue font-mono"
                  />
                </div>
              )}

              {indexError && (
                <p className="text-xs text-red-400 bg-red-950/50 p-2 rounded border border-red-900 font-mono">
                  {indexError.message}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-chailm-textMuted hover:text-chailm-textMain cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isIndexing}
                  className="px-4 py-2 bg-chailm-card hover:bg-chailm-hover disabled:opacity-50 text-chailm-textMain font-medium rounded-full border border-chailm-border transition cursor-pointer"
                >
                  {isIndexing ? 'Indexing...' : 'Index'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </aside>
  );
}
