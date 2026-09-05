import React from 'react';
import type { StudioArtifact, StudioArtifactType } from '../../../modules/studio/dto/studioDto';
import type { WorkspaceSourceItem } from '../../../modules/workspace/dto/workspaceDto';
import type { FeatureConfig } from './FeatureHeaderBanner';
import { ArtifactCard } from './ArtifactCard';
import { FeatureEmptyState } from './FeatureEmptyState';
import { mono } from '../../landing/tokens';

export interface FeatureArtifactsGridProps {
  artifacts: StudioArtifact[];
  sources?: WorkspaceSourceItem[];
  featureMeta: FeatureConfig;
  selectedFeature: StudioArtifactType;
  isLoadingArtifacts: boolean;
  isDeleting: boolean;
  onSelectArtifact: (artifact: StudioArtifact) => void;
  onDeleteArtifact: (artifactId: string, e: React.MouseEvent) => void;
  onOpenCreateModal: (type: StudioArtifactType) => void;
}

export function FeatureArtifactsGrid({
  artifacts,
  sources = [],
  featureMeta,
  selectedFeature,
  isLoadingArtifacts,
  isDeleting,
  onSelectArtifact,
  onDeleteArtifact,
  onOpenCreateModal,
}: FeatureArtifactsGridProps) {
  return (
    <div className="space-y-4">
      <div
        className="flex items-center justify-between text-xs font-mono font-bold text-[#5C6169] uppercase tracking-wider"
        style={mono}
      >
        <span>Generated {featureMeta.pluralLabel}</span>
        {isLoadingArtifacts && (
          <span className="text-[10px] text-[#1F7A5C] animate-pulse">Syncing artifacts...</span>
        )}
      </div>

      {artifacts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {artifacts.map((art) => (
            <ArtifactCard
              key={art.artifactId || (art as any)._id}
              artifact={art}
              sources={sources}
              featureMeta={featureMeta}
              isDeleting={isDeleting}
              onSelect={onSelectArtifact}
              onDelete={onDeleteArtifact}
            />
          ))}
        </div>
      ) : (
        <FeatureEmptyState
          featureMeta={featureMeta}
          selectedFeature={selectedFeature}
          onOpenCreateModal={onOpenCreateModal}
        />
      )}
    </div>
  );
}
