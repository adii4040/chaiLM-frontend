import {
  Sparkles,
  BookOpen,
  Layers,
  HelpCircle,
  Network,
  Mic,
} from 'lucide-react';
import type { StudioArtifact, StudioArtifactType } from '../../modules/studio/dto/studioDto';
import { colors, mono } from '../landing/tokens';

export interface StudioArtifactsSectionProps {
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

export function StudioArtifactsSection({
  artifacts = [],
  selectedStudioFeature = 'study_guide',
  onSelectStudioFeature,
}: StudioArtifactsSectionProps) {
  return (
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
  );
}
