import React, { useState } from 'react';
import { Shield, Zap, Skull, Volume2, Sparkles } from 'lucide-react';

interface BossBarPreviewProps {
  onTriggerEffect?: (effectName: string) => void;
}

export const BossBarPreview: React.FC<BossBarPreviewProps> = ({ onTriggerEffect }) => {
  const [screenDarken, setScreenDarken] = useState(false);
  const [activeSpecial, setActiveSpecial] = useState<string | null>(null);

  const playSynthesizedSound = (type: 'roar' | 'slash' | 'break') => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'roar') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.8);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
      } else if (type === 'slash') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.35);
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      } else {
        // Reality Break burst
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 1.2);
        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch {
      // Audio context might be restricted before user gesture
    }
  };

  const triggerAbility = (name: string, sound: 'roar' | 'slash' | 'break') => {
    setActiveSpecial(name);
    setScreenDarken(true);
    playSynthesizedSound(sound);
    if (onTriggerEffect) onTriggerEffect(name);
    setTimeout(() => {
      setActiveSpecial(null);
      setScreenDarken(false);
    }, 1800);
  };

  return (
    <div className={`relative rounded-2xl p-5 border transition-all duration-500 overflow-hidden ${
      screenDarken 
        ? 'bg-neutral-950 border-red-600/80 shadow-2xl shadow-red-950/60 ring-2 ring-red-500/40' 
        : 'bg-neutral-900/90 border-neutral-800'
    }`}>
      {/* Sky Darkening Overlay Simulation */}
      {screenDarken && (
        <div className="absolute inset-0 bg-red-950/30 pointer-events-none animate-pulse" />
      )}

      {/* Bedrock Boss Bar Header */}
      <div className="flex flex-col items-center mb-4">
        <div className="flex items-center gap-2 mb-1.5">
          <Skull className="w-4 h-4 text-red-500 animate-bounce" />
          <h3 className="text-sm md:text-base font-black tracking-widest text-red-500 uppercase font-mono drop-shadow-[0_2px_8px_rgba(230,0,57,0.8)]">
            AKUTO SAI — REALITY BREAKER
          </h3>
          <Skull className="w-4 h-4 text-red-500 animate-bounce" />
        </div>

        {/* Realistic Bedrock Boss Health Bar */}
        <div className="w-full max-w-xl h-5 bg-neutral-950 border-2 border-red-900 rounded-sm p-[2px] shadow-inner relative overflow-hidden">
          {/* Segmented notches typical to Bedrock boss bars */}
          <div className="absolute inset-0 grid grid-cols-10 pointer-events-none z-10 opacity-30">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="border-r border-black" />
            ))}
          </div>

          <div 
            className="h-full w-full bg-gradient-to-r from-red-800 via-red-600 to-rose-500 shadow-lg relative"
            style={{
              boxShadow: '0 0 12px rgba(230, 0, 57, 0.6) inset'
            }}
          >
            <div className="absolute inset-0 bg-white/10 animate-pulse" />
          </div>
        </div>

        <div className="flex items-center justify-between w-full max-w-xl mt-1.5 px-1 text-[11px] font-mono text-neutral-400">
          <span className="text-red-400 font-bold">9,000,000,000 / 9,000,000,000 HP</span>
          <span className="text-neutral-500">Range: 64 Blocks • Sky Darken: Active</span>
        </div>
      </div>

      {/* Special Ability Triggers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 border-t border-neutral-800/80">
        <button
          onClick={() => triggerAbility('Reality Break', 'break')}
          className="p-2.5 rounded-xl bg-neutral-950 hover:bg-red-950/40 border border-neutral-800 hover:border-red-500/50 text-left transition-all group"
        >
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-neutral-200 group-hover:text-red-300">Reality Break</span>
          </div>
          <p className="text-[11px] text-neutral-400">Cosmic energy pulse & sky darkening shockwave</p>
        </button>

        <button
          onClick={() => triggerAbility('Void Slash', 'slash')}
          className="p-2.5 rounded-xl bg-neutral-950 hover:bg-purple-950/40 border border-neutral-800 hover:border-purple-500/50 text-left transition-all group"
        >
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-neutral-200 group-hover:text-purple-300">Void Slash</span>
          </div>
          <p className="text-[11px] text-neutral-400">Sweeping dark purple/crimson crescent wave</p>
        </button>

        <button
          onClick={() => triggerAbility('Instant Transmission', 'roar')}
          className="p-2.5 rounded-xl bg-neutral-950 hover:bg-rose-950/40 border border-neutral-800 hover:border-rose-500/50 text-left transition-all group"
        >
          <div className="flex items-center gap-2 mb-1">
            <Volume2 className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-neutral-200 group-hover:text-rose-300">Instant Transmission</span>
          </div>
          <p className="text-[11px] text-neutral-400">Pre-burst contraction & instant warp</p>
        </button>
      </div>

      {activeSpecial && (
        <div className="mt-3 py-1.5 px-3 rounded-lg bg-red-950/80 border border-red-500/60 text-center text-xs font-mono text-red-200 flex items-center justify-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-red-400" />
          <span>EXECUTING ABILITY: {activeSpecial.toUpperCase()} (Damage: 9,000,000,000)</span>
        </div>
      )}
    </div>
  );
};
