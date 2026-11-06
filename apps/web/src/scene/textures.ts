import * as THREE from 'three';

/** Procedural textures generated at runtime — no external assets, works offline. */
function canvasTexture(size: number, draw: (ctx: CanvasRenderingContext2D, s: number) => void, repeat = 1): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  draw(ctx, size);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function rand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const cache = new Map<string, THREE.Texture>();
function cached(key: string, make: () => THREE.Texture) {
  let t = cache.get(key);
  if (!t) {
    t = make();
    cache.set(key, t);
  }
  return t;
}

/** Coral-stone and gypsum plaster: warm base, mottled noise, faint vertical weathering. */
export const plasterTexture = () =>
  cached('plaster', () =>
    canvasTexture(256, (ctx, s) => {
      ctx.fillStyle = '#d8bf98';
      ctx.fillRect(0, 0, s, s);
      const r = rand(7);
      for (let i = 0; i < 2600; i++) {
        const v = 180 + Math.floor(r() * 50);
        ctx.fillStyle = `rgba(${v + 20},${v},${v - 30},${0.08 + r() * 0.12})`;
        const w = 1 + r() * 4;
        ctx.fillRect(r() * s, r() * s, w, w);
      }
      for (let i = 0; i < 40; i++) {
        ctx.fillStyle = `rgba(120,90,60,${0.03 + r() * 0.05})`;
        ctx.fillRect(r() * s, 0, 1 + r() * 2, s);
      }
    }),
  );

export const sandTexture = () =>
  cached('sand', () =>
    canvasTexture(
      256,
      (ctx, s) => {
        ctx.fillStyle = '#cfae7f';
        ctx.fillRect(0, 0, s, s);
        const r = rand(11);
        for (let i = 0; i < 5000; i++) {
          const v = 170 + Math.floor(r() * 60);
          ctx.fillStyle = `rgba(${v + 25},${v + 5},${v - 35},0.12)`;
          ctx.fillRect(r() * s, r() * s, 1.5, 1.5);
        }
      },
      30,
    ),
  );

export const teakTexture = () =>
  cached('teak', () =>
    canvasTexture(128, (ctx, s) => {
      ctx.fillStyle = '#5a3a22';
      ctx.fillRect(0, 0, s, s);
      const r = rand(3);
      for (let y = 0; y < s; y += 2) {
        ctx.fillStyle = `rgba(${90 + r() * 40},${55 + r() * 25},${30 + r() * 15},0.5)`;
        ctx.fillRect(0, y, s, 1 + r() * 1.5);
      }
    }),
  );

/** Majlis carpet: deep red field with a geometric border and medallions. */
export const carpetTexture = () =>
  cached('carpet', () =>
    canvasTexture(512, (ctx, s) => {
      ctx.fillStyle = '#7d1f1a';
      ctx.fillRect(0, 0, s, s);
      ctx.strokeStyle = '#d6a96b';
      ctx.lineWidth = 10;
      ctx.strokeRect(22, 22, s - 44, s - 44);
      ctx.strokeStyle = '#0f2a3a';
      ctx.lineWidth = 6;
      ctx.strokeRect(44, 44, s - 88, s - 88);
      const step = 64;
      for (let x = 88; x < s - 80; x += step) {
        for (let y = 88; y < s - 80; y += step) {
          ctx.save();
          ctx.translate(x + 16, y + 16);
          ctx.rotate(Math.PI / 4);
          ctx.fillStyle = (x + y) % 128 === 0 ? '#d6a96b' : '#e9dcc4';
          ctx.fillRect(-9, -9, 18, 18);
          ctx.restore();
        }
      }
    }),
  );

export const waterTexture = () =>
  cached('water', () =>
    canvasTexture(
      128,
      (ctx, s) => {
        const g = ctx.createLinearGradient(0, 0, s, s);
        g.addColorStop(0, '#1f6f7a');
        g.addColorStop(1, '#35d6c3');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, s, s);
        ctx.strokeStyle = 'rgba(255,255,255,0.18)';
        for (let i = 0; i < 14; i++) {
          ctx.beginPath();
          ctx.moveTo(0, i * 10);
          ctx.bezierCurveTo(s / 3, i * 10 + 6, (2 * s) / 3, i * 10 - 6, s, i * 10);
          ctx.stroke();
        }
      },
      2,
    ),
  );
