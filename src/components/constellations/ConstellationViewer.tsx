import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { constellations } from '../../data/constellations';
import type { Constellation, StarPoint } from '../../types/constellation';
import { gsap } from '../../utils/gsap';
import ConstellationCanvas from './ConstellationCanvas';
import ConstellationTabs from './ConstellationTabs';

interface Readout {
  x: number;
  y: number;
}

const fmtRA = (x: number) => {
  const hours = (x / 100) * 24;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m`;
};

const fmtDec = (y: number) => {
  const deg = 90 - (y / 100) * 180;
  const sign = deg >= 0 ? '+' : '−';
  const abs = Math.abs(deg);
  const d = Math.floor(abs);
  const m = Math.round((abs - d) * 60);
  return `${sign}${String(d).padStart(2, '0')}° ${String(m).padStart(2, '0')}'`;
};

export default function ConstellationViewer() {
  const [active, setActive] = useState<Constellation>(constellations[0]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [lockedIndex, setLockedIndex] = useState<number | null>(null);
  const [pointer, setPointer] = useState<Readout | null>(null);
  const apertureRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((pos: Readout | null) => setPointer(pos), []);
  const handleHover = useCallback((index: number | null) => setHoveredIndex(index), []);
  const handleLock = useCallback((index: number | null) => setLockedIndex(index), []);

  const select = (id: Constellation['id']) => {
    setActive(constellations.find((c) => c.id === id) ?? constellations[0]);
    setHoveredIndex(null);
    setLockedIndex(null);
    setPointer(null);
  };

  useEffect(() => {
    const el = apertureRef.current;
    if (!el) return;
    const context = gsap.context(() => {
      gsap.fromTo(
        el,
        { scale: 0.96, opacity: 0.35 },
        { scale: 1, opacity: 1, duration: 0.55, ease: 'power2.out' },
      );
    }, el);
    return () => context.revert();
  }, [active.id]);

  const target = useMemo<StarPoint | null>(() => {
    if (hoveredIndex !== null) return active.stars[hoveredIndex] ?? null;
    if (lockedIndex !== null) return active.stars[lockedIndex] ?? null;
    return null;
  }, [hoveredIndex, lockedIndex, active]);

  const readout: Readout | null = pointer ?? (target ? { x: target.x, y: target.y } : null);
  const tracking = pointer !== null || target !== null;

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:items-stretch">
      <div
        ref={apertureRef}
        className="surface-glass relative overflow-hidden lg:col-span-7"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <p className="label-sm text-celestial-muted">Visor de constelaciones</p>
          <p className="hud-tnum label-sm text-celestial-muted">
            FOV 100° · AZ 340°
          </p>
        </div>

        <div className="p-6">
          <ConstellationCanvas
            key={active.id}
            constellation={active}
            hoveredIndex={hoveredIndex}
            lockedIndex={lockedIndex}
            onHover={handleHover}
            onLock={handleLock}
            onMove={handleMove}
          />
        </div>

        <div className="border-t border-white/10 px-6 py-4">
          <ConstellationTabs
            activeId={active.id}
            onSelect={select}
          />
        </div>
      </div>

      <div className="flex flex-col justify-between gap-8 lg:col-span-5">
        <div className="surface-glass flex flex-1 flex-col p-8">
          <p className="label-sm text-celestial-purple">Constelación activa</p>
          <h3 className="mt-4 font-display text-4xl font-bold text-white">
            {active.name}
          </h3>
          <p className="mt-3 leading-relaxed text-celestial-muted">
            {active.subtitle}
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-white/10 bg-celestial-bg/40 p-4">
              <dt className="label-sm text-celestial-muted">Estrellas</dt>
              <dd className="hud-tnum mt-2 font-display text-2xl font-bold text-celestial-teal">
                {active.stars.length}
              </dd>
            </div>
            <div className="rounded-lg border border-white/10 bg-celestial-bg/40 p-4">
              <dt className="label-sm text-celestial-muted">Líneas</dt>
              <dd className="hud-tnum mt-2 font-display text-2xl font-bold text-celestial-teal">
                {active.lines.length}
              </dd>
            </div>
          </dl>
        </div>

        <div className="surface-glass p-6">
          <div className="flex items-center justify-between">
            <p className="label-sm text-celestial-muted">Telemetría</p>
            <span className="flex items-center gap-2 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-celestial-muted">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  tracking
                    ? 'animate-pulse bg-celestial-teal shadow-neon-teal'
                    : 'bg-celestial-muted/40'
                }`}
              />
              {tracking ? 'Seguimiento' : 'Inactivo'}
            </span>
          </div>

          <dl className="hud-tnum mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <dt className="text-celestial-muted">Asc. recta</dt>
              <dd className="font-medium text-celestial-teal">
                {readout ? fmtRA(readout.x) : '--h --m'}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-celestial-muted">Declinación</dt>
              <dd className="font-medium text-celestial-teal">
                {readout ? fmtDec(readout.y) : '±--° --′'}
              </dd>
            </div>
          </dl>

          <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/10 pt-4">
            <div>
              <p className="label-sm text-celestial-muted">Objetivo</p>
              <p className="mt-2 font-display text-lg font-semibold text-white">
                {target?.label ?? 'Campo abierto'}
              </p>
              <p className="hud-tnum mt-1 text-xs text-celestial-muted">
                {target
                  ? `x${target.x.toFixed(0)} · y${target.y.toFixed(0)}`
                  : 'Mueve el cursor para rastrear'}
              </p>
            </div>
            {lockedIndex !== null ? (
              <span className="rounded-full border border-celestial-purple/60 bg-celestial-purple/10 px-3 py-1.5 shadow-neon-purple">
                <span className="label-sm text-celestial-purple">Enfoque</span>
              </span>
            ) : (
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-celestial-purple/60 bg-celestial-purple/10 shadow-neon-purple">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="3.5" stroke="#BC13FE" strokeWidth="1.5" />
                  <circle cx="12" cy="12" r="9" stroke="#BC13FE" strokeWidth="0.5" strokeDasharray="2 2" />
                  <path d="M12 1v5M12 18v5M1 12h5M18 12h5" stroke="#BC13FE" strokeWidth="1" />
                </svg>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
