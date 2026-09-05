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
import { colors, mono } from './landing/tokens';

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
    <aside
      className="w-96 md:w-[460px] bg-white flex flex-col h-full shrink-0 shadow-2xl z-40 transition-all duration-300 animate-in slide-in-from-right duration-200"
      style={{ borderLeft: `1px solid ${colors.hairline}` }}
    >
      {/* Header Bar */}
      <div className="p-3.5 border-b flex items-center justify-between gap-2 shrink-0 bg-white" style={{ borderColor: colors.hairline }}>
        <div className="flex items-center space-x-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: colors.verifiedSoft, color: colors.verified }}
          >
            <Layers className="w-4 h-4" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-[#14171A]" style={mono}>
              SOURCE PREVIEWS
            </span>
            <span
              className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{
                ...mono,
                background: colors.verifiedSoft,
                color: colors.verified,
                border: `1px solid ${colors.verifiedBorder}`,
              }}
            >
              {candidateSources.length} {candidateSources.length === 1 ? 'Source' : 'Sources'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          {candidateSources.length > 1 && (
            <button
              type="button"
              onClick={expandedIds.length === candidateSources.length ? collapseAll : expandAll}
              className="text-[10px] font-mono font-semibold text-[#5C6169] hover:text-[#14171A] px-2.5 py-1 rounded-lg bg-[#F5F6F4] border border-[#CBCFC9] transition cursor-pointer"
            >
              {expandedIds.length === candidateSources.length ? 'Collapse All' : 'Expand All'}
            </button>
          )}

          <button
            onClick={onClose}
            className="p-1.5 text-[#93968F] hover:text-[#14171A] hover:bg-gray-100 rounded-full transition cursor-pointer shrink-0"
            title="Close Previews"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Accordion List Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 min-h-0" style={{ background: colors.paper }}>
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
                className={`rounded-2xl border transition-all overflow-hidden bg-white shadow-xs ${
                  isExpanded ? 'border-[#CBCFC9]' : 'border-[#E2E4E1] hover:border-[#CBCFC9]'
                }`}
              >
                {/* Accordion Item Header */}
                <button
                  type="button"
                  onClick={() => toggleAccordion(source.sourceId)}
                  className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer transition select-none group"
                >
                  <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                    {isYoutube && (
                      <div className="w-6 h-6 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                        <Video className="w-3.5 h-3.5" />
                      </div>
                    )}
                    {isPdf && (
                      <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                    )}
                    {isWeb && (
                      <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <Globe className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <h3 className="text-xs font-semibold text-[#14171A] truncate group-hover:text-[#1F7A5C] transition">
                        {source.title}
                      </h3>
                      <span className="text-[10px] font-mono text-[#5C6169] uppercase font-bold" style={mono}>
                        {source.sourceType}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {isMatchingMedia && (
                      <span
                        className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold"
                        style={{
                          ...mono,
                          background: colors.verifiedSoft,
                          color: colors.verified,
                          border: `1px solid ${colors.verifiedBorder}`,
                        }}
                      >
                        Active Citation
                      </span>
                    )}

                    <div className="p-1 rounded-lg bg-[#F5F6F4] text-[#5C6169] group-hover:text-[#14171A] transition">
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
                  <div className="p-4 pt-0 border-t space-y-3.5 animate-in fade-in duration-200" style={{ borderColor: colors.hairline }}>
                    {/* YouTube Video Player Embed */}
                    {isYoutube && videoId ? (
                      <div className="space-y-3 pt-3">
                        <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-[#CBCFC9] shadow-md">
                          <iframe
                            key={`${videoId}-${startSecs}`}
                            src={`https://www.youtube.com/embed/${videoId}?start=${startSecs}&autoplay=${isMatchingMedia ? 1 : 0}&enablejsapi=1`}
                            title={source.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="w-full h-full border-0"
                          />
                        </div>

                        <div className="p-3 bg-[#F5F6F4] border border-[#E2E4E1] rounded-xl flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2 font-mono text-[11px]" style={mono}>
                            <span className="text-[#5C6169]">Timestamp:</span>
                            <span
                              className="font-bold px-2 py-0.5 rounded-full"
                              style={{
                                background: colors.verifiedSoft,
                                color: colors.verified,
                                border: `1px solid ${colors.verifiedBorder}`,
                              }}
                            >
                              {formattedTime ? `${formattedTime} (${startSecs}s)` : `${startSecs}s`}
                            </span>
                          </div>

                          <a
                            href={`https://www.youtube.com/watch?v=${videoId}&t=${startSecs}s`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-[#1F7A5C] hover:underline inline-flex items-center space-x-1 font-semibold"
                          >
                            <span>Open YouTube</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ) : isPdf ? (
                      /* PDF Document Embed */
                      <div className="space-y-3 pt-3 flex flex-col">
                        <div className="bg-[#F5F6F4] border border-[#E2E4E1] rounded-xl p-3 flex justify-between items-center text-xs">
                          <span
                            className="font-mono font-bold px-2.5 py-0.5 rounded-full"
                            style={{
                              ...mono,
                              background: '#FEF3C7',
                              color: '#B45309',
                              border: '1px solid #FDE68A',
                            }}
                          >
                            Page {pageNum}
                          </span>

                          {pdfUrl && (
                            <a
                              href={pdfUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#1F7A5C] hover:underline flex items-center gap-1 text-[11px] font-semibold"
                            >
                              <span>Open PDF</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>

                        {pdfUrl ? (
                          <div className="h-[420px] bg-white rounded-xl overflow-hidden border border-[#CBCFC9] shadow-md">
                            <iframe
                              key={`${pdfUrl}-${pageNum}`}
                              src={`${pdfUrl}#page=${pageNum}`}
                              title={source.title}
                              className="w-full h-full border-0"
                            />
                          </div>
                        ) : (
                          <div className="p-4 bg-[#F5F6F4] rounded-xl border border-[#E2E4E1] text-xs text-[#5C6169] italic text-center">
                            No external URL available for this PDF.
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Website Source Link */
                      <div className="bg-[#F5F6F4] p-3.5 rounded-xl border border-[#E2E4E1] text-xs space-y-2 pt-3">
                        <p className="text-[#14171A] font-semibold">{source.title}</p>
                        {source.sourceUrl && (
                          <a
                            href={source.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#1F7A5C] hover:underline flex items-center gap-1 text-[11px] font-semibold"
                          >
                            <span>Open Web Source</span>
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
          <div
            className="p-8 text-center bg-white rounded-3xl space-y-2 shadow-xs my-auto"
            style={{ border: `1px dashed ${colors.hairlineStrong}` }}
          >
            <Layers className="w-6 h-6 text-[#93968F] mx-auto" />
            <p className="text-xs text-[#14171A] font-semibold">No sources to preview</p>
            <p className="text-[11px] text-[#5C6169] leading-relaxed">
              Add or select knowledge sources in this workspace to preview them here.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
