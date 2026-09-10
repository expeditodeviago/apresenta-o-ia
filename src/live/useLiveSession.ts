import { useCallback, useEffect, useRef, useState } from 'react';
import { initialState, reduce } from '../../shared/engine';
import type { Command, State } from '../../shared/engine';

const makeId = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), byte => byte.toString(16).padStart(2, '0')).join('');
function readJSON(key: string) { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; } }
export function credential(id: string) { return sessionStorage.getItem('synapse-owner-' + id) || localStorage.getItem('synapse-control-' + id) || ''; }
type Pending = { id: string; command: Command };
type Packet = { state: State; serverTime: number };
async function request(url: string, init?: RequestInit) {
  const abort = new AbortController(), timer = setTimeout(() => abort.abort(), 1800);
  try { return await fetch(url, { ...init, signal: abort.signal }); } finally { clearTimeout(timer); }
}

export function useLiveSession(control: boolean) {
  const urlId = new URLSearchParams(location.search).get('session') || '';
  const [sessionId, setSessionId] = useState(urlId);
  const [state, setState] = useState<State>(() => readJSON('synapse-state-' + (urlId || 'local')) || initialState());
  const [connection, setConnection] = useState('connecting');
  const [error, setError] = useState('');
  const [serverOffset, setServerOffset] = useState(0);
  const [canControl, setCanControl] = useState(!urlId && !control || Boolean(urlId && credential(urlId)));
  const currentSession = useRef(sessionId), stateRef = useRef(state);
  const pending = useRef<Pending[]>(readJSON('synapse-pending-' + (urlId || 'local')) || []);
  const busy = useRef(false), alive = useRef(true), blocked = useRef(false);
  const creation = useRef<Promise<{ id: string; secret: string }> | null>(null);
  const confirmed = useRef<State | null>(null);
  const cachePending = useCallback(() => {
    try { localStorage.setItem('synapse-pending-' + (currentSession.current || 'local'), JSON.stringify(pending.current)); } catch { /* In-memory queue remains available. */ }
  }, []);
  const apply = useCallback((next: State) => {
    if (!alive.current) return;
    stateRef.current = next; setState(next);
    try { localStorage.setItem('synapse-state-' + (currentSession.current || 'local'), JSON.stringify(next)); } catch { /* Storage is optional. */ }
  }, []);
  const accept = useCallback((packet: Packet) => {
    setServerOffset(packet.serverTime - Date.now());
    if (!confirmed.current || packet.state.version >= confirmed.current.version) {
      confirmed.current = packet.state;
      // Pending IDs survive retries; only their local preview is reapplied.
      apply(pending.current.reduce((next, item) => reduce(next, item.command), packet.state));
    }
  }, [apply]);
  const flush = useCallback(async () => {
    const id = currentSession.current;
    if (!id || busy.current || blocked.current || !alive.current) return;
    busy.current = true;
    try {
      while (pending.current.length && alive.current) {
        const item = pending.current[0];
        const response = await request('/api/sessions/' + id + '/command', {
          method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + credential(id) }, body: JSON.stringify(item),
        });
        if (response.status === 403 || response.status === 410) {
          blocked.current = true;
          setConnection(response.status === 410 ? 'expired' : 'offline');
          if (response.status === 403) setCanControl(false);
          setError(response.status === 410 ? 'Sessão expirada. Continue no computador; abra uma nova sessão para parear novamente.' : 'Controle revogado. Faça um novo pareamento.');
          return;
        }
        if (!response.ok) {
          pending.current.shift(); cachePending();
          setError('Um comando não foi aceito. Confira os parâmetros.');
          continue;
        }
        const packet: Packet = await response.json();
        pending.current.shift(); cachePending(); accept(packet);
      }
      if (alive.current) { setConnection('online'); setError(''); }
    } catch {
      if (alive.current) {
        setConnection('offline');
        setError(control ? 'Sem conexão. Comandos aguardam confirmação; o computador continua disponível.' : 'Sem rede. Continue no computador; suas ações serão sincronizadas ao reconectar.');
      }
    } finally { busy.current = false; }
  }, [accept, cachePending, control]);

  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  useEffect(() => {
    if (sessionId || control) return;
    let stopped = false;
    // Reuse the creation promise during StrictMode effect replay.
    creation.current ??= request('/api/sessions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }).then(async response => {
      if (!response.ok) throw Error('Servidor indisponível');
      return response.json();
    });
    creation.current.then(data => {
      if (stopped) return;
      sessionStorage.setItem('synapse-owner-' + data.id, data.secret);
      currentSession.current = data.id; cachePending(); setSessionId(data.id); setCanControl(true);
      history.replaceState(null, '', '?session=' + data.id);
    }).catch(() => { if (!stopped) setConnection('offline'); });
    return () => { stopped = true; };
  }, [sessionId, control, cachePending]);

  useEffect(() => {
    if (!sessionId) return;
    currentSession.current = sessionId;
    let stopped = false;
    const source = new EventSource('/api/sessions/' + sessionId + '/events');
    const receive = (packet: Packet) => {
      if (stopped || busy.current || blocked.current) return;
      if (pending.current.length) { void flush(); return; }
      accept(packet); setConnection('online');
    };
    source.onmessage = event => { receive(JSON.parse(event.data)); };
    source.onerror = () => { if (!stopped && !blocked.current) setConnection('offline'); };
    source.addEventListener('expired', () => { blocked.current = true; setConnection('expired'); setError('Sessão expirada. Continue no computador ou abra uma nova sessão.'); source.close(); });
    // Recover even if EventSource remains stalled after Wi-Fi returns.
    const recover = async () => {
      if (stopped || busy.current || blocked.current) return;
      if (pending.current.length) { await flush(); return; }
      try { const response = await request('/api/sessions/' + sessionId + '/state'); if (response.ok) receive(await response.json()); } catch { if (!stopped) setConnection('offline'); }
    };
    const timer = setInterval(recover, 2000);
    window.addEventListener('online', recover);
    void recover();
    return () => { stopped = true; source.close(); clearInterval(timer); window.removeEventListener('online', recover); };
  }, [sessionId, accept, flush]);

  const send = useCallback((command: Command) => {
    if (!canControl) { setError('Este dispositivo não está autorizado a controlar.'); return; }
    const item = { id: makeId(), command };
    pending.current.push(item); cachePending();
    apply(reduce(stateRef.current, command));
    void flush();
  }, [apply, canControl, cachePending, flush]);

  useEffect(() => {
    if (connection === 'online' || control) return;
    const timer = setInterval(() => { if (stateRef.current.autoplay || stateRef.current.running) apply(reduce(stateRef.current, { type: 'tick' })); }, 250);
    return () => clearInterval(timer);
  }, [connection, apply, control]);
  return { state, send, sessionId, connection, serverOffset, error, canControl, clearError: () => setError('') };
}

