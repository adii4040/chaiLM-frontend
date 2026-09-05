import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Loader2,
  X,
  Sparkles,
  Clock,
  FileText,
  Video,
  Globe,
  ChevronDown,
  Check,
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import type { WorkspaceSourceItem } from '../../../modules/workspace/dto/workspaceDto';
import { useGenerateAudioOverview } from '../../../modules/studio/mutation';
import { QUERY_KEY_WORKSPACE_DATA } from '../../../modules/workspace/constants';

export interface AudioOverviewGeneratorModalProps {
  workspaceId: string;
  sources: WorkspaceSourceItem[];
  defaultSourceId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (artifact: any) => void;
}

const DURATION_OPTIONS = [
  { length: 3, label: 'Quick Brief', sub: '3 min (~18 turns)' },
  { length: 5, label: 'Deep Dive', sub: '5 min (~28 turns)' },
];

const FORMAT_PRESETS = [
  'Educational & Informative',
  'Debate & Counter-arguments',
  'Casual Coffee Chat',
  'Technical Walkthrough',
];

const MOOD_PRESETS = [
  'Analytical & Rigorous',
  'Humorous & Witty',
  'Warm & Storytelling',
];

export function AudioOverviewGeneratorModal({
  workspaceId,
  sources,
  defaultSourceId,
  isOpen,
  onClose,
  onSuccess,
}: AudioOverviewGeneratorModalProps) {
  const queryClient = useQueryClient();
  const [selectedSourceId, setSelectedSourceId] = useState<string>(
    defaultSourceId || sources[0]?.sourceId || ''
  );
  const [audioLength, setAudioLength] = useState<number>(5);
  const [podcastType, setPodcastType] = useState('Educational and informative');
  const [audioMood, setAudioMood] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [processingNotice, setProcessingNotice] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (defaultSourceId) setSelectedSourceId(defaultSourceId);
      else if (sources[0]?.sourceId) setSelectedSourceId(sources[0].sourceId);
      setPodcastType('Educational and informative');
      setAudioMood('');
      setAudioLength(5);
      setIsDropdownOpen(false);
      setProcessingNotice(null);
    }
  }, [isOpen, defaultSourceId, sources]);

  // Click outside listener for custom source dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const { mutate: generateAudioOverview, isPending, error } = useGenerateAudioOverview();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPending) return;
    setProcessingNotice(null);

    generateAudioOverview(
      {
        workspaceId,
        sourceId: selectedSourceId || undefined,
        options: {
          length: audioLength,
          podcastType: podcastType.trim() || undefined,
          mood: audioMood.trim() || undefined,
        },
      },
      {
        onSuccess: (res: any) => {
          if (res?.status === 'PROCESSING' || (!res?.artifact && res?.message)) {
            setProcessingNotice(
              res?.message || 'Outline summarization is currently in progress for this source. Please wait a moment.'
            );
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEY_WORKSPACE_DATA, workspaceId],
            });
            return;
          }
          if (res?.artifact) {
            onSuccess(res.artifact);
            onClose();
          }
        },
      }
    );
  };

  const activeSource = sources.find((s) => s.sourceId === selectedSourceId) || sources[0];

  const getSourceIcon = (type?: string, className = 'w-4 h-4') => {
    const t = (type || '').toLowerCase();
    if (t === 'youtube') return <Video className={`${className} text-rose-500`} />;
    if (t === 'pdf') return <FileText className={`${className} text-amber-500`} />;
    return <Globe className={`${className} text-blue-500`} />;
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-[28px] max-w-[560px] w-full p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh] border border-gray-100">
        
        {/* Header */}
        <div className="flex justify-between items-start shrink-0">
          <div className="flex items-start space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
                Generate Audio Overview
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
                Create a realistic 2–host conversational dialogue exploring your selected source material.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition cursor-pointer disabled:opacity-40 shrink-0"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5 overflow-y-auto pr-1">
          
          {/* 1. Custom Knowledge Source Dropdown */}
          <div className="space-y-1.5" ref={dropdownRef}>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <label className="font-semibold text-gray-900">Knowledge source</label>
              <span className="text-xs text-gray-400">Primary context</span>
            </div>

            <div className="relative">
              {/* Trigger Button */}
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full flex items-center justify-between bg-white border rounded-2xl px-3.5 py-3 transition text-left cursor-pointer shadow-2xs ${
                  isDropdownOpen
                    ? 'border-rose-500 ring-2 ring-rose-100'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                  <div className="shrink-0">
                    {getSourceIcon(activeSource?.sourceType)}
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                    {activeSource?.title || 'Select a source'}
                  </span>
                </div>

                <ChevronDown
                  className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180 text-rose-600' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu Popover */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 py-1.5 max-h-56 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
                  {sources.map((s) => {
                    const isSelected = s.sourceId === selectedSourceId;
                    return (
                      <button
                        key={s.sourceId}
                        type="button"
                        onClick={() => {
                          setSelectedSourceId(s.sourceId);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full px-3.5 py-2.5 flex items-center justify-between text-left transition cursor-pointer text-xs sm:text-sm ${
                          isSelected
                            ? 'bg-rose-50 text-rose-900 font-semibold'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                          <div className="shrink-0">{getSourceIcon(s.sourceType)}</div>
                          <span className="truncate">{s.title}</span>
                        </div>

                        {isSelected && (
                          <Check className="w-4 h-4 text-rose-600 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* 2. Episode Duration (2 Options: 3 Min & 5 Min) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <label className="font-semibold text-gray-900">Episode duration</label>
              <span className="bg-rose-50 text-rose-600 px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{audioLength} Minutes</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {DURATION_OPTIONS.map((opt) => {
                const isActive = audioLength === opt.length;
                return (
                  <button
                    key={opt.length}
                    type="button"
                    onClick={() => setAudioLength(opt.length)}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                      isActive
                        ? 'border-2 border-rose-600 bg-white shadow-xs'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50'
                    }`}
                  >
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-600 absolute top-3.5 right-3.5" />
                    )}
                    <span
                      className={`text-xs sm:text-sm font-semibold ${
                        isActive ? 'text-rose-600' : 'text-gray-900'
                      }`}
                    >
                      {opt.label}
                    </span>
                    <span className="text-[11px] sm:text-xs text-gray-500 mt-1 leading-tight">
                      {opt.sub}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Podcast format & style */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <label className="font-semibold text-gray-900">
                Podcast format &amp; style{' '}
                <span className="text-gray-400 font-normal text-xs">(Optional)</span>
              </label>
              <span className="text-xs text-gray-400 hidden sm:inline">Choose a preset or type below</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {FORMAT_PRESETS.map((preset) => {
                const isSelected = podcastType.toLowerCase() === preset.toLowerCase();
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setPodcastType(preset)}
                    className={`px-3 py-1.5 rounded-xl text-xs transition cursor-pointer border ${
                      isSelected
                        ? 'bg-rose-50 border-rose-200 text-rose-700 font-medium'
                        : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                    }`}
                  >
                    {preset}
                  </button>
                );
              })}
            </div>

            <input
              type="text"
              placeholder="e.g. Educational and informative"
              value={podcastType}
              onChange={(e) => setPodcastType(e.target.value)}
              className="w-full bg-white border border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 transition"
            />
          </div>

          {/* 4. Vocal mood & atmosphere */}
          <div className="space-y-2.5">
            <label className="font-semibold text-gray-900 text-xs sm:text-sm block">
              Vocal mood &amp; atmosphere{' '}
              <span className="text-gray-400 font-normal text-xs">(Optional)</span>
            </label>

            <div className="flex flex-wrap gap-2">
              {MOOD_PRESETS.map((mood) => {
                const isSelected = audioMood.toLowerCase() === mood.toLowerCase();
                return (
                  <button
                    key={mood}
                    type="button"
                    onClick={() => setAudioMood(mood)}
                    className={`px-3 py-1.5 rounded-xl text-xs transition cursor-pointer border ${
                      isSelected
                        ? 'bg-rose-50 border-rose-200 text-rose-700 font-medium'
                        : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                    }`}
                  >
                    {mood}
                  </button>
                );
              })}
            </div>

            <input
              type="text"
              placeholder="e.g. Humorous & Witty, Intense & Provocative, Analytical & Rigorous"
              value={audioMood}
              onChange={(e) => setAudioMood(e.target.value)}
              className="w-full bg-white border border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 transition"
            />
          </div>

          {/* Processing Notice */}
          {processingNotice && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 space-y-1 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm">
                <Loader2 className="w-4 h-4 animate-spin text-amber-700 shrink-0" />
                <span>Outline Generation in Progress</span>
              </div>
              <p className="text-xs text-amber-800 leading-snug">
                {processingNotice}
              </p>
            </div>
          )}

          {error && (
            <p className="text-xs text-red-600 bg-red-50 p-3 rounded-2xl border border-red-200 font-mono">
              {error.message}
            </p>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2.5 text-xs sm:text-sm text-gray-600 hover:text-gray-900 font-medium transition cursor-pointer disabled:opacity-40"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm hover:shadow transition flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Episode</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
