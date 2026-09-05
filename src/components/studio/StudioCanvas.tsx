import React from 'react';
import { BookOpen, Layers, HelpCircle, Network, Mic } from 'lucide-react';
import type { StudioArtifact, StudioArtifactType } from '../../modules/studio/dto/studioDto';
import type { WorkspaceSourceItem } from '../../modules/workspace/dto/workspaceDto';
import { useDeleteStudioArtifact } from '../../modules/studio/mutation';
import {
  ActiveArtifactViewer,
  FeatureHeaderBanner,
  FeatureArtifactsGrid,
  type FeatureConfig,
} from './canvas';
import { colors } from '../landing/tokens';

export interface StudioCanvasProps {
  workspaceId?: string;
  sources?: WorkspaceSourceItem[];
  artifacts: StudioArtifact[];
  isLoadingArtifacts: boolean;
  selectedFeature?: StudioArtifactType;
  activeArtifact: StudioArtifact | null;
  onSelectArtifact: (artifact: StudioArtifact | null) => void;
  onOpenCreateModal: (type: StudioArtifactType, sourceId?: string) => void;
}

const FEATURE_CONFIG: Record<StudioArtifactType, FeatureConfig> = {
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
        if (
          activeArtifact?.artifactId === artifactId ||
          (activeArtifact as any)?._id === artifactId
        ) {
          onSelectArtifact(null);
        }
      },
    });
  };

  const currentFeatureMeta = FEATURE_CONFIG[selectedFeature] || FEATURE_CONFIG.study_guide;

  // 1. Active Artifact Inspection Canvas View
  if (activeArtifact) {
    const meta = FEATURE_CONFIG[activeArtifact.type] || currentFeatureMeta;
    return (
      <ActiveArtifactViewer
        artifact={activeArtifact}
        featureMeta={meta}
        isDeleting={isDeleting}
        onBack={() => onSelectArtifact(null)}
        onRegenerate={(type, sourceId) => onOpenCreateModal(type, sourceId)}
        onDelete={handleDelete}
      />
    );
  }

  // 2. Feature Artifacts Grid / Empty State View
  const featureArtifacts = artifacts.filter((a) => a.type === selectedFeature);

  return (
    <main
      className="flex-1 flex flex-col h-full overflow-y-auto p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full"
      style={{ background: colors.paper }}
    >
      {/* Feature Header Banner */}
      <FeatureHeaderBanner
        featureMeta={currentFeatureMeta}
        count={featureArtifacts.length}
        selectedFeature={selectedFeature}
        onOpenCreateModal={onOpenCreateModal}
      />

      {/* Generated Artifacts Grid / Empty State */}
      <FeatureArtifactsGrid
        artifacts={featureArtifacts}
        sources={sources}
        featureMeta={currentFeatureMeta}
        selectedFeature={selectedFeature}
        isLoadingArtifacts={isLoadingArtifacts}
        isDeleting={isDeleting}
        onSelectArtifact={onSelectArtifact}
        onDeleteArtifact={handleDelete}
        onOpenCreateModal={onOpenCreateModal}
      />
    </main>
  );
}

export * from './canvas';
