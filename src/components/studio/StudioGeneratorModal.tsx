import type { StudioArtifactType } from '../../modules/studio/dto/studioDto';
import type { WorkspaceSourceItem } from '../../modules/workspace/dto/workspaceDto';
import {
  StudyGuideGeneratorModal,
  FlashcardsGeneratorModal,
  QuizGeneratorModal,
  MindMapGeneratorModal,
  AudioOverviewGeneratorModal,
} from './modals';

export interface StudioGeneratorModalProps {
  workspaceId: string;
  sources: WorkspaceSourceItem[];
  artifactType: StudioArtifactType;
  defaultSourceId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (artifact: any) => void;
}

export default function StudioGeneratorModal({
  workspaceId,
  sources,
  artifactType,
  defaultSourceId,
  isOpen,
  onClose,
  onSuccess,
}: StudioGeneratorModalProps) {
  if (!isOpen) return null;

  switch (artifactType) {
    case 'study_guide':
      return (
        <StudyGuideGeneratorModal
          workspaceId={workspaceId}
          sources={sources}
          defaultSourceId={defaultSourceId}
          isOpen={isOpen}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      );
    case 'flashcards':
      return (
        <FlashcardsGeneratorModal
          workspaceId={workspaceId}
          sources={sources}
          defaultSourceId={defaultSourceId}
          isOpen={isOpen}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      );
    case 'quiz':
      return (
        <QuizGeneratorModal
          workspaceId={workspaceId}
          sources={sources}
          defaultSourceId={defaultSourceId}
          isOpen={isOpen}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      );
    case 'mindmap':
      return (
        <MindMapGeneratorModal
          workspaceId={workspaceId}
          sources={sources}
          defaultSourceId={defaultSourceId}
          isOpen={isOpen}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      );
    case 'audio_overview':
      return (
        <AudioOverviewGeneratorModal
          workspaceId={workspaceId}
          sources={sources}
          defaultSourceId={defaultSourceId}
          isOpen={isOpen}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      );
    default:
      return null;
  }
}

export * from './modals';
