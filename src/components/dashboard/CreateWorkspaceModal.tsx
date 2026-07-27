import React, { useState } from 'react';
import { FolderPlus, X, ArrowRight } from 'lucide-react';

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export default function CreateWorkspaceModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateWorkspaceModalProps) {
  const [newTitle, setNewTitle] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-chailm-panel border border-chailm-border rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative overflow-hidden">
        {/* Brand Top Line */}
        <div className="brand-gradient-bar h-1 w-full absolute top-0 left-0"></div>

        <div className="flex items-center justify-between border-b border-chailm-border pb-3">
          <div className="flex items-center space-x-2">
            <FolderPlus className="w-4 h-4 text-chailm-accentBlue" />
            <h3 className="font-semibold text-chailm-textMain text-sm">Create New Workspace</h3>
          </div>
          <button
            onClick={onClose}
            className="text-chailm-textMuted hover:text-chailm-textMain cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-chailm-textMuted mb-1 font-mono text-[11px]">
              Workspace Title
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Legal Research & Transcripts"
              className="w-full px-4 py-2.5 bg-chailm-bg border border-chailm-border rounded-xl text-chailm-textMain placeholder-chailm-textMuted focus:outline-none focus:border-chailm-accentBlue font-sans text-xs"
              autoFocus
            />
          </div>

          <p className="text-[11px] text-chailm-textMuted leading-relaxed">
            Creating a new workspace generates an isolated grounding context session. You can index YouTube videos and PDF documents inside.
          </p>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-chailm-textMuted hover:text-chailm-textMain text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-chailm-accentBlue/10 hover:bg-chailm-accentBlue/20 text-chailm-accentBlue font-medium rounded-full text-xs border border-chailm-accentBlue/30 transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <span>Create Session</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
