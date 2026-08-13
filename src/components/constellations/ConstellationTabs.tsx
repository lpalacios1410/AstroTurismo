import { constellations } from '../../data/constellations';
import type { Constellation } from '../../types/constellation';

interface Props {
  activeId: Constellation['id'];
  onSelect: (id: Constellation['id']) => void;
}

export default function ConstellationTabs({ activeId, onSelect }: Props) {
  return (
    <div
      className="flex flex-wrap items-center gap-2"
      role="tablist"
      aria-label="Seleccionar constelación"
    >
      {constellations.map((c) => {
        const active = c.id === activeId;
        return (
          <button
            key={c.id}
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(c.id)}
            className={[
              'rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-300',
              active
                ? 'border-celestial-purple bg-celestial-purple/10 text-celestial-purple shadow-neon-purple'
                : 'border-white/10 text-celestial-muted hover:border-white/25 hover:text-white',
            ].join(' ')}
          >
            {c.name}
          </button>
        );
      })}
    </div>
  );
}
