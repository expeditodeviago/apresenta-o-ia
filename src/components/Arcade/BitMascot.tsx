import { useEffect, useId, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { usePresentationStore } from '../../store/usePresentationStore';

export function BitMascot() {
  const score = usePresentationStore(s => s.score);
  const [happy, setHappy] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const previousScore = useRef(score);
  const reduceMotion = useReducedMotion();
  const id = useId().replace(/:/g, '');
  const celebrate = () => {
    setHappy(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setHappy(false), 1600);
  };
  useEffect(() => {
    if (score > previousScore.current) celebrate();
    previousScore.current = score;
  }, [score]);
  useEffect(() => () => clearTimeout(timer.current), []);
  return <button className="bit-mascot" aria-label="Cumprimentar Bit" title="Bit, seu companheiro de descobertas" onClick={celebrate}>
    <motion.svg viewBox="0 0 104 110" role="img" aria-label={happy ? 'Bit comemorando' : 'Robô Bit'} animate={reduceMotion ? {} : { y: happy ? [0, -9, 0, -5, 0] : [0, -3, 0], rotate: happy ? [0, -6, 6, 0] : 0 }} transition={{ duration: happy ? .6 : 3.5, repeat: happy ? 0 : Infinity }}>
      <defs><linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff" /><stop offset="1" stopColor="#9ca9c4" /></linearGradient></defs>
      <ellipse cx="52" cy="103" rx="25" ry="4" fill="#000" opacity=".18" />
      <path d="M52 18V10" stroke="#a5badb" strokeWidth="4" /><circle cx="52" cy="8" r="5" fill="var(--act-color)" />
      <rect x="30" y="64" width="44" height="29" rx="12" fill={`url(#${id}-body)`} />
      <rect x="32" y="87" width="14" height="13" rx="6" fill="#c7d2e4" /><rect x="59" y="87" width="14" height="13" rx="6" fill="#c7d2e4" />
      <motion.path d="M29 72L19 83M75 72L86 82" stroke="#ccd6e8" strokeWidth="10" strokeLinecap="round" animate={happy ? { d: 'M29 72L17 60M75 72L88 58' } : { d: 'M29 72L19 83M75 72L86 82' }} />
      <rect x="15" y="22" width="74" height="49" rx="21" fill={`url(#${id}-body)`} /><rect x="23" y="29" width="58" height="34" rx="13" fill="#111b2e" />
      {happy ? <g stroke="#6ee7ef" strokeWidth="4" fill="none" strokeLinecap="round"><path d="M34 46q5-9 10 0M60 46q5-9 10 0" /><path d="M45 53q7 6 14 0" strokeWidth="2" /></g> : <g fill="#6ee7ef"><rect x="35" y="39" width="8" height="14" rx="4" /><rect x="61" y="39" width="8" height="14" rx="4" /></g>}
      <circle cx="52" cy="78" r="4" fill="var(--act-color)" />
    </motion.svg><span>BIT<span className="bit-status" /></span>
  </button>;
}
