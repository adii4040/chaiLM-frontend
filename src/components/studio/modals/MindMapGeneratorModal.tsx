import React, { useState, useEffect } from 'react';
import { Network, Loader2, X, Sparkles } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import type { WorkspaceSourceItem } from '../../../modules/workspace/dto/workspaceDto';
import { useGenerateMindMap } from '../../../modules/studio/mutation';
import { QUERY_KEY_WORKSPACE_DATA } from '../../../modules/workspace/constants';
import { SourceDropdown } from './SourceDropdown';

export interface MindMapGeneratorModalProps {
  workspaceId: string;
  sources: WorkspaceSourceItem[];
  defaultSourceId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (artifact: any) => void;
}

export function MindMapGeneratorModal({
  workspaceId,
  sources,
  defaultSourceId,
  isOpen,
  onClose,
  onSuccess,
}: MindMapGeneratorModalProps) {
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

  const { mutate: generateMindMap, isPending, error } = useGenerateMindMap();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPending) return;
    setProcessingNotice(null);

    generateMindMap(
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

  const activeSource = sources.find((s) => s.sourceId === selectedSourceId);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-[28px] max-w-[560px] w-full p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh] border border-gray-100">
        
        {/* Header */}
        <div className="flex justify-between items-start shrink-0">
          <div className="flex items-start space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Network className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
                Generate Mind Map
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
                Build an expandable multi-level conceptual tree mapping all sections of your source document.
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
          
          {/* Custom Source Dropdown */}
          <SourceDropdown
            sources={sources}
            selectedSourceId={selectedSourceId}
            onSelect={setSelectedSourceId}
            accentColor="purple"
          />

          {/* User Custom Focus */}
          <div className="space-y-1.5">
            <label className="font-semibold text-gray-900 text-xs sm:text-sm block">
              Custom Focus / Prompt{' '}
              <span className="text-gray-400 font-normal text-xs">(Optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Focus on taxonomy hierarchies, workflow branches, or specific modules..."
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              className="w-full bg-white border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 resize-none transition"
            />
          </div>

          {/* Optional Title */}
          <div className="space-y-1.5">
            <label className="font-semibold text-gray-900 text-xs sm:text-sm block">
              Custom Title{' '}
              <span className="text-gray-400 font-normal text-xs">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder={`e.g. ${activeSource?.title || 'Knowledge'} Mind Map`}
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full bg-white border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 transition"
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
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm hover:shadow transition flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Mind Map</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
