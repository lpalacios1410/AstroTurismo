import { useEffect, useRef } from 'react';
import { gsap } from '../../utils/gsap';

interface Star {
  x: number;
  y: number;
  r: number;
  base: number;
  speed: number;
  phase: number;
  color: string;
}

const STAR_COLORS = ['#EAF2FF', '#EAF2FF', '#00F5FF', '#BC13FE'];

export default function StarBackground() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let stars: Star[] = [];
    let width = 0;
    let height = 0;

    const makeStars = () => {
      const count = Math.min(Math.floor((width * height) / 2600), 240);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.4 + Math.random() * 1.4,
        base: 0.25 + Math.random() * 0.65,
        speed: 0.5 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      }));
    };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      makeStars();
    };

    const draw = (time: number) => {
      const t = time / 1000;
      ctx.clearRect(0, 0, width, height);
      for (const s of stars) {
        const twinkle = reduced ? 1 : 0.5 + 0.5 * Math.sin(t * s.speed + s.phase);
        ctx.globalAlpha = Math.max(0.05, Math.min(1, s.base * twinkle));
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    resize();
    draw(0);

    const context = gsap.context(() => {
      if (!reduced) {
        gsap.ticker.add(draw);
        gsap.to(canvas, {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: wrap,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }, wrap);

    const observer = new ResizeObserver(() => resize());
    observer.observe(wrap);

    return () => {
      observer.disconnect();
      context.revert();
    };
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden">
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
    </div>
  );
}
