import { X, ExternalLink, Play, FileText, Globe } from 'lucide-react';

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
  media: ActiveMediaState;
  onClose: () => void;
}

export default function RightPlayerSidebar({ media, onClose }: RightPlayerSidebarProps) {
  const isYoutube = media.sourceType.toLowerCase() === 'youtube' || Boolean(media.videoId);
  const isPdf = media.sourceType.toLowerCase() === 'pdf';
  const isWeb = media.sourceType.toLowerCase() === 'website';

  const startSecs = media.startSeconds || 0;
  const pdfUrl = media.cloudinaryUrl || (media.sourceUrl?.startsWith('http') ? media.sourceUrl : null);
  const pageNum = media.pageNumber || 1;

  return (
    <aside className="w-[500px] bg-slate-950 border-l border-slate-800 flex flex-col h-full shrink-0 shadow-2xl z-40 transition-all duration-300">
      {/* Header Bar */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 truncate pr-2">
          {isYoutube && <Play className="w-4 h-4 text-red-400 shrink-0" />}
          {isPdf && <FileText className="w-4 h-4 text-amber-400 shrink-0" />}
          {isWeb && <Globe className="w-4 h-4 text-blue-400 shrink-0" />}
          <h2 className="text-sm font-semibold text-white truncate">{media.title}</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white hover:bg-slate-900 rounded transition"
          title="Close Player"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Player Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
        {/* YouTube Video Player Embed */}
        {isYoutube && media.videoId ? (
          <div className="space-y-3">
            <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-slate-800 shadow-xl">
              <iframe
                key={`${media.videoId}-${startSecs}`}
                src={`https://www.youtube.com/embed/${media.videoId}?start=${startSecs}&autoplay=1`}
                title={media.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between items-center text-slate-400">
                <span>Active Timestamp:</span>
                <span className="font-mono text-emerald-400 font-bold bg-slate-950 px-2 py-0.5 rounded">
                  {media.formattedTimestamp ? `[${media.formattedTimestamp}]` : `${startSecs}s`}
                </span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Playback started at the exact cited timestamp referenced in your workspace takeaways.
              </p>
            </div>
          </div>
        ) : isPdf ? (
          <div className="flex-1 flex flex-col space-y-3 min-h-0">
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 flex justify-between items-center text-xs shrink-0">
              <span className="text-slate-300 font-medium">PDF Document</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-amber-400 font-bold bg-slate-950 px-2 py-0.5 rounded">
                  Page {pageNum}
                </span>
                {pdfUrl && (
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] transition"
                  >
                    Open External <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            {pdfUrl ? (
              <div className="flex-1 min-h-[500px] bg-slate-900 rounded-lg overflow-hidden border border-slate-800 shadow-xl">
                <iframe
                  key={`${pdfUrl}-${pageNum}`}
                  src={`${pdfUrl}#page=${pageNum}`}
                  title={media.title}
                  className="w-full h-full border-0"
                />
              </div>
            ) : (
              <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-400 italic">
                No external URL available for this PDF document.
              </div>
            )}
          </div>
        ) : (
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 text-xs space-y-2">
            <p className="text-slate-300">{media.title}</p>
            {media.sourceUrl && (
              <a
                href={media.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:underline flex items-center gap-1 mt-2 text-[11px]"
              >
                Open Link <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
