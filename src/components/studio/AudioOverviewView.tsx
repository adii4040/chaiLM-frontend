import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Loader2,
  AlertCircle,
  Sparkles,
  Clock,
  Radio,
  ChevronDown,
  FileText,
  FastForward,
  Rewind,
} from 'lucide-react';
import { ScrollingWaveform } from '../ui/waveform';
import type { AudioOverviewData } from '../../modules/studio/dto/studioDto';
import { colors, mono } from '../landing/tokens';

interface AudioOverviewViewProps {
  data: AudioOverviewData;
  audioUrl?: string | null;
  audioStatus?: string;
  audioError?: string | null;
  metadata?: Record<string, any>;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default function AudioOverviewView({
  data,
  audioUrl,
  audioStatus = 'ready',
  audioError,
  metadata = {},
}: AudioOverviewViewProps) {
  const dialogue = data.dialogue || [];
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Audio Playback State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Collapsible Transcript State
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);

  const podcastFormat = data.podcastType || metadata.podcastType;
  const mood = data.mood || metadata.mood;
  const targetMinutes = data.durationMinutesEstimate || metadata.targetMinutes || metadata.durationMinutesEstimate || 5;

  const isAudioProcessing = audioStatus === 'processing' || audioStatus === 'pending';
  const isAudioFailed = audioStatus === 'failed';
  const isAudioReady = (audioStatus === 'ready' || !audioStatus) && Boolean(audioUrl);

  // Reset audio playback on audioUrl change
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.warn('Audio playback error:', err));
    }
  };

  const handleSeekPercentage = (percentage: number) => {
    if (!audioRef.current || !duration) return;
    const nextTime = (percentage / 100) * duration;
    audioRef.current.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const handleSkip = (seconds: number) => {
    if (!audioRef.current) return;
    const nextTime = Math.min(Math.max(0, audioRef.current.currentTime + seconds), duration || 100);
    audioRef.current.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const handleReset = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioRef.current.muted = nextMuted;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (audioRef.current) {
      audioRef.current.volume = val;
      audioRef.current.muted = val === 0;
    }
  };

  const handleRateCycle = () => {
    const rates = [1, 1.25, 1.5, 2];
    const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const volumePercent = isMuted ? 0 : volume * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Hidden HTML5 Audio Element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          preload="metadata"
          onTimeUpdate={() => {
            if (audioRef.current) {
              setCurrentTime(audioRef.current.currentTime);
            }
          }}
          onLoadedMetadata={() => {
            if (audioRef.current) {
              setDuration(audioRef.current.duration || 0);
            }
          }}
          onEnded={() => {
            setIsPlaying(false);
            setCurrentTime(0);
          }}
        />
      )}

      {/* Podcast Audio Player Header Banner */}
      <div
        className="bg-white rounded-3xl p-6 shadow-sm relative overflow-hidden space-y-5"
        style={{ border: `1.5px solid ${colors.hairlineStrong}` }}
      >
        <div className="h-1.5 w-full bg-rose-600 absolute top-0 left-0 right-0" />

        {/* Top Meta & Title */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold"
              style={mono}
            >
              <Mic className="w-3 h-3 text-rose-600" />
              <span>2-Host Studio Podcast</span>
            </span>

            {targetMinutes && (
              <span
                className="inline-flex items-center gap-1 text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200 font-bold"
                style={mono}
              >
                <Clock className="w-3 h-3" />
                <span>{targetMinutes} Min Episode</span>
              </span>
            )}

            {podcastFormat && (
              <span
                className="inline-flex items-center gap-1 text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-bold"
                style={mono}
              >
                <Radio className="w-3 h-3" />
                <span className="truncate max-w-[200px]">{podcastFormat}</span>
              </span>
            )}

            {mood && (
              <span
                className="inline-flex items-center gap-1 text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold"
                style={mono}
              >
                <Sparkles className="w-3 h-3" />
                <span className="truncate max-w-[200px]">{mood}</span>
              </span>
            )}
          </div>

          <h2 className="text-base md:text-lg font-bold text-[#14171A] leading-snug">
            {data.episodeTitle || 'Podcast Episode'}
          </h2>

          {data.summary && (
            <p className="text-xs text-[#5C6169] leading-relaxed">
              {data.summary}
            </p>
          )}
        </div>

        {/* Audio Synthesis In-Progress Banner */}
        {isAudioProcessing && (
          <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 flex items-center justify-between gap-3 animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-rose-950">
                  Synthesizing Audio Overview Track...
                </h4>
                <p className="text-[11px] text-rose-700 leading-tight">
                  Generating natural 2-host speech audio via TTS pipeline. Audio controls will activate as soon as synthesis completes.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono uppercase text-rose-700 font-bold shrink-0 hidden sm:inline" style={mono}>
              Processing
            </span>
          </div>
        )}

        {/* Audio Synthesis Failure Notice */}
        {isAudioFailed && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <div className="space-y-0.5 min-w-0">
              <h4 className="text-xs font-bold text-red-900">Audio Synthesis Notice</h4>
              <p className="text-[11px] text-red-700 truncate">
                {audioError || 'Audio synthesis encountered an issue, but the full script is available below.'}
              </p>
            </div>
          </div>
        )}

        {/* Real Audio Player with Live Scrolling Waveform */}
        {isAudioReady && (
          <div className="p-5 rounded-2xl bg-[#F7F8F6] border border-[#E2E4E1] space-y-4 shadow-2xs">
            {/* 1. Live Animated Scrolling Waveform Scrubber */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono font-bold text-[#14171A] shrink-0 min-w-[38px]" style={mono}>
                  {formatTime(currentTime)}
                </span>

                {/* Animated Waveform Display */}
                <div className="flex-1 bg-white rounded-xl border border-[#E2E4E1] p-1.5 px-3 shadow-xs hover:border-[#1F7A5C]/50 transition-colors">
                  <ScrollingWaveform
                    height={48}
                    barWidth={3}
                    barGap={2.5}
                    speed={28}
                    fadeEdges={true}
                    barColor="#DDE0DC"
                    activeColor="#1F7A5C"
                    progress={progressPercent}
                    isPlaying={isPlaying}
                    onSeek={handleSeekPercentage}
                  />
                </div>

                <span className="text-[11px] font-mono text-[#5C6169] shrink-0 min-w-[38px] text-right" style={mono}>
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* 2. Controls & Volume Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-[#E8EAE6]">
              {/* Left: Playback Action Buttons */}
              <div className="flex items-center space-x-2">
                {/* Play / Pause */}
                <button
                  type="button"
                  onClick={togglePlay}
                  className="px-4 py-2 rounded-full text-white font-semibold text-xs flex items-center space-x-2 transition cursor-pointer shadow-xs hover:shadow-md hover:-translate-y-0.5"
                  style={{ background: colors.verified }}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      <span>Play</span>
                    </>
                  )}
                </button>

                {/* Rewind 10s */}
                <button
                  type="button"
                  onClick={() => handleSkip(-10)}
                  className="px-2.5 py-1.5 rounded-full bg-white hover:bg-gray-100 border border-[#CBCFC9] text-[#5C6169] hover:text-[#14171A] text-[10px] font-mono font-bold flex items-center gap-1 transition cursor-pointer shadow-2xs"
                  style={mono}
                  title="Rewind 10 seconds"
                >
                  <Rewind className="w-3 h-3 text-[#5C6169]" />
                  <span>10s</span>
                </button>

                {/* Forward 10s */}
                <button
                  type="button"
                  onClick={() => handleSkip(10)}
                  className="px-2.5 py-1.5 rounded-full bg-white hover:bg-gray-100 border border-[#CBCFC9] text-[#5C6169] hover:text-[#14171A] text-[10px] font-mono font-bold flex items-center gap-1 transition cursor-pointer shadow-2xs"
                  style={mono}
                  title="Forward 10 seconds"
                >
                  <span>10s</span>
                  <FastForward className="w-3 h-3 text-[#5C6169]" />
                </button>

                {/* Reset to Start */}
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-2 rounded-full bg-white hover:bg-gray-100 border border-[#CBCFC9] text-[#5C6169] hover:text-[#14171A] transition cursor-pointer shadow-2xs"
                  title="Reset Audio to Beginning"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                </button>

                {/* Playback Rate Speed Pill */}
                <button
                  type="button"
                  onClick={handleRateCycle}
                  className="px-2.5 py-1 rounded-full bg-white border border-[#CBCFC9] text-[10px] font-mono font-bold text-[#14171A] hover:bg-gray-100 transition cursor-pointer shadow-2xs"
                  style={mono}
                  title="Cycle Playback Speed"
                >
                  {playbackRate}x
                </button>
              </div>

              {/* Right: Sleek Volume Control */}
              <div className="flex items-center space-x-2.5 px-3 py-1.5 rounded-full bg-white border border-[#CBCFC9] shadow-2xs">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="text-[#5C6169] hover:text-[#14171A] cursor-pointer transition-colors p-0.5"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-3.5 h-3.5 text-red-500" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-[#1F7A5C]" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="volume-slider w-16"
                  style={{
                    background: `linear-gradient(to right, #1F7A5C ${volumePercent}%, #DDE0DC ${volumePercent}%)`,
                  }}
                  title={`Volume: ${Math.round(volumePercent)}%`}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Collapsible Podcast Dialogue Transcript Section */}
      <div className="space-y-3">
        {/* Accordion Trigger Header */}
        <button
          type="button"
          onClick={() => setIsTranscriptOpen(!isTranscriptOpen)}
          className="w-full flex items-center justify-between p-4 rounded-2xl bg-white hover:bg-[#FAFBF9] border border-[#CBCFC9] transition-all cursor-pointer shadow-xs group select-none"
        >
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-[#14171A] tracking-wider" style={mono}>
                PODCAST DIALOGUE TRANSCRIPT
              </span>
              <span
                className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#F5F6F4] text-[#5C6169] border border-[#E2E4E1]"
                style={mono}
              >
                {dialogue.length} Turns
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-semibold text-[#5C6169] group-hover:text-[#14171A] transition-colors">
            <span className="text-[11px]">{isTranscriptOpen ? 'Hide Transcript' : 'Show Transcript'}</span>
            <ChevronDown
              className={`w-4 h-4 text-[#5C6169] group-hover:text-[#1F7A5C] transition-transform duration-200 ${
                isTranscriptOpen ? 'rotate-180 text-[#1F7A5C]' : ''
              }`}
            />
          </div>
        </button>

        {/* Collapsed/Expanded Transcript Content (Single Cohesive Document View) */}
        {isTranscriptOpen && (
          <div className="bg-white rounded-2xl border border-[#CBCFC9] shadow-sm divide-y divide-[#F0F1EE] overflow-hidden animate-in fade-in duration-200">
            {dialogue.map((turn, tIdx) => {
              const isHost1 =
                turn.speaker.toLowerCase().includes('host 1') ||
                turn.speaker.toLowerCase().includes('host a') ||
                turn.speaker.toLowerCase().includes('alex') ||
                tIdx % 2 === 0;

              return (
                <div
                  key={tIdx}
                  className={`p-4.5 transition-colors duration-150 space-y-1.5 ${
                    isHost1 ? 'bg-white hover:bg-[#FAFBF9]' : 'bg-[#FAFAFA]/70 hover:bg-[#F5F6F4]'
                  }`}
                >
                  {/* Turn Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-[10px] shadow-2xs ${
                          isHost1
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : 'bg-blue-100 text-blue-800 border border-blue-300'
                        }`}
                        style={mono}
                      >
                        {isHost1 ? '1' : '2'}
                      </div>
                      <span className="font-bold text-xs text-[#14171A]">
                        {turn.speaker}
                      </span>
                    </div>

                    {turn.tone && (
                      <span
                        className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#F0F1EE] text-[#5C6169] border border-[#E2E4E1] font-semibold tracking-wider"
                        style={mono}
                      >
                        {turn.tone}
                      </span>
                    )}
                  </div>

                  {/* Spoken Utterance Text */}
                  <p className="text-xs md:text-sm text-[#2D3139] leading-relaxed pl-7.5 font-sans">
                    {turn.text}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
