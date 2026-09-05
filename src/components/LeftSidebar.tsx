import type { WorkspaceSourceItem } from '../modules/workspace/dto/workspaceDto';
import type { StudioArtifact, StudioArtifactType } from '../modules/studio/dto/studioDto';
import type { ActiveMediaState } from './RightPlayerSidebar';
import { KnowledgeSourcesSection, StudioArtifactsSection } from './sidebar';
import { colors } from './landing/tokens';

export interface LeftSidebarProps {
  workspaceId: string;
  sessionId?: string;
  sources: WorkspaceSourceItem[];
  selectedSourceIds: string[];
  onToggleSourceSelect: (sourceId: string) => void;
  onSelectAllSources: () => void;
  onClearSourceSelection: () => void;
  isLoadingSources: boolean;
  onNewSession?: () => void;
  onIndexingSuccess: () => void;
  onSelectSourceMedia: (media: ActiveMediaState) => void;
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
  artifacts?: StudioArtifact[];
  selectedStudioFeature?: StudioArtifactType;
  onSelectStudioFeature?: (type: StudioArtifactType) => void;
}

export default function LeftSidebar({
  sources,
  selectedSourceIds,
  onToggleSourceSelect,
  onSelectAllSources,
  onClearSourceSelection,
  isLoadingSources,
  onSelectSourceMedia,
  setShowAddModal,
  artifacts = [],
  selectedStudioFeature = 'study_guide',
  onSelectStudioFeature,
}: LeftSidebarProps) {
  return (
    <aside
      className="w-72 bg-[#FAFBF9] flex flex-col h-full shrink-0 select-none z-10 overflow-hidden"
      style={{ borderRight: `1px solid ${colors.hairlineStrong}` }}
    >
      {/* 1. Top-Left: Knowledge Sources Grounding Section */}
      <KnowledgeSourcesSection
        sources={sources}
        selectedSourceIds={selectedSourceIds}
        onToggleSourceSelect={onToggleSourceSelect}
        onSelectAllSources={onSelectAllSources}
        onClearSourceSelection={onClearSourceSelection}
        isLoadingSources={isLoadingSources}
        onSelectSourceMedia={onSelectSourceMedia}
        setShowAddModal={setShowAddModal}
      />

      {/* 2. Bottom-Left: Studio Artifacts Features Section */}
      <StudioArtifactsSection
        artifacts={artifacts}
        selectedStudioFeature={selectedStudioFeature}
        onSelectStudioFeature={onSelectStudioFeature}
      />
    </aside>
  );
}
