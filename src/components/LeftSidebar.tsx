import { X } from 'lucide-react';
import type { WorkspaceSourceItem } from '../modules/workspace/dto/workspaceDto';
import type { StudioArtifact, StudioArtifactType } from '../modules/studio/dto/studioDto';
import type { ActiveMediaState } from './RightPlayerSidebar';
import { KnowledgeSourcesSection, StudioArtifactsSection } from './sidebar';
import { colors, serif } from './landing/tokens';

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
  isOpen?: boolean;
  onClose?: () => void;
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
  isOpen = false,
  onClose,
}: LeftSidebarProps) {
  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden animate-in fade-in duration-200"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-80 bg-[#FAFBF9] flex flex-col h-full shrink-0 select-none overflow-hidden shadow-2xl transition-transform duration-300 ease-in-out lg:static lg:w-72 lg:shadow-none lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ borderRight: `1px solid ${colors.hairlineStrong}` }}
      >
        {/* Mobile Header Bar with Close Button */}
        <div
          className="lg:hidden flex items-center justify-between px-4 py-3 border-b bg-white shrink-0"
          style={{ borderColor: colors.hairline }}
        >
          <div className="flex items-center gap-1.5" style={serif}>
            <span className="font-bold text-sm tracking-tight text-[#14171A]">
              chai<span style={{ color: colors.verified }}>LM</span>
            </span>
            <span className="text-[10px] font-mono text-[#5C6169] bg-[#F5F6F4] px-2 py-0.5 rounded-full border border-[#E2E4E1]">
              Menu
            </span>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-[#5C6169] hover:text-[#14171A] hover:bg-[#F5F6F4] rounded-lg transition cursor-pointer"
              title="Close Menu"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 1. Top-Left: Knowledge Sources Grounding Section */}
        <KnowledgeSourcesSection
          sources={sources}
          selectedSourceIds={selectedSourceIds}
          onToggleSourceSelect={onToggleSourceSelect}
          onSelectAllSources={onSelectAllSources}
          onClearSourceSelection={onClearSourceSelection}
          isLoadingSources={isLoadingSources}
          onSelectSourceMedia={(media) => {
            onSelectSourceMedia(media);
            if (onClose && window.innerWidth < 1024) {
              onClose();
            }
          }}
          setShowAddModal={setShowAddModal}
        />

        {/* 2. Bottom-Left: Studio Artifacts Features Section */}
        <StudioArtifactsSection
          artifacts={artifacts}
          selectedStudioFeature={selectedStudioFeature}
          onSelectStudioFeature={(feat) => {
            if (onSelectStudioFeature) {
              onSelectStudioFeature(feat);
            }
            if (onClose && window.innerWidth < 1024) {
              onClose();
            }
          }}
        />
      </aside>
    </>
  );
}
