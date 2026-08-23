import { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  Video,
  FileText,
  Globe,
  ChevronDown,
  ChevronUp,
  Layers,
} from 'lucide-react';
import type { WorkspaceSourceItem } from '../modules/workspace/dto/workspaceDto';

export interface ActiveMediaState {
  sourceType: string;
  sourceUrl: string;
  title: string;
  videoId?: string | null;
  startSeconds?: number | null;
  formattedTimestamp?: string | null;
  pageNumber?: number | null;
  cloudinaryUrl?: string | null;
}

interface RightPlayerSidebarProps {
  media: ActiveMediaState | null;
  sources?: WorkspaceSourceItem[];
  selectedSourceIds?: string[];
  onClose: () => void;
}

function getYoutubeVideoId(url?: string, videoId?: string | null): string | null {
  if (videoId) return videoId;
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export default function RightPlayerSidebar({
  media,
  sources = [],
  selectedSourceIds = [],
  onClose,
}: RightPlayerSidebarProps) {
  // Determine all candidate sources to show in accordion
  // 1. If selectedSourceIds has items, use those sources
  // 2. Otherwise if sources array exists, use all sources
  // 3. Fallback to single media item if provided
  const candidateSources: {
    sourceId: string;
    sourceType: string;
    sourceUrl: string;
    title: string;
    videoId?: string | null;
    cloudinaryUrl?: string | null;
    pageNumber?: number | null;
    startSeconds?: number | null;
    formattedTimestamp?: string | null;
  }[] = (() => {
    if (selectedSourceIds.length > 0 && sources.length > 0) {
      return sources.filter((s) => selectedSourceIds.includes(s.sourceId));
    }
    if (sources.length > 0) {
      return sources;
    }
    if (media) {
      return [
        {
          sourceId: media.sourceUrl || 'media-active',
          sourceType: media.sourceType,
          sourceUrl: media.sourceUrl,
          title: media.title,
          videoId: media.videoId,
          cloudinaryUrl: media.cloudinaryUrl,
          pageNumber: media.pageNumber,
          startSeconds: media.startSeconds,
          formattedTimestamp: media.formattedTimestamp,
        },
      ];
    }
    return [];
  })();

  // Track expanded accordion items by sourceId
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  // Automatically expand the matching media source when media changes
  useEffect(() => {
    if (media && candidateSources.length > 0) {
      const match = candidateSources.find(
        (s) =>
          s.sourceUrl === media.sourceUrl ||
          s.title === media.title ||
          (s.videoId && media.videoId && s.videoId === media.videoId)
      );
      if (match) {
        setExpandedIds((prev) => (prev.includes(match.sourceId) ? prev : [...prev, match.sourceId]));
      } else if (candidateSources[0]) {
        setExpandedIds([candidateSources[0].sourceId]);
      }
    } else if (candidateSources.length > 0 && expandedIds.length === 0) {
      // Default expand the first item
      setExpandedIds([candidateSources[0].sourceId]);
    }
  }, [media, candidateSources.length]);

  const toggleAccordion = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const expandAll = () => {
    setExpandedIds(candidateSources.map((s) => s.sourceId));
  };

  const collapseAll = () => {
    setExpandedIds([]);
  };

  return (
    <aside className="w-96 md:w-[460px] bg-chailm-panel border-l border-chailm-border flex flex-col h-full shrink-0 shadow-2xl z-40 transition-all duration-300 animate-in slide-in-from-right duration-200">
      {/* Header Bar */}
      <div className="p-3.5 border-b border-chailm-border flex items-center justify-between gap-2 bg-chailm-panel/90 shrink-0">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <Layers className="w-4 h-4" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-chailm-textMain">Source Previews</span>
            <span className="font-mono text-[10px] text-chailm-accentBlue bg-chailm-accentBlue/10 border border-chailm-accentBlue/20 px-2 py-0.5 rounded-full">
              {candidateSources.length} {candidateSources.length === 1 ? 'Source' : 'Sources'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          {candidateSources.length > 1 && (
            <button
              type="button"
              onClick={expandedIds.length === candidateSources.length ? collapseAll : expandAll}
              className="text-[10px] font-mono text-chailm-textMuted hover:text-chailm-textMain px-2 py-1 rounded-lg bg-chailm-card border border-chailm-border transition cursor-pointer"
            >
              {expandedIds.length === candidateSources.length ? 'Collapse All' : 'Expand All'}
            </button>
          )}

          <button
            onClick={onClose}
            className="p-1.5 text-chailm-textMuted hover:text-chailm-textMain hover:bg-chailm-hover rounded-full transition cursor-pointer shrink-0"
            title="Close Previews"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Accordion List Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 min-h-0">
        {candidateSources.length > 0 ? (
          candidateSources.map((source) => {
            const isExpanded = expandedIds.includes(source.sourceId);
            const sourceType = (source.sourceType || 'website').toLowerCase();
            const isYoutube = sourceType === 'youtube';
            const isPdf = sourceType === 'pdf';
            const isWeb = sourceType === 'website';

            const videoId = isYoutube
              ? getYoutubeVideoId(source.sourceUrl, source.videoId)
              : null;

            // Check if active media citation matches this source
            const isMatchingMedia =
              media &&
              (media.sourceUrl === source.sourceUrl ||
                media.title === source.title ||
                (media.videoId && videoId && media.videoId === videoId));

            const startSecs = isMatchingMedia ? media?.startSeconds || 0 : source.startSeconds || 0;
            const formattedTime = isMatchingMedia
              ? media?.formattedTimestamp || null
              : source.formattedTimestamp || null;
            const pageNum = isMatchingMedia ? media?.pageNumber || 1 : source.pageNumber || 1;

            const pdfUrl =
              source.cloudinaryUrl ||
              (source.sourceUrl?.startsWith('http') ? source.sourceUrl : null);

            return (
              <div
                key={source.sourceId}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isExpanded
                    ? 'bg-chailm-card/90 border-chailm-accentBlue/40 shadow-sm'
                    : 'bg-chailm-card/40 border-chailm-border hover:border-chailm-border/80'
                }`}
              >
                {/* Accordion Item Header */}
                <button
                  type="button"
                  onClick={() => toggleAccordion(source.sourceId)}
                  className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer transition select-none group"
                >
                  <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                    {isYoutube && <Video className="w-4 h-4 text-rose-400 shrink-0" />}
                    {isPdf && <FileText className="w-4 h-4 text-amber-400 shrink-0" />}
                    {isWeb && <Globe className="w-4 h-4 text-blue-400 shrink-0" />}

                    <div className="min-w-0">
                      <h3 className="text-xs font-semibold text-chailm-textMain truncate group-hover:text-chailm-accentBlue transition">
                        {source.title}
                      </h3>
                      <span className="text-[10px] font-mono text-chailm-textMuted uppercase">
                        {source.sourceType}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {isMatchingMedia && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        Cited
                      </span>
                    )}

                    <div className="p-1 rounded-lg bg-chailm-bg border border-chailm-border text-chailm-textMuted group-hover:text-chailm-textMain transition">
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Accordion Item Expanded Body */}
                {isExpanded && (
                  <div className="p-4 pt-0 border-t border-chailm-border/60 space-y-3.5 animate-in fade-in duration-200">
                    {/* YouTube Video Player Embed */}
                    {isYoutube && videoId ? (
                      <div className="space-y-3 pt-3">
                        <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-chailm-border shadow-xl">
                          <iframe
                            key={`${videoId}-${startSecs}`}
                            src={`https://www.youtube-nocookie.com/embed/${videoId}?start=${startSecs}&autoplay=0`}
                            title={source.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full border-0"
                          />
                        </div>

                        <div className="p-3 bg-chailm-bg border border-chailm-border rounded-xl flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2 font-mono text-[11px]">
                            <span className="text-chailm-textMuted">Timestamp:</span>
                            <span className="text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                              {formattedTime ? `${formattedTime} (${startSecs}s)` : `${startSecs}s`}
                            </span>
                          </div>

                          <a
                            href={`${source.sourceUrl}&t=${startSecs}s`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-chailm-accentBlue hover:underline inline-flex items-center space-x-1 font-medium"
                          >
                            <span>Open on YouTube</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ) : isPdf ? (
                      /* PDF Document Embed */
                      <div className="space-y-3 pt-3 flex flex-col">
                        <div className="bg-chailm-bg border border-chailm-border rounded-xl p-3 flex justify-between items-center text-xs">
                          <span className="font-mono text-amber-300 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                            Page {pageNum}
                          </span>

                          {pdfUrl && (
                            <a
                              href={pdfUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-chailm-accentBlue hover:underline flex items-center gap-1 text-[11px] font-medium"
                            >
                              <span>Open External PDF</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>

                        {pdfUrl ? (
                          <div className="h-[420px] bg-chailm-bg rounded-2xl overflow-hidden border border-chailm-border shadow-xl">
                            <iframe
                              key={`${pdfUrl}-${pageNum}`}
                              src={`${pdfUrl}#page=${pageNum}`}
                              title={source.title}
                              className="w-full h-full border-0"
                            />
                          </div>
                        ) : (
                          <div className="p-4 bg-chailm-bg rounded-xl border border-chailm-border text-xs text-chailm-textMuted italic text-center">
                            No external URL available for this PDF.
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Website Source Link */
                      <div className="bg-chailm-bg p-3.5 rounded-xl border border-chailm-border text-xs space-y-2 pt-3">
                        <p className="text-chailm-textMain font-medium">{source.title}</p>
                        {source.sourceUrl && (
                          <a
                            href={source.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-chailm-accentBlue hover:underline flex items-center gap-1 text-[11px] font-medium"
                          >
                            <span>Open Web Link</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center bg-chailm-card/40 rounded-3xl border border-dashed border-chailm-border my-auto space-y-2">
            <Layers className="w-6 h-6 text-chailm-textMuted mx-auto" />
            <p className="text-xs text-chailm-textMain font-medium">No sources to preview</p>
            <p className="text-[11px] text-chailm-textMuted leading-relaxed">
              Add or select knowledge sources in this workspace to preview them here.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
