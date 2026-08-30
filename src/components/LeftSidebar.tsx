import {
  FileText,
  Video,
  Globe,
  Loader2,
  AlertCircle,
  Sparkles,
  BookOpen,
  Layers,
  HelpCircle,
  Network,
  Mic,
  Plus,
  Check,
} from 'lucide-react';
import type { WorkspaceSourceItem } from '../modules/workspace/dto/workspaceDto';
import type { StudioArtifact, StudioArtifactType } from '../modules/studio/dto/studioDto';
import type { ActiveMediaState } from './RightPlayerSidebar';
import { colors, mono } from './landing/tokens';

interface LeftSidebarProps {
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

const FIXED_STUDIO_ITEMS: {
  type: StudioArtifactType;
  label: string;
  icon: any;
  accentBg: string;
  iconBg: string;
  textColor: string;
  badgeBg: string;
}[] = [
  {
    type: 'study_guide',
    label: 'Study Guide',
    icon: BookOpen,
    accentBg: 'bg-blue-50/90 border-blue-200 hover:border-blue-300 hover:bg-blue-100/70',
    iconBg: 'bg-blue-600 text-white',
    textColor: 'text-blue-950 font-semibold',
    badgeBg: 'bg-blue-600 text-white',
  },
  {
    type: 'flashcards',
    label: 'Flashcards',
    icon: Layers,
    accentBg: 'bg-amber-50/90 border-amber-200 hover:border-amber-300 hover:bg-amber-100/70',
    iconBg: 'bg-amber-600 text-white',
    textColor: 'text-amber-950 font-semibold',
    badgeBg: 'bg-amber-600 text-white',
  },
  {
    type: 'quiz',
    label: 'Quiz',
    icon: HelpCircle,
    accentBg: 'bg-emerald-50/90 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-100/70',
    iconBg: 'bg-[#1F7A5C] text-white',
    textColor: 'text-emerald-950 font-semibold',
    badgeBg: 'bg-[#1F7A5C] text-white',
  },
  {
    type: 'mindmap',
    label: 'Mind Map',
    icon: Network,
    accentBg: 'bg-purple-50/90 border-purple-200 hover:border-purple-300 hover:bg-purple-100/70',
    iconBg: 'bg-purple-600 text-white',
    textColor: 'text-purple-950 font-semibold',
    badgeBg: 'bg-purple-600 text-white',
  },
  {
    type: 'audio_overview',
    label: 'Audio Overview',
    icon: Mic,
    accentBg: 'bg-rose-50/90 border-rose-200 hover:border-rose-300 hover:bg-rose-100/70',
    iconBg: 'bg-rose-600 text-white',
    textColor: 'text-rose-950 font-semibold',
    badgeBg: 'bg-rose-600 text-white',
  },
];

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
  const allSelected = sources.length > 0 && selectedSourceIds.length === sources.length;

  return (
    <aside
      className="w-72 bg-[#FAFBF9] flex flex-col h-full shrink-0 select-none z-10"
      style={{ borderRight: `1px solid ${colors.hairlineStrong}` }}
    >
      {/* 1. Header: Knowledge Sources */}
      <div className="p-3.5 flex items-center justify-between border-b bg-white" style={{ borderColor: colors.hairline }}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#1F7A5C]" />
          <span className="text-xs font-bold text-[#14171A] tracking-wider" style={mono}>
            KNOWLEDGE SOURCES
          </span>
        </div>
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs font-mono"
          style={{
            background: colors.verified,
            color: '#FFFFFF',
          }}
        >
          {sources.length} Total
        </span>
      </div>

      {/* 2. Sources Content */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 min-h-0">
        <div className="flex justify-between items-center text-[10px] font-bold text-[#5C6169] uppercase tracking-wider" style={mono}>
          <span>Grounding Scope</span>
          {sources.length > 0 && (
            <button
              type="button"
              onClick={allSelected ? onClearSourceSelection : onSelectAllSources}
              className="text-[10px] text-[#1F7A5C] hover:text-[#1E2A5E] font-mono font-bold cursor-pointer transition-colors"
            >
              {allSelected ? 'Deselect All' : 'Select All'}
            </button>
          )}
        </div>

        {isLoadingSources ? (
          <div className="flex items-center justify-center py-8 text-xs text-[#5C6169] space-x-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#1F7A5C]" />
            <span className="font-medium">Loading sources...</span>
          </div>
        ) : sources.length > 0 ? (
          <div className="space-y-2.5">
            {sources.map((src, idx) => {
              const type = (src.sourceType || 'website').toLowerCase();
              const sourceId = src.sourceId;
              const isSelected = selectedSourceIds.includes(sourceId);
              const isPending = src.status === 'PENDING' || src.status === 'PROCESSING';
              const isFailed = src.status === 'FAILED';

              return (
                <div
                  key={sourceId || idx}
                  onClick={() =>
                    onSelectSourceMedia({
                      sourceType: src.sourceType,
                      sourceUrl: src.sourceUrl,
                      title: src.title,
                      cloudinaryUrl: src.cloudinaryUrl,
                      videoId: src.videoId,
                      startSeconds: src.startSeconds || 0,
                      formattedTimestamp: src.formattedTimestamp || null,
                      pageNumber: src.pageNumber || null,
                    })
                  }
                  className={`p-3 rounded-2xl border transition-all duration-200 cursor-pointer select-none relative overflow-hidden group shadow-xs hover:shadow-md hover:-translate-y-0.5 ${
                    isSelected
                      ? 'bg-white border-[#1F7A5C] ring-1 ring-[#1F7A5C]/20'
                      : 'bg-white/80 border-[#CBCFC9] hover:bg-white hover:border-[#1F7A5C]'
                  }`}
                >
                  {/* Left accent bar for active items */}
                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1F7A5C]" />
                  )}

                  <div className="flex items-start justify-between space-x-2 pl-1">
                    <div className="flex items-center space-x-2.5 min-w-0">
                      {type === 'youtube' ? (
                        <div className="w-7 h-7 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Video className="w-3.5 h-3.5" />
                        </div>
                      ) : type === 'pdf' ? (
                        <div className="w-7 h-7 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <FileText className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Globe className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <span className="text-xs font-bold text-[#14171A] truncate group-hover:text-[#1F7A5C] transition-colors">
                        {src.title}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSourceSelect(sourceId);
                      }}
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                        isSelected
                          ? 'bg-[#1F7A5C] border-[#1F7A5C] text-white shadow-2xs'
                          : 'bg-white border-[#CBCFC9] hover:border-[#1F7A5C]'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>
                  </div>

                  {/* Status Indicator Bar */}
                  {isPending && (
                    <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-amber-800 font-mono bg-amber-100 px-2 py-0.5 rounded-lg border border-amber-300" style={mono}>
                      <Loader2 className="w-3 h-3 animate-spin text-amber-700" />
                      <span>Vectorizing embeddings...</span>
                    </div>
                  )}

                  {isFailed && (
                    <div className="mt-2.5 flex items-center gap-1 text-[10px] text-red-700 font-mono bg-red-100 px-2 py-0.5 rounded-lg border border-red-300" style={mono}>
                      <AlertCircle className="w-3 h-3 text-red-600" />
                      <span className="truncate">{src.errorMessage || 'Indexing Failed'}</span>
                    </div>
                  )}

                  <div className="mt-2.5 flex items-center justify-between text-[10px] pl-1 font-mono" style={mono}>
                    <span className="truncate max-w-[130px] text-[#5C6169]">{src.sourceUrl || src.sourceId}</span>
                    <span
                      className={`uppercase font-bold px-2 py-0.5 rounded-md text-[9px] ${
                        type === 'youtube'
                          ? 'bg-red-100 text-red-700'
                          : type === 'pdf'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {src.sourceType}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className="p-6 bg-white rounded-2xl text-center space-y-2.5 shadow-xs"
            style={{ border: `1.5px dashed ${colors.hairlineStrong}` }}
          >
            <p className="text-xs text-[#14171A] font-bold">No sources added yet</p>
            <p className="text-[11px] text-[#5C6169] leading-relaxed">
              Add YouTube videos, PDF documents, or web articles to ground this workspace.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white mt-1 shadow-xs hover:shadow-md transition-all cursor-pointer"
              style={{ background: colors.verified }}
            >
              <Plus size={13} /> Add First Source
            </button>
          </div>
        )}
      </div>

      {/* 3. Bottom Studio Artifacts Section (Vibrant Colored Cards) */}
      <div
        className="p-3.5 border-t space-y-2 shrink-0 bg-white"
        style={{
          borderColor: colors.hairline,
        }}
      >
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-[#1F7A5C]" />
            <span className="text-xs font-bold text-[#14171A]" style={mono}>
              STUDIO ARTIFACTS
            </span>
          </div>
          <span
            className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1F7A5C]/10 text-[#1F7A5C] border border-[#1F7A5C]/20"
            style={mono}
          >
            {artifacts.length} Total
          </span>
        </div>

        {/* List of Studio Feature Options */}
        <div className="space-y-1.5">
          {FIXED_STUDIO_ITEMS.map((item) => {
            const Icon = item.icon;
            const count = artifacts.filter((a) => a.type === item.type).length;
            const isSelected = selectedStudioFeature === item.type;

            return (
              <button
                key={item.type}
                type="button"
                onClick={() => onSelectStudioFeature && onSelectStudioFeature(item.type)}
                className={`w-full p-2.5 rounded-xl border text-xs transition-all duration-200 cursor-pointer flex items-center justify-between group text-left ${
                  item.accentBg
                } ${
                  isSelected
                    ? 'ring-2 ring-[#1F7A5C] shadow-xs'
                    : 'shadow-2xs'
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 shadow-2xs ${item.iconBg}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className={`text-xs truncate ${item.textColor}`}>
                    {item.label}
                  </span>
                </div>

                {count > 0 ? (
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shadow-2xs ${item.badgeBg}`}>
                    {count}
                  </span>
                ) : (
                  <span className="text-xs font-bold text-[#5C6169] group-hover:text-[#14171A] px-1.5">
                    +
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
