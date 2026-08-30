import React, { useState } from 'react';
import {
  FileText,
  Video,
  Globe,
  Loader2,
  X,
  UploadCloud,
} from 'lucide-react';
import type { SourceType } from '../modules/indexer/dto/indexerDto';
import { useIndexDocument } from '../modules/indexer/mutation/useIndexDocument';
import { colors, mono, serif } from './landing/tokens';

interface AddSourceModalProps {
  workspaceId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddSourceModal({
  workspaceId,
  isOpen,
  onClose,
  onSuccess,
}: AddSourceModalProps) {
  const [indexType, setIndexType] = useState<SourceType>('pdf');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const { mutate: indexDocument, isPending: isIndexing, error: indexError } = useIndexDocument();

  if (!isOpen) return null;

  const handleIndexSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (indexType === 'pdf') {
      if (!file) return alert('Please select a PDF file');
      indexDocument(
        { type: 'pdf', file, workspaceId },
        {
          onSuccess: () => {
            setFile(null);
            onSuccess();
            onClose();
          },
        }
      );
    } else {
      if (!url.trim()) return alert('Please enter a valid URL');
      indexDocument(
        { type: indexType, url: url.trim(), workspaceId },
        {
          onSuccess: () => {
            setUrl('');
            onSuccess();
            onClose();
          },
        }
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/45 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative overflow-hidden"
        style={{ border: `1px solid ${colors.hairlineStrong}` }}
      >
        {/* Top Verified Accent Line */}
        <div className="h-1.5 w-full bg-[#1F7A5C] absolute top-0 left-0 right-0" />

        <div className="flex justify-between items-start border-b pb-3.5" style={{ borderColor: colors.hairline }}>
          <div>
            <h3 className="font-bold text-[#14171A] text-base" style={serif}>
              Ingest Knowledge Source
            </h3>
            <p className="text-xs text-[#5C6169] mt-0.5">
              Ground this workspace with verifiable multi-modal sources.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#93968F] hover:text-[#14171A] p-1.5 rounded-full hover:bg-gray-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleIndexSubmit} className="space-y-4 text-xs">
          {/* Type Switcher Tabs */}
          <div
            className="flex gap-1.5 p-1 rounded-2xl bg-[#F5F6F4]"
            style={{ border: `1px solid ${colors.hairline}` }}
          >
            {(['pdf', 'youtube', 'website'] as SourceType[]).map((t) => {
              const isActive = indexType === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setIndexType(t)}
                  className={`flex-1 py-2 rounded-xl capitalize font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs ${
                    isActive
                      ? 'bg-white shadow-xs text-[#14171A]'
                      : 'text-[#5C6169] hover:text-[#14171A]'
                  }`}
                >
                  {t === 'youtube' && <Video className="w-4 h-4 text-red-600" />}
                  {t === 'pdf' && <FileText className="w-4 h-4 text-amber-600" />}
                  {t === 'website' && <Globe className="w-4 h-4 text-blue-600" />}
                  <span>{t}</span>
                </button>
              );
            })}
          </div>

          {/* PDF File Upload Zone */}
          {indexType === 'pdf' ? (
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5C6169]" style={mono}>
                Upload PDF Document
              </label>
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#CBCFC9] hover:border-[#1F7A5C] bg-[#FAFBF9] hover:bg-white rounded-2xl cursor-pointer transition-all duration-200 group">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-5 h-5" />
                </div>
                {file ? (
                  <div className="text-center space-y-1">
                    <p className="text-xs font-bold text-[#14171A] truncate max-w-[280px]">
                      {file.name}
                    </p>
                    <p className="text-[10px] font-mono text-[#1F7A5C] font-bold" style={mono}>
                      {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to Index
                    </p>
                  </div>
                ) : (
                  <div className="text-center space-y-1">
                    <p className="text-xs font-semibold text-[#14171A]">
                      Click to browse or drag &amp; drop
                    </p>
                    <p className="text-[10px] text-[#93968F] font-mono" style={mono}>
                      PDF files up to 50MB
                    </p>
                  </div>
                )}
              </label>
            </div>
          ) : indexType === 'youtube' ? (
            /* YouTube Video URL Input */
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5C6169]" style={mono}>
                YouTube Video URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-[#FAFBF9] focus:bg-white rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#14171A] placeholder:text-[#93968F] focus:outline-none focus:ring-2 focus:ring-[#1F7A5C]/20 font-mono"
                  style={{ border: `1px solid ${colors.hairlineStrong}` }}
                />
                <Video className="w-4 h-4 text-red-500 absolute left-3.5 top-3" />
              </div>
              <p className="text-[11px] text-[#5C6169] leading-relaxed">
                Auto-fetches English audio transcripts and builds clickable timestamp citations.
              </p>
            </div>
          ) : (
            /* Website URL Input */
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5C6169]" style={mono}>
                Website URL (Firecrawl Engine)
              </label>
              <div className="relative">
                <input
                  type="url"
                  placeholder="https://arxiv.org/abs/2205.14135"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-[#FAFBF9] focus:bg-white rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#14171A] placeholder:text-[#93968F] focus:outline-none focus:ring-2 focus:ring-[#1F7A5C]/20 font-mono"
                  style={{ border: `1px solid ${colors.hairlineStrong}` }}
                />
                <Globe className="w-4 h-4 text-blue-500 absolute left-3.5 top-3" />
              </div>
              <p className="text-[11px] text-[#5C6169] leading-relaxed">
                Parses and vectorizes clean markdown content with Firecrawl.
              </p>
            </div>
          )}

          {indexError && (
            <p className="text-xs text-red-700 bg-red-50 p-2.5 rounded-xl border border-red-200 font-mono" style={mono}>
              {indexError.message}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t" style={{ borderColor: colors.hairline }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isIndexing}
              className="px-4 py-2 text-[#5C6169] hover:text-[#14171A] font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isIndexing || (indexType === 'pdf' ? !file : !url.trim())}
              className="px-5 py-2.5 text-white font-semibold rounded-full text-xs shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer flex items-center space-x-1.5 disabled:opacity-50"
              style={{ background: colors.verified }}
            >
              {isIndexing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Vectorizing...</span>
                </>
              ) : (
                <span>Index Source</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
