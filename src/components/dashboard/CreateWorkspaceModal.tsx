import React, { useState } from 'react';
import { FolderPlus, X, ArrowRight, Loader2 } from 'lucide-react';
import { colors, serif, mono } from '../landing/tokens';

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string) => void;
  isSubmitting?: boolean;
}

export default function CreateWorkspaceModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}: CreateWorkspaceModalProps) {
  const [newTitle, setNewTitle] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const titleToSubmit = newTitle.trim() || 'Untitled Workspace';
    onSubmit(titleToSubmit);
    setNewTitle('');
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-md w-full p-7 space-y-6 shadow-2xl relative overflow-hidden text-left"
        style={{ border: `1px solid ${colors.hairlineStrong}` }}
      >
        {/* Brand Top Line */}
        <div className="h-1 w-full bg-[#1F7A5C] absolute top-0 left-0 right-0" />

        <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: colors.hairline }}>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: colors.verifiedSoft }}>
              <FolderPlus className="w-4 h-4 text-[#1F7A5C]" />
            </div>
            <h3 className="font-semibold text-lg text-[#14171A]" style={serif}>
              Create New Workspace
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-[#93968F] hover:text-[#14171A] p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block mb-1.5 font-semibold text-[11px] uppercase tracking-wider text-[#5C6169]" style={mono}>
              Workspace Title
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Stanford CS229 Attention Mechanics"
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-[#F5F6F4] rounded-xl text-[#14171A] placeholder:text-[#93968F] focus:outline-none focus:ring-2 focus:ring-[#1F7A5C]/20 transition-all font-sans text-xs"
              style={{ border: `1px solid ${colors.hairlineStrong}` }}
              autoFocus
            />
          </div>

          <p className="text-xs text-[#5C6169] leading-relaxed">
            Creating a new workspace generates an isolated grounding context session. You can index YouTube videos, PDF documents, and web articles inside without context bleed.
          </p>

          <div className="pt-3 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 text-[#5C6169] hover:text-[#14171A] text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-white font-medium rounded-full text-xs shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer flex items-center space-x-1.5 disabled:opacity-50"
              style={{ background: colors.verified }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <span>Create Session</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
