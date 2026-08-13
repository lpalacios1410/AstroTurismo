import { memo, useEffect, useMemo, useRef } from 'react';
import type { Constellation } from '../../types/constellation';
import { gsap } from '../../utils/gsap';

interface Props {
  constellation: Constellation;
  hoveredIndex: number | null;
  lockedIndex: number | null;
  onHover: (index: number | null) => void;
  onLock: (index: number | null) => void;
  onMove: (pos: { x: number; y: number } | null) => void;
}

interface FieldDot {
  x: number;
  y: number;
  size: number;
  delay: number;
  dur: number;
  color: string;
}

const FIELD_COLORS = ['#EAF2FF', '#EAF2FF', '#EAF2FF', '#EAF2FF', '#00F5FF', '#BC13FE'];

// PRNG determinista: servidor y cliente generan los mismos valores al
// hidratar, evitando el hydration mismatch (React compara el HTML del SSR
// con el render del cliente).
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function ConstellationCanvas({
  constellation,
  hoveredIndex,
  lockedIndex,
  onHover,
  onLock,
  onMove,
}: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const crossRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const fieldDots = useMemo<FieldDot[]>(() => {
    const rand = mulberry32(0xae5a);
    return Array.from({ length: 56 }, () => ({
      x: rand() * 100,
      y: rand() * 100,
      size: rand() < 0.8 ? 1 : 2,
      delay: rand() * 6,
      dur: 2 + rand() * 4,
      color: FIELD_COLORS[Math.floor(rand() * FIELD_COLORS.length)],
    }));
  }, []);

  const connectedLines = useMemo(() => {
    if (hoveredIndex === null) return null;
    return new Set(
      constellation.lines.flatMap((line, i) =>
        line.from === hoveredIndex || line.to === hoveredIndex ? [i] : [],
      ),
    );
  }, [hoveredIndex, constellation]);

  useEffect(() => {
    const frame = frameRef.current;
    const inner = innerRef.current;
    const field = fieldRef.current;
    const cross = crossRef.current;
    const svg = svgRef.current;
    if (!frame || !inner || !field || !cross || !svg) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const context = gsap.context(() => {
      const lines = gsap.utils.toArray<SVGLineElement>('line[data-line]', svg);
      gsap.fromTo(
        lines,
        { strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          duration: 1.1,
          ease: 'power2.out',
          stagger: 0.12,
        },
      );
      gsap.fromTo(
        svg.querySelectorAll('circle[data-star]'),
        { opacity: 0, scale: 0.4 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: 'back.out(2)',
          stagger: 0.05,
        },
      );
      gsap.fromTo(field, { opacity: 0 }, { opacity: 1, duration: 1.4 });

      if (!reduced) {
        gsap.to(field, {
          xPercent: 2,
          yPercent: -2,
          duration: 26,
          ease: 'none',
          yoyo: true,
          repeat: -1,
        });
      }
    }, inner);

    if (reduced) return () => context.revert();

    const quickRX = gsap.quickTo(inner, 'rotationX', { duration: 0.7, ease: 'power3.out' });
    const quickRY = gsap.quickTo(inner, 'rotationY', { duration: 0.7, ease: 'power3.out' });
    const quickCX = gsap.quickTo(cross, 'x', { duration: 0.45, ease: 'power3.out' });
    const quickCY = gsap.quickTo(cross, 'y', { duration: 0.45, ease: 'power3.out' });

    const center = () => ({
      x: frame.getBoundingClientRect().width / 2,
      y: frame.getBoundingClientRect().height / 2,
    });

    const onPointerMove = (e: PointerEvent) => {
      const rect = frame.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const nx = (x / rect.width) * 2 - 1;
      const ny = (y / rect.height) * 2 - 1;
      quickRY(nx * 7);
      quickRX(-ny * 7);
      quickCX(x);
      quickCY(y);
      onMove({
        x: Math.round((x / rect.width) * 100),
        y: Math.round((y / rect.height) * 100),
      });
    };

    const onPointerLeave = () => {
      const c = center();
      quickRX(0);
      quickRY(0);
      quickCX(c.x);
      quickCY(c.y);
      onMove(null);
    };

    const onPointerDown = () => onLock(null);

    const spawnMeteor = () => {
      const startX = 5 + Math.random() * 85;
      const startY = 5 + Math.random() * 85;
      const angle = -35 + Math.random() * 40;
      const dist = 55 + Math.random() * 45;
      const meteor = document.createElement('div');
      meteor.className = 'pointer-events-none absolute rounded-full';
      meteor.style.cssText = `left:${startX}%;top:${startY}%;width:${80 + Math.random() * 70}px;height:1.5px;background:linear-gradient(90deg,rgba(234,242,255,0.95),rgba(0,245,255,0.35),transparent);box-shadow:0 0 8px rgba(0,245,255,0.8);`;
      field.appendChild(meteor);
      const rad = (angle * Math.PI) / 180;
      gsap.fromTo(
        meteor,
        { xPercent: 0, yPercent: 0, opacity: 0 },
        { xPercent: Math.cos(rad) * dist, yPercent: Math.sin(rad) * dist, opacity: 1, duration: 0.5, ease: 'power1.in' },
      );
      gsap.to(meteor, {
        opacity: 0,
        duration: 0.6,
        delay: 0.55,
        onComplete: () => meteor.remove(),
      });
      timeout = window.setTimeout(spawnMeteor, 3500 + Math.random() * 6500);
    };

    let timeout = window.setTimeout(spawnMeteor, 2200 + Math.random() * 3500);

    frame.addEventListener('pointermove', onPointerMove);
    frame.addEventListener('pointerleave', onPointerLeave);
    frame.addEventListener('pointerdown', onPointerDown);

    return () => {
      context.revert();
      window.clearTimeout(timeout);
      frame.removeEventListener('pointermove', onPointerMove);
      frame.removeEventListener('pointerleave', onPointerLeave);
      frame.removeEventListener('pointerdown', onPointerDown);
    };
  }, []);

  const spawnRipple = (x: number, y: number, color: string) => {
    const field = fieldRef.current;
    if (!field || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ring = document.createElement('div');
    ring.className = 'pointer-events-none absolute rounded-full border';
    ring.style.cssText = `left:${x}%;top:${y}%;width:6px;height:6px;margin:-3px 0 0 -3px;border-color:${color};box-shadow:0 0 14px ${color};`;
    field.appendChild(ring);
    gsap.fromTo(
      ring,
      { scale: 1, opacity: 0.9 },
      { scale: 13, opacity: 0, duration: 0.85, ease: 'power2.out', onComplete: () => ring.remove() },
    );
  };

  const lineOpacity = (i: number) => {
    if (connectedLines) return connectedLines.has(i) ? 0.95 : 0.14;
    return 0.55;
  };

  return (
    <div
      ref={frameRef}
      className="relative aspect-square w-full cursor-crosshair touch-none select-none"
      style={{ perspective: '900px' }}
    >
      {/* Campo rotatorio + clip circular del ocular */}
      <div
        ref={innerRef}
        className="absolute inset-0"
        style={{
          transformStyle: 'preserve-3d',
          clipPath: 'circle(50% at 50% 50%)',
          willChange: 'transform',
        }}
      >
        <div ref={fieldRef} className="absolute inset-0">
          {fieldDots.map((dot, i) => (
            <span
              key={i}
              className="animate-twinkle absolute rounded-full"
              style={{
                left: `${dot.x}%`,
                top: `${dot.y}%`,
                width: dot.size,
                height: dot.size,
                background: dot.color,
                animationDelay: `${dot.delay}s`,
                animationDuration: `${dot.dur}s`,
              }}
            />
          ))}

          <svg
            ref={svgRef}
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 h-full w-full"
            role="img"
            aria-label={`Diagrama de la constelación ${constellation.name}`}
          >
            <defs>
              <pattern id="reticle" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M10 0H0V10" fill="none" stroke="rgba(147,160,196,0.07)" strokeWidth="0.15" />
              </pattern>
              <radialGradient id="star-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#00F5FF" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#00F5FF" stopOpacity="0" />
              </radialGradient>
            </defs>

            <rect x="0" y="0" width="100" height="100" fill="url(#reticle)" />

            {constellation.lines.map((line, i) => {
              const a = constellation.stars[line.from];
              const b = constellation.stars[line.to];
              const active = connectedLines?.has(i);
              return (
                <line
                  key={i}
                  data-line
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  pathLength={1}
                  stroke="#00F5FF"
                  strokeWidth={active ? 0.7 : 0.35}
                  strokeOpacity={lineOpacity(i)}
                  strokeDasharray={1}
                  strokeDashoffset={1}
                  strokeLinecap="round"
                  className="transition-[stroke-opacity,stroke-width] duration-300"
                  style={
                    active
                      ? { filter: 'drop-shadow(0 0 3px rgba(0,245,255,0.9))' }
                      : undefined
                  }
                />
              );
            })}

            {constellation.stars.map((star, i) => {
              const isHovered = hoveredIndex === i;
              const isLocked = lockedIndex === i;
              return (
                <g
                  key={i}
                  className="cursor-pointer"
                  onMouseEnter={() => onHover(i)}
                  onMouseLeave={() => onHover(null)}
                  onFocus={() => onHover(i)}
                  onBlur={() => onHover(null)}
                  onClick={() => {
                    onLock(i);
                    spawnRipple(star.x, star.y, isLocked ? '#BC13FE' : '#00F5FF');
                  }}
                >
                  <circle
                    cx={star.x}
                    cy={star.y}
                    r={isHovered || isLocked ? 5.5 : 4}
                    fill="url(#star-glow)"
                    className="animate-twinkle"
                    style={{ animationDelay: `${i * 0.4}s`, animationDuration: `${2.4 + i * 0.3}s` }}
                  />
                  {isLocked && (
                    <circle
                      cx={star.x}
                      cy={star.y}
                      r={7}
                      fill="none"
                      stroke="#BC13FE"
                      strokeWidth={0.5}
                      strokeDasharray="1 1"
                      className="animate-spin [animation-duration:6s]"
                      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                    />
                  )}
                  <circle
                    data-star
                    cx={star.x}
                    cy={star.y}
                    r={isHovered || isLocked ? 2.8 : 2.1}
                    fill={isHovered || isLocked ? '#00F5FF' : '#EAF2FF'}
                    stroke="#00F5FF"
                    strokeWidth={isHovered || isLocked ? 0.5 : 0.2}
                    tabIndex={0}
                    role="button"
                    aria-label={star.label ?? `Estrella ${i + 1}`}
                    className="transition-[r,fill] duration-200"
                  />
                </g>
              );
            })}
          </svg>

          {/* Retícula de mira que sigue al cursor */}
          <div ref={crossRef} className="pointer-events-none absolute left-0 top-0 z-20 opacity-80">
            <svg width="46" height="46" viewBox="0 0 46 46" className="-translate-x-1/2 -translate-y-1/2">
              <circle cx="23" cy="23" r="2" fill="#00F5FF" />
              <circle cx="23" cy="23" r="9" fill="none" stroke="#00F5FF" strokeWidth="0.8" strokeOpacity="0.8" />
              <circle cx="23" cy="23" r="19" fill="none" stroke="#00F5FF" strokeWidth="0.4" strokeDasharray="2 2" strokeOpacity="0.5" />
              <path d="M23 2v8M23 36v8M2 23h8M36 23h8" stroke="#00F5FF" strokeWidth="1.1" strokeOpacity="0.9" />
            </svg>
          </div>
        </div>
      </div>

      {/* Anillo del ocular */}
      <div className="pointer-events-none absolute inset-0 z-30">
        <div className="absolute inset-0 rounded-full shadow-[inset_0_0_40px_rgba(0,0,0,0.9),inset_0_0_12px_rgba(0,245,255,0.15)]" />
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
          <circle cx="50" cy="50" r="49.2" fill="none" stroke="rgba(147,160,196,0.4)" strokeWidth="1.6" />
          <circle cx="50" cy="50" r="48.4" fill="none" stroke="rgba(0,245,255,0.35)" strokeWidth="0.4" />
          <circle
            cx="50"
            cy="50"
            r="47"
            fill="none"
            stroke="rgba(147,160,196,0.45)"
            strokeWidth="0.3"
            strokeDasharray="0.4 2.6"
          />
          {[0, 90, 180, 270].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const x1 = 50 + Math.cos(rad) * 45;
            const y1 = 50 + Math.sin(rad) * 45;
            const x2 = 50 + Math.cos(rad) * 49;
            const y2 = 50 + Math.sin(rad) * 49;
            return (
              <line
                key={deg}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#00F5FF"
                strokeWidth={deg === 0 ? 0.9 : 0.45}
                strokeOpacity={deg === 0 ? 0.95 : 0.6}
              />
            );
          })}
          <path d="M50 3.5 L52.4 8 L47.6 8 Z" fill="#BC13FE" />
        </svg>
        <svg
          viewBox="0 0 100 100"
          className="animate-spin absolute inset-0 h-full w-full [animation-duration:90s]"
        >
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="rgba(0,245,255,0.25)"
            strokeWidth="0.4"
            strokeDasharray="1 4.5"
          />
        </svg>
        <svg
          viewBox="0 0 100 100"
          className="animate-spin absolute inset-0 h-full w-full [animation-direction:reverse] [animation-duration:70s]"
        >
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="rgba(188,19,254,0.22)"
            strokeWidth="0.3"
            strokeDasharray="0.3 6"
          />
        </svg>
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_28%_22%,rgba(255,255,255,0.09),transparent_42%)]" />
      </div>
    </div>
  );
}

export default memo(ConstellationCanvas);
