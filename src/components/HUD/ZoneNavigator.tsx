import React from 'react';
import { ZONES } from '../../data/presentationData';
import { CHALK_COLORS } from '../../utils/chalkMath';

interface ZoneNavigatorProps {
  currentZoneId?: string;
  onSelectZone: (zoneId: string) => void;
}

export const ZoneNavigator: React.FC<ZoneNavigatorProps> = ({
  currentZoneId,
  onSelectZone,
}) => {
  return (
    <div className="fixed top-20 left-4 z-20 hidden lg:flex flex-col gap-1.5 no-pan select-none">
      <div className="chalk-hud rounded-xl px-2 py-1.5 flex flex-col gap-1">
        <span className="text-[9px] uppercase font-mono tracking-widest text-slate-400 font-bold px-1.5">
          Zonas da Lousa (1-5)
        </span>
        {ZONES.map((zone) => {
          const colorMeta = CHALK_COLORS[zone.color];
          const isCurrent = currentZoneId === zone.id;

          return (
            <button
              key={zone.id}
              onClick={() => onSelectZone(zone.id)}
              className={`px-2.5 py-1.5 rounded-lg text-left text-xs font-friendly transition-all flex items-center gap-2 ${
                isCurrent
                  ? `${colorMeta.badgeBg} ${colorMeta.badgeText} border ${colorMeta.badgeBorder} font-bold shadow-sm`
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: colorMeta.hex }}
              />
              <span className="font-mono text-[11px] font-bold">Z{zone.zoneNumber}:</span>
              <span className="truncate max-w-[130px]">{zone.title.split(':')[1] || zone.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
