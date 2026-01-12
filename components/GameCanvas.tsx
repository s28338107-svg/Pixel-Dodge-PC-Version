
import React, { useRef, useEffect, useCallback } from 'react';
import { Difficulty, GameSettings } from '../types';
import { CANVAS_WIDTH, CANVAS_HEIGHT, DIFFICULTY_CONFIG } from '../constants';

interface GameCanvasProps {
  difficulty: Difficulty;
  settings: GameSettings;
  onGameOver: (score: number, survivalTime: number) => void;
  onScoreUpdate: (score: number) => void;
  isPaused: boolean;
  onPause: () => void;
}

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Spike extends GameObject {
  speed: number;
  rotation: number;
}

interface PowerUp extends GameObject {
  type: 'SLOW' | 'BOMB';
  active: boolean;
  pulse: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ difficulty, settings, onGameOver, onScoreUpdate, isPaused, onPause }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>();
  const spawnTimerRef = useRef<number>(0);
  const powerUpTimerRef = useRef<number>(0);
  
  const playerRef = useRef({ 
    x: CANVAS_WIDTH / 2 - 12, 
    y: CANVAS_HEIGHT - 70, 
    width: 24, 
    height: 24, 
    velX: 0,
    squash: 1,
    eyeDir: 0
  });
  const spikesRef = useRef<Spike[]>([]);
  const powerUpsRef = useRef<PowerUp[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const gameRunningRef = useRef(true);
  const scoreRef = useRef(0);
  const survivalTimeRef = useRef(0);
  
  const slowMoTimerRef = useRef(0);
  const screenShakeRef = useRef(0);

  const config = DIFFICULTY_CONFIG[difficulty];

  const spawnPowerUp = () => {
    const types: ('SLOW' | 'BOMB')[] = ['SLOW', 'BOMB'];
    const type = types[Math.floor(Math.random() * types.length)];
    powerUpsRef.current.push({
      x: 30 + Math.random() * (CANVAS_WIDTH - 60),
      y: -50,
      width: 24,
      height: 24,
      type,
      active: true,
      pulse: 0
    });
  };

  const createParticles = (x: number, y: number, color: string, count = 12) => {
    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        x, y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: 1.0,
        color,
        size: 4 + Math.random() * 6
      });
    }
  };

  const update = useCallback((deltaTime: number) => {
    if (!gameRunningRef.current || isPaused) return;

    if (screenShakeRef.current > 0) screenShakeRef.current -= deltaTime * 0.01;

    const speedFactor = slowMoTimerRef.current > 0 ? 0.35 : 1.0;
    if (slowMoTimerRef.current > 0) {
      slowMoTimerRef.current -= deltaTime;
    }

    const speed = 6;
    if (keysRef.current['a'] || keysRef.current['arrowleft'] || keysRef.current['leftbtn']) {
      playerRef.current.velX = -speed;
      playerRef.current.eyeDir = -4;
    } else if (keysRef.current['d'] || keysRef.current['arrowright'] || keysRef.current['rightbtn']) {
      playerRef.current.velX = speed;
      playerRef.current.eyeDir = 4;
    } else {
      playerRef.current.velX *= 0.8;
      playerRef.current.eyeDir *= 0.8;
    }

    playerRef.current.x += playerRef.current.velX;
    if (playerRef.current.x < 10) playerRef.current.x = 10;
    if (playerRef.current.x > CANVAS_WIDTH - playerRef.current.width - 10) playerRef.current.x = CANVAS_WIDTH - playerRef.current.width - 10;

    playerRef.current.squash = 1 + Math.abs(playerRef.current.velX) * 0.02;

    spawnTimerRef.current += deltaTime * speedFactor;
    if (spawnTimerRef.current > config.spawnRate) {
      const spikeWidth = 22 + Math.random() * 20;
      spikesRef.current.push({
        x: Math.random() * (CANVAS_WIDTH - spikeWidth),
        y: -60,
        width: spikeWidth,
        height: 40,
        speed: config.spikeSpeed + (Math.random() * 2),
        rotation: (Math.random() - 0.5) * 0.2
      });
      spawnTimerRef.current = 0;
    }

    powerUpTimerRef.current += deltaTime;
    if (powerUpTimerRef.current > 9000) {
      spawnPowerUp();
      powerUpTimerRef.current = 0;
    }

    for (let i = spikesRef.current.length - 1; i >= 0; i--) {
      const s = spikesRef.current[i];
      s.y += s.speed * speedFactor;

      if (
        playerRef.current.x < s.x + s.width &&
        playerRef.current.x + playerRef.current.width > s.x &&
        playerRef.current.y < s.y + s.height &&
        playerRef.current.y + playerRef.current.height > s.y
      ) {
        gameRunningRef.current = false;
        onGameOver(Math.floor(scoreRef.current), Math.floor(survivalTimeRef.current));
      }

      if (s.y > CANVAS_HEIGHT) spikesRef.current.splice(i, 1);
    }

    for (let i = powerUpsRef.current.length - 1; i >= 0; i--) {
      const p = powerUpsRef.current[i];
      p.y += 2.5 * speedFactor;
      p.pulse += deltaTime * 0.005;

      if (
        playerRef.current.x < p.x + p.width &&
        playerRef.current.x + playerRef.current.width > p.x &&
        playerRef.current.y < p.y + p.height &&
        playerRef.current.y + playerRef.current.height > p.y
      ) {
        if (p.type === 'SLOW') {
          slowMoTimerRef.current = 5000;
          createParticles(p.x + 12, p.y + 12, '#06b6d4', 15);
        } else if (p.type === 'BOMB') {
          createParticles(p.x + 12, p.y + 12, '#ef4444', 25);
          spikesRef.current = [];
          screenShakeRef.current = 6;
        }
        powerUpsRef.current.splice(i, 1);
      } else if (p.y > CANVAS_HEIGHT) {
        powerUpsRef.current.splice(i, 1);
      }
    }

    for (let i = particlesRef.current.length - 1; i >= 0; i--) {
      const p = particlesRef.current[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= deltaTime * 0.002;
      p.size *= 0.98;
      if (p.life <= 0) particlesRef.current.splice(i, 1);
    }

    survivalTimeRef.current += deltaTime / 1000;
    scoreRef.current += (deltaTime / 100) * config.scoreMultiplier * (1 + (survivalTimeRef.current / 45));
    onScoreUpdate(Math.floor(scoreRef.current));
  }, [config, onGameOver, onScoreUpdate, isPaused]);

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.save();
    if (screenShakeRef.current > 0) {
      ctx.translate((Math.random() - 0.5) * screenShakeRef.current * 12, (Math.random() - 0.5) * screenShakeRef.current * 12);
    }

    // High Contrast Retro Background
    ctx.fillStyle = '#0c0a09';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Grid lines for retro look
    ctx.strokeStyle = '#292524';
    ctx.lineWidth = 1;
    for (let x = 0; x < CANVAS_WIDTH; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CANVAS_HEIGHT); ctx.stroke();
    }
    for (let y = 0; y < CANVAS_HEIGHT; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_WIDTH, y); ctx.stroke();
    }

    particlesRef.current.forEach(p => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
    });
    ctx.globalAlpha = 1.0;

    const p = playerRef.current;
    ctx.save();
    ctx.translate(p.x + p.width/2, p.y + p.height/2);
    ctx.scale(p.squash, 1/p.squash);
    ctx.fillStyle = config.color;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.fillRect(-p.width/2, -p.height/2, p.width, p.height);
    ctx.strokeRect(-p.width/2, -p.height/2, p.width, p.height);
    
    ctx.fillStyle = '#000';
    ctx.fillRect(-8 + p.eyeDir, -8, 6, 6);
    ctx.fillRect(2 + p.eyeDir, -8, 6, 6);
    ctx.restore();

    powerUpsRef.current.forEach(pw => {
      const pulseScale = 1 + Math.sin(pw.pulse) * 0.1;
      ctx.save();
      ctx.translate(pw.x + 12, pw.y + 12);
      ctx.scale(pulseScale, pulseScale);
      
      if (pw.type === 'SLOW') {
        ctx.fillStyle = '#22d3ee';
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fillStyle = '#f97316';
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.fillRect(-2, -2, 4, 4);
      }
      ctx.restore();
    });

    spikesRef.current.forEach(s => {
      ctx.save();
      ctx.translate(s.x + s.width/2, s.y + s.height/2);
      ctx.rotate(s.rotation);
      ctx.fillStyle = '#f87171';
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-s.width/2, -s.height/2);
      ctx.lineTo(s.width/2, -s.height/2);
      ctx.lineTo(0, s.height/2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });

    ctx.font = '14px "Press Start 2P"';
    ctx.fillStyle = '#fff';
    ctx.fillText(`SCORE: ${Math.floor(scoreRef.current).toLocaleString()}`, 10, 30);
    
    ctx.font = '8px "Press Start 2P"';
    ctx.fillStyle = config.color;
    ctx.fillText(`${difficulty}`, 10, 50);

    if (slowMoTimerRef.current > 0) {
      const barWidth = (slowMoTimerRef.current / 5000) * 120;
      ctx.fillStyle = '#fff';
      ctx.fillRect(CANVAS_WIDTH - 134, 20, 124, 12);
      ctx.fillStyle = '#22d3ee';
      ctx.fillRect(CANVAS_WIDTH - 132, 22, barWidth, 8);
    }

    ctx.restore();
  }, [config.color, difficulty]);

  const loop = useCallback((time: number) => {
    if (lastTimeRef.current === undefined) lastTimeRef.current = time;
    const deltaTime = time - lastTimeRef.current;
    
    const frameLimit = settings.lowFPS ? 1000 / 30 : 0;
    if (deltaTime >= frameLimit) {
      update(deltaTime);
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) draw(ctx);
      lastTimeRef.current = time;
    }

    if (gameRunningRef.current) {
      requestRef.current = requestAnimationFrame(loop);
    }
  }, [draw, settings.lowFPS, update]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysRef.current[key] = true;
      if (key === 'escape' || key === 'p') {
        onPause();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => keysRef.current[e.key.toLowerCase()] = false;
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    requestRef.current = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [loop, onPause]);

  return (
    <div className="relative w-full h-full bg-stone-900 cursor-none select-none overflow-hidden border-t-8 border-white">
      <canvas 
        ref={canvasRef} 
        width={CANVAS_WIDTH} 
        height={CANVAS_HEIGHT}
        className="w-full h-full block"
      />
      
      {/* Pause Button */}
      <button 
        onClick={(e) => { e.stopPropagation(); onPause(); }}
        className="absolute top-4 right-4 z-50 p-2 bg-white text-black border-4 border-black hover:bg-stone-200 active:translate-y-1 pointer-events-auto text-[10px]"
      >
        PAUSE
      </button>
      
      <div className="absolute inset-x-0 bottom-0 flex justify-between h-full pointer-events-none z-40">
        <button 
          onMouseDown={() => keysRef.current['leftbtn'] = true}
          onMouseUp={() => keysRef.current['leftbtn'] = false}
          onMouseLeave={() => keysRef.current['leftbtn'] = false}
          onTouchStart={(e) => { e.preventDefault(); keysRef.current['leftbtn'] = true; }}
          onTouchEnd={(e) => { e.preventDefault(); keysRef.current['leftbtn'] = false; }}
          className="w-28 h-full pointer-events-auto bg-transparent active:bg-white/5 transition-all flex items-center justify-center text-5xl text-white/5 font-black"
        >
          &larr;
        </button>
        <button 
          onMouseDown={() => keysRef.current['rightbtn'] = true}
          onMouseUp={() => keysRef.current['rightbtn'] = false}
          onMouseLeave={() => keysRef.current['rightbtn'] = false}
          onTouchStart={(e) => { e.preventDefault(); keysRef.current['rightbtn'] = true; }}
          onTouchEnd={(e) => { e.preventDefault(); keysRef.current['rightbtn'] = false; }}
          className="w-28 h-full pointer-events-auto bg-transparent active:bg-white/5 transition-all flex items-center justify-center text-5xl text-white/5 font-black"
        >
          &rarr;
        </button>
      </div>
    </div>
  );
};

export default GameCanvas;
