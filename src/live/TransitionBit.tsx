import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function TransitionBit({ module, title, reduced }: { module: number; title: string; reduced: boolean }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setVisible(true); const timer = setTimeout(() => setVisible(false), 950); return () => clearTimeout(timer); }, [module]);
  if (!visible || reduced) return null;
  return <motion.div key={module} className="transition-bit" aria-hidden="true" initial={{ x: 150, opacity: 0 }} animate={{ x: [150, 15, -5, 0], opacity: [0, 1, 1, 0] }} transition={{ duration: .9, times: [0, .35, .7, 1] }}>
    <motion.svg viewBox="0 0 112 100" animate={{ rotate: [0, -8, 3, 0] }} transition={{ duration: .65 }}><path d="M58 70L104 67" stroke="#d3dcec" strokeWidth="3" /><rect x="28" y="52" width="34" height="27" rx="9" fill="#d5deec" /><path d="M32 77L24 91M57 77L64 91M30 60L17 71M61 59L79 66" stroke="#d5deec" strokeWidth="9" strokeLinecap="round" /><rect x="15" y="17" width="62" height="42" rx="17" fill="#eef3fa" /><rect x="23" y="24" width="46" height="27" rx="10" fill="#14283b" /><path d="M37 33v9M55 33v9" stroke="#79dfea" strokeWidth="6" strokeLinecap="round" /><path d="M45 17V9" stroke="#becadc" strokeWidth="3" /><circle cx="45" cy="6" r="4" fill="#f4c777" /></motion.svg><div><span>PRÓXIMA CONEXÃO</span><strong>{title}</strong></div>
  </motion.div>;
}
