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
  RotateCcw,
  Plus,
  FileText,
  Video,
  Globe,
  ArrowRight,
} from 'lucide-react';
import type { StudioArtifact, StudioArtifactType } from '../../modules/studio/dto/studioDto';
import type { WorkspaceSourceItem } from '../../modules/workspace/dto/workspaceDto';
import StudyGuideView from './StudyGuideView';
import FlashcardsView from './FlashcardsView';
import QuizView from './QuizView';
import MindMapView from './MindMapView';
import AudioOverviewView from './AudioOverviewView';
import { useDeleteStudioArtifact } from '../../modules/studio/mutation';
import { colors, mono, spotlightMove } from '../landing/tokens';

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
    {
      label: string;
      pluralLabel: string;
      icon: any;
      desc: string;
      headerBg: string;
      iconColor: string;
      tagBg: string;
      accentBorder: string;
    }
  > = {
    study_guide: {
      label: 'Study Guide',
      pluralLabel: 'Study Guides',
      icon: BookOpen,
      desc: 'Executive summaries, thematic chapter modules, key takeaways, and domain glossaries.',
      headerBg: 'bg-blue-600',
      iconColor: 'bg-blue-600 text-white shadow-xs',
      tagBg: 'bg-blue-50 text-blue-700 border-blue-200',
      accentBorder: '#2563EB',
    },
    flashcards: {
      label: 'Flashcard Deck',
      pluralLabel: 'Flashcard Decks',
      icon: Layers,
      desc: 'Active recall question-answer cards with hints, source citations, and difficulty tracking.',
      headerBg: 'bg-amber-600',
      iconColor: 'bg-amber-600 text-white shadow-xs',
      tagBg: 'bg-amber-50 text-amber-800 border-amber-200',
      accentBorder: '#D97706',
    },
    quiz: {
      label: 'Assessment Quiz',
      pluralLabel: 'Assessment Quizzes',
      icon: HelpCircle,
      desc: 'Interactive multiple-choice exams with detailed rationale explanations and scoring.',
      headerBg: 'bg-[#1F7A5C]',
      iconColor: 'bg-[#1F7A5C] text-white shadow-xs',
      tagBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      accentBorder: '#1F7A5C',
    },
    mindmap: {
      label: 'Mind Map',
      pluralLabel: 'Mind Maps',
      icon: Network,
      desc: 'Hierarchical node hierarchies and semantic relationship trees connecting source concepts.',
      headerBg: 'bg-purple-600',
      iconColor: 'bg-purple-600 text-white shadow-xs',
      tagBg: 'bg-purple-50 text-purple-700 border-purple-200',
      accentBorder: '#9333EA',
    },
    audio_overview: {
      label: 'Audio Overview',
      pluralLabel: 'Audio Overviews',
      icon: Mic,
      desc: 'Two-host conversational podcast style synthesis and narrative discussion.',
      headerBg: 'bg-rose-600',
      iconColor: 'bg-rose-600 text-white shadow-xs',
      tagBg: 'bg-rose-50 text-rose-700 border-rose-200',
      accentBorder: '#E11D48',
    },
  };

  const currentFeatureMeta = featureConfig[selectedFeature];
  const FeatureIcon = currentFeatureMeta.icon;

  // Filter artifacts for the selected studio feature
  const featureArtifacts = artifacts.filter((a) => a.type === selectedFeature);

  // Active Artifact Inspection Canvas View
  if (activeArtifact) {
    const meta = featureConfig[activeArtifact.type] || currentFeatureMeta;
    const Icon = meta.icon;
    const typeLabel = meta.label;

    return (
      <main
        className="flex-1 flex flex-col h-full overflow-hidden"
        style={{ background: colors.paper }}
      >
        {/* Active Artifact Header Toolbar */}
        <div
          className="h-16 px-6 bg-white flex items-center justify-between gap-4 border-b shrink-0 z-10"
          style={{ borderColor: colors.hairline }}
        >
          <div className="flex items-center space-x-3.5 min-w-0">
            <button
              type="button"
              onClick={() => onSelectArtifact(null)}
              className="p-2 rounded-xl bg-[#F5F6F4] hover:bg-[#E2E4E1] text-[#5C6169] hover:text-[#14171A] border border-[#CBCFC9] transition cursor-pointer shrink-0"
              title={`Back to ${currentFeatureMeta.pluralLabel}`}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center space-x-2">
                <span
                  className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border flex items-center space-x-1 font-bold ${meta.tagBg}`}
                  style={mono}
                >
                  <Icon className="w-3 h-3" />
                  <span>{typeLabel}</span>
                </span>
                {activeArtifact.metadata?.sourceTitle && (
                  <span className="text-xs text-[#5C6169] truncate hidden sm:inline max-w-md">
                    • {activeArtifact.metadata.sourceTitle}
                  </span>
                )}
              </div>
              <h1 className="text-sm md:text-base font-bold text-[#14171A] truncate leading-tight">
                {activeArtifact.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={() => onOpenCreateModal(activeArtifact.type, activeArtifact.sourceId)}
              className="px-3.5 py-2 rounded-full bg-white hover:bg-[#F5F6F4] border border-[#CBCFC9] text-xs text-[#14171A] font-semibold flex items-center space-x-1.5 transition cursor-pointer shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#1F7A5C]" />
              <span className="hidden sm:inline">Regenerate</span>
            </button>

            <button
              type="button"
              disabled={isDeleting}
              onClick={(e) => handleDelete(activeArtifact.artifactId || (activeArtifact as any)._id, e)}
              className="p-2 rounded-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 transition cursor-pointer disabled:opacity-50"
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
    <main
      className="flex-1 flex flex-col h-full overflow-y-auto p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full"
      style={{ background: colors.paper }}
    >
      {/* 1. Feature Header Banner */}
      <div
        className="bg-white rounded-3xl p-6 relative overflow-hidden shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5"
        style={{ border: `1px solid ${colors.hairlineStrong}` }}
      >
        <div className={`h-1.5 w-full absolute top-0 left-0 right-0 ${currentFeatureMeta.headerBg}`} />

        <div className="flex items-center space-x-4 min-w-0">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${currentFeatureMeta.iconColor}`}>
            <FeatureIcon className="w-6 h-6" />
          </div>
          <div className="space-y-1 min-w-0">
            <div className="flex items-center space-x-2.5">
              <h1 className="text-base md:text-lg font-bold text-[#14171A]">
                {currentFeatureMeta.pluralLabel}
              </h1>
              <span
                className="font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                style={{
                  ...mono,
                  background: colors.verifiedSoft,
                  color: colors.verified,
                  border: `1px solid ${colors.verifiedBorder}`,
                }}
              >
                {featureArtifacts.length} Generated
              </span>
            </div>
            <p className="text-xs text-[#5C6169] leading-relaxed line-clamp-2">
              {currentFeatureMeta.desc}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpenCreateModal(selectedFeature)}
          className="px-4 py-2.5 rounded-full text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center space-x-1.5 cursor-pointer shrink-0"
          style={{ background: colors.verified }}
        >
          <Plus className="w-4 h-4" />
          <span>Generate {currentFeatureMeta.label}</span>
        </button>
      </div>

      {/* 2. Generated Artifacts for this Feature */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono font-bold text-[#5C6169] uppercase tracking-wider" style={mono}>
          <span>Generated {currentFeatureMeta.pluralLabel}</span>
          {isLoadingArtifacts && (
            <span className="text-[10px] text-[#1F7A5C] animate-pulse">Syncing artifacts...</span>
          )}
        </div>

        {featureArtifacts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {featureArtifacts.map((art) => {
              const matchingSource = sources.find((s) => s.sourceId === art.sourceId);
              const sourceType = (art.metadata?.sourceType || matchingSource?.sourceType || 'document').toLowerCase();

              return (
                <div
                  key={art.artifactId || (art as any)._id}
                  onClick={() => onSelectArtifact(art)}
                  onMouseMove={spotlightMove}
                  className="p-6 rounded-3xl bg-white border border-[#CBCFC9] hover:border-[#1F7A5C] transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 group shadow-sm hover:shadow-xl hover:-translate-y-1 relative overflow-hidden spotlight-card"
                >
                  {/* Top sliding green indicator line on hover */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[3px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                    style={{ background: currentFeatureMeta.accentBorder }}
                  />

                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2 text-[10px] font-mono" style={mono}>
                        {sourceType === 'youtube' ? (
                          <span className="flex items-center gap-1 text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full font-bold">
                            <Video className="w-3 h-3" /> YouTube
                          </span>
                        ) : sourceType === 'pdf' ? (
                          <span className="flex items-center gap-1 text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full font-bold">
                            <FileText className="w-3 h-3" /> PDF
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full font-bold">
                            <Globe className="w-3 h-3" /> Web
                          </span>
                        )}
                        <span className="text-[#5C6169]">{new Date(art.createdAt).toLocaleDateString()}</span>
                      </div>

                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={(e) => handleDelete(art.artifactId || (art as any)._id, e)}
                        className="p-1.5 text-[#93968F] hover:text-red-600 rounded-lg hover:bg-red-50 transition opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Delete Artifact"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-[#14171A] group-hover:text-[#1F7A5C] transition-colors leading-snug">
                        {art.title}
                      </h3>
                      {art.metadata?.sourceTitle && (
                        <p className="text-xs text-[#5C6169] font-mono truncate" style={mono}>
                          Source: {art.metadata.sourceTitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-3.5 border-t flex items-center justify-between" style={{ borderColor: colors.hairline }}>
                    <div>
                      {art.type === 'quiz' && (
                        <span
                          className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-2xs font-mono"
                          style={{
                            ...mono,
                            background: colors.verifiedSoft,
                            color: colors.verified,
                            border: `1px solid ${colors.verifiedBorder}`,
                          }}
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>{(art.data as any)?.questions?.length || art.metadata?.questionCount || 10} Questions</span>
                        </span>
                      )}
                      {art.type === 'flashcards' && (
                        <span className="px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-800 font-mono text-xs font-bold flex items-center gap-1.5 shadow-2xs" style={mono}>
                          <Layers className="w-3.5 h-3.5" />
                          <span>{(art.data as any)?.cards?.length || art.metadata?.totalCards || 0} Cards</span>
                        </span>
                      )}
                      {art.type === 'study_guide' && (
                        <span className="px-3 py-1 rounded-full bg-blue-100 border border-blue-300 text-blue-800 font-mono text-xs font-bold flex items-center gap-1.5 shadow-2xs" style={mono}>
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{(art.data as any)?.keyThemes?.length || 0} Modules</span>
                        </span>
                      )}
                      {art.type === 'mindmap' && (
                        <span className="px-3 py-1 rounded-full bg-purple-100 border border-purple-300 text-purple-800 font-mono text-xs font-bold flex items-center gap-1.5 shadow-2xs" style={mono}>
                          <Network className="w-3.5 h-3.5" />
                          <span>{(art.data as any)?.rootNode?.branches?.length || 0} Branches</span>
                        </span>
                      )}
                      {art.type === 'audio_overview' && (
                        <span className="px-3 py-1 rounded-full bg-rose-100 border border-rose-300 text-rose-800 font-mono text-xs font-bold flex items-center gap-1.5 shadow-2xs" style={mono}>
                          <Mic className="w-3.5 h-3.5" />
                          <span>~{(art.data as any)?.durationMinutesEstimate || 6} Mins Audio</span>
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectArtifact(art);
                      }}
                      className="py-1.5 px-3.5 rounded-full text-white text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs hover:shadow-md hover:-translate-y-0.5"
                      style={{ background: colors.verified }}
                    >
                      <span>Open</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div
            className="p-12 rounded-3xl bg-white text-center space-y-4 my-6 shadow-sm"
            style={{ border: `1.5px dashed ${colors.hairlineStrong}` }}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto shadow-xs ${currentFeatureMeta.iconColor}`}>
              <FeatureIcon className="w-7 h-7" />
            </div>

            <div className="space-y-1.5 max-w-sm mx-auto">
              <h3 className="text-base font-bold text-[#14171A]">
                No {currentFeatureMeta.pluralLabel} Generated Yet
              </h3>
              <p className="text-xs text-[#5C6169] leading-relaxed">
                You haven't generated any {currentFeatureMeta.label.toLowerCase()} in this workspace. Click below to synthesize one from your grounded sources.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onOpenCreateModal(selectedFeature)}
              className="px-5 py-2.5 rounded-full text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 inline-flex items-center space-x-2 cursor-pointer"
              style={{ background: colors.verified }}
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
