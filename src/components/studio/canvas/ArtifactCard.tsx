import React from 'react';
import {
  FileText,
  Video,
  Globe,
  Trash2,
  ArrowRight,
  HelpCircle,
  Layers,
  BookOpen,
  Network,
  Mic,
} from 'lucide-react';
import type { StudioArtifact } from '../../../modules/studio/dto/studioDto';
import type { WorkspaceSourceItem } from '../../../modules/workspace/dto/workspaceDto';
import type { FeatureConfig } from './FeatureHeaderBanner';
import { colors, mono, spotlightMove } from '../../landing/tokens';

export interface ArtifactCardProps {
  artifact: StudioArtifact;
  sources?: WorkspaceSourceItem[];
  featureMeta: FeatureConfig;
  isDeleting: boolean;
  onSelect: (artifact: StudioArtifact) => void;
  onDelete: (artifactId: string, e: React.MouseEvent) => void;
}

export function ArtifactCard({
  artifact,
  sources = [],
  featureMeta,
  isDeleting,
  onSelect,
  onDelete,
}: ArtifactCardProps) {
  const matchingSource = sources.find((s) => s.sourceId === artifact.sourceId);
  const sourceType = (artifact.metadata?.sourceType || matchingSource?.sourceType || 'document').toLowerCase();
  const artId = artifact.artifactId || (artifact as any)._id;

  return (
    <div
      onClick={() => onSelect(artifact)}
      onMouseMove={spotlightMove}
      className="p-6 rounded-3xl bg-white border border-[#CBCFC9] hover:border-[#1F7A5C] transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 group shadow-sm hover:shadow-xl hover:-translate-y-1 relative overflow-hidden spotlight-card"
    >
      {/* Top sliding indicator line on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
        style={{ background: featureMeta.accentBorder }}
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
            <span className="text-[#5C6169]">{new Date(artifact.createdAt).toLocaleDateString()}</span>
          </div>

          <button
            type="button"
            disabled={isDeleting}
            onClick={(e) => onDelete(artId, e)}
            className="p-1.5 text-[#93968F] hover:text-red-600 rounded-lg hover:bg-red-50 transition opacity-0 group-hover:opacity-100 cursor-pointer"
            title="Delete Artifact"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-bold text-[#14171A] group-hover:text-[#1F7A5C] transition-colors leading-snug">
            {artifact.title}
          </h3>
          {artifact.metadata?.sourceTitle && (
            <p className="text-xs text-[#5C6169] font-mono truncate" style={mono}>
              Source: {artifact.metadata.sourceTitle}
            </p>
          )}
        </div>
      </div>

      <div className="pt-3.5 border-t flex items-center justify-between" style={{ borderColor: colors.hairline }}>
        <div>
          {artifact.type === 'quiz' && (
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
              <span>{(artifact.data as any)?.questions?.length || artifact.metadata?.questionCount || 10} Questions</span>
            </span>
          )}
          {artifact.type === 'flashcards' && (
            <span
              className="px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-800 font-mono text-xs font-bold flex items-center gap-1.5 shadow-2xs"
              style={mono}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{(artifact.data as any)?.cards?.length || artifact.metadata?.totalCards || 0} Cards</span>
            </span>
          )}
          {artifact.type === 'study_guide' && (
            <span
              className="px-3 py-1 rounded-full bg-blue-100 border border-blue-300 text-blue-800 font-mono text-xs font-bold flex items-center gap-1.5 shadow-2xs"
              style={mono}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{(artifact.data as any)?.keyThemes?.length || 0} Modules</span>
            </span>
          )}
          {artifact.type === 'mindmap' && (
            <span
              className="px-3 py-1 rounded-full bg-purple-100 border border-purple-300 text-purple-800 font-mono text-xs font-bold flex items-center gap-1.5 shadow-2xs"
              style={mono}
            >
              <Network className="w-3.5 h-3.5" />
              <span>{(artifact.data as any)?.rootNode?.branches?.length || 0} Branches</span>
            </span>
          )}
          {artifact.type === 'audio_overview' && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className="px-3 py-1 rounded-full bg-rose-100 border border-rose-300 text-rose-800 font-mono text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                style={mono}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>{artifact.metadata?.targetMinutes || (artifact.data as any)?.durationMinutesEstimate || 5} Min Episode</span>
              </span>
              {artifact.audioStatus === 'processing' && (
                <span
                  className="px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-800 font-mono text-[10px] font-bold animate-pulse"
                  style={mono}
                >
                  Synthesizing Audio...
                </span>
              )}
              {artifact.audioStatus === 'ready' && artifact.audioUrl && (
                <span
                  className="px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-mono text-[10px] font-bold"
                  style={mono}
                >
                  Audio Ready
                </span>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(artifact);
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
}
