import { Plus } from 'lucide-react';
import type { StudioArtifactType } from '../../../modules/studio/dto/studioDto';
import { colors, mono } from '../../landing/tokens';

export interface FeatureConfig {
  label: string;
  pluralLabel: string;
  icon: any;
  desc: string;
  headerBg: string;
  iconColor: string;
  tagBg: string;
  accentBorder: string;
}

export interface FeatureHeaderBannerProps {
  featureMeta: FeatureConfig;
  count: number;
  selectedFeature: StudioArtifactType;
  onOpenCreateModal: (type: StudioArtifactType) => void;
}

export function FeatureHeaderBanner({
  featureMeta,
  count,
  selectedFeature,
  onOpenCreateModal,
}: FeatureHeaderBannerProps) {
  const FeatureIcon = featureMeta.icon;

  return (
    <div
      className="bg-white rounded-3xl p-6 relative overflow-hidden shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5 shrink-0"
      style={{ border: `1px solid ${colors.hairlineStrong}` }}
    >
      <div className={`h-1.5 w-full absolute top-0 left-0 right-0 ${featureMeta.headerBg}`} />

      <div className="flex items-center space-x-4 min-w-0">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${featureMeta.iconColor}`}>
          <FeatureIcon className="w-6 h-6" />
        </div>
        <div className="space-y-1 min-w-0">
          <div className="flex items-center space-x-2.5">
            <h1 className="text-base md:text-lg font-bold text-[#14171A]">
              {featureMeta.pluralLabel}
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
              {count} Generated
            </span>
          </div>
          <p className="text-xs text-[#5C6169] leading-relaxed line-clamp-2">
            {featureMeta.desc}
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
        <span>Generate {featureMeta.label}</span>
      </button>
    </div>
  );
}
