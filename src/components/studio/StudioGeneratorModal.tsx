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

  const featureMetadata: Record<StudioArtifactType, { label: string; icon: any; desc: string }> = {
    study_guide: {
      label: 'Study Guide',
      icon: BookOpen,
      desc: 'Synthesize executive summaries, thematic chapter modules, key takeaways, and domain glossaries.',
    },
    flashcards: {
      label: 'Flashcard Deck',
      icon: Layers,
      desc: 'Generate active recall question-answer cards with hints, citations, and difficulty tracking.',
    },
    quiz: {
      label: 'Assessment Quiz',
      icon: HelpCircle,
      desc: 'Create an interactive test with multiple-choice options, answers, and comprehensive explanations.',
    },
    mindmap: {
      label: 'Hierarchical Mind Map',
      icon: Network,
      desc: 'Build an expandable multi-level conceptual tree mapping all sections of your source document.',
    },
    audio_overview: {
      label: 'Audio Overview Script',
      icon: Mic,
      desc: 'Produce a 2-host conversational podcast dialogue exploring key themes with simulated audio playback.',
    },
  };

  const currentMeta = featureMetadata[artifactType] || featureMetadata.study_guide;
  const FeatureIcon = currentMeta.icon;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-chailm-panel border border-chailm-border rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative overflow-hidden">
        <div className="brand-gradient-bar h-1 w-full absolute top-0 left-0"></div>

        {/* Modal Header for Selected Feature */}
        <div className="flex justify-between items-start border-b border-chailm-border pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-chailm-accentBlue/10 border border-chailm-accentBlue/20 text-chailm-accentBlue">
              <FeatureIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-chailm-textMain text-sm">
                Generate {currentMeta.label}
              </h3>
              <p className="text-[11px] text-chailm-textMuted leading-tight mt-0.5">
                {currentMeta.desc}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isPending}
            className="text-chailm-textMuted hover:text-chailm-textMain cursor-pointer disabled:opacity-40 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Target Source Document */}
          {sources.length > 0 && (
            <div className="space-y-1 text-xs">
              <label className="text-[11px] font-mono text-chailm-textMuted uppercase tracking-wider">
                Target Knowledge Source
              </label>
              <select
                value={selectedSourceId}
                onChange={(e) => setSelectedSourceId(e.target.value)}
                className="w-full bg-chailm-bg border border-chailm-border rounded-xl px-3 py-2 text-xs text-chailm-textMain focus:outline-none focus:border-chailm-accentBlue font-sans"
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
            <div className="space-y-1.5 text-xs animate-in fade-in duration-150">
              <label className="text-[11px] font-mono text-chailm-textMuted uppercase tracking-wider">
                Number of Cards
              </label>
              <div className="flex items-center gap-1.5">
                {[5, 10, 15, 20, 30].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setCardCount(count)}
                    className={`flex-1 py-1 rounded-xl border text-xs font-mono font-medium transition cursor-pointer ${
                      cardCount === count
                        ? 'bg-chailm-card border-chailm-accentBlue text-chailm-accentBlue font-bold shadow-xs'
                        : 'bg-chailm-bg border-chailm-border text-chailm-textMuted hover:text-chailm-textMain'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quiz Specific Options: Prominent Number of Questions & Difficulty */}
          {artifactType === 'quiz' && (
            <div className="space-y-2 animate-in fade-in duration-150">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono text-chailm-textMuted uppercase tracking-wider">
                    Number of Questions
                  </label>
                  <span className="text-[11px] font-mono font-bold text-chailm-accentBlue">
                    {questionCount} Questions
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {[3, 5, 10, 15, 20].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setQuestionCount(num)}
                      className={`flex-1 py-1.5 rounded-xl border text-xs font-mono font-medium transition cursor-pointer ${
                        questionCount === num
                          ? 'bg-chailm-card border-chailm-accentBlue text-chailm-accentBlue font-bold shadow-xs'
                          : 'bg-chailm-bg border-chailm-border text-chailm-textMuted hover:text-chailm-textMain'
                      }`}
                    >
                      {num} Qs
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1 text-xs">
                  <label className="text-[10px] font-mono text-chailm-textMuted">Custom Count (3–25)</label>
                  <input
                    type="number"
                    min="3"
                    max="25"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="w-full bg-chailm-bg border border-chailm-border rounded-xl px-3 py-1.5 text-xs text-chailm-textMain font-mono focus:outline-none focus:border-chailm-accentBlue"
                  />
                </div>
                <div className="space-y-1 text-xs">
                  <label className="text-[10px] font-mono text-chailm-textMuted">Difficulty Level</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full bg-chailm-bg border border-chailm-border rounded-xl px-3 py-1.5 text-xs text-chailm-textMain font-sans focus:outline-none focus:border-chailm-accentBlue"
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
            <label className="text-[11px] font-mono text-chailm-textMuted">
              Custom Focus / Prompt (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Focus on character relationships, trade-offs, or specific section questions..."
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              className="w-full bg-chailm-bg border border-chailm-border rounded-xl px-3 py-2 text-xs text-chailm-textMain placeholder-chailm-textMuted focus:outline-none focus:border-chailm-accentBlue font-sans resize-none"
            />
          </div>

          {/* Optional Title */}
          <div className="space-y-1 text-xs">
            <label className="text-[11px] font-mono text-chailm-textMuted">
              Custom Title (Optional)
            </label>
            <input
              type="text"
              placeholder={`e.g. ${sources.find((s) => s.sourceId === selectedSourceId)?.title || 'Knowledge'} ${currentMeta.label}`}
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full bg-chailm-bg border border-chailm-border rounded-xl px-3 py-2 text-xs text-chailm-textMain placeholder-chailm-textMuted focus:outline-none focus:border-chailm-accentBlue font-sans"
            />
          </div>

          {currentError && (
            <p className="text-xs text-rose-400 bg-rose-950/40 p-2.5 rounded-xl border border-rose-900 font-mono">
              {currentError.message}
            </p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2 text-xs border-t border-chailm-border/60">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 text-chailm-textMuted hover:text-chailm-textMain cursor-pointer disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2 bg-chailm-accentBlue/10 hover:bg-chailm-accentBlue/20 text-chailm-accentBlue font-medium rounded-full border border-chailm-accentBlue/30 transition cursor-pointer flex items-center space-x-2 disabled:opacity-50"
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
