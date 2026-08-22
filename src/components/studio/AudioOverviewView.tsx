import { useState, useEffect } from 'react';
import { Mic, Play, Pause, RotateCcw, Volume2, User } from 'lucide-react';
import type { AudioOverviewData } from '../../modules/studio/dto/studioDto';

interface AudioOverviewViewProps {
  data: AudioOverviewData;
}

export default function AudioOverviewView({ data }: AudioOverviewViewProps) {
  const dialogue = data.dialogue || [];
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTurnIdx, setActiveTurnIdx] = useState<number | null>(null);

  // Simple Speech Synthesis or auto-advance simulation
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      if (activeTurnIdx === null) {
        setActiveTurnIdx(0);
      } else if (activeTurnIdx < dialogue.length - 1) {
        timer = setTimeout(() => {
          setActiveTurnIdx((prev) => (prev !== null ? prev + 1 : 0));
        }, 4000);
      } else {
        setIsPlaying(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, activeTurnIdx, dialogue.length]);

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      if (activeTurnIdx === null || activeTurnIdx >= dialogue.length - 1) {
        setActiveTurnIdx(0);
      }
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setActiveTurnIdx(0);
  };

  const toneBadges: Record<string, string> = {
    enthusiastic: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    curious: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
    analytical: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
    reflective: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    humorous: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Podcast Audio Player Header Banner */}
      <div className="bg-chailm-panel border border-chailm-border rounded-3xl p-6 shadow-xl relative overflow-hidden space-y-4">
        <div className="brand-gradient-bar h-1 w-full absolute top-0 left-0"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-[10px] font-mono text-chailm-accentBlue uppercase tracking-wider">
              <Mic className="w-3.5 h-3.5" />
              <span>Studio 2-Host Audio Deep Dive</span>
            </div>
            <h2 className="text-sm md:text-base font-semibold text-chailm-textMain">
              {data.episodeTitle || 'Podcast Episode'}
            </h2>
            <p className="text-xs text-chailm-textMuted leading-relaxed max-w-xl">
              {data.summary}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-3 shrink-0">
            <button
              type="button"
              onClick={togglePlay}
              className="px-5 py-2.5 rounded-full bg-chailm-accentBlue text-chailm-bg font-semibold text-xs flex items-center space-x-2 hover:opacity-90 transition cursor-pointer shadow-md"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause Stream</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                  <span>{activeTurnIdx !== null ? 'Resume Stream' : 'Play Dialogue'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="p-2.5 rounded-full bg-chailm-card hover:bg-chailm-hover border border-chailm-border text-chailm-textMuted hover:text-chailm-textMain transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Audio Wave Simulation Indicator */}
        <div className="pt-2 border-t border-chailm-border/60 flex items-center justify-between text-[11px] font-mono text-chailm-textMuted">
          <div className="flex items-center space-x-2">
            <Volume2 className="w-3.5 h-3.5 text-chailm-accentBlue" />
            <span>~{data.durationMinutesEstimate || 6} Min Listening Length</span>
          </div>

          <div className="flex items-center space-x-1">
            {Array.from({ length: 16 }).map((_, i) => (
              <span
                key={i}
                className={`w-1 rounded-full transition-all duration-300 ${
                  isPlaying ? 'bg-chailm-accentBlue animate-pulse' : 'bg-chailm-card'
                }`}
                style={{
                  height: isPlaying ? `${Math.max(6, (i % 5) * 4 + 6)}px` : '4px',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Dialogue Conversation Turns */}
      <div className="space-y-4">
        {dialogue.map((turn, idx) => {
          const isHost1 = turn.speaker === 'Host 1';
          const isActive = activeTurnIdx === idx;
          const toneClass = toneBadges[turn.tone?.toLowerCase()] || 'bg-chailm-card text-chailm-textMuted border-chailm-border';

          return (
            <div
              key={idx}
              onClick={() => setActiveTurnIdx(idx)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer space-y-2.5 ${
                isActive
                  ? 'bg-chailm-card border-chailm-accentBlue/60 shadow-lg scale-[1.01]'
                  : isHost1
                  ? 'bg-chailm-panel/90 border-chailm-border hover:border-chailm-accentBlue/30'
                  : 'bg-chailm-panel/60 border-chailm-border/80 hover:border-chailm-accentBlue/30'
              }`}
            >
              {/* Turn Header */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isHost1
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-chailm-textMain font-mono">
                    {turn.speaker} {isHost1 ? '(Intuitive Lead)' : '(Domain Expert)'}
                  </span>
                </div>

                {turn.tone && (
                  <span className={`text-[10px] font-mono capitalize px-2 py-0.5 rounded-full border ${toneClass}`}>
                    {turn.tone}
                  </span>
                )}
              </div>

              {/* Speech Text */}
              <p className="text-xs md:text-sm text-chailm-textMain leading-relaxed pl-8">
                {turn.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
