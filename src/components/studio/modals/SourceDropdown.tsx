import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check, Video, FileText, Globe } from 'lucide-react';
import type { WorkspaceSourceItem } from '../../../modules/workspace/dto/workspaceDto';

export interface SourceDropdownProps {
  sources: WorkspaceSourceItem[];
  selectedSourceId: string;
  onSelect: (sourceId: string) => void;
  accentColor?: 'blue' | 'amber' | 'emerald' | 'purple' | 'rose';
}

const ACCENT_STYLES = {
  blue: {
    focusRing: 'focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100',
    borderActive: 'border-blue-500 ring-2 ring-blue-100',
    selectedItem: 'bg-blue-50 text-blue-900 font-semibold',
    checkColor: 'text-blue-600',
    chevronActive: 'text-blue-600',
  },
  amber: {
    focusRing: 'focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-100',
    borderActive: 'border-amber-500 ring-2 ring-amber-100',
    selectedItem: 'bg-amber-50 text-amber-900 font-semibold',
    checkColor: 'text-amber-600',
    chevronActive: 'text-amber-600',
  },
  emerald: {
    focusRing: 'focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100',
    borderActive: 'border-emerald-500 ring-2 ring-emerald-100',
    selectedItem: 'bg-emerald-50 text-emerald-900 font-semibold',
    checkColor: 'text-[#1F7A5C]',
    chevronActive: 'text-[#1F7A5C]',
  },
  purple: {
    focusRing: 'focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100',
    borderActive: 'border-purple-500 ring-2 ring-purple-100',
    selectedItem: 'bg-purple-50 text-purple-900 font-semibold',
    checkColor: 'text-purple-600',
    chevronActive: 'text-purple-600',
  },
  rose: {
    focusRing: 'focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-100',
    borderActive: 'border-rose-500 ring-2 ring-rose-100',
    selectedItem: 'bg-rose-50 text-rose-900 font-semibold',
    checkColor: 'text-rose-600',
    chevronActive: 'text-rose-600',
  },
};

export function SourceDropdown({
  sources,
  selectedSourceId,
  onSelect,
  accentColor = 'blue',
}: SourceDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const style = ACCENT_STYLES[accentColor] || ACCENT_STYLES.blue;
  const activeSource = sources.find((s) => s.sourceId === selectedSourceId) || sources[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getSourceIcon = (type?: string, className = 'w-4 h-4') => {
    const t = (type || '').toLowerCase();
    if (t === 'youtube') return <Video className={`${className} text-red-500`} />;
    if (t === 'pdf') return <FileText className={`${className} text-amber-500`} />;
    return <Globe className={`${className} text-blue-500`} />;
  };

  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <div className="space-y-1.5" ref={dropdownRef}>
      <div className="flex items-center justify-between text-xs sm:text-sm">
        <label className="font-semibold text-gray-900">Knowledge source</label>
        <span className="text-xs text-gray-400">Primary context</span>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between bg-white border rounded-2xl px-3.5 py-3 transition text-left cursor-pointer shadow-2xs ${
            isOpen ? style.borderActive : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center space-x-2.5 min-w-0 pr-2">
            <div className="shrink-0">{getSourceIcon(activeSource?.sourceType)}</div>
            <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">
              {activeSource?.title || 'Select a source'}
            </span>
          </div>

          <ChevronDown
            className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
              isOpen ? `rotate-180 ${style.chevronActive}` : ''
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 py-1.5 max-h-56 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            {sources.map((s) => {
              const isSelected = s.sourceId === selectedSourceId;
              return (
                <button
                  key={s.sourceId}
                  type="button"
                  onClick={() => {
                    onSelect(s.sourceId);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3.5 py-2.5 flex items-center justify-between text-left transition cursor-pointer text-xs sm:text-sm ${
                    isSelected ? style.selectedItem : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                    <div className="shrink-0">{getSourceIcon(s.sourceType)}</div>
                    <span className="truncate">{s.title}</span>
                  </div>

                  {isSelected && <Check className={`w-4 h-4 shrink-0 ml-2 ${style.checkColor}`} />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
