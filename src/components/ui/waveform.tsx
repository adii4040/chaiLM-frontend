import React, { useRef, useEffect, useState, useCallback } from 'react';

export interface ScrollingWaveformProps {
  height?: number;
  barWidth?: number;
  barGap?: number;
  speed?: number;
  fadeEdges?: boolean;
  barColor?: string;
  activeColor?: string;
  progress?: number; // 0 to 100
  isPlaying?: boolean;
  onSeek?: (percentage: number) => void;
  className?: string;
}

export function ScrollingWaveform({
  height = 56,
  barWidth = 3,
  barGap = 2.5,
  speed = 30,
  fadeEdges = true,
  barColor = '#DDE0DC',
  activeColor = '#1F7A5C',
  progress = 0,
  isPlaying = false,
  onSeek,
  className = '',
}: ScrollingWaveformProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const phaseRef = useRef<number>(0);

  const [hoverPercent, setHoverPercent] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Render waveform onto canvas with high DPI support
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const dpr = window.devicePixelRatio || 1;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const step = barWidth + barGap;
    const totalBars = Math.floor(width / step);
    const progressX = (progress / 100) * width;
    const phase = phaseRef.current;

    const centerY = height / 2;
    const minHeight = 6;
    const maxHeight = height - 8;

    for (let i = 0; i < totalBars; i++) {
      const x = i * step + barGap / 2;
      const normX = i / totalBars;

      // Complex multi-frequency wave formula creating natural fluid sound wave motion
      const wave1 = Math.sin(normX * 12 + phase) * 0.35;
      const wave2 = Math.sin(normX * 24 - phase * 1.4) * 0.22;
      const wave3 = Math.cos(normX * 6 + phase * 0.7) * 0.25;
      const wave4 = Math.sin(i * 0.75) * 0.18; // discrete bar variation

      // Natural audio envelope (tapered at edges, fuller in center)
      const envelope = Math.sin(normX * Math.PI) * 0.3 + 0.7;
      const rawAmp = (0.45 + wave1 + wave2 + wave3 + wave4) * envelope;
      const clampedAmp = Math.max(0.12, Math.min(0.98, rawAmp));

      const barH = Math.max(minHeight, clampedAmp * maxHeight);
      const y = centerY - barH / 2;

      // Color based on active progress
      const isPast = x <= progressX;
      ctx.fillStyle = isPast ? activeColor : barColor;

      // Rounded bar rectangle
      ctx.beginPath();
      const radius = barWidth / 2;
      ctx.roundRect(x, y, barWidth, barH, radius);
      ctx.fill();
    }

    // Playhead needle line
    if (progress > 0 && progress < 100) {
      ctx.fillStyle = activeColor;
      ctx.beginPath();
      ctx.roundRect(progressX - 1.5, 2, 3, height - 4, 1.5);
      ctx.fill();

      // Playhead top handle
      ctx.beginPath();
      ctx.arc(progressX, 4, 4, 0, Math.PI * 2);
      ctx.fillStyle = activeColor;
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    ctx.restore();
  }, [height, barWidth, barGap, barColor, activeColor, progress]);

  // Animation Loop when playing
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (isPlaying) {
        // Increment phase based on speed
        phaseRef.current += (speed / 10) * delta * 1.8;
      }

      render();
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying, speed, render]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => render();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [render]);

  // Interactive Seeking
  const calculatePercentage = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    return Math.max(0, Math.min(100, (clickX / rect.width) * 100));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const pct = calculatePercentage(e);
    if (onSeek) onSeek(pct);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const pct = calculatePercentage(e);
    setHoverPercent(pct);
    if (isDragging && onSeek) {
      onSeek(pct);
    }
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoverPercent(null)}
      className={`relative w-full cursor-pointer select-none group ${className}`}
      style={{ height: `${height}px` }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{
          maskImage: fadeEdges
            ? 'linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)'
            : undefined,
          WebkitMaskImage: fadeEdges
            ? 'linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)'
            : undefined,
        }}
      />

      {/* Hover scrubber guide */}
      {hoverPercent !== null && (
        <div
          className="absolute top-0 bottom-0 w-[1.5px] bg-[#1F7A5C]/60 pointer-events-none -translate-x-1/2"
          style={{ left: `${hoverPercent}%` }}
        />
      )}
    </div>
  );
}
