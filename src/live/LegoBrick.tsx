import type { CSSProperties } from 'react';

const BRICK_COLORS = ['#f4bd42', '#43a9f0', '#ef6571', '#48c89b', '#ad85ed', '#f39a51'];

/** A plastic brick with a top, side wall and four raised studs. */
export function LegoBrick({ value, className = '' }: { value: number; className?: string }) {
  const label = String.fromCharCode(65 + value);
  return <svg className={'lego-brick ' + className} viewBox="0 0 100 82" role="img" aria-label={'Peça ' + label} style={{ '--brick-color': BRICK_COLORS[value % BRICK_COLORS.length] } as CSSProperties}>
    <ellipse cx="50" cy="73" rx="43" ry="7" fill="#000" opacity=".18" />
    <path d="M7 34 73 34 92 23 92 60 73 73 7 61Z" fill="var(--brick-color)" />
    <path d="M73 34 92 23V60L73 73Z" fill="#000" opacity=".23" />
    <path d="M7 34 73 34V73L7 61Z" fill="#000" opacity=".06" />
    <path d="M7 34 26 20H92L73 34Z" fill="var(--brick-color)" />
    <path d="M7 34 26 20H92L73 34Z" fill="#fff" opacity=".22" />
    {[{ x: 33, y: 19 }, { x: 61, y: 19 }, { x: 22, y: 28 }, { x: 50, y: 28 }].map(({ x, y }) => <g key={x}>
      <path d={`M${x - 9} ${y - 7}v6a9 4 0 0 0 18 0v-6`} fill="var(--brick-color)" stroke="#000" strokeOpacity=".08" />
      <ellipse cx={x} cy={y - 7} rx="9" ry="4" fill="var(--brick-color)" />
      <ellipse cx={x} cy={y - 7} rx="9" ry="4" fill="#fff" opacity=".3" />
      <path d={`M${x - 6} ${y - 8}q5 -2 10 0`} fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="1.3" strokeLinecap="round" />
    </g>)}
    <path d="M9 35H72M9 36V59" fill="none" stroke="#fff" strokeOpacity=".4" strokeWidth="1.5" />
    <text x="40" y="57" textAnchor="middle" fill="#132b3c" fontSize="21" fontWeight="800" aria-hidden="true">{label}</text>
  </svg>;
}

export function LegoChoices({ options = 3 }: { options?: number }) {
  return <div className="lego-choices" aria-label={options + ' tipos de peças disponíveis'}>{Array.from({ length: options }, (_, i) => <LegoBrick key={i} value={i} />)}</div>;
}
