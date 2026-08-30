import { useState, useEffect } from 'react';
import { Mic, Play, Pause, RotateCcw, Volume2 } from 'lucide-react';
import type { AudioOverviewData } from '../../modules/studio/dto/studioDto';
import { colors, mono } from '../landing/tokens';

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
    enthusiastic: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    curious: 'bg-blue-100 text-blue-800 border-blue-300',
    analytical: 'bg-purple-100 text-purple-800 border-purple-300',
    reflective: 'bg-amber-100 text-amber-800 border-amber-300',
    humorous: 'bg-rose-100 text-rose-800 border-rose-300',
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Podcast Audio Player Header Banner */}
      <div
        className="bg-white rounded-3xl p-6 shadow-sm relative overflow-hidden space-y-4"
        style={{ border: `1.5px solid ${colors.hairlineStrong}` }}
      >
        <div className="h-1 w-full bg-rose-600 absolute top-0 left-0 right-0" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-[10px] font-mono text-rose-700 uppercase tracking-wider font-bold" style={mono}>
              <Mic className="w-3.5 h-3.5 text-rose-600" />
              <span>Studio 2-Host Conversational Audio</span>
            </div>
            <h2 className="text-sm md:text-base font-bold text-[#14171A]">
              {data.episodeTitle || 'Podcast Episode'}
            </h2>
            <p className="text-xs text-[#5C6169] leading-relaxed max-w-xl">
              {data.summary}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-3 shrink-0">
            <button
              type="button"
              onClick={togglePlay}
              className="px-5 py-2.5 rounded-full text-white font-semibold text-xs flex items-center space-x-2 transition cursor-pointer shadow-xs hover:shadow-md hover:-translate-y-0.5"
              style={{ background: colors.verified }}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause Audio</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                  <span>{activeTurnIdx !== null ? 'Resume Dialogue' : 'Play Dialogue'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="p-2.5 rounded-full bg-white hover:bg-[#F5F6F4] border border-[#CBCFC9] text-[#5C6169] hover:text-[#14171A] transition cursor-pointer shadow-xs"
              title="Reset Dialogue"
            >
              <RotateCcw className="w-4 h-4 text-rose-600" />
            </button>
          </div>
        </div>

        {/* Progress Timeline Indicator */}
        <div className="space-y-1.5 pt-2 border-t" style={{ borderColor: colors.hairline }}>
          <div className="flex items-center justify-between text-[11px] font-mono text-[#5C6169]" style={mono}>
            <div className="flex items-center space-x-2">
              <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? 'text-[#1F7A5C] animate-pulse' : 'text-[#93968F]'}`} />
              <span>Turn {(activeTurnIdx ?? 0) + 1} of {dialogue.length}</span>
            </div>
            <span>~{data.durationMinutesEstimate || 6} Min Overview</span>
          </div>

          <div className="w-full bg-[#E2E4E1] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-rose-500 h-full transition-all duration-300 ease-out"
              style={{
                width: `${
                  dialogue.length > 0
                    ? Math.round((((activeTurnIdx ?? 0) + 1) / dialogue.length) * 100)
                    : 0
                }%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Script & Dialogue Stream */}
      <div className="space-y-3.5">
        {dialogue.map((turn, tIdx) => {
          const isActive = activeTurnIdx === tIdx;
          const isHostA = turn.speaker.toLowerCase().includes('host a') || turn.speaker.toLowerCase().includes('alex') || tIdx % 2 === 0;

          return (
            <div
              key={tIdx}
              onClick={() => setActiveTurnIdx(tIdx)}
              className={`p-5 rounded-3xl border transition-all duration-200 cursor-pointer space-y-2 relative overflow-hidden bg-white shadow-xs ${
                isActive
                  ? 'border-rose-400 ring-2 ring-rose-400/20 shadow-md'
                  : 'border-[#CBCFC9] hover:border-rose-300'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-600" />
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shadow-2xs ${
                      isHostA
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : 'bg-blue-100 text-blue-800 border border-blue-300'
                    }`}
                  >
                    {isHostA ? 'A' : 'B'}
                  </div>
                  <span className="font-bold text-xs text-[#14171A]">
                    {turn.speaker}
                  </span>
                </div>

                {turn.tone && (
                  <span
                    className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border font-bold ${
                      toneBadges[turn.tone.toLowerCase()] || 'bg-[#F5F6F4] text-[#5C6169] border-[#CBCFC9]'
                    }`}
                    style={mono}
                  >
                    {turn.tone}
                  </span>
                )}
              </div>

              <p className="text-xs md:text-sm text-[#14171A] leading-relaxed pl-9">
                {turn.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
