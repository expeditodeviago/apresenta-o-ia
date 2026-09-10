import { useEffect, useRef, useState } from 'react';

/** A brief curtain gives a live prediction time to land; it never blocks input. */
export function RevealCue({ module, stage, revealed, reduced }: { module: number; stage: number; revealed: boolean; reduced: boolean }) {
  const previous = useRef({ module, stage, revealed });
  const [cue, setCue] = useState(0);
  useEffect(() => {
    const before = previous.current;
    previous.current = { module, stage, revealed };
    setCue(0);
    if (before.module !== module || module === 0 || module === 14 || reduced) { setCue(0); return; }
    if (!(before.stage < 3 && stage >= 3) && !(!before.revealed && revealed)) return;
    setCue(value => value + 1);
    const timer = setTimeout(() => setCue(0), 850);
    return () => clearTimeout(timer);
  }, [module, stage, revealed, reduced]);
  return cue ? <div key={cue} className="reveal-cue" aria-hidden="true"><span>HIPÓTESE EM TESTE</span><strong>Vamos descobrir.</strong><i /></div> : null;
}
