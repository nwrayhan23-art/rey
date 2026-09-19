import React, { useState } from 'react';
import { 
  Download, 
  Terminal, 
  ShieldCheck, 
  Swords, 
  Flame, 
  Sparkles, 
  Box, 
  ExternalLink, 
  CheckCircle2, 
  Layers, 
  Zap, 
  Eye, 
  Check, 
  Copy 
} from 'lucide-react';
import { ModelViewer3D } from './components/ModelViewer3D';
import { BossBarPreview } from './components/BossBarPreview';
import { WardenBattleSim } from './components/WardenBattleSim';
import { FileExplorer } from './components/FileExplorer';
import { ChecklistModal } from './components/ChecklistModal';
import { InstallGuide } from './components/InstallGuide';
import { ADDON_STATS } from './data/addonInfo';

export default function App() {
  const [currentAnim, setCurrentAnim] = useState<'idle' | 'walk' | 'attack' | 'reality_break' | 'teleport'>('idle');
  const [activeTab, setActiveTab] = useState<'overview' | 'battle' | 'explorer' | 'checklist' | 'guide'>('overview');
  const [copiedSummon, setCopiedSummon] = useState(false);

  const copySummonCommand = () => {
    navigator.clipboard.writeText(ADDON_STATS.summonCommand);
    setCopiedSummon(true);
    setTimeout(() => setCopiedSummon(false), 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-red-500 selection:text-white flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-neutral-950/85 backdrop-blur-md border-b border-neutral-800/80 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 via-rose-700 to-neutral-900 flex items-center justify-center font-mono font-black text-white text-base shadow-lg shadow-red-600/30 border border-red-500/40">
              V4
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-sm sm:text-base tracking-wide text-neutral-100">
                  Akuto Sai V4
                </h1>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-red-950/80 border border-red-500/30 text-red-400 font-bold">
                  Reality Breaker
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-mono">
                Bedrock 1.26.51.1 • Single .mcaddon Output
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={copySummonCommand}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs font-mono hover:border-neutral-700 transition-all"
            >
              {copiedSummon ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-neutral-400" />}
              <span>/summon akuto:sai_v4</span>
            </button>

            {/* Direct .mcaddon Download Link */}
            <a
              href="/Akuto_Sai_V4_Reality_Breaker.mcaddon"
              download="Akuto_Sai_V4_Reality_Breaker.mcaddon"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-red-600/30 transition-all border border-red-400/30"
            >
              <Download className="w-4 h-4" />
              <span>Download .mcaddon</span>
              <span className="text-[10px] opacity-80 font-mono hidden md:inline">({ADDON_STATS.filesize})</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Navigation Sub-bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-neutral-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-neutral-800 text-white font-bold shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            <Eye className="w-4 h-4 text-red-500" />
            <span>3D Model & Stats</span>
          </button>

          <button
            onClick={() => setActiveTab('battle')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'battle'
                ? 'bg-neutral-800 text-white font-bold shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            <Swords className="w-4 h-4 text-amber-500" />
            <span>Warden Battle (Test 14 & 15)</span>
          </button>

          <button
            onClick={() => setActiveTab('explorer')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'explorer'
                ? 'bg-neutral-800 text-white font-bold shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Addon Package Explorer</span>
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'checklist'
                ? 'bg-neutral-800 text-white font-bold shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>20-Point Checklist (100% Passed)</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'guide'
                ? 'bg-neutral-800 text-white font-bold shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            <Terminal className="w-4 h-4 text-rose-400" />
            <span>Installation Guide</span>
          </button>
        </div>

        {/* View Switcher Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Top Grid: 3D Model Visualizer & Boss Stats Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: 3D Interactive Model Canvas (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <ModelViewer3D 
                  currentAnim={currentAnim} 
                  onAnimChange={setCurrentAnim} 
                />

                {/* Boss Bar with special ability triggers */}
                <BossBarPreview 
                  onTriggerEffect={(ability) => {
                    if (ability === 'Reality Break') setCurrentAnim('reality_break');
                    else if (ability === 'Void Slash') setCurrentAnim('attack');
                    else if (ability === 'Instant Transmission') setCurrentAnim('teleport');
                  }} 
                />
              </div>

              {/* Right Column: Entity Specifications & Character Design (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                {/* Stats Card */}
                <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-5 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                    <div>
                      <span className="text-[11px] font-mono text-red-400 uppercase font-bold tracking-wider">
                        God-Tier Supernatural Entity
                      </span>
                      <h2 className="text-xl font-black text-neutral-100">
                        {ADDON_STATS.name}
                      </h2>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-mono bg-red-950 text-red-300 font-bold border border-red-500/30">
                      V4 FINAL
                    </span>
                  </div>

                  {/* Core Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/80">
                      <div className="text-[11px] text-neutral-400">Health Pool:</div>
                      <div className="text-base font-black text-red-400 font-mono">9,000,000,000</div>
                      <div className="text-[10px] text-neutral-500">Extreme Regeneration</div>
                    </div>

                    <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/80">
                      <div className="text-[11px] text-neutral-400">Attack Damage:</div>
                      <div className="text-base font-black text-amber-400 font-mono">9,000,000,000</div>
                      <div className="text-[10px] text-neutral-500">One-shots Warden</div>
                    </div>

                    <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/80">
                      <div className="text-[11px] text-neutral-400">Movement Speed:</div>
                      <div className="text-sm font-bold text-neutral-200 font-mono">0.45 (Very Fast)</div>
                      <div className="text-[10px] text-neutral-500">Fast tracking & climb</div>
                    </div>

                    <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/80">
                      <div className="text-[11px] text-neutral-400">Knockback Resist:</div>
                      <div className="text-sm font-bold text-neutral-200 font-mono">100% Unstoppable</div>
                      <div className="text-[10px] text-neutral-500">Zero pushback</div>
                    </div>
                  </div>

                  {/* Immunities List */}
                  <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/80">
                    <div className="text-xs font-bold text-neutral-300 mb-2 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Total Damage Immunities:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
                      <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">🔥 Fire / Lava Immune</span>
                      <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">⚡ Fall Damage: NO</span>
                      <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">💥 100% Explosion Resist</span>
                      <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">🌊 Drowning: NO</span>
                      <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">🌌 Void Protection</span>
                    </div>
                  </div>

                  {/* Player Safety Note */}
                  <div className="p-3 rounded-xl bg-neutral-950/80 border border-blue-900/40 text-xs text-neutral-300 flex items-start gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0 mt-1.5" />
                    <div>
                      <strong className="text-blue-300">Player Safety Guaranteed:</strong> Akuto Sai targets hostile mobs (Warden, Wither, Ender Dragon, monsters). Players are completely safe unless they intentionally attack him!
                    </div>
                  </div>
                </div>

                {/* Character Design Specs Card */}
                <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-5 shadow-xl space-y-3">
                  <h3 className="font-bold text-neutral-200 text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-red-500" />
                    <span>Custom Anime Aesthetic & Anatomy</span>
                  </h3>

                  <div className="space-y-2 text-xs text-neutral-400">
                    <div className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">•</span>
                      <span><strong className="text-neutral-200">Hair:</strong> Multi-piece 3D spiky crests, angled bangs, side flares, and back curtain (Zero flat cube look).</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">•</span>
                      <span><strong className="text-neutral-200">Uniform:</strong> Dark supernatural school blazer, popped collar, white shirt, dark crimson red necktie.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">•</span>
                      <span><strong className="text-neutral-200">Coat Tails:</strong> Dual long coat tails extending behind legs with dynamic flapping physics and crimson runes.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">•</span>
                      <span><strong className="text-neutral-200">No Invisible Mesh:</strong> Uses Bedrock <code className="text-emerald-400 bg-neutral-950 px-1 py-0.5 rounded font-mono">entity_alphatest</code> to eliminate previous invisible entity bugs forever.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Feature Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800">
                <div className="flex items-center gap-2 mb-2 text-red-400 font-bold text-sm">
                  <Flame className="w-4 h-4" />
                  <span>5-Layered Particle Aura</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Feet circular disc, torso ascending void energy, head crimson spark wisps, and signature cosmic shockwaves.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800">
                <div className="flex items-center gap-2 mb-2 text-amber-400 font-bold text-sm">
                  <Zap className="w-4 h-4" />
                  <span>Signature Abilities</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Reality Break (sky darkening blast), Void Slash (horizontal energy blade), and Instant Transmission (pre-burst teleportation).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800">
                <div className="flex items-center gap-2 mb-2 text-emerald-400 font-bold text-sm">
                  <Box className="w-4 h-4" />
                  <span>Ready-To-Import .mcaddon</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Single file containing both Behavior Pack and Resource Pack linked with deterministic UUIDs. Zero manual folder edits needed.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Warden Battle Simulator */}
        {activeTab === 'battle' && (
          <div className="space-y-6">
            <WardenBattleSim />
          </div>
        )}

        {/* Tab 3: Addon Package Explorer */}
        {activeTab === 'explorer' && (
          <div className="space-y-6">
            <FileExplorer />
          </div>
        )}

        {/* Tab 4: 20-Point Checklist */}
        {activeTab === 'checklist' && (
          <div className="space-y-6">
            <ChecklistModal />
          </div>
        )}

        {/* Tab 5: Installation Guide */}
        {activeTab === 'guide' && (
          <div className="space-y-6">
            <InstallGuide />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-neutral-800/80 bg-neutral-950 py-4 px-4 text-center text-xs text-neutral-500 font-mono">
        Akuto Sai V4 — Reality Breaker • Minecraft Bedrock 1.26.51.1 Compliant Addon • Ready for direct import
      </footer>
    </div>
  );
}
