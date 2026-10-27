import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let frame = 0;
    let raf = 0;
    let width = 0;
    let height = 0;
    let columns = 0;
    let drops: number[] = [];
    const fontSize = 14;
    const glyphs = 'アカサタナハマヤラワ012345789ABCDEF<>/{}[]';
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      columns = Math.ceil(width / fontSize);
      drops = Array.from({ length: columns }, () => Math.random() * -(height / fontSize));
      ctx.clearRect(0, 0, width, height);
    };

    const draw = () => {
      frame += 1;
      if (frame % 2 === 0) {
        ctx.fillStyle = 'rgba(5, 7, 6, 0.075)';
        ctx.fillRect(0, 0, width, height);
        ctx.font = `${fontSize}px 'DM Mono', monospace`;
        for (let i = 0; i < drops.length; i += 1) {
          const char = glyphs[Math.floor(Math.random() * glyphs.length)];
          const x = i * fontSize;
          const y = drops[i] * fontSize;
          ctx.fillStyle = Math.random() > 0.965 ? 'rgba(0, 229, 255, .75)' : 'rgba(0, 255, 102, .42)';
          ctx.fillText(char, x, y);
          if (y > height && Math.random() > 0.975) drops[i] = 0;
          drops[i] += Math.random() > 0.94 ? 1.4 : 0.55;
        }
      }
      raf = window.requestAnimationFrame(draw);
    };

    resize();
    if (!reduceMotion) raf = window.requestAnimationFrame(draw);
    const onResize = () => resize();
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [reduceMotion]);

  return <canvas ref={canvasRef} className="matrix-canvas" aria-hidden="true" />;
}
