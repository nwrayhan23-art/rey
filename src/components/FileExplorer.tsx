import React, { useState } from 'react';
import { Folder, FileCode, FileText, Image as ImageIcon, Sparkles, Box, Check, Copy } from 'lucide-react';
import { ADDON_BONES, ADDON_PARTICLES } from '../data/addonInfo';

export const FileExplorer: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'bp_entity' | 'rp_client' | 'geometry' | 'render_ctrl' | 'animations' | 'particles' | 'manifests'>('geometry');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 p-5 shadow-xl flex flex-col">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <Folder className="w-5 h-5 text-red-500" />
          <h3 className="font-bold text-neutral-200 text-sm md:text-base">
            Addon Package Structure & Verified Definitions
          </h3>
        </div>
        <span className="text-xs text-neutral-400 font-mono">16 JSON Files • 0 Errors</span>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 text-xs">
        <button
          onClick={() => setSelectedTab('geometry')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all flex items-center gap-1.5 ${
            selectedTab === 'geometry' ? 'bg-red-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          <span>Geometry (18 Bones)</span>
        </button>

        <button
          onClick={() => setSelectedTab('bp_entity')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all flex items-center gap-1.5 ${
            selectedTab === 'bp_entity' ? 'bg-red-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>BP: akuto_sai_v4.json</span>
        </button>

        <button
          onClick={() => setSelectedTab('rp_client')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all flex items-center gap-1.5 ${
            selectedTab === 'rp_client' ? 'bg-red-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>RP: Client Entity</span>
        </button>

        <button
          onClick={() => setSelectedTab('render_ctrl')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all flex items-center gap-1.5 ${
            selectedTab === 'render_ctrl' ? 'bg-red-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Render Controllers</span>
        </button>

        <button
          onClick={() => setSelectedTab('particles')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all flex items-center gap-1.5 ${
            selectedTab === 'particles' ? 'bg-red-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>6 Particles</span>
        </button>

        <button
          onClick={() => setSelectedTab('animations')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all flex items-center gap-1.5 ${
            selectedTab === 'animations' ? 'bg-red-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Animations</span>
        </button>

        <button
          onClick={() => setSelectedTab('manifests')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all flex items-center gap-1.5 ${
            selectedTab === 'manifests' ? 'bg-red-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Linked Manifests</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-neutral-950 rounded-xl border border-neutral-800/80 p-4 font-mono text-xs overflow-x-auto max-h-[340px] text-neutral-300 relative">
        {selectedTab === 'geometry' && (
          <div className="space-y-3 font-sans">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800 text-neutral-400 text-xs">
              <span>Identifier: <strong className="text-red-400 font-mono">geometry.akuto_sai_v4</strong></span>
              <span>Format: <strong>1.12.0</strong> • Texture: <strong>128x128</strong></span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {ADDON_BONES.map((b, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800/80">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-red-400">{b.name}</span>
                    <span className="text-[11px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
                      {b.cubesCount} cubes
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-400 mb-1">
                    Parent: <span className="font-mono text-neutral-300">{b.parent || 'none (root)'}</span> | Pivot: [{b.pivot.join(', ')}]
                  </div>
                  <div className="text-[11px] text-neutral-300">{b.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'bp_entity' && (
          <pre className="text-emerald-400 font-mono whitespace-pre text-[11px]">
{`{
  "format_version": "1.20.80",
  "minecraft:entity": {
    "description": {
      "identifier": "akuto:sai_v4",
      "is_spawnable": true,
      "is_summonable": true,
      "is_experimental": false
    },
    "components": {
      "minecraft:health": {
        "value": 9000000000,
        "max": 9000000000
      },
      "minecraft:attack": {
        "damage": 9000000000
      },
      "minecraft:knockback_resistance": { "value": 1.0 },
      "minecraft:fire_immune": true,
      "minecraft:fall_damage": false,
      "minecraft:boss": {
        "hud_range": 64,
        "name": "AKUTO SAI — REALITY BREAKER",
        "should_darken_sky": true
      },
      "minecraft:movement": { "value": 0.45 },
      "minecraft:behavior.melee_attack": {
        "priority": 3,
        "speed_multiplier": 1.5,
        "track_target": true,
        "reach_multiplier": 2.5
      },
      "minecraft:behavior.nearest_attackable_target": {
        "priority": 2,
        "entity_types": [
          {
            "filters": {
              "any_of": [
                { "test": "is_family", "subject": "other", "value": "monster" },
                { "test": "is_family", "subject": "other", "value": "warden" },
                { "test": "is_family", "subject": "other", "value": "wither" },
                { "test": "is_family", "subject": "other", "value": "dragon" }
              ]
            },
            "max_dist": 48
          }
        ]
      }
    }
  }
}`}
          </pre>
        )}

        {selectedTab === 'rp_client' && (
          <pre className="text-cyan-400 font-mono whitespace-pre text-[11px]">
{`{
  "format_version": "1.10.0",
  "minecraft:client_entity": {
    "description": {
      "identifier": "akuto:sai_v4",
      "materials": {
        "default": "entity_alphatest"
      },
      "textures": {
        "default": "textures/entity/akuto_sai_v4"
      },
      "geometry": {
        "default": "geometry.akuto_sai_v4"
      },
      "animations": {
        "idle": "animation.akuto_sai_v4.idle",
        "walk": "animation.akuto_sai_v4.walk",
        "attack": "animation.akuto_sai_v4.attack",
        "aura": "animation.akuto_sai_v4.aura",
        "reality_break": "animation.akuto_sai_v4.reality_break",
        "void_slash": "animation.akuto_sai_v4.void_slash",
        "teleport": "animation.akuto_sai_v4.teleport"
      },
      "scripts": {
        "animate": [
          "idle",
          "aura",
          { "walk": "query.modified_move_speed" },
          { "attack": "variable.attack_time" }
        ]
      },
      "render_controllers": [
        "controller.render.akuto_sai_v4"
      ]
    }
  }
}`}
          </pre>
        )}

        {selectedTab === 'render_ctrl' && (
          <pre className="text-amber-400 font-mono whitespace-pre text-[11px]">
{`{
  "format_version": "1.8.0",
  "render_controllers": {
    "controller.render.akuto_sai_v4": {
      "geometry": "Geometry.default",
      "materials": [
        { "*": "Material.default" }
      ],
      "textures": [
        "Texture.default"
      ]
    }
  }
}`}
          </pre>
        )}

        {selectedTab === 'particles' && (
          <div className="space-y-2.5 font-sans">
            {ADDON_PARTICLES.map((p, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="font-mono font-bold text-neutral-200 text-xs">{p.id}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">{p.layer}</span>
                  </div>
                  <div className="text-xs text-neutral-400">{p.description}</div>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 whitespace-nowrap">Bedrock 1.10.0+ OK</span>
              </div>
            ))}
          </div>
        )}

        {selectedTab === 'animations' && (
          <pre className="text-purple-400 font-mono whitespace-pre text-[11px]">
{`// animation.akuto_sai_v4.json registered animations:
1. animation.akuto_sai_v4.idle
   - Continuous 3.0s subtle breathing, hair wave, and coat tail sway
2. animation.akuto_sai_v4.walk
   - Synchronized leg strides, counter arm swings, active coat flapping
3. animation.akuto_sai_v4.attack (Void Slash)
   - Arm rotation snap, torso lunging forward, coat flare
4. animation.akuto_sai_v4.aura
   - Hair front & side floating energy pulses
5. animation.akuto_sai_v4.reality_break
   - Floating ascension, arms outstretched, shockwave pulse
6. animation.akuto_sai_v4.teleport
   - Instant compression & expansion collapse`}
          </pre>
        )}

        {selectedTab === 'manifests' && (
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-800">
              <div className="font-bold text-red-400 mb-1">Akuto_Sai_V4_BP/manifest.json</div>
              <div className="text-neutral-400 text-[11px]">
                UUID Header: <span className="text-neutral-200">d87a412b-7e61-4601-97a4-9b16ea9825b4</span><br/>
                Dependency on RP: <span className="text-emerald-400">7f2e1a90-3844-4861-a08b-648de498f3c1</span>
              </div>
            </div>

            <div className="p-3 bg-neutral-900 rounded-lg border border-neutral-800">
              <div className="font-bold text-red-400 mb-1">Akuto_Sai_V4_RP/manifest.json</div>
              <div className="text-neutral-400 text-[11px]">
                UUID Header: <span className="text-neutral-200">7f2e1a90-3844-4861-a08b-648de498f3c1</span><br/>
                Dependency on BP: <span className="text-emerald-400">d87a412b-7e61-4601-97a4-9b16ea9825b4</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
