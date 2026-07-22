import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';

export const BrushingTimer: React.FC = () => {
  const TOTAL_SECONDS = 120; // 2 minutes
  const [secondsLeft, setSecondsLeft] = useState<number>(TOTAL_SECONDS);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    let interval: any = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          const next = prev - 1;
          // Play sound chime at 30-second quadrant intervals (90s, 60s, 30s, 0s)
          if (soundEnabled && (next === 90 || next === 60 || next === 30 || next === 0)) {
            playBeep();
          }
          return next;
        });
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft, soundEnabled]);

  const playBeep = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 tone
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      // Audio fallback
    }
  };

  const getQuadrantInfo = () => {
    const elapsed = TOTAL_SECONDS - secondsLeft;
    if (elapsed < 30) {
      return { quad: 'Quadrant 1: Upper Right Teeth', instruction: 'Brush outer, inner & biting surfaces of upper right molars & premolars.' };
    } else if (elapsed < 60) {
      return { quad: 'Quadrant 2: Upper Left Teeth', instruction: 'Brush outer, inner & biting surfaces of upper left teeth.' };
    } else if (elapsed < 90) {
      return { quad: 'Quadrant 3: Lower Left Teeth', instruction: 'Brush outer, inner & biting surfaces of lower left teeth.' };
    } else if (elapsed < 120) {
      return { quad: 'Quadrant 4: Lower Right Teeth', instruction: 'Brush outer, inner & biting surfaces of lower right teeth.' };
    } else {
      return { quad: 'Complete!', instruction: 'Great job! Gently brush your tongue and spit remaining toothpaste.' };
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = ((TOTAL_SECONDS - secondsLeft) / TOTAL_SECONDS) * 100;
  const currentQuad = getQuadrantInfo();

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-xl border border-slate-700/80 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Sparkles className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-bold text-base text-white">2-Minute Quad Brushing Timer</h3>
            <p className="text-xs text-slate-400">Dentist-recommended 30-second quadrant guide</p>
          </div>
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-2 rounded-xl border text-xs font-semibold transition-all ${
            soundEnabled
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Progress & Time */}
      <div className="text-center space-y-2">
        <div className="text-4xl sm:text-5xl font-black tracking-tight text-cyan-400 font-mono">
          {formatTime(secondsLeft)}
        </div>

        <div className="bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700 max-w-md mx-auto">
          <div
            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Active Quadrant Guide */}
      <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-center space-y-1">
        <div className="text-xs font-extrabold uppercase tracking-wider text-cyan-300 flex items-center justify-center space-x-1">
          {secondsLeft === 0 && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          <span>{currentQuad.quad}</span>
        </div>
        <p className="text-xs text-slate-300 max-w-sm mx-auto">{currentQuad.instruction}</p>
      </div>

      {/* Timer Controls */}
      <div className="flex items-center justify-center space-x-3">
        <button
          onClick={() => setIsActive(!isActive)}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs rounded-xl shadow-md shadow-cyan-500/20 flex items-center space-x-2 transition-all"
        >
          {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isActive ? 'Pause' : 'Start Brushing'}</span>
        </button>

        <button
          onClick={() => {
            setIsActive(false);
            setSecondsLeft(TOTAL_SECONDS);
          }}
          className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 flex items-center space-x-1.5 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};
