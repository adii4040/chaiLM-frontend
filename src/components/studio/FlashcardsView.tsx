import { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Lightbulb, Sparkles, Check, Bookmark } from 'lucide-react';
import type { FlashcardDeckData } from '../../modules/studio/dto/studioDto';

interface FlashcardsViewProps {
  data: FlashcardDeckData;
}

export default function FlashcardsView({ data }: FlashcardsViewProps) {
  const cards = data.cards || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [masteredIds, setMasteredIds] = useState<number[]>([]);

  if (cards.length === 0) {
    return (
      <div className="p-8 text-center bg-chailm-panel border border-chailm-border rounded-3xl text-chailm-textMuted text-xs">
        No flashcards generated in this deck.
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const isMastered = masteredIds.includes(currentCard.id);

  const handleNext = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const toggleMastered = () => {
    setMasteredIds((prev) =>
      prev.includes(currentCard.id)
        ? prev.filter((id) => id !== currentCard.id)
        : [...prev, currentCard.id]
    );
  };

  const difficultyColors = {
    easy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    hard: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  };

  const progressPercent = Math.round(((currentIndex + 1) / cards.length) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Deck Stats & Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-chailm-textMuted">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-chailm-textMain">
              Card {currentIndex + 1} of {cards.length}
            </span>
            {isMastered && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
                <Check className="w-2.5 h-2.5" />
                <span>Mastered</span>
              </span>
            )}
          </div>
          <span>{masteredIds.length} / {cards.length} Mastered</span>
        </div>

        <div className="w-full bg-chailm-card h-1.5 rounded-full overflow-hidden border border-chailm-border">
          <div
            className="bg-chailm-accentBlue h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 3D-like Interactive Flashcard */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full min-h-[300px] md:min-h-[340px] bg-chailm-panel border border-chailm-border rounded-3xl p-8 flex flex-col justify-between shadow-xl cursor-pointer hover:border-chailm-accentBlue/40 transition-all group relative overflow-hidden select-none"
      >
        {/* Subtle Top Accent bar */}
        <div className="brand-gradient-bar h-1 w-full absolute top-0 left-0"></div>

        {/* Card Header */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-chailm-textMuted uppercase tracking-wider flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-chailm-accentBlue" />
            <span>{isFlipped ? 'Answer Side' : 'Question / Prompt'}</span>
          </span>

          <div className="flex items-center space-x-2">
            <span
              className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${
                difficultyColors[currentCard.difficulty || 'medium']
              }`}
            >
              {currentCard.difficulty || 'medium'}
            </span>
            {currentCard.sourceReference && (
              <span className="text-[10px] font-mono text-chailm-textMuted bg-chailm-card px-2 py-0.5 rounded-full border border-chailm-border">
                {currentCard.sourceReference}
              </span>
            )}
          </div>
        </div>

        {/* Card Core Content */}
        <div className="py-6 my-auto text-center space-y-4">
          {!isFlipped ? (
            <h2 className="text-base md:text-lg font-medium text-chailm-textMain leading-relaxed">
              {currentCard.front}
            </h2>
          ) : (
            <div className="space-y-3 animate-in fade-in duration-200">
              <p className="text-sm md:text-base text-chailm-textMain leading-relaxed">
                {currentCard.back}
              </p>
            </div>
          )}
        </div>

        {/* Card Footer / Flip Reminder */}
        <div className="flex items-center justify-between text-xs text-chailm-textMuted pt-4 border-t border-chailm-border/50">
          {currentCard.hint && !isFlipped ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowHint(!showHint);
              }}
              className="text-[11px] text-amber-400 hover:underline flex items-center space-x-1 font-mono cursor-pointer"
            >
              <Lightbulb className="w-3 h-3" />
              <span>{showHint ? currentCard.hint : 'Reveal Hint'}</span>
            </button>
          ) : (
            <span></span>
          )}

          <span className="text-[10px] font-mono text-chailm-textMuted group-hover:text-chailm-accentBlue transition">
            Click anywhere to {isFlipped ? 'view prompt' : 'flip answer'} ↵
          </span>
        </div>
      </div>

      {/* Bottom Action Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={toggleMastered}
          className={`px-4 py-2 rounded-2xl text-xs font-medium border transition-all flex items-center space-x-1.5 cursor-pointer ${
            isMastered
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
              : 'bg-chailm-card hover:bg-chailm-hover border-chailm-border text-chailm-textMuted hover:text-chailm-textMain'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>{isMastered ? 'Mastered' : 'Mark as Mastered'}</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handlePrev}
            className="p-2.5 rounded-full bg-chailm-card hover:bg-chailm-hover border border-chailm-border text-chailm-textMain transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsFlipped(!isFlipped)}
            className="px-4 py-2 rounded-full bg-chailm-card hover:bg-chailm-hover border border-chailm-border text-xs text-chailm-textMain flex items-center space-x-1 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Flip</span>
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="p-2.5 rounded-full bg-chailm-accentBlue/10 hover:bg-chailm-accentBlue/20 border border-chailm-accentBlue/30 text-chailm-accentBlue transition cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
