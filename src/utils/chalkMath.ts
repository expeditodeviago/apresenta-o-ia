import { ChalkColor } from '../types/presentation';

// Color map for Chalk colors
export const CHALK_COLORS: Record<ChalkColor, {
  hex: string;
  glow: string;
  rgba: (alpha: number) => string;
  name: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
}> = {
  white: {
    hex: '#f8fafc',
    glow: 'chalk-glow-white',
    rgba: (a) => `rgba(248, 250, 252, ${a})`,
    name: 'Giz Branco',
    badgeBg: 'bg-slate-100/10',
    badgeBorder: 'border-slate-300/40',
    badgeText: 'text-slate-100',
  },
  cream: {
    hex: '#fef3c7',
    glow: 'chalk-glow-amber',
    rgba: (a) => `rgba(254, 243, 199, ${a})`,
    name: 'Giz Creme',
    badgeBg: 'bg-amber-100/10',
    badgeBorder: 'border-amber-200/40',
    badgeText: 'text-amber-100',
  },
  green: {
    hex: '#22c55e',
    glow: 'chalk-glow-green',
    rgba: (a) => `rgba(34, 197, 94, ${a})`,
    name: 'Giz Verde',
    badgeBg: 'bg-emerald-500/15',
    badgeBorder: 'border-emerald-400/50',
    badgeText: 'text-emerald-400',
  },
  amber: {
    hex: '#f59e0b',
    glow: 'chalk-glow-amber',
    rgba: (a) => `rgba(245, 158, 11, ${a})`,
    name: 'Giz Âmbar',
    badgeBg: 'bg-amber-500/15',
    badgeBorder: 'border-amber-400/50',
    badgeText: 'text-amber-400',
  },
  blue: {
    hex: '#38bdf8',
    glow: 'chalk-glow-blue',
    rgba: (a) => `rgba(56, 189, 248, ${a})`,
    name: 'Giz Azul',
    badgeBg: 'bg-sky-500/15',
    badgeBorder: 'border-sky-400/50',
    badgeText: 'text-sky-300',
  },
  rose: {
    hex: '#ef4444',
    glow: 'chalk-glow-coral',
    rgba: (a) => `rgba(239, 68, 68, ${a})`,
    name: 'Giz Coral',
    badgeBg: 'bg-rose-500/15',
    badgeBorder: 'border-rose-400/50',
    badgeText: 'text-rose-400',
  },
  purple: {
    hex: '#c084fc',
    glow: 'chalk-glow-purple',
    rgba: (a) => `rgba(192, 132, 252, ${a})`,
    name: 'Giz Lilás',
    badgeBg: 'bg-purple-500/15',
    badgeBorder: 'border-purple-400/50',
    badgeText: 'text-purple-300',
  },
  orange: {
    hex: '#fb923c',
    glow: 'chalk-glow-amber',
    rgba: (a) => `rgba(251, 146, 60, ${a})`,
    name: 'Giz Laranja',
    badgeBg: 'bg-orange-500/15',
    badgeBorder: 'border-orange-400/50',
    badgeText: 'text-orange-300',
  },
  cyan: {
    hex: '#00f2fe',
    glow: 'glow-cyan',
    rgba: (a) => `rgba(0, 242, 254, ${a})`,
    name: 'Cyan Neon',
    badgeBg: 'bg-cyan-500/15',
    badgeBorder: 'border-cyan-400/50',
    badgeText: 'text-cyan-300',
  },
  matrix: {
    hex: '#00ff88',
    glow: 'glow-green',
    rgba: (a) => `rgba(0, 255, 136, ${a})`,
    name: 'Verde Matrix',
    badgeBg: 'bg-emerald-500/15',
    badgeBorder: 'border-emerald-400/50',
    badgeText: 'text-emerald-300',
  },
};

/**
 * Generates rough sketchy SVG path commands for a hand-drawn rectangle
 */
export function generateRoughRectPath(
  x: number,
  y: number,
  width: number,
  height: number,
  roughness: number = 2.5
): string {
  const r = () => (Math.random() - 0.5) * roughness;
  const padding = 2;
  const w = width - padding * 2;
  const h = height - padding * 2;
  const ox = x + padding;
  const oy = y + padding;

  // 1st stroke
  let d = `M ${ox + r()} ${oy + r()} `;
  d += `Q ${ox + w / 2 + r()} ${oy - r()}, ${ox + w + r()} ${oy + r()} `;
  d += `Q ${ox + w + r()} ${oy + h / 2 + r()}, ${ox + w + r()} ${oy + h + r()} `;
  d += `Q ${ox + w / 2 + r()} ${oy + h + r()}, ${ox + r()} ${oy + h + r()} `;
  d += `Q ${ox - r()} ${oy + h / 2 + r()}, ${ox + r()} ${oy + r()} `;

  // 2nd slight offset stroke for authentic double-chalk pass
  d += `M ${ox + 2 + r()} ${oy + 1 + r()} `;
  d += `L ${ox + w - 1 + r()} ${oy + 1 + r()} `;
  d += `L ${ox + w - 1 + r()} ${oy + h - 1 + r()} `;
  d += `L ${ox + 1 + r()} ${oy + h - 1 + r()} Z`;

  return d;
}

/**
 * Generates an organic hand-drawn curved chalk connection between two points
 */
export function generateChalkArrowPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  curved: 'up' | 'down' | 'straight' | 's-curve' = 'straight'
): { path: string; arrowHead: string; midX: number; midY: number } {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy);

  let cx1 = x1 + dx * 0.33;
  let cy1 = y1 + dy * 0.33;
  let cx2 = x1 + dx * 0.66;
  let cy2 = y1 + dy * 0.66;

  const curvature = Math.min(60, dist * 0.25);

  if (curved === 'up') {
    cy1 -= curvature;
    cy2 -= curvature;
  } else if (curved === 'down') {
    cy1 += curvature;
    cy2 += curvature;
  } else if (curved === 's-curve') {
    cy1 -= curvature;
    cy2 += curvature;
  }

  const path = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;

  // Arrowhead angle at end of bezier curve
  const angle = Math.atan2(y2 - cy2, x2 - cx2);
  const arrowSize = 14;
  const leftX = x2 - arrowSize * Math.cos(angle - Math.PI / 6);
  const leftY = y2 - arrowSize * Math.sin(angle - Math.PI / 6);
  const rightX = x2 - arrowSize * Math.cos(angle + Math.PI / 6);
  const rightY = y2 - arrowSize * Math.sin(angle + Math.PI / 6);

  const arrowHead = `M ${leftX} ${leftY} L ${x2} ${y2} L ${rightX} ${rightY}`;

  const midX = (x1 + x2) / 2 + (curved === 'up' ? -10 : curved === 'down' ? 10 : 0);
  const midY = (y1 + y2) / 2 + (curved === 'up' ? -curvature * 0.6 : curved === 'down' ? curvature * 0.6 : 0);

  return { path, arrowHead, midX, midY };
}
