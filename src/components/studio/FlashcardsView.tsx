import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  Check,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Lightbulb,
  Clock,
  HelpCircle,
} from 'lucide-react';
import type { FlashcardDeckData } from '../../modules/studio/dto/studioDto';
import { colors, mono } from '../landing/tokens';

interface FlashcardsViewProps {
  data: FlashcardDeckData;
}

// Built-in Lightweight Canvas Confetti Generator
function triggerConfetti(
  particleCount = 50,
  originY = 0.7,
  colorsArray = ['#10B981', '#F59E0B', '#34D399', '#FBBF24', '#6366F1']
) {
  if (typeof window === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return;
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles: Array<{
    x: number;
    y: number;
    size: number;
    color: string;
    speedX: number;
    speedY: number;
    rotation: number;
    rotationSpeed: number;
    opacity: number;
  }> = [];

  const startX = canvas.width / 2;
  const startY = canvas.height * originY;

  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.random() * 120 - 60 - 90) * (Math.PI / 180);
    const speed = Math.random() * 12 + 6;
    particles.push({
      x: startX + (Math.random() * 60 - 30),
      y: startY,
      size: Math.random() * 8 + 4,
      color: colorsArray[Math.floor(Math.random() * colorsArray.length)],
      speedX: Math.cos(angle) * speed,
      speedY: Math.sin(angle) * speed,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 8 - 4,
      opacity: 1,
    });
  }

  let animationFrameId: number;

  function render() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let activeParticles = 0;

    particles.forEach((p) => {
      if (p.opacity <= 0) return;
      activeParticles++;

      p.x += p.speedX;
      p.y += p.speedY;
      p.speedY += 0.35;
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.014;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });

    if (activeParticles > 0) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(animationFrameId);
      canvas.remove();
    }
  }

  render();
}

export default function FlashcardsView({ data }: FlashcardsViewProps) {
  const rawCards = data?.cards || [];
  const cards = rawCards.map((c, idx) => ({
    id: c.id ?? idx + 1,
    front: c.front || 'Question',
    back: c.back || 'Answer',
    hint: c.hint || '',
    difficulty: (c.difficulty || 'medium').toLowerCase() as 'easy' | 'medium' | 'hard',
    sourceReference: c.sourceReference || '',
  }));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHintVisible, setIsHintVisible] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'none' | 'next' | 'prev'>('none');

  const stageRef = useRef<HTMLDivElement | null>(null);
  const tiltBoxRef = useRef<HTMLDivElement | null>(null);
  const flipperRef = useRef<HTMLDivElement | null>(null);

  const currentCard = cards[currentIndex] || {
    id: 1,
    front: 'No flashcard available',
    back: 'Please generate a deck.',
    hint: '',
    difficulty: 'medium' as const,
    sourceReference: '',
  };

  // Parallax Cursor 3D Tilt Effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current || !tiltBoxRef.current || window.innerWidth < 768) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    if (flipperRef.current) {
      flipperRef.current.style.setProperty('--glare-x', `${glareX}%`);
      flipperRef.current.style.setProperty('--glare-y', `${glareY}%`);
    }

    tiltBoxRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const resetTilt = () => {
    if (tiltBoxRef.current) {
      tiltBoxRef.current.style.transform = 'rotateX(0deg) rotateY(0deg)';
    }
  };

  const handleFlip = useCallback(
    (e?: React.MouseEvent | KeyboardEvent) => {
      if (e && (e.target as HTMLElement).closest && (e.target as HTMLElement).closest('.interactive-btn')) {
        return;
      }
      setIsFlipped((prev) => !prev);
      setIsHintVisible(false);
    },
    []
  );

  const handleNext = useCallback(() => {
    if (cards.length === 0) return;
    setIsFlipped(false);
    setIsHintVisible(false);
    resetTilt();

    setSlideDirection('next');
    setTimeout(() => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        // Deck completed celebration
        triggerConfetti(100, 0.5);
      }
      setSlideDirection('none');
    }, 180);
  }, [cards.length, currentIndex]);

  const handlePrev = useCallback(() => {
    if (currentIndex === 0 || cards.length === 0) return;
    setIsFlipped(false);
    setIsHintVisible(false);
    resetTilt();

    setSlideDirection('prev');
    setTimeout(() => {
      setCurrentIndex((prev) => Math.max(0, prev - 1));
      setSlideDirection('none');
    }, 180);
  }, [cards.length, currentIndex]);

  const toggleHint = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsHintVisible((prev) => !prev);
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        if (!isFlipped && currentCard.hint) {
          setIsHintVisible((prev) => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlip, handleNext, handlePrev, isFlipped, currentCard.hint]);

  if (cards.length === 0) {
    return (
      <div
        className="p-12 text-center bg-white rounded-3xl text-gray-500 text-xs shadow-xs max-w-xl mx-auto my-12"
        style={{ border: `1.5px dashed ${colors.hairlineStrong}` }}
      >
        <HelpCircle className="w-8 h-8 text-gray-400 mx-auto mb-2.5" />
        <h3 className="text-sm font-bold text-gray-800">No Flashcards in Deck</h3>
        <p className="text-xs text-gray-500 mt-1">Generate flashcards from your grounded knowledge sources to begin.</p>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / cards.length) * 100);

  const difficultyBadges = {
    easy: 'bg-emerald-50 text-emerald-700 border-emerald-300',
    medium: 'bg-amber-50 text-amber-700 border-amber-300',
    hard: 'bg-rose-50 text-rose-700 border-rose-300',
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col justify-between items-center space-y-6 pb-12 animate-in fade-in duration-300 select-none">
      
      {/* Top Header Metrics & Progress Bar */}
      <header className="w-full space-y-3">
        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-gray-800">
          {/* Active Card Tracker */}
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-mono font-bold tracking-tight text-gray-900" style={mono}>
              Card {currentIndex + 1} of {cards.length}
            </span>
          </div>

          <div className="font-mono text-xs text-gray-500 font-medium" style={mono}>
            {progressPercent}% Completed
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative w-full h-2.5 bg-gray-200/80 rounded-full overflow-hidden p-0.5 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* 3D Card Interactive Stage */}
      <main className="w-full my-auto py-2 flex flex-col items-center justify-center">
        <div
          ref={stageRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={resetTilt}
          onClick={handleFlip}
          className="w-full cursor-pointer select-none"
          style={{ perspective: '1600px' }}
        >
          {/* Tilt Container */}
          <div
            ref={tiltBoxRef}
            className={`w-full transition-transform duration-200 ease-out ${
              slideDirection === 'next'
                ? 'opacity-0 scale-95 -translate-x-8 transition-all duration-180'
                : slideDirection === 'prev'
                ? 'opacity-0 scale-95 translate-x-8 transition-all duration-180'
                : 'opacity-100 scale-100 translate-x-0'
            }`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* 3D Flipper Box */}
            <div
              ref={flipperRef}
              className="relative w-full min-h-[360px] sm:min-h-[400px] rounded-[28px] shadow-[0_20px_50px_-15px_rgba(20,25,30,0.12)] hover:shadow-[0_28px_65px_-12px_rgba(20,25,30,0.18)] transition-shadow duration-300"
              style={{
                transformStyle: 'preserve-3d',
                transition: 'transform 0.65s cubic-bezier(0.34, 1.25, 0.64, 1)',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              {/* ================= FRONT SIDE (QUESTION / PROMPT) ================= */}
              <div
                className="absolute inset-0 bg-white rounded-[28px] border border-gray-200/90 overflow-hidden flex flex-col justify-between shadow-xs"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                {/* Top Amber Accent Gradient Bar */}
                <div className="h-2 w-full bg-gradient-to-r from-amber-400 via-amber-500 to-orange-400 shadow-[0_2px_10px_rgba(245,158,11,0.3)]" />

                {/* Glare Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-40 z-20"
                  style={{
                    background:
                      'radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 65%)',
                    mixBlendMode: 'overlay',
                  }}
                />

                {/* Card Inner Content */}
                <div className="p-6 sm:p-9 flex flex-col justify-between h-full z-10">
                  {/* Header Row */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2 text-amber-700 font-bold tracking-wider text-xs uppercase" style={mono}>
                      <span className="p-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 shadow-2xs">
                        <Sparkles className="w-4 h-4" />
                      </span>
                      <span>QUESTION / PROMPT</span>
                    </div>

                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase border shadow-2xs ${
                        difficultyBadges[currentCard.difficulty] || difficultyBadges.medium
                      }`}
                      style={mono}
                    >
                      {currentCard.difficulty}
                    </span>
                  </div>

                  {/* Central Question */}
                  <div className="my-auto py-6 text-center sm:text-left">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-snug tracking-tight">
                      {currentCard.front}
                    </h2>
                  </div>

                  {/* Card Bottom Row */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3 text-xs">
                    {/* Show Hint Button */}
                    {currentCard.hint ? (
                      <button
                        type="button"
                        onClick={toggleHint}
                        className="interactive-btn inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-gray-600 hover:text-amber-800 hover:bg-amber-50/80 border border-transparent hover:border-amber-200/80 transition shadow-2xs cursor-pointer"
                      >
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        <span className="font-mono font-semibold" style={mono}>
                          {isHintVisible ? 'Hide Hint' : 'Show Hint'}
                        </span>
                      </button>
                    ) : (
                      <div />
                    )}

                    <div className="flex items-center gap-1.5 font-mono text-gray-400 text-xs" style={mono}>
                      <span>Click card or Press Space to flip</span>
                    </div>
                  </div>
                </div>

                {/* Slide-in Hint Drawer */}
                {isHintVisible && currentCard.hint && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute inset-x-0 bottom-16 mx-6 sm:mx-9 bg-amber-50/95 backdrop-blur-sm border border-amber-200 rounded-2xl p-4 shadow-lg z-30 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200"
                  >
                    <span className="text-amber-600 text-lg">💡</span>
                    <div className="text-xs sm:text-sm text-amber-950 leading-relaxed min-w-0">
                      <strong className="font-bold block mb-0.5 font-mono text-xs" style={mono}>
                        Clue:
                      </strong>
                      <span className="text-amber-900">{currentCard.hint}</span>
                    </div>
                    <button
                      type="button"
                      onClick={toggleHint}
                      className="interactive-btn ml-auto text-amber-600 hover:text-amber-900 p-1 text-xs font-bold cursor-pointer shrink-0"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* ================= BACK SIDE (ANSWER & CITATION) ================= */}
              <div
                className="absolute inset-0 bg-white rounded-[28px] border border-gray-200/90 overflow-hidden flex flex-col justify-between shadow-xs"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                {/* Top Teal/Emerald Accent Gradient Bar */}
                <div className="h-2 w-full bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 shadow-[0_2px_10px_rgba(16,185,129,0.3)]" />

                {/* Glare Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-40 z-20"
                  style={{
                    background:
                      'radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 65%)',
                    mixBlendMode: 'overlay',
                  }}
                />

                {/* Card Inner Content */}
                <div className="p-6 sm:p-9 flex flex-col justify-between h-full z-10">
                  {/* Header Row */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2 text-emerald-700 font-bold tracking-wider text-xs uppercase" style={mono}>
                      <span className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 shadow-2xs">
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      </span>
                      <span>ANSWER</span>
                    </div>

                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase border shadow-2xs ${
                        difficultyBadges[currentCard.difficulty] || difficultyBadges.medium
                      }`}
                      style={mono}
                    >
                      {currentCard.difficulty}
                    </span>
                  </div>

                  {/* Central Answer & Citation */}
                  <div className="my-auto py-6 text-center sm:text-left flex flex-col items-center sm:items-start gap-4">
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-snug tracking-tight">
                      {currentCard.back}
                    </p>

                    {currentCard.sourceReference && (
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gray-100 border border-gray-200 text-gray-600 font-mono text-xs font-medium tracking-wide shadow-2xs" style={mono}>
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>Citation: {currentCard.sourceReference}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Row */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3 text-xs">
                    {/* View Question Button */}
                    <button
                      type="button"
                      onClick={handleFlip}
                      className="interactive-btn inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-gray-600 hover:text-emerald-800 hover:bg-emerald-50/80 border border-transparent hover:border-emerald-200/80 transition shadow-2xs cursor-pointer"
                    >
                      <RotateCw className="w-4 h-4 text-emerald-600" />
                      <span className="font-mono font-semibold" style={mono}>
                        View Question
                      </span>
                    </button>

                    <div className="flex items-center gap-1.5 font-mono text-gray-400 text-xs" style={mono}>
                      <span>Click card or Press Space to flip</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Control Bar */}
      <footer className="w-full flex flex-col items-center gap-4">
        <div className="w-full flex items-center justify-between gap-4">
          {/* Previous Button */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-xs sm:text-sm rounded-2xl border border-gray-200 shadow-sm hover:shadow active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Center 3D Flip Action Trigger */}
          <button
            type="button"
            onClick={handleFlip}
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-white border-2 border-amber-500 text-amber-600 hover:text-amber-700 hover:border-amber-600 hover:bg-amber-50/50 shadow-md hover:shadow-lg active:scale-90 flex items-center justify-center transition-all duration-200 group cursor-pointer"
            title="Flip Card (Spacebar)"
          >
            <RotateCw
              className={`w-6 h-6 transition-transform duration-500 ${
                isFlipped ? 'rotate-180' : 'rotate-0'
              }`}
            />
          </button>

          {/* Next Button */}
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-semibold text-xs sm:text-sm rounded-2xl shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <span>{currentIndex === cards.length - 1 ? 'Finish Deck' : 'Next Card'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Keyboard Hotkey Guide */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-gray-400 pt-1" style={mono}>
          <span className="inline-flex items-center gap-1">
            <kbd className="px-2 py-0.5 rounded bg-white border border-gray-200 text-gray-700 font-semibold shadow-2xs">
              Space
            </kbd>{' '}
            Flip
          </span>
          <span className="text-gray-300">•</span>
          <span className="inline-flex items-center gap-1">
            <kbd className="px-2 py-0.5 rounded bg-white border border-gray-200 text-gray-700 font-semibold shadow-2xs">
              ←
            </kbd>
            <kbd className="px-2 py-0.5 rounded bg-white border border-gray-200 text-gray-700 font-semibold shadow-2xs">
              →
            </kbd>{' '}
            Navigate
          </span>
          <span className="text-gray-300">•</span>
          <span className="inline-flex items-center gap-1">
            <kbd className="px-2 py-0.5 rounded bg-white border border-gray-200 text-gray-700 font-semibold shadow-2xs">
              H
            </kbd>{' '}
            Hint
          </span>
        </div>
      </footer>
    </div>
  );
}
