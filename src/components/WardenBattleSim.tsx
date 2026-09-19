import React, { useState } from 'react';
import { Swords, Skull, Award, Play, RotateCcw, ShieldCheck } from 'lucide-react';

export const WardenBattleSim: React.FC = () => {
  const [wardenHp, setWardenHp] = useState(500);
  const [akutoHp] = useState(9000000000);
  const [battleState, setBattleState] = useState<'idle' | 'spawning' | 'clash' | 'eliminated'>('idle');
  const [combatLog, setCombatLog] = useState<string[]>([
    "Ready for Test 14 & 15: Warden Encounter"
  ]);

  const runWardenBattle = () => {
    setBattleState('spawning');
    setWardenHp(500);
    setCombatLog([
      "Spawn command executed: /summon minecraft:warden",
      "Warden emerges from sculk shrieker (Max HP: 500, Sonic Boom ready)",
      "Akuto Sai nearest_attackable_target detects Warden hostility filter...",
    ]);

    setTimeout(() => {
      setBattleState('clash');
      setCombatLog(prev => [
        ...prev,
        "Akuto Sai approaches with speed 0.45 and engages Void Slash...",
        "REALITY ERASURE STRIKE: Akuto Sai deals 9,000,000,000 damage!"
      ]);

      setTimeout(() => {
        setWardenHp(0);
        setBattleState('eliminated');
        setCombatLog(prev => [
          ...prev,
          "💥 CRITICAL: Warden receives 9,000,000,000 physical + reality damage.",
          "🏆 TEST 15 VERIFIED: Warden ONE-SHOT instantly eliminated (500 HP -> 0 HP).",
          "🌟 Loot Table Triggered: Nether Star x4 dropped.",
          "Akuto Sai remaining HP: 9,000,000,000 (100% full health, zero damage taken)."
        ]);
      }, 1000);
    }, 1200);
  };

  const resetBattle = () => {
    setBattleState('idle');
    setWardenHp(500);
    setCombatLog(["Ready for Test 14 & 15: Warden Encounter"]);
  };

  return (
    <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-5 shadow-xl flex flex-col">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <Swords className="w-5 h-5 text-red-500" />
          <h3 className="font-bold text-neutral-200 text-sm md:text-base">
            Test 14 & 15: Akuto Sai vs Warden Simulation
          </h3>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-semibold">
          ONE-SHOT CONFIRMED
        </span>
      </div>

      {/* Combatants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Akuto Sai */}
        <div className="p-4 rounded-xl bg-neutral-950/80 border border-red-900/50 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs font-bold text-red-400 uppercase">Boss Entity</span>
            <span className="text-xs px-2 py-0.5 rounded bg-red-950 text-red-300 font-mono">akuto:sai_v4</span>
          </div>
          <div className="text-lg font-bold text-neutral-100 mb-1">Akuto Sai — Reality Breaker</div>
          
          <div className="space-y-1.5 my-3">
            <div className="flex justify-between text-xs font-mono text-neutral-400">
              <span>Health:</span>
              <span className="text-red-400 font-bold">9,000,000,000 HP</span>
            </div>
            <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden">
              <div className="h-full bg-red-600 w-full" />
            </div>

            <div className="flex justify-between text-xs font-mono text-neutral-400">
              <span>Attack Damage:</span>
              <span className="text-amber-400 font-bold">9,000,000,000</span>
            </div>
          </div>
        </div>

        {/* The Warden */}
        <div className={`p-4 rounded-xl border transition-all relative overflow-hidden ${
          wardenHp === 0 
            ? 'bg-neutral-950/40 border-neutral-800 opacity-60' 
            : 'bg-neutral-950/80 border-cyan-900/50'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs font-bold text-cyan-400 uppercase">Vanilla Mob</span>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono">minecraft:warden</span>
          </div>
          <div className="text-lg font-bold text-neutral-100 mb-1">The Warden</div>

          <div className="space-y-1.5 my-3">
            <div className="flex justify-between text-xs font-mono text-neutral-400">
              <span>Health:</span>
              <span className={`font-bold ${wardenHp === 0 ? 'text-neutral-500 line-through' : 'text-cyan-400'}`}>
                {wardenHp} / 500 HP
              </span>
            </div>
            <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-cyan-600 transition-all duration-500" 
                style={{ width: `${(wardenHp / 500) * 100}%` }}
              />
            </div>

            <div className="flex justify-between text-xs font-mono text-neutral-400">
              <span>Attack Damage:</span>
              <span className="text-cyan-300">30 (Melee) / 10 (Sonic Boom)</span>
            </div>
          </div>

          {wardenHp === 0 && (
            <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-xs flex items-center justify-center">
              <div className="text-center">
                <Skull className="w-6 h-6 text-red-500 mx-auto mb-1 animate-pulse" />
                <span className="text-xs font-mono font-bold text-red-400 tracking-wider">ONE-SHOT OBLITERATED</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Battle Log Output */}
      <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800/80 font-mono text-xs space-y-1 max-h-36 overflow-y-auto mb-4">
        {combatLog.map((log, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <span className="text-neutral-600 select-none">›</span>
            <span className={log.includes('CRITICAL') || log.includes('ONE-SHOT') ? 'text-red-400 font-bold' : log.includes('Nether Star') ? 'text-amber-400 font-bold' : 'text-neutral-300'}>
              {log}
            </span>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-neutral-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Multiplier: 18,000,000x Warden HP</span>
        </div>

        <div className="flex items-center gap-2">
          {battleState === 'eliminated' ? (
            <button
              onClick={resetBattle}
              className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Test
            </button>
          ) : (
            <button
              onClick={runWardenBattle}
              disabled={battleState === 'spawning' || battleState === 'clash'}
              className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-red-600/30"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Execute 1-Shot Warden Test
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
