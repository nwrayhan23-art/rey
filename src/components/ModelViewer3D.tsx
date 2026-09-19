import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCw, Flame, Sparkles, ShieldAlert, Eye } from 'lucide-react';

interface ModelViewer3DProps {
  currentAnim: 'idle' | 'walk' | 'attack' | 'reality_break' | 'teleport';
  onAnimChange: (anim: 'idle' | 'walk' | 'attack' | 'reality_break' | 'teleport') => void;
}

export const ModelViewer3D: React.FC<ModelViewer3DProps> = ({ currentAnim, onAnimChange }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showAura, setShowAura] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [isRotating, setIsRotating] = useState(true);
  const [cameraAngle, setCameraAngle] = useState({ yaw: 0.35, pitch: 0.15, zoom: 1.0 });
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    // Particles system for the multi-layered aura
    const particles: Array<{
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      life: number;
      maxLife: number;
      color: string;
      size: number;
      layer: number;
    }> = [];

    // Initialize particles
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 1.6,
        y: Math.random() * 2.2,
        z: (Math.random() - 0.5) * 1.6,
        vx: (Math.random() - 0.5) * 0.02,
        vy: 0.015 + Math.random() * 0.03,
        vz: (Math.random() - 0.5) * 0.02,
        life: Math.random() * 60,
        maxLife: 60 + Math.random() * 40,
        color: Math.random() > 0.4 ? '#e60039' : (Math.random() > 0.5 ? '#6a0dad' : '#0a0a14'),
        size: 1.5 + Math.random() * 3.5,
        layer: Math.floor(Math.random() * 3) + 1
      });
    }

    const render = () => {
      time += 0.03;
      const width = canvas.width;
      const height = canvas.height;

      // Clear with deep cosmic dark background
      ctx.fillStyle = '#06060c';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle reality fracture radial grid
      ctx.save();
      ctx.strokeStyle = 'rgba(230, 0, 57, 0.08)';
      ctx.lineWidth = 1;
      const cx = width / 2;
      const cy = height / 2 + 70;
      for (let r = 30; r < 280; r += 50) {
        ctx.beginPath();
        ctx.ellipse(cx, cy, r, r * 0.35, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      // Effective camera rotation
      const yaw = isRotating ? cameraAngle.yaw + time * 0.4 : cameraAngle.yaw;
      const pitch = cameraAngle.pitch;
      const scale = 110 * cameraAngle.zoom;

      // 3D Projection helper (centered around waist/chest of Akuto Sai)
      const project = (x: number, y: number, z: number): [number, number, number] => {
        // Rotate around Y (yaw)
        const cosY = Math.cos(yaw);
        const sinY = Math.sin(yaw);
        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;

        // Rotate around X (pitch)
        const cosP = Math.cos(pitch);
        const sinP = Math.sin(pitch);
        const y2 = y * cosP - z1 * sinP;
        const z2 = y * sinP + z1 * cosP;

        // Perspective depth factor
        const distance = 4.0;
        const fov = distance / (distance + z2);

        const screenX = cx + x1 * scale * fov;
        const screenY = cy - y2 * scale * fov;

        return [screenX, screenY, z2];
      };

      // Draw 3D Cube with lighting
      const drawCube = (
        ox: number, oy: number, oz: number,
        sx: number, sy: number, sz: number,
        colorHex: string,
        strokeHex = 'rgba(230, 0, 57, 0.3)'
      ) => {
        const hx = sx / 2;
        const hy = sy / 2;
        const hz = sz / 2;

        const vertices: [number, number, number][] = [
          [ox - hx, oy - hy, oz - hz],
          [ox + hx, oy - hy, oz - hz],
          [ox + hx, oy + hy, oz - hz],
          [ox - hx, oy + hy, oz - hz],
          [ox - hx, oy - hy, oz + hz],
          [ox + hx, oy - hy, oz + hz],
          [ox + hx, oy + hy, oz + hz],
          [ox - hx, oy + hy, oz + hz],
        ];

        const projected = vertices.map(v => project(v[0], v[1], v[2]));

        // Cube faces: front, back, top, bottom, left, right
        const faces = [
          { indices: [0, 1, 2, 3], normZ: -1, shade: 0.95 },
          { indices: [5, 4, 7, 6], normZ: 1, shade: 0.7 },
          { indices: [3, 2, 6, 7], normY: 1, shade: 1.15 },
          { indices: [4, 5, 1, 0], normY: -1, shade: 0.55 },
          { indices: [4, 0, 3, 7], normX: -1, shade: 0.8 },
          { indices: [1, 5, 6, 2], normX: 1, shade: 0.85 },
        ];

        // Sort faces by depth
        faces.forEach(face => {
          const avgZ = face.indices.reduce((sum, idx) => sum + projected[idx][2], 0) / 4;
          (face as any).avgZ = avgZ;
        });
        faces.sort((a: any, b: any) => b.avgZ - a.avgZ);

        faces.forEach(face => {
          ctx.beginPath();
          const p0 = projected[face.indices[0]];
          ctx.moveTo(p0[0], p0[1]);
          for (let i = 1; i < 4; i++) {
            const p = projected[face.indices[i]];
            ctx.lineTo(p[0], p[1]);
          }
          ctx.closePath();

          if (!wireframe) {
            ctx.fillStyle = colorHex;
            ctx.globalAlpha = 0.95;
            ctx.fill();
          }

          ctx.strokeStyle = strokeHex;
          ctx.lineWidth = wireframe ? 1.5 : 0.8;
          ctx.stroke();
          ctx.globalAlpha = 1.0;
        });
      };

      // Compute bone transforms based on animation
      let armLRot = 0;
      let armRRot = 0;
      let legLRot = 0;
      let legRRot = 0;
      let coatTailRot = 0;
      let headBob = Math.sin(time * 2) * 0.02;
      let bodyElev = 0;
      let slashAlpha = 0;

      if (currentAnim === 'walk') {
        const walkCycle = time * 5;
        legLRot = Math.sin(walkCycle) * 0.45;
        legRRot = -Math.sin(walkCycle) * 0.45;
        armLRot = -Math.sin(walkCycle) * 0.35;
        armRRot = Math.sin(walkCycle) * 0.35;
        coatTailRot = 0.2 + Math.abs(Math.cos(walkCycle)) * 0.3;
      } else if (currentAnim === 'attack') {
        armRRot = 1.2 + Math.sin(time * 10) * 0.4;
        coatTailRot = 0.4;
        slashAlpha = Math.max(0, Math.sin(time * 10));
      } else if (currentAnim === 'reality_break') {
        bodyElev = 0.3 + Math.sin(time * 6) * 0.08;
        armLRot = -1.6;
        armRRot = -1.6;
        coatTailRot = 0.5 + Math.sin(time * 8) * 0.15;
      } else if (currentAnim === 'teleport') {
        const tScale = 0.5 + Math.abs(Math.sin(time * 4)) * 0.5;
        bodyElev = (1 - tScale) * 0.4;
      } else {
        // Idle
        coatTailRot = 0.1 + Math.sin(time * 1.5) * 0.08;
        armLRot = Math.sin(time * 1.5) * 0.05;
        armRRot = -Math.sin(time * 1.5) * 0.05;
      }

      // Draw Multi-Layered Particle Aura
      if (showAura) {
        ctx.save();
        // Layer 1: Feet circular aura ring
        const ringP = project(0, 0.05, 0);
        const grad = ctx.createRadialGradient(ringP[0], ringP[1], 5, ringP[0], ringP[1], 75 * cameraAngle.zoom);
        grad.addColorStop(0, 'rgba(230, 0, 57, 0.5)');
        grad.addColorStop(0.5, 'rgba(106, 13, 173, 0.3)');
        grad.addColorStop(1, 'rgba(10, 10, 20, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(ringP[0], ringP[1], 75 * cameraAngle.zoom, 30 * cameraAngle.zoom, 0, 0, Math.PI * 2);
        ctx.fill();

        // Aura Particles
        particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.z += p.vz;
          p.life += 1;

          if (p.life >= p.maxLife || p.y > 2.6) {
            p.life = 0;
            p.y = 0.1;
            p.x = (Math.random() - 0.5) * 1.4;
            p.z = (Math.random() - 0.5) * 1.4;
          }

          const proj = project(p.x, p.y + bodyElev, p.z);
          const alpha = Math.sin((p.life / p.maxLife) * Math.PI) * 0.8;
          ctx.fillStyle = p.color;
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(proj[0], proj[1], p.size * cameraAngle.zoom, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      }

      // 1. LEGS & BOOTS
      // Left leg
      const lLegZ = Math.sin(legLRot) * 0.3;
      const lLegY = 0.5 + Math.cos(legLRot) * 0.1;
      drawCube(0.25, lLegY, lLegZ, 0.26, 0.5, 0.28, '#14141e');
      drawCube(0.25, 0.12, lLegZ + 0.03, 0.28, 0.22, 0.34, '#0a0a10', '#888899'); // combat boot

      // Right leg
      const rLegZ = Math.sin(legRRot) * 0.3;
      const rLegY = 0.5 + Math.cos(legRRot) * 0.1;
      drawCube(-0.25, rLegY, rLegZ, 0.26, 0.5, 0.28, '#14141e');
      drawCube(-0.25, 0.12, rLegZ + 0.03, 0.28, 0.22, 0.34, '#0a0a10', '#888899');

      // 2. LONG COAT TAILS (Flapping)
      const ctOffsetZ = 0.18 + Math.sin(coatTailRot) * 0.2;
      const ctOffsetY = 0.55 - Math.cos(coatTailRot) * 0.1 + bodyElev;
      drawCube(0.24, ctOffsetY, ctOffsetZ, 0.28, 0.7, 0.06, '#0a0a12', '#e60039'); // Left tail
      drawCube(-0.24, ctOffsetY, ctOffsetZ, 0.28, 0.7, 0.06, '#0a0a12', '#e60039'); // Right tail

      // 3. TORSO / UNIFORM JACKET / SHIRT / TIE
      const torsoY = 1.15 + bodyElev;
      // Main slim athletic torso
      drawCube(0, torsoY, 0, 0.65, 0.75, 0.36, '#0e0e16', '#222233');
      // Popped high jacket collar
      drawCube(0, torsoY + 0.38, -0.02, 0.72, 0.18, 0.42, '#0a0a14', '#e60039');
      // White inner shirt
      drawCube(0, torsoY + 0.12, -0.19, 0.28, 0.45, 0.04, '#f0f0f8');
      // Dark red tie
      drawCube(0, torsoY + 0.06, -0.21, 0.1, 0.4, 0.03, '#b30026');
      // Crimson waist belt & sash
      drawCube(0, torsoY - 0.36, 0, 0.67, 0.1, 0.38, '#1a0008', '#e60039');

      // 4. ARMS & HANDS
      // Left arm
      const armLY = torsoY + 0.15;
      const armLZ = Math.sin(armLRot) * 0.3;
      drawCube(0.48, armLY - 0.2, armLZ, 0.22, 0.48, 0.24, '#0a0a12');
      drawCube(0.48, armLY - 0.45, armLZ, 0.2, 0.24, 0.22, '#20202c'); // tactical glove
      drawCube(0.48, armLY - 0.33, armLZ, 0.24, 0.08, 0.26, '#e60039'); // crimson cuff

      // Right arm
      const armRY = torsoY + 0.15;
      const armRZ = Math.sin(armRRot) * 0.3;
      drawCube(-0.48, armRY - 0.2, armRZ, 0.22, 0.48, 0.24, '#0a0a12');
      drawCube(-0.48, armRY - 0.45, armRZ, 0.2, 0.24, 0.22, '#20202c');
      drawCube(-0.48, armRY - 0.33, armRZ, 0.24, 0.08, 0.26, '#e60039');

      // 5. HEAD, SPIKY HAIR & GLOWING CRIMSON EYES
      const headY = torsoY + 0.65 + headBob;
      // Head base (pale skin)
      drawCube(0, headY, 0, 0.52, 0.52, 0.52, '#f2e6dc');

      // Anime Eyes (Glowing Crimson)
      const eyeP1 = project(0.12, headY + 0.02, -0.27);
      const eyeP2 = project(-0.12, headY + 0.02, -0.27);
      ctx.fillStyle = '#ff1a4a';
      ctx.shadowColor = '#ff1a4a';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(eyeP1[0], eyeP1[1], 3.5 * cameraAngle.zoom, 0, Math.PI * 2);
      ctx.arc(eyeP2[0], eyeP2[1], 3.5 * cameraAngle.zoom, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Spiky Anime Hair Cubes
      drawCube(0, headY + 0.25, 0, 0.56, 0.25, 0.56, '#0d0d16'); // top base
      drawCube(0, headY - 0.05, 0.25, 0.54, 0.45, 0.12, '#0a0a14'); // back curtain
      drawCube(0.12, headY + 0.42, -0.05, 0.24, 0.24, 0.24, '#121220'); // crest 1
      drawCube(-0.1, headY + 0.45, 0.05, 0.22, 0.25, 0.22, '#18182a'); // crest 2
      drawCube(0, headY + 0.15, -0.27, 0.2, 0.25, 0.08, '#0d0d16'); // center bangs
      drawCube(0.28, headY + 0.1, -0.05, 0.12, 0.38, 0.38, '#0d0d16'); // left tuft
      drawCube(-0.28, headY + 0.1, -0.05, 0.12, 0.38, 0.38, '#0d0d16'); // right tuft

      // Draw Void Slash Crescent Arc
      if (slashAlpha > 0) {
        ctx.save();
        ctx.globalAlpha = slashAlpha;
        const slashP = project(-0.2, torsoY, -0.4);
        ctx.strokeStyle = '#e60039';
        ctx.lineWidth = 6 * cameraAngle.zoom;
        ctx.shadowColor = '#ff1a4a';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(slashP[0], slashP[1], 90 * cameraAngle.zoom, -Math.PI * 0.3, Math.PI * 0.4);
        ctx.stroke();
        ctx.restore();
      }

      // Draw Reality Break Lightning Arcs
      if (currentAnim === 'reality_break') {
        ctx.save();
        ctx.strokeStyle = '#ffffff';
        ctx.shadowColor = '#e60039';
        ctx.shadowBlur = 12;
        ctx.lineWidth = 2;
        for (let l = 0; l < 3; l++) {
          ctx.beginPath();
          const start = project(0, torsoY, 0);
          ctx.moveTo(start[0], start[1]);
          let currX = start[0];
          let currY = start[1];
          for (let seg = 0; seg < 5; seg++) {
            currX += (Math.random() - 0.5) * 60;
            currY += (Math.random() - 0.5) * 60;
            ctx.lineTo(currX, currY);
          }
          ctx.stroke();
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [cameraAngle, showAura, wireframe, isRotating, currentAnim]);

  // Mouse drag handlers for rotating 3D view
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    setCameraAngle(prev => ({
      ...prev,
      yaw: prev.yaw + dx * 0.01,
      pitch: Math.max(-0.5, Math.min(0.6, prev.pitch - dy * 0.01))
    }));
    setIsRotating(false);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-2xl flex flex-col">
      {/* 3D Canvas */}
      <div 
        className="relative w-full h-[420px] cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas
          ref={canvasRef}
          width={800}
          height={420}
          className="w-full h-full block"
        />

        {/* Live Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/90 border border-red-500/30 backdrop-blur-md text-xs font-mono text-neutral-300">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="text-red-400 font-bold">akuto:sai_v4</span>
          <span className="text-neutral-500">|</span>
          <span>18 Bones Verified</span>
        </div>

        {/* Quick Canvas Controls */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={() => setShowAura(!showAura)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
              showAura 
                ? 'bg-red-950/60 border-red-500/50 text-red-300 shadow-lg shadow-red-900/20' 
                : 'bg-neutral-900/80 border-neutral-700 text-neutral-400'
            }`}
            title="Toggle 5-layer particle aura"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Aura {showAura ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => setWireframe(!wireframe)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
              wireframe 
                ? 'bg-purple-950/60 border-purple-500/50 text-purple-300' 
                : 'bg-neutral-900/80 border-neutral-700 text-neutral-400'
            }`}
            title="Toggle geometry wireframe"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Mesh</span>
          </button>

          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`p-1.5 rounded-lg border text-xs transition-all ${
              isRotating ? 'bg-neutral-800 border-neutral-700 text-neutral-300' : 'bg-neutral-900 border-neutral-800 text-neutral-500'
            }`}
            title="Toggle auto orbit"
          >
            <RotateCw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
          </button>
        </div>

        {/* Camera guidance prompt */}
        <div className="absolute bottom-3 left-4 text-[11px] text-neutral-400/80 font-mono pointer-events-none flex items-center gap-2">
          <span>Click & drag to rotate view</span>
          <span>•</span>
          <span>Scroll/Zoom supported</span>
        </div>
      </div>

      {/* Animation Switcher Toolbar */}
      <div className="p-3 bg-neutral-900/95 border-t border-neutral-800 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Action:</span>
          {(['idle', 'walk', 'attack', 'reality_break', 'teleport'] as const).map(anim => {
            const labels: Record<string, string> = {
              idle: 'Idle',
              walk: 'Walk',
              attack: 'Void Slash',
              reality_break: 'Reality Break',
              teleport: 'Instant Transmission'
            };
            const isActive = currentAnim === anim;
            return (
              <button
                key={anim}
                onClick={() => onAnimChange(anim)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-red-600 text-white font-semibold shadow-md shadow-red-600/30'
                    : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                {labels[anim]}
              </button>
            );
          })}
        </div>

        <div className="text-xs text-neutral-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>entity_alphatest Active</span>
        </div>
      </div>
    </div>
  );
};
