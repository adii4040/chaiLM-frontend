import { X, ExternalLink, Video, FileText, Globe, Sparkles, Layers, BookOpen, HelpCircle, Network, Mic } from 'lucide-react';
import type { StudioArtifact, StudioArtifactType } from '../modules/studio/dto/studioDto';
import StudyGuideView from './studio/StudyGuideView';
import FlashcardsView from './studio/FlashcardsView';
import QuizView from './studio/QuizView';
import MindMapView from './studio/MindMapView';
import AudioOverviewView from './studio/AudioOverviewView';

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
  activeArtifact?: StudioArtifact | null;
  activeTab?: 'preview' | 'studio';
  onTabChange?: (tab: 'preview' | 'studio') => void;
  onClose: () => void;
}

export default function RightPlayerSidebar({
  media,
  activeArtifact = null,
  activeTab = 'preview',
  onTabChange,
  onClose,
}: RightPlayerSidebarProps) {
  const currentTab = activeTab;

  const isYoutube = media ? media.sourceType.toLowerCase() === 'youtube' || Boolean(media.videoId) : false;
  const isPdf = media ? media.sourceType.toLowerCase() === 'pdf' : false;
  const isWeb = media ? media.sourceType.toLowerCase() === 'website' : false;

  const startSecs = media?.startSeconds || 0;
  const pdfUrl = media?.cloudinaryUrl || (media?.sourceUrl?.startsWith('http') ? media.sourceUrl : null);
  const pageNum = media?.pageNumber || 1;

  const artifactIcons: Record<StudioArtifactType, any> = {
    study_guide: BookOpen,
    flashcards: Layers,
    quiz: HelpCircle,
    mindmap: Network,
    audio_overview: Mic,
  };

  return (
    <aside className="w-96 md:w-[420px] bg-chailm-panel border-l border-chailm-border flex flex-col h-full shrink-0 shadow-2xl z-40 transition-all duration-300 animate-in slide-in-from-right duration-200">
      {/* Header Bar with Mode Switcher */}
      <div className="p-3 border-b border-chailm-border flex items-center justify-between gap-2 bg-chailm-panel/80">
        {/* Segmented Switcher: Source Preview vs Studio Canvas */}
        <div className="flex bg-chailm-bg p-1 rounded-2xl border border-chailm-border text-[11px] font-medium font-sans">
          <button
            type="button"
            onClick={() => onTabChange && onTabChange('preview')}
            className={`px-3 py-1 rounded-xl transition cursor-pointer flex items-center space-x-1.5 ${
              currentTab === 'preview'
                ? 'bg-chailm-card text-chailm-accentBlue font-semibold shadow-xs border border-chailm-border/60'
                : 'text-chailm-textMuted hover:text-chailm-textMain'
            }`}
          >
            <Video className="w-3 h-3 text-rose-400" />
            <span>Source Preview</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange && onTabChange('studio')}
            className={`px-3 py-1 rounded-xl transition cursor-pointer flex items-center space-x-1.5 ${
              currentTab === 'studio'
                ? 'bg-chailm-card text-chailm-accentBlue font-semibold shadow-xs border border-chailm-border/60'
                : 'text-chailm-textMuted hover:text-chailm-textMain'
            }`}
          >
            <Sparkles className="w-3 h-3 text-chailm-accentBlue" />
            <span>Studio Canvas</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-chailm-textMuted hover:text-chailm-textMain hover:bg-chailm-hover rounded-full transition cursor-pointer shrink-0"
          title="Close Sidebar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col min-h-0">
        {currentTab === 'preview' ? (
          media ? (
            /* Source Preview Mode */
            <>
              {/* Media Title Bar */}
              <div className="flex items-center gap-2 pb-2 border-b border-chailm-border/60 truncate">
                {isYoutube && <Video className="w-4 h-4 text-rose-400 shrink-0" />}
                {isPdf && <FileText className="w-4 h-4 text-amber-400 shrink-0" />}
                {isWeb && <Globe className="w-4 h-4 text-blue-400 shrink-0" />}
                <h2 className="text-xs font-semibold text-chailm-textMain truncate">{media.title}</h2>
              </div>

              {/* YouTube Video Player Embed */}
              {isYoutube && media.videoId ? (
                <div className="space-y-4">
                  <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-chailm-border shadow-xl">
                    <iframe
                      key={`${media.videoId}-${startSecs}`}
                      src={`https://www.youtube-nocookie.com/embed/${media.videoId}?start=${startSecs}&autoplay=1`}
                      title={media.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  </div>

                  <div className="p-4 bg-chailm-card border border-chailm-border rounded-2xl space-y-2 text-xs">
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-chailm-textMuted">CITED_OFFSET</span>
                      <span className="text-rose-400 font-bold bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                        {media.formattedTimestamp ? `${media.formattedTimestamp} (${startSecs}s)` : `${startSecs}s`}
                      </span>
                    </div>
                    <a
                      href={`${media.sourceUrl}&t=${startSecs}s`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1.5 text-xs text-chailm-accentBlue hover:underline pt-2 font-medium"
                    >
                      <span>Open on YouTube at exact offset</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ) : isPdf ? (
                <div className="flex-1 flex flex-col space-y-4 min-h-0">
                  <div className="bg-chailm-card border border-chailm-border rounded-2xl p-4 flex justify-between items-center text-xs shrink-0">
                    <span className="text-chailm-textMain font-medium">PDF Document</span>
                    <div className="flex items-center gap-2">
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
                          Open External <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  {pdfUrl ? (
                    <div className="flex-1 min-h-[400px] bg-chailm-bg rounded-2xl overflow-hidden border border-chailm-border shadow-xl">
                      <iframe
                        key={`${pdfUrl}-${pageNum}`}
                        src={`${pdfUrl}#page=${pageNum}`}
                        title={media.title}
                        className="w-full h-full border-0"
                      />
                    </div>
                  ) : (
                    <div className="p-4 bg-chailm-card rounded-2xl border border-chailm-border text-xs text-chailm-textMuted italic text-center">
                      No external URL available for this PDF document.
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-chailm-card p-4 rounded-2xl border border-chailm-border text-xs space-y-2">
                  <p className="text-chailm-textMain">{media.title}</p>
                  {media.sourceUrl && (
                    <a
                      href={media.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-chailm-accentBlue hover:underline flex items-center gap-1 mt-2 text-[11px] font-medium"
                    >
                      Open Link <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center bg-chailm-card/40 rounded-3xl border border-dashed border-chailm-border my-auto space-y-2">
              <Video className="w-6 h-6 text-chailm-textMuted mx-auto" />
              <p className="text-xs text-chailm-textMain font-medium">No source media selected</p>
              <p className="text-[11px] text-chailm-textMuted leading-relaxed">
                Click on any citation chip or source from the left sidebar to preview video or PDF pages here.
              </p>
            </div>
          )
        ) : (
          /* Studio Canvas Inspector Mode */
          activeArtifact ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-chailm-border/60 truncate">
                {(() => {
                  const Icon = artifactIcons[activeArtifact.type] || Sparkles;
                  return <Icon className="w-4 h-4 text-chailm-accentBlue shrink-0" />;
                })()}
                <h3 className="text-xs font-semibold text-chailm-textMain truncate">
                  {activeArtifact.title}
                </h3>
              </div>

              {activeArtifact.type === 'study_guide' && (
                <StudyGuideView data={activeArtifact.data} />
              )}
              {activeArtifact.type === 'flashcards' && (
                <FlashcardsView data={activeArtifact.data} />
              )}
              {activeArtifact.type === 'quiz' && (
                <QuizView data={activeArtifact.data} />
              )}
              {activeArtifact.type === 'mindmap' && (
                <MindMapView data={activeArtifact.data} />
              )}
              {activeArtifact.type === 'audio_overview' && (
                <AudioOverviewView data={activeArtifact.data} />
              )}
            </div>
          ) : (
            <div className="p-8 text-center bg-chailm-card/40 rounded-3xl border border-dashed border-chailm-border my-auto space-y-2">
              <Sparkles className="w-6 h-6 text-chailm-accentBlue mx-auto" />
              <p className="text-xs text-chailm-textMain font-medium">No Studio Artifact Selected</p>
              <p className="text-[11px] text-chailm-textMuted leading-relaxed">
                Choose or generate a Study Guide, Flashcard Deck, Quiz, Mind Map, or Podcast to inspect it here.
              </p>
            </div>
          )
        )}
      </div>
    </aside>
  );
}
