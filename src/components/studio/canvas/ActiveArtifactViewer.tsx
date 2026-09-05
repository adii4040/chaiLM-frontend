import React from 'react';
import { ArrowLeft, RotateCcw, Trash2 } from 'lucide-react';
import type { StudioArtifact, StudioArtifactType } from '../../../modules/studio/dto/studioDto';
import type { FeatureConfig } from './FeatureHeaderBanner';
import StudyGuideView from '../StudyGuideView';
import FlashcardsView from '../FlashcardsView';
import QuizView from '../QuizView';
import MindMapView from '../MindMapView';
import AudioOverviewView from '../AudioOverviewView';
import { colors, mono } from '../../landing/tokens';

export interface ActiveArtifactViewerProps {
  artifact: StudioArtifact;
  featureMeta: FeatureConfig;
  isDeleting: boolean;
  onBack: () => void;
  onRegenerate: (type: StudioArtifactType, sourceId?: string) => void;
  onDelete: (artifactId: string, e: React.MouseEvent) => void;
}

export function ActiveArtifactViewer({
  artifact,
  featureMeta,
  isDeleting,
  onBack,
  onRegenerate,
  onDelete,
}: ActiveArtifactViewerProps) {
  const Icon = featureMeta.icon;
  const typeLabel = featureMeta.label;
  const artId = artifact.artifactId || (artifact as any)._id;

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
            onClick={onBack}
            className="p-2 rounded-xl bg-[#F5F6F4] hover:bg-[#E2E4E1] text-[#5C6169] hover:text-[#14171A] border border-[#CBCFC9] transition cursor-pointer shrink-0"
            title={`Back to ${featureMeta.pluralLabel}`}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center space-x-2">
              <span
                className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border flex items-center space-x-1 font-bold ${featureMeta.tagBg}`}
                style={mono}
              >
                <Icon className="w-3 h-3" />
                <span>{typeLabel}</span>
              </span>
              {artifact.metadata?.sourceTitle && (
                <span className="text-xs text-[#5C6169] truncate hidden sm:inline max-w-md">
                  • {artifact.metadata.sourceTitle}
                </span>
              )}
            </div>
            <h1 className="text-sm md:text-base font-bold text-[#14171A] truncate leading-tight">
              {artifact.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={() => onRegenerate(artifact.type, artifact.sourceId)}
            className="px-3.5 py-2 rounded-full bg-white hover:bg-[#F5F6F4] border border-[#CBCFC9] text-xs text-[#14171A] font-semibold flex items-center space-x-1.5 transition cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#1F7A5C]" />
            <span className="hidden sm:inline">Regenerate</span>
          </button>

          <button
            type="button"
            disabled={isDeleting}
            onClick={(e) => onDelete(artId, e)}
            className="p-2 rounded-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 transition cursor-pointer disabled:opacity-50"
            title="Delete Artifact"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Artifact Content Canvas */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        {artifact.type === 'study_guide' && <StudyGuideView data={artifact.data} />}
        {artifact.type === 'flashcards' && <FlashcardsView data={artifact.data} />}
        {artifact.type === 'quiz' && <QuizView data={artifact.data} />}
        {artifact.type === 'mindmap' && <MindMapView data={artifact.data} />}
        {artifact.type === 'audio_overview' && (
          <AudioOverviewView
            data={artifact.data}
            audioUrl={artifact.audioUrl}
            audioStatus={artifact.audioStatus}
            audioError={artifact.audioError}
            metadata={artifact.metadata}
          />
        )}
      </div>
    </main>
  );
}
