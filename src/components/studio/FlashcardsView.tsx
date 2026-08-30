import { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Lightbulb, Sparkles, Check, Bookmark } from 'lucide-react';
import type { FlashcardDeckData } from '../../modules/studio/dto/studioDto';
import { colors, mono } from '../landing/tokens';

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
      <div
        className="p-10 text-center bg-white rounded-3xl text-[#5C6169] text-xs shadow-xs"
        style={{ border: `1px dashed ${colors.hairlineStrong}` }}
      >
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
    easy: 'text-emerald-700 bg-emerald-100 border-emerald-300',
    medium: 'text-amber-800 bg-amber-100 border-amber-300',
    hard: 'text-rose-700 bg-rose-100 border-rose-300',
  };

  const progressPercent = Math.round(((currentIndex + 1) / cards.length) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Deck Stats & Progress Bar */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-mono text-[#5C6169]" style={mono}>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-[#14171A]">
              Card {currentIndex + 1} of {cards.length}
            </span>
            {isMastered && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1 font-bold">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
                <span>Mastered</span>
              </span>
            )}
          </div>
          <span className="font-bold">{masteredIds.length} / {cards.length} Mastered</span>
        </div>

        <div className="w-full bg-[#E2E4E1] h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#1F7A5C] h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Interactive Flashcard */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full min-h-[300px] md:min-h-[340px] bg-white rounded-3xl p-8 flex flex-col justify-between shadow-md cursor-pointer hover:border-[#1F7A5C] transition-all duration-300 group relative overflow-hidden select-none"
        style={{ border: `1.5px solid ${colors.hairlineStrong}` }}
      >
        {/* Top Accent line */}
        <div className="h-1 w-full bg-amber-500 absolute top-0 left-0 right-0" />

        {/* Card Header */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-[#5C6169] uppercase tracking-wider flex items-center space-x-1.5 font-bold" style={mono}>
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{isFlipped ? 'Answer' : 'Question / Prompt'}</span>
          </span>

          <div className="flex items-center space-x-2">
            <span
              className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold border ${
                difficultyColors[currentCard.difficulty || 'medium']
              }`}
              style={mono}
            >
              {currentCard.difficulty || 'medium'}
            </span>
          </div>
        </div>

        {/* Card Center Content */}
        <div className="my-auto py-6 text-center space-y-4">
          <p className="text-base md:text-xl font-bold text-[#14171A] leading-relaxed">
            {isFlipped ? currentCard.back : currentCard.front}
          </p>

          {!isFlipped && showHint && currentCard.hint && (
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-800 text-left space-y-1 animate-in fade-in">
              <div className="flex items-center space-x-1.5 font-mono text-[10px] uppercase font-bold" style={mono}>
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                <span>Hint:</span>
              </div>
              <p>{currentCard.hint}</p>
            </div>
          )}

          {isFlipped && currentCard.sourceReference && (
            <div className="pt-2">
              <span className="text-[10px] font-mono text-[#5C6169] bg-[#F5F6F4] px-2.5 py-1 rounded-full border border-[#CBCFC9]" style={mono}>
                Citation: {currentCard.sourceReference}
              </span>
            </div>
          )}
        </div>

        {/* Card Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t text-xs" style={{ borderColor: colors.hairline }}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowHint(!showHint);
            }}
            disabled={!currentCard.hint || isFlipped}
            className="text-[11px] font-mono text-[#5C6169] hover:text-[#14171A] flex items-center space-x-1.5 disabled:opacity-30 cursor-pointer font-bold"
            style={mono}
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
            <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
          </button>

          <span className="text-[10px] font-mono text-[#93968F]" style={mono}>
            Click card to flip
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleMastered();
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer ${
              isMastered
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-[#F5F6F4] text-[#5C6169] hover:text-[#14171A] border border-[#CBCFC9]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{isMastered ? 'Mastered' : 'Mark as Mastered'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={handlePrev}
          className="px-4 py-2 rounded-full bg-white hover:bg-[#F5F6F4] border border-[#CBCFC9] text-xs font-bold text-[#14171A] flex items-center space-x-1.5 transition cursor-pointer shadow-xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setIsFlipped(false);
            setShowHint(false);
          }}
          className="p-2 rounded-full bg-white hover:bg-[#F5F6F4] border border-[#CBCFC9] text-[#5C6169] hover:text-[#14171A] transition cursor-pointer shadow-xs"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4 text-amber-600" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="px-5 py-2 rounded-full text-white text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer shadow-xs hover:shadow-md"
          style={{ background: colors.verified }}
        >
          <span>Next Card</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
