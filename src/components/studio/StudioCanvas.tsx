import React from 'react';
import {
  BookOpen,
  Layers,
  HelpCircle,
  Network,
  Mic,
  Sparkles,
  Trash2,
  ArrowLeft,
  Play,
  RotateCcw,
  Plus,
  FileText,
  Video,
  Globe,
} from 'lucide-react';
import type { StudioArtifact, StudioArtifactType } from '../../modules/studio/dto/studioDto';
import type { WorkspaceSourceItem } from '../../modules/workspace/dto/workspaceDto';
import StudyGuideView from './StudyGuideView';
import FlashcardsView from './FlashcardsView';
import QuizView from './QuizView';
import MindMapView from './MindMapView';
import AudioOverviewView from './AudioOverviewView';
import { useDeleteStudioArtifact } from '../../modules/studio/mutation';

interface StudioCanvasProps {
  workspaceId?: string;
  sources?: WorkspaceSourceItem[];
  artifacts: StudioArtifact[];
  isLoadingArtifacts: boolean;
  selectedFeature?: StudioArtifactType;
  activeArtifact: StudioArtifact | null;
  onSelectArtifact: (artifact: StudioArtifact | null) => void;
  onOpenCreateModal: (type: StudioArtifactType, sourceId?: string) => void;
}

export default function StudioCanvas({
  sources = [],
  artifacts = [],
  isLoadingArtifacts,
  selectedFeature = 'study_guide',
  activeArtifact,
  onSelectArtifact,
  onOpenCreateModal,
}: StudioCanvasProps) {
  const { mutate: deleteArtifact, isPending: isDeleting } = useDeleteStudioArtifact();

  const handleDelete = (artifactId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this artifact?')) return;
    deleteArtifact(artifactId, {
      onSuccess: () => {
        if (activeArtifact?.artifactId === artifactId || (activeArtifact as any)?._id === artifactId) {
          onSelectArtifact(null);
        }
      },
    });
  };

  const featureConfig: Record<
    StudioArtifactType,
    { label: string; pluralLabel: string; icon: any; desc: string; color: string }
  > = {
    study_guide: {
      label: 'Study Guide',
      pluralLabel: 'Study Guides',
      icon: BookOpen,
      desc: 'Executive summaries, thematic chapter modules, key takeaways, and domain glossaries.',
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    },
    flashcards: {
      label: 'Flashcard Deck',
      pluralLabel: 'Flashcard Decks',
      icon: Layers,
      desc: 'Active recall question-answer cards with hints, source citations, and difficulty tracking.',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    quiz: {
      label: 'Assessment Quiz',
      pluralLabel: 'Assessment Quizzes',
      icon: HelpCircle,
      desc: 'Interactive multiple choice tests with instant verification, scoring, and explanations.',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    mindmap: {
      label: 'Mind Map',
      pluralLabel: 'Mind Maps',
      icon: Network,
      desc: 'Hierarchical conceptual tree diagrams spanning all sections of your sources.',
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    },
    audio_overview: {
      label: 'Audio Overview',
      pluralLabel: 'Audio Overviews',
      icon: Mic,
      desc: 'Two-host conversational podcast dialogue scripts with simulated audio stream playback.',
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    },
  };

  const currentFeatureMeta = featureConfig[selectedFeature] || featureConfig.study_guide;
  const FeatureIcon = currentFeatureMeta.icon;

  // Filter artifacts for the currently selected feature from the left sidebar
  const featureArtifacts = artifacts.filter((a) => a.type === selectedFeature);

  // If an active artifact is selected, render the dedicated full viewer!
  if (activeArtifact) {
    const Icon = featureConfig[activeArtifact.type]?.icon || Sparkles;
    const typeLabel = featureConfig[activeArtifact.type]?.label || activeArtifact.type;
    const colorClass =
      featureConfig[activeArtifact.type]?.color ||
      'text-chailm-accentBlue bg-chailm-accentBlue/10 border-chailm-accentBlue/20';

    return (
      <main className="flex-1 flex flex-col h-full bg-chailm-bg overflow-hidden relative min-w-0">
        {/* Artifact Header Nav */}
        <div className="p-4 md:px-8 border-b border-chailm-border flex items-center justify-between bg-chailm-panel/60 shrink-0">
          <div className="flex items-center space-x-3 min-w-0">
            <button
              type="button"
              onClick={() => onSelectArtifact(null)}
              className="p-2 rounded-xl bg-chailm-card hover:bg-chailm-hover text-chailm-textMuted hover:text-chailm-textMain border border-chailm-border transition cursor-pointer shrink-0"
              title={`Back to ${currentFeatureMeta.pluralLabel}`}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center space-x-2">
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border flex items-center space-x-1 ${colorClass}`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{typeLabel}</span>
                </span>
                {activeArtifact.metadata?.sourceTitle && (
                  <span className="text-[11px] font-mono text-chailm-textMuted truncate hidden sm:inline">
                    • {activeArtifact.metadata.sourceTitle}
                  </span>
                )}
              </div>
              <h1 className="text-sm md:text-base font-semibold text-chailm-textMain truncate">
                {activeArtifact.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={() => onOpenCreateModal(activeArtifact.type, activeArtifact.sourceId)}
              className="px-3 py-1.5 rounded-xl bg-chailm-card hover:bg-chailm-hover border border-chailm-border text-xs text-chailm-textMain flex items-center space-x-1.5 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-chailm-accentBlue" />
              <span className="hidden sm:inline">Regenerate</span>
            </button>

            <button
              type="button"
              disabled={isDeleting}
              onClick={(e) => handleDelete(activeArtifact.artifactId || (activeArtifact as any)._id, e)}
              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 transition cursor-pointer disabled:opacity-50"
              title="Delete Artifact"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Artifact Content Canvas */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {activeArtifact.type === 'study_guide' && <StudyGuideView data={activeArtifact.data} />}
          {activeArtifact.type === 'flashcards' && <FlashcardsView data={activeArtifact.data} />}
          {activeArtifact.type === 'quiz' && <QuizView data={activeArtifact.data} />}
          {activeArtifact.type === 'mindmap' && <MindMapView data={activeArtifact.data} />}
          {activeArtifact.type === 'audio_overview' && <AudioOverviewView data={activeArtifact.data} />}
        </div>
      </main>
    );
  }

  // Feature Artifacts List / Empty State View
  return (
    <main className="flex-1 flex flex-col h-full bg-chailm-bg overflow-y-auto p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full">
      {/* 1. Header for Selected Feature */}
      <div className="bg-chailm-panel border border-chailm-border rounded-3xl p-6 relative overflow-hidden shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="brand-gradient-bar h-1 w-full absolute top-0 left-0"></div>

        <div className="flex items-center space-x-3.5 min-w-0">
          <div className={`p-3 rounded-2xl border ${currentFeatureMeta.color}`}>
            <FeatureIcon className="w-6 h-6" />
          </div>
          <div className="space-y-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h1 className="text-base md:text-lg font-semibold text-chailm-textMain">
                {currentFeatureMeta.pluralLabel}
              </h1>
              <span className="font-mono text-[10px] text-chailm-accentBlue bg-chailm-accentBlue/10 border border-chailm-accentBlue/20 px-2 py-0.5 rounded-full">
                {featureArtifacts.length} Generated
              </span>
            </div>
            <p className="text-xs text-chailm-textMuted leading-relaxed line-clamp-2">
              {currentFeatureMeta.desc}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpenCreateModal(selectedFeature)}
          className="px-4 py-2.5 rounded-full bg-chailm-accentBlue/10 hover:bg-chailm-accentBlue/20 text-chailm-accentBlue border border-chailm-accentBlue/30 text-xs font-semibold transition flex items-center justify-center space-x-1.5 cursor-pointer shrink-0 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Generate {currentFeatureMeta.label}</span>
        </button>
      </div>

      {/* 2. Generated Artifacts for this Feature */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-chailm-textMuted uppercase tracking-wider">
          <span>Generated {currentFeatureMeta.pluralLabel}</span>
          {isLoadingArtifacts && (
            <span className="text-[10px] text-chailm-accentBlue animate-pulse">Syncing...</span>
          )}
        </div>

        {featureArtifacts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featureArtifacts.map((art) => {
              const matchingSource = sources.find((s) => s.sourceId === art.sourceId);
              const sourceType = (art.metadata?.sourceType || matchingSource?.sourceType || 'document').toLowerCase();

              return (
                <div
                  key={art.artifactId || (art as any)._id}
                  onClick={() => onSelectArtifact(art)}
                  className="p-5 rounded-3xl bg-chailm-panel border border-chailm-border hover:border-chailm-accentBlue/50 hover:bg-chailm-card transition-all cursor-pointer flex flex-col justify-between space-y-4 group shadow-sm hover:shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2 text-[10px] font-mono text-chailm-textMuted">
                        {sourceType === 'youtube' ? (
                          <span className="flex items-center gap-1 text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                            <Video className="w-3 h-3" /> YouTube
                          </span>
                        ) : sourceType === 'pdf' ? (
                          <span className="flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                            <FileText className="w-3 h-3" /> PDF
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                            <Globe className="w-3 h-3" /> Web
                          </span>
                        )}
                        <span>{new Date(art.createdAt).toLocaleDateString()}</span>
                      </div>

                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={(e) => handleDelete(art.artifactId || (art as any)._id, e)}
                        className="p-1.5 text-chailm-textMuted hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Delete Artifact"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-chailm-textMain group-hover:text-chailm-accentBlue transition">
                        {art.title}
                      </h3>
                      {art.metadata?.sourceTitle && (
                        <p className="text-[11px] text-chailm-textMuted font-mono truncate">
                          Source: {art.metadata.sourceTitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-chailm-border/60 flex items-center justify-between">
                    <div>
                      {art.type === 'quiz' && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[11px] font-semibold flex items-center gap-1.5">
                          <HelpCircle className="w-3 h-3" />
                          <span>{(art.data as any)?.questions?.length || art.metadata?.questionCount || 10} Questions</span>
                        </span>
                      )}
                      {art.type === 'flashcards' && (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-[11px] font-semibold flex items-center gap-1.5">
                          <Layers className="w-3 h-3" />
                          <span>{(art.data as any)?.cards?.length || art.metadata?.totalCards || 0} Cards</span>
                        </span>
                      )}
                      {art.type === 'study_guide' && (
                        <span className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[11px] font-semibold flex items-center gap-1.5">
                          <BookOpen className="w-3 h-3" />
                          <span>{(art.data as any)?.keyThemes?.length || 0} Modules</span>
                        </span>
                      )}
                      {art.type === 'mindmap' && (
                        <span className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono text-[11px] font-semibold flex items-center gap-1.5">
                          <Network className="w-3 h-3" />
                          <span>{(art.data as any)?.rootNode?.branches?.length || 0} Branches</span>
                        </span>
                      )}
                      {art.type === 'audio_overview' && (
                        <span className="px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono text-[11px] font-semibold flex items-center gap-1.5">
                          <Mic className="w-3 h-3" />
                          <span>~{(art.data as any)?.durationMinutesEstimate || 6} Mins Length</span>
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectArtifact(art);
                      }}
                      className="py-1.5 px-3 rounded-xl bg-chailm-accentBlue/10 hover:bg-chailm-accentBlue/20 text-chailm-accentBlue border border-chailm-accentBlue/30 text-xs font-medium transition flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current ml-0.5" />
                      <span>Open</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State: Prompt user to generate artifact for this feature */
          <div className="p-10 rounded-3xl bg-chailm-panel/50 border border-dashed border-chailm-border text-center space-y-4 my-6">
            <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mx-auto ${currentFeatureMeta.color}`}>
              <FeatureIcon className="w-6 h-6" />
            </div>

            <div className="space-y-1.5 max-w-sm mx-auto">
              <h3 className="text-sm font-semibold text-chailm-textMain">
                No {currentFeatureMeta.pluralLabel} Generated Yet
              </h3>
              <p className="text-xs text-chailm-textMuted leading-relaxed">
                You haven't generated any {currentFeatureMeta.label.toLowerCase()} in this workspace. Click below to synthesize one from your indexed sources.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onOpenCreateModal(selectedFeature)}
              className="px-5 py-2.5 rounded-full bg-chailm-accentBlue/10 hover:bg-chailm-accentBlue/20 text-chailm-accentBlue border border-chailm-accentBlue/30 text-xs font-semibold transition inline-flex items-center space-x-2 cursor-pointer shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate {currentFeatureMeta.label}</span>
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
