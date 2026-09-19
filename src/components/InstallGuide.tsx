import React, { useState } from 'react';
import { Download, Terminal, Smartphone, Monitor, Apple, Copy, Check, Info } from 'lucide-react';
import { ADDON_STATS } from '../data/addonInfo';

export const InstallGuide: React.FC = () => {
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [platform, setPlatform] = useState<'windows' | 'android' | 'ios'>('windows');

  const copyCommand = () => {
    navigator.clipboard.writeText(ADDON_STATS.summonCommand);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-5 shadow-xl flex flex-col">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-red-500" />
          <h3 className="font-bold text-neutral-200 text-sm md:text-base">
            Installation & In-Game Activation Guide
          </h3>
        </div>
        <span className="text-xs text-neutral-400 font-mono">Bedrock 1.26.51.1+</span>
      </div>

      {/* Quick Summon Command Banner */}
      <div className="p-3 bg-neutral-950 rounded-xl border border-red-900/40 flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 min-w-0">
          <Terminal className="w-4 h-4 text-red-400 shrink-0" />
          <div className="truncate">
            <div className="text-[11px] text-neutral-400">Summon In-Game Command:</div>
            <div className="font-mono text-sm font-bold text-red-400">{ADDON_STATS.summonCommand}</div>
          </div>
        </div>

        <button
          onClick={copyCommand}
          className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition-all flex items-center gap-1.5 shrink-0"
        >
          {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedCmd ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>

      {/* Package Downloads Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
        <a
          href="/Akuto_Sai_V4_Reality_Breaker.mcaddon"
          download="Akuto_Sai_V4_Reality_Breaker.mcaddon"
          className="p-3 rounded-xl bg-red-950/60 border border-red-800/60 hover:border-red-500 hover:bg-red-900/60 transition-all flex flex-col gap-1 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-200 group-hover:text-white">Full Addon (.mcaddon)</span>
            <Download className="w-4 h-4 text-red-400 group-hover:translate-y-0.5 transition-transform" />
          </div>
          <span className="text-[10px] text-neutral-400">1-Click Auto Import (BP + RP)</span>
        </a>

        <a
          href="/Akuto_Sai_V4_BP.mcpack"
          download="Akuto_Sai_V4_BP.mcpack"
          className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900 transition-all flex flex-col gap-1 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-200 group-hover:text-white">Behavior Pack (.mcpack)</span>
            <Download className="w-4 h-4 text-neutral-400 group-hover:translate-y-0.5 transition-transform" />
          </div>
          <span className="text-[10px] text-neutral-400">Entities, Boss AI & Loot</span>
        </a>

        <a
          href="/Akuto_Sai_V4_RP.mcpack"
          download="Akuto_Sai_V4_RP.mcpack"
          className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900 transition-all flex flex-col gap-1 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-200 group-hover:text-white">Resource Pack (.mcpack)</span>
            <Download className="w-4 h-4 text-neutral-400 group-hover:translate-y-0.5 transition-transform" />
          </div>
          <span className="text-[10px] text-neutral-400">3D Models, 6 Particles & HD Textures</span>
        </a>

        <a
          href="/Akuto_Sai_V4_Reality_Breaker.zip"
          download="Akuto_Sai_V4_Reality_Breaker.zip"
          className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900 transition-all flex flex-col gap-1 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-200 group-hover:text-white">Full Source (.zip)</span>
            <Download className="w-4 h-4 text-neutral-400 group-hover:translate-y-0.5 transition-transform" />
          </div>
          <span className="text-[10px] text-neutral-400">Manual development folder extract</span>
        </a>
      </div>

      {/* Platform Switcher */}
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={() => setPlatform('windows')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            platform === 'windows' ? 'bg-red-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Windows PC</span>
        </button>

        <button
          onClick={() => setPlatform('android')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            platform === 'android' ? 'bg-red-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Android</span>
        </button>

        <button
          onClick={() => setPlatform('ios')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            platform === 'ios' ? 'bg-red-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
          }`}
        >
          <Apple className="w-3.5 h-3.5" />
          <span>iOS / iPadOS</span>
        </button>
      </div>

      {/* Platform Instructions */}
      <div className="p-4 bg-neutral-950/80 rounded-xl border border-neutral-800/80 text-xs text-neutral-300 space-y-2.5">
        {platform === 'windows' && (
          <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
            <li>Download the <strong className="text-red-400">Akuto_Sai_V4_Reality_Breaker.mcaddon</strong> file.</li>
            <li>Double-click the downloaded file. Minecraft Bedrock will launch automatically.</li>
            <li>Watch the top of the screen: <span className="font-mono text-emerald-400">"Import Started..."</span> followed by <span className="font-mono text-emerald-400">"Successfully imported Behavior Pack & Resource Pack"</span>.</li>
            <li>Edit an existing world or Create New World &gt; Scroll to <strong>Behavior Packs</strong> and click <strong>Activate</strong> on Akuto Sai V4. (Resource Pack activates automatically due to linked UUID).</li>
            <li>In-game, get the <strong className="text-neutral-100">Akuto Sai V4 Spawn Egg</strong> from the Creative Inventory (Nature tab), or execute <span className="font-mono text-red-400">/summon akuto:sai_v4</span>!</li>
          </ol>
        )}

        {platform === 'android' && (
          <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
            <li>Tap the <strong className="text-red-400">Download .mcaddon</strong> button on your phone or tablet.</li>
            <li>Once downloaded, tap the file in your notification bar or in your Files/Downloads app.</li>
            <li>If prompted with "Open with", select <strong>Minecraft</strong>.</li>
            <li>Minecraft will launch and import both the Behavior Pack and Resource Pack.</li>
            <li>Go to your World Settings &gt; Activate both packs &gt; Enter world &gt; Summon Akuto Sai!</li>
          </ol>
        )}

        {platform === 'ios' && (
          <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
            <li>Download the <strong className="text-red-400">.mcaddon</strong> file in Safari.</li>
            <li>Tap the Download icon in Safari's address bar &gt; Tap the downloaded file.</li>
            <li>In the Files app, tap the <strong>Share</strong> button and choose <strong>Minecraft</strong>.</li>
            <li>Minecraft Bedrock will open and complete the import.</li>
            <li>Activate in World Settings and enjoy!</li>
          </ol>
        )}
      </div>
    </div>
  );
};
