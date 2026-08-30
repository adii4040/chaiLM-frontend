import React, { useState, useEffect } from 'react';
import { BookOpen, Layers, HelpCircle, Network, Mic, Loader2, X, Sparkles } from 'lucide-react';
import type { StudioArtifactType } from '../../modules/studio/dto/studioDto';
import type { WorkspaceSourceItem } from '../../modules/workspace/dto/workspaceDto';
import {
  useGenerateStudyGuide,
  useGenerateFlashcards,
  useGenerateQuiz,
  useGenerateMindMap,
  useGenerateAudioOverview,
} from '../../modules/studio/mutation';
import { colors, mono, serif } from '../landing/tokens';

interface StudioGeneratorModalProps {
  workspaceId: string;
  sources: WorkspaceSourceItem[];
  artifactType: StudioArtifactType;
  defaultSourceId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (artifact: any) => void;
}

export default function StudioGeneratorModal({
  workspaceId,
  sources,
  artifactType,
  defaultSourceId,
  isOpen,
  onClose,
  onSuccess,
}: StudioGeneratorModalProps) {
  const [selectedSourceId, setSelectedSourceId] = useState<string>(
    defaultSourceId || sources[0]?.sourceId || ''
  );
  const [customTitle, setCustomTitle] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [cardCount, setCardCount] = useState(15);
  const [questionCount, setQuestionCount] = useState(10);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  // Synchronize default source
  useEffect(() => {
    if (isOpen) {
      if (defaultSourceId) setSelectedSourceId(defaultSourceId);
      else if (sources[0]?.sourceId) setSelectedSourceId(sources[0].sourceId);
      setCustomTitle('');
      setUserPrompt('');
    }
  }, [isOpen, defaultSourceId, sources]);

  const { mutate: generateStudyGuide, isPending: isGuideLoading, error: guideError } = useGenerateStudyGuide();
  const { mutate: generateFlashcards, isPending: isFlashLoading, error: flashError } = useGenerateFlashcards();
  const { mutate: generateQuiz, isPending: isQuizLoading, error: quizError } = useGenerateQuiz();
  const { mutate: generateMindMap, isPending: isMapLoading, error: mapError } = useGenerateMindMap();
  const { mutate: generateAudioOverview, isPending: isAudioLoading, error: audioError } = useGenerateAudioOverview();

  const isPending = isGuideLoading || isFlashLoading || isQuizLoading || isMapLoading || isAudioLoading;
  const currentError = guideError || flashError || quizError || mapError || audioError;

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPending) return;

    const basePayload = {
      workspaceId,
      sourceId: selectedSourceId || undefined,
      userPrompt: userPrompt.trim() || undefined,
      title: customTitle.trim() || undefined,
    };

    const handleCallback = {
      onSuccess: (res: any) => {
        onSuccess(res.artifact);
        onClose();
      },
    };

    switch (artifactType) {
      case 'study_guide':
        generateStudyGuide(basePayload, handleCallback);
        break;
      case 'flashcards':
        generateFlashcards({ ...basePayload, cardCount: Number(cardCount) }, handleCallback);
        break;
      case 'quiz':
        generateQuiz({ ...basePayload, questionCount: Number(questionCount), difficulty }, handleCallback);
        break;
      case 'mindmap':
        generateMindMap(basePayload, handleCallback);
        break;
      case 'audio_overview':
        generateAudioOverview(basePayload, handleCallback);
        break;
    }
  };

  const featureMetadata: Record<
    StudioArtifactType,
    { label: string; icon: any; desc: string; colorBg: string; borderTop: string }
  > = {
    study_guide: {
      label: 'Study Guide',
      icon: BookOpen,
      desc: 'Synthesize executive summaries, thematic chapter modules, key takeaways, and domain glossaries.',
      colorBg: 'bg-blue-600 text-white',
      borderTop: 'bg-blue-600',
    },
    flashcards: {
      label: 'Flashcard Deck',
      icon: Layers,
      desc: 'Generate active recall question-answer cards with hints, citations, and difficulty tracking.',
      colorBg: 'bg-amber-600 text-white',
      borderTop: 'bg-amber-600',
    },
    quiz: {
      label: 'Assessment Quiz',
      icon: HelpCircle,
      desc: 'Create an interactive test with multiple-choice options, answers, and comprehensive explanations.',
      colorBg: 'bg-[#1F7A5C] text-white',
      borderTop: 'bg-[#1F7A5C]',
    },
    mindmap: {
      label: 'Hierarchical Mind Map',
      icon: Network,
      desc: 'Build an expandable multi-level conceptual tree mapping all sections of your source document.',
      colorBg: 'bg-purple-600 text-white',
      borderTop: 'bg-purple-600',
    },
    audio_overview: {
      label: 'Audio Overview Script',
      icon: Mic,
      desc: 'Produce a 2-host conversational podcast dialogue exploring key themes with simulated audio playback.',
      colorBg: 'bg-rose-600 text-white',
      borderTop: 'bg-rose-600',
    },
  };

  const currentMeta = featureMetadata[artifactType] || featureMetadata.study_guide;
  const FeatureIcon = currentMeta.icon;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative overflow-hidden"
        style={{ border: `1px solid ${colors.hairlineStrong}` }}
      >
        <div className={`h-1 w-full absolute top-0 left-0 right-0 ${currentMeta.borderTop}`} />

        {/* Modal Header */}
        <div className="flex justify-between items-start border-b pb-3.5" style={{ borderColor: colors.hairline }}>
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${currentMeta.colorBg}`}>
              <FeatureIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-[#14171A] text-sm" style={serif}>
                Generate {currentMeta.label}
              </h3>
              <p className="text-[11px] text-[#5C6169] leading-tight mt-0.5">
                {currentMeta.desc}
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
                className="w-full bg-[#F5F6F4] rounded-xl px-3 py-2 text-xs text-[#14171A] font-semibold focus:outline-none focus:ring-2 focus:ring-[#1F7A5C]/20 cursor-pointer"
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

          {/* Flashcard Specific Options */}
          {artifactType === 'flashcards' && (
            <div className="space-y-1.5 animate-in fade-in duration-150">
              <label className="text-[10px] font-mono font-bold text-[#5C6169] uppercase tracking-wider" style={mono}>
                Number of Cards
              </label>
              <div className="flex items-center gap-1.5">
                {[5, 10, 15, 20, 30].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setCardCount(count)}
                    className={`flex-1 py-1.5 rounded-xl border text-xs font-mono font-bold transition cursor-pointer ${
                      cardCount === count
                        ? 'bg-amber-100 border-amber-300 text-amber-800 shadow-xs'
                        : 'bg-[#F5F6F4] border-[#E2E4E1] text-[#5C6169] hover:text-[#14171A]'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quiz Specific Options */}
          {artifactType === 'quiz' && (
            <div className="space-y-2 animate-in fade-in duration-150">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono font-bold text-[#5C6169] uppercase tracking-wider" style={mono}>
                    Number of Questions
                  </label>
                  <span className="text-[11px] font-mono font-bold text-[#1F7A5C]" style={mono}>
                    {questionCount} Questions
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {[3, 5, 10, 15, 20].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setQuestionCount(num)}
                      className={`flex-1 py-1.5 rounded-xl border text-xs font-mono font-bold transition cursor-pointer ${
                        questionCount === num
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-800 shadow-xs'
                          : 'bg-[#F5F6F4] border-[#E2E4E1] text-[#5C6169] hover:text-[#14171A]'
                      }`}
                    >
                      {num} Qs
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1 text-xs">
                  <label className="text-[10px] font-mono text-[#5C6169] font-bold" style={mono}>Custom Count (3–25)</label>
                  <input
                    type="number"
                    min="3"
                    max="25"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="w-full bg-[#F5F6F4] rounded-xl px-3 py-1.5 text-xs text-[#14171A] font-mono focus:outline-none"
                    style={{ border: `1px solid ${colors.hairlineStrong}` }}
                  />
                </div>
                <div className="space-y-1 text-xs">
                  <label className="text-[10px] font-mono text-[#5C6169] font-bold" style={mono}>Difficulty Level</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full bg-[#F5F6F4] rounded-xl px-3 py-1.5 text-xs text-[#14171A] font-sans focus:outline-none cursor-pointer"
                    style={{ border: `1px solid ${colors.hairlineStrong}` }}
                  >
                    <option value="easy">Easy (Definitions)</option>
                    <option value="medium">Medium (Mechanics)</option>
                    <option value="hard">Hard (Trade-offs)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* User Custom Instructions / Prompt */}
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
              placeholder={`e.g. ${sources.find((s) => s.sourceId === selectedSourceId)?.title || 'Knowledge'} ${currentMeta.label}`}
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full bg-[#F5F6F4] rounded-xl px-3.5 py-2 text-xs text-[#14171A] placeholder:text-[#93968F] focus:outline-none font-sans"
              style={{ border: `1px solid ${colors.hairlineStrong}` }}
            />
          </div>

          {currentError && (
            <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200 font-mono" style={mono}>
              {currentError.message}
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
                  <span>Generate {currentMeta.label}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
