import { motion } from 'framer-motion';
import { useEffect, useId, useState } from 'react';

export function TransitionBit({ module, title, reduced }: { module: number; title: string; reduced: boolean }) {
  const [visible, setVisible] = useState(false);
  const id = useId().replace(/:/g, '');
  useEffect(() => { setVisible(true); const timer = setTimeout(() => setVisible(false), 1700); return () => clearTimeout(timer); }, [module]);
  if (!visible || reduced) return null;
  return <motion.div key={module} className="transition-bit" aria-hidden="true" initial={{ x: 240, opacity: 0 }} animate={{ x: [240, -12, 0, 0, -25], opacity: [0, 1, 1, 1, 0] }} transition={{ duration: 1.65, times: [0, .32, .46, .8, 1] }}>
    <svg className="bit-character" viewBox="0 0 170 160">
      <defs>
        <linearGradient id={id + '-shell'} x1="0" y1="0" x2=".7" y2="1"><stop stopColor="#fffdf2" /><stop offset=".5" stopColor="#e0edf0" /><stop offset="1" stopColor="#94b5c1" /></linearGradient>
        <linearGradient id={id + '-face'} x2="0" y2="1"><stop stopColor="#234b59" /><stop offset="1" stopColor="#10232f" /></linearGradient>
      </defs>
      <ellipse cx="76" cy="150" rx="49" ry="7" fill="#000" opacity=".2" />
      <path className="bit-tether" d="M123 99Q147 98 170 80" fill="none" stroke="#e7cf98" strokeWidth="3" strokeLinecap="round" />
      <g className="bit-leg bit-leg-back"><path d="M87 124 99 140" stroke="#86aab7" strokeWidth="11" strokeLinecap="round" /><rect x="88" y="137" width="27" height="12" rx="6" fill="#dce9ea" /></g>
      <g className="bit-leg bit-leg-front"><path d="M65 124 51 140" stroke="#a4c0ca" strokeWidth="11" strokeLinecap="round" /><rect x="37" y="137" width="29" height="12" rx="6" fill="#eef4ed" /></g>
      <g className="bit-body">
        <path d="M51 99Q30 99 32 82" fill="none" stroke="#bed5da" strokeWidth="10" strokeLinecap="round" /><circle cx="31" cy="80" r="8" fill="#f0f4e9" />
        <rect x="50" y="86" width="51" height="44" rx="18" fill={'url(#' + id + '-shell)'} />
        <rect x="62" y="100" width="27" height="18" rx="8" fill="#163846" /><path d="M70 109h11m-5-5v10" stroke="#bcef9d" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M99 100 113 106 125 98" fill="none" stroke="#c8dde1" strokeWidth="11" strokeLinecap="round" />
        <circle cx="125" cy="98" r="8" fill="#eff6ed" /><path d="m125 94 4 4-4 4" fill="none" stroke="#8facb6" strokeWidth="2" strokeLinecap="round" />
        <g className="bit-head">
          <path d="M73 31 69 17" stroke="#b6d0d6" strokeWidth="4" strokeLinecap="round" /><circle cx="68" cy="13" r="7" fill="#d6fa87" /><circle cx="66" cy="11" r="2" fill="#fff" />
          <rect x="24" y="51" width="13" height="25" rx="6" fill="#77b8b5" /><rect x="111" y="51" width="13" height="25" rx="6" fill="#77b8b5" />
          <rect x="31" y="29" width="86" height="64" rx="26" fill={'url(#' + id + '-shell)'} /><path d="M45 39Q68 30 92 38" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".8" />
          <rect x="40" y="43" width="68" height="40" rx="17" fill={'url(#' + id + '-face)'} />
          <g className="bit-eyes" fill="#a0f0dc"><rect x="52" y="53" width="10" height="16" rx="5" /><rect x="84" y="53" width="10" height="16" rx="5" /></g>
          <ellipse cx="49" cy="72" rx="5" ry="2.5" fill="#f6a0aa" opacity=".75" /><ellipse cx="97" cy="72" rx="5" ry="2.5" fill="#f6a0aa" opacity=".75" />
          <path d="M67 71Q73 78 80 70" fill="none" stroke="#a0f0dc" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      </g>
      <path d="m19 39 2-6 2 6 6 2-6 2-2 6-2-6-6-2Zm109-18 1.5-4 1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5Z" fill="#d6fa87" opacity=".85" />
    </svg>
    <motion.div className="bit-page" initial={{ rotate: 9 }} animate={{ rotate: [9, -3, 1, 0] }} transition={{ duration: 1.1 }}>
      <span className="bit-page-kicker">UMA IDEIA PUXA A PRÓXIMA</span><strong>{title}</strong>
      <div className="bit-page-footer"><i /><span>SYNAPSE</span><b>{String(module).padStart(2, '0')} / 14</b></div>
    </motion.div>
  </motion.div>;
}
