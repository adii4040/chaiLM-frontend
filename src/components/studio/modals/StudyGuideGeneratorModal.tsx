import React, { useState, useEffect } from 'react';
import { BookOpen, Loader2, X, Sparkles } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import type { WorkspaceSourceItem } from '../../../modules/workspace/dto/workspaceDto';
import { useGenerateStudyGuide } from '../../../modules/studio/mutation';
import { QUERY_KEY_WORKSPACE_DATA } from '../../../modules/workspace/constants';
import { colors, mono, serif } from '../../landing/tokens';

export interface StudyGuideGeneratorModalProps {
  workspaceId: string;
  sources: WorkspaceSourceItem[];
  defaultSourceId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (artifact: any) => void;
}

export function StudyGuideGeneratorModal({
  workspaceId,
  sources,
  defaultSourceId,
  isOpen,
  onClose,
  onSuccess,
}: StudyGuideGeneratorModalProps) {
  const queryClient = useQueryClient();
  const [selectedSourceId, setSelectedSourceId] = useState<string>(
    defaultSourceId || sources[0]?.sourceId || ''
  );
  const [customTitle, setCustomTitle] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [processingNotice, setProcessingNotice] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (defaultSourceId) setSelectedSourceId(defaultSourceId);
      else if (sources[0]?.sourceId) setSelectedSourceId(sources[0].sourceId);
      setCustomTitle('');
      setUserPrompt('');
      setProcessingNotice(null);
    }
  }, [isOpen, defaultSourceId, sources]);

  const { mutate: generateStudyGuide, isPending, error } = useGenerateStudyGuide();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPending) return;
    setProcessingNotice(null);

    generateStudyGuide(
      {
        workspaceId,
        sourceId: selectedSourceId || undefined,
        userPrompt: userPrompt.trim() || undefined,
        title: customTitle.trim() || undefined,
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
        <div className="h-1 w-full absolute top-0 left-0 right-0 bg-blue-600" />

        {/* Header */}
        <div className="flex justify-between items-start border-b pb-3.5" style={{ borderColor: colors.hairline }}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs bg-blue-600 text-white">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-[#14171A] text-sm" style={serif}>
                Generate Study Guide
              </h3>
              <p className="text-[11px] text-[#5C6169] leading-tight mt-0.5">
                Synthesize executive summaries, thematic chapter modules, key takeaways, and domain glossaries.
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
                className="w-full bg-[#F5F6F4] rounded-xl px-3 py-2 text-xs text-[#14171A] font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
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

          {/* User Custom Instructions */}
          <div className="space-y-1 text-xs">
            <label className="text-[10px] font-mono text-[#5C6169] font-bold uppercase" style={mono}>
              Custom Focus / Prompt (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Focus on practical takeaways, key concepts, or executive summary..."
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
              placeholder={`e.g. ${sources.find((s) => s.sourceId === selectedSourceId)?.title || 'Knowledge'} Study Guide`}
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
                  <span>Generate Study Guide</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
