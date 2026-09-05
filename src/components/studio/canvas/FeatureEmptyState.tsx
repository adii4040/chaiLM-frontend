import { Sparkles } from 'lucide-react';
import type { StudioArtifactType } from '../../../modules/studio/dto/studioDto';
import type { FeatureConfig } from './FeatureHeaderBanner';
import { colors } from '../../landing/tokens';

export interface FeatureEmptyStateProps {
  featureMeta: FeatureConfig;
  selectedFeature: StudioArtifactType;
  onOpenCreateModal: (type: StudioArtifactType) => void;
}

export function FeatureEmptyState({
  featureMeta,
  selectedFeature,
  onOpenCreateModal,
}: FeatureEmptyStateProps) {
  const FeatureIcon = featureMeta.icon;

  return (
    <div
      className="p-12 rounded-3xl bg-white text-center space-y-4 my-6 shadow-sm"
      style={{ border: `1.5px dashed ${colors.hairlineStrong}` }}
    >
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto shadow-xs ${featureMeta.iconColor}`}
      >
        <FeatureIcon className="w-7 h-7" />
      </div>

      <div className="space-y-1.5 max-w-sm mx-auto">
        <h3 className="text-base font-bold text-[#14171A]">
          No {featureMeta.pluralLabel} Generated Yet
        </h3>
        <p className="text-xs text-[#5C6169] leading-relaxed">
          You haven't generated any {featureMeta.label.toLowerCase()} in this workspace. Click below to synthesize one from your grounded sources.
        </p>
      </div>

      <button
        type="button"
        onClick={() => onOpenCreateModal(selectedFeature)}
        className="px-5 py-2.5 rounded-full text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 inline-flex items-center space-x-2 cursor-pointer"
        style={{ background: colors.verified }}
      >
        <Sparkles className="w-4 h-4" />
        <span>Generate {featureMeta.label}</span>
      </button>
    </div>
  );
}
