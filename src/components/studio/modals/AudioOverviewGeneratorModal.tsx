import React, { useState, useEffect } from 'react';
import { Mic, Loader2, X, Sparkles, Clock } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import type { WorkspaceSourceItem } from '../../../modules/workspace/dto/workspaceDto';
import { useGenerateAudioOverview } from '../../../modules/studio/mutation';
import { QUERY_KEY_WORKSPACE_DATA } from '../../../modules/workspace/constants';
import { colors, mono, serif } from '../../landing/tokens';

export interface AudioOverviewGeneratorModalProps {
  workspaceId: string;
  sources: WorkspaceSourceItem[];
  defaultSourceId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (artifact: any) => void;
}

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
  const [customTitle, setCustomTitle] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [audioLength, setAudioLength] = useState<3 | 5>(5);
  const [podcastType, setPodcastType] = useState('');
  const [audioMood, setAudioMood] = useState('');
  const [processingNotice, setProcessingNotice] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (defaultSourceId) setSelectedSourceId(defaultSourceId);
      else if (sources[0]?.sourceId) setSelectedSourceId(sources[0].sourceId);
      setCustomTitle('');
      setUserPrompt('');
      setPodcastType('');
      setAudioMood('');
      setAudioLength(5);
      setProcessingNotice(null);
    }
  }, [isOpen, defaultSourceId, sources]);

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
        userPrompt: userPrompt.trim() || undefined,
        title: customTitle.trim() || undefined,
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

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative overflow-hidden"
        style={{ border: `1px solid ${colors.hairlineStrong}` }}
      >
        <div className="h-1 w-full absolute top-0 left-0 right-0 bg-rose-600" />

        {/* Header */}
        <div className="flex justify-between items-start border-b pb-3.5" style={{ borderColor: colors.hairline }}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs bg-rose-600 text-white">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-[#14171A] text-sm" style={serif}>
                Generate Audio Overview Script
              </h3>
              <p className="text-[11px] text-[#5C6169] leading-tight mt-0.5">
                Produce a 2-host conversational podcast dialogue exploring key themes with simulated audio playback.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isPending}
            className="text-[#93968F] hover:text-[#14171A] p-1 rounded-full hover:bg-gray-100 transition cursor-pointer disabled:opacity-40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Target Source Document */}
          {sources.length > 0 && (
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-[#5C6169] uppercase tracking-wider" style={mono}>
                Target Knowledge Source
              </label>
              <select
                value={selectedSourceId}
                onChange={(e) => setSelectedSourceId(e.target.value)}
                className="w-full bg-[#F5F6F4] rounded-xl px-3 py-2 text-xs text-[#14171A] font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20 cursor-pointer"
                style={{ border: `1px solid ${colors.hairlineStrong}` }}
              >
                {sources.map((s) => (
                  <option key={s.sourceId} value={s.sourceId}>
                    {s.title} ({s.sourceType.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Episode Duration Dropdown */}
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono font-bold text-[#5C6169] uppercase tracking-wider" style={mono}>
                Episode Duration
              </label>
              <span className="text-[11px] font-mono font-bold text-rose-600 flex items-center gap-1" style={mono}>
                <Clock className="w-3 h-3" />
                {audioLength} Minutes
              </span>
            </div>
            <select
              value={audioLength}
              onChange={(e) => setAudioLength(Number(e.target.value) as 3 | 5)}
              className="w-full bg-[#F5F6F4] rounded-xl px-3 py-2 text-xs text-[#14171A] font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20 cursor-pointer"
              style={{ border: `1px solid ${colors.hairlineStrong}` }}
            >
              <option value={3}>3 Minutes (Focused & High Density)</option>
              <option value={5}>5 Minutes (Extended Deep Dive)</option>
            </select>
            <p className="text-[10px] text-[#5C6169] leading-tight">
              Controls dialogue turn count (~18 turns for 3m, ~28 turns for 5m) and spoken detail.
            </p>
          </div>

          {/* Podcast Format Free-Text Input */}
          <div className="space-y-1 text-xs">
            <label className="text-[10px] font-mono font-bold text-[#5C6169] uppercase tracking-wider" style={mono}>
              Podcast Format & Style (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Debate & Critique, Technical Deep-Dive, Casual Banter, Storytelling"
              value={podcastType}
              onChange={(e) => setPodcastType(e.target.value)}
              className="w-full bg-[#F5F6F4] rounded-xl px-3.5 py-2 text-xs text-[#14171A] placeholder:text-[#93968F] focus:outline-none font-sans"
              style={{ border: `1px solid ${colors.hairlineStrong}` }}
            />
            <p className="text-[10px] text-[#5C6169] leading-tight">
              Defines how the hosts interact (e.g. opposing debate, technical walkthrough, casual coffee chat).
            </p>
          </div>

          {/* Mood & Atmosphere Free-Text Input */}
          <div className="space-y-1 text-xs">
            <label className="text-[10px] font-mono font-bold text-[#5C6169] uppercase tracking-wider" style={mono}>
              Vocal Mood & Atmosphere (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Humorous & Witty, Intense & Provocative, Analytical & Rigorous, Engaging & Lively"
              value={audioMood}
              onChange={(e) => setAudioMood(e.target.value)}
              className="w-full bg-[#F5F6F4] rounded-xl px-3.5 py-2 text-xs text-[#14171A] placeholder:text-[#93968F] focus:outline-none font-sans"
              style={{ border: `1px solid ${colors.hairlineStrong}` }}
            />
            <p className="text-[10px] text-[#5C6169] leading-tight">
              Sets the emotional energy, pacing, and vocabulary of both hosts throughout the conversation.
            </p>
          </div>

          {/* Custom Focus Prompt */}
          <div className="space-y-1 text-xs">
            <label className="text-[10px] font-mono text-[#5C6169] font-bold uppercase" style={mono}>
              Custom Focus / Prompt (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Focus on character relationships, trade-offs, or specific section questions..."
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              className="w-full bg-[#F5F6F4] rounded-xl px-3.5 py-2 text-xs text-[#14171A] placeholder:text-[#93968F] focus:outline-none font-sans resize-none"
              style={{ border: `1px solid ${colors.hairlineStrong}` }}
            />
          </div>

          {/* Optional Title */}
          <div className="space-y-1 text-xs">
            <label className="text-[10px] font-mono text-[#5C6169] font-bold uppercase" style={mono}>
              Custom Title (Optional)
            </label>
            <input
              type="text"
              placeholder={`e.g. ${sources.find((s) => s.sourceId === selectedSourceId)?.title || 'Knowledge'} Audio Overview`}
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full bg-[#F5F6F4] rounded-xl px-3.5 py-2 text-xs text-[#14171A] placeholder:text-[#93968F] focus:outline-none font-sans"
              style={{ border: `1px solid ${colors.hairlineStrong}` }}
            />
          </div>

          {/* Background Processing Notice */}
          {processingNotice && (
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 space-y-1 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 font-bold text-xs">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-700 shrink-0" />
                <span>Outline Generation in Progress</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-snug">
                {processingNotice}
              </p>
            </div>
          )}

          {error && (
            <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200 font-mono" style={mono}>
              {error.message}
            </p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2 text-xs border-t" style={{ borderColor: colors.hairline }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 text-[#5C6169] hover:text-[#14171A] cursor-pointer disabled:opacity-40 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2.5 text-white font-semibold rounded-full text-xs shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer flex items-center space-x-1.5 disabled:opacity-50"
              style={{ background: colors.verified }}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Audio Overview</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
