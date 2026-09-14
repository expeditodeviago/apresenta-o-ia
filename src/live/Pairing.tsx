import { useEffect, useRef, useState, type ReactNode } from 'react';
import QRCode from 'qrcode';
import { BookOpen, Copy, Maximize, Smartphone } from 'lucide-react';
import { credential } from './useLiveSession';

async function api(url: string, data?: unknown, secret?: string) {
  const abort = new AbortController(), timer = setTimeout(() => abort.abort(), 8000);
  try {
    const response = await fetch(url, { signal: abort.signal, method: data === undefined ? 'GET' : 'POST', headers: { ...(data === undefined ? {} : { 'Content-Type': 'application/json' }), ...(secret ? { Authorization: 'Bearer ' + secret } : {}) }, body: data === undefined ? undefined : JSON.stringify(data) });
    const result = await response.json();
    if (!response.ok) throw Error(result.error || 'Não foi possível conectar.');
    return result;
  } catch (error) {
    if (error instanceof TypeError || error instanceof DOMException && error.name === 'AbortError') throw Error('O servidor não respondeu. Confira a rede e mantenha a apresentação aberta no computador.');
    throw error;
  } finally { clearTimeout(timer); }
}
const message = (error: unknown) => error instanceof Error ? error.message : 'Não foi possível conectar.';

export function PairingGate({ children }: { children: ReactNode }) {
  const [linkToken] = useState(() => new URLSearchParams(location.hash.slice(1)).get('pair') || '');
  const [code, setCode] = useState(''), [busy, setBusy] = useState(Boolean(linkToken)), [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const started = useRef(false);
  const id = new URLSearchParams(location.search).get('session');
  const connect = async (pair: string) => {
    setBusy(true); setError('');
    try {
      const data = await api('/api/pair', { pair });
      localStorage.removeItem('synapse-pending-' + data.id);
      localStorage.setItem('synapse-control-' + data.id, data.secret);
      location.replace('/control?session=' + data.id);
    } catch (e) { setError(message(e)); setBusy(false); }
  };
  const login = async () => {
    setBusy(true); setError('');
    try {
      const data = await api('/api/sessions/' + id + '/login', { password });
      localStorage.removeItem('synapse-pending-' + data.id);
      localStorage.setItem('synapse-control-' + data.id, data.secret);
      setPassword(''); location.replace('/control?session=' + data.id);
    } catch (e) { setError(message(e)); setBusy(false); }
  };
  useEffect(() => {
    if (!linkToken || started.current) return;
    started.current = true;
    history.replaceState(null, '', '/control');
    void connect(linkToken);
  }, [linkToken]);
  if (!linkToken && id && credential(id)) return <>{children}</>;
  return <div className="private-page"><span className="live-eyebrow">SYNAPSE // CONTROLE PRIVADO</span><h1>{busy ? 'Conectando seu controle…' : id ? 'Entre com a senha do controle.' : 'Este controle precisa ser pareado.'}</h1><p>{id ? 'Digite a senha definida na preparação privada do computador.' : 'Para entrar com senha, abra o link da sessão copiado em “Conectar celular” no computador. Você também pode usar o QR ou código temporário.'}</p>
    {error && <p className="control-error" role="alert">{error}</p>}
    {id && <form onSubmit={event => { event.preventDefault(); void login(); }}><label>Senha do controle<input type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" maxLength={128} disabled={busy} required /></label><button className="live-primary" disabled={busy || !password}><Smartphone size={18} />{busy ? 'Conectando…' : 'Entrar com senha'}</button><p>Ou use um código temporário:</p></form>}
    <form onSubmit={event => { event.preventDefault(); void connect(code); }}><label>Código de pareamento<input value={code} onChange={event => setCode(event.target.value.toUpperCase())} placeholder="XXXXX-XXXXX" autoComplete="off" autoCapitalize="characters" spellCheck={false} maxLength={14} disabled={busy} required /></label><button className="live-primary" disabled={busy || code.replace(/[\s-]/g, '').length !== 10}><Smartphone size={18} />{busy ? 'Conectando…' : 'Conectar com código'}</button></form>
    <p>O código e o QR autorizam o mesmo controle, por uso único. Se você estiver em um navegador dentro de outro aplicativo, abra este endereço no Safari ou Chrome.</p>
  </div>;
}

export function PairingSetup() {
  const [id, setId] = useState(new URLSearchParams(location.search).get('session') || '');
  const [addresses, setAddresses] = useState<string[]>([]), [base, setBase] = useState('');
  const [defaultPasswordConfigured, setDefaultPasswordConfigured] = useState(false);
  const [remote, setRemote] = useState(false), [loaded, setLoaded] = useState(false);
  const [pair, setPair] = useState(''), [code, setCode] = useState(''), [expires, setExpires] = useState(0), [qr, setQr] = useState('');
  const [error, setError] = useState(''), [notice, setNotice] = useState(''), [admin, setAdmin] = useState(''), [busy, setBusy] = useState(false), [now, setNow] = useState(Date.now());
  const [password, setPassword] = useState('');
  const generation = useRef(0);
  const remaining = Math.max(0, Math.ceil((expires - now) / 1000));
  const connectURL = base.replace(/\/$/, '') + '/control';
  const pairingURL = connectURL + '#pair=' + pair;
  const passwordURL = connectURL + '?session=' + id;
  useEffect(() => {
    api('/api/info').then(info => {
      setDefaultPasswordConfigured(Boolean(info.defaultPasswordConfigured)); setAddresses(info.addresses); setRemote(!info.local);
      const sameOrigin = !['localhost', '127.0.0.1', '[::1]'].includes(location.hostname) ? location.origin : '';
      setBase(info.publicBase || info.addresses[0] || sameOrigin); setLoaded(true);
    }).catch(e => { setError(message(e)); setLoaded(true); });
  }, []);
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 500); return () => clearInterval(timer); }, []);
  const copy = async (text: string) => { try { await navigator.clipboard.writeText(text); setNotice('Copiado.'); } catch { setNotice('Selecione o endereço ou código e copie manualmente.'); } };
  const create = async () => {
    setBusy(true); setError('');
    try { const data = await api('/api/sessions', {}, admin); sessionStorage.setItem('synapse-owner-' + data.id, data.secret); setId(data.id); setAdmin(''); history.replaceState(null, '', '/setup?session=' + data.id); }
    catch (e) { setError(message(e)); } finally { setBusy(false); }
  };
  const generate = async () => {
    const revision = ++generation.current;
    setBusy(true); setError(''); setNotice(''); setPair(''); setQr(''); setCode('');
    try {
      const url = new URL(base);
      if (!['http:', 'https:'].includes(url.protocol) || ['localhost', '127.0.0.1', '[::1]', '0.0.0.0'].includes(url.hostname) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) throw Error('Use apenas a origem acessível pelo celular: http://IP:porta ou https://seu-site.');
      const data = await api('/api/sessions/' + id + '/pair', {}, credential(id));
      const generated = await QRCode.toDataURL(url.origin + '/control#pair=' + data.pair, { width: 320, margin: 4, errorCorrectionLevel: 'M', color: { dark: '#000000', light: '#ffffff' } });
      if (revision !== generation.current) return;
      setBase(url.origin); setPair(data.pair); setCode(data.code); setExpires(data.expires); setNow(Date.now()); setQr(generated);
    } catch (e) { if (revision === generation.current) setError(message(e)); } finally { if (revision === generation.current) setBusy(false); }
  };
  const savePassword = async () => {
    setBusy(true); setError(''); setNotice('');
    try {
      await api('/api/sessions/' + id + '/password', { password }, credential(id));
      setPassword(''); setPair(''); setQr(''); setCode('');
      setNotice('Senha salva. Abra o link da sessão no celular e entre com a senha. Os controles anteriores foram desconectados.');
    } catch (e) { setError(message(e)); } finally { setBusy(false); }
  };
  return <div className="private-page pairing-page"><span className="live-eyebrow">SYNAPSE // PREPARAÇÃO PRIVADA</span><h1>Seu celular, no comando.</h1><p>Use esta janela no monitor privado. O QR e o código autorizam o controle e o acesso às notas.</p>
    {error && <p className="control-error" role="alert">{error}</p>}{notice && <p role="status">{notice}</p>}
    {!loaded ? <p>Verificando o servidor…</p> : !id ? <><p>{remote ? 'Crie a sessão com a chave administrativa da sua hospedagem. Depois abra a tela pública pelo link abaixo.' : 'Crie uma sessão neste computador para conectar o celular.'}</p>{remote && <label>Credencial administrativa<input type="password" value={admin} onChange={e => setAdmin(e.target.value)} autoComplete="off" /></label>}<button className="live-primary" disabled={busy} onClick={create}>{busy ? 'Criando…' : 'Criar sessão'}</button></> : !credential(id) ? <><p>Abra a preparação a partir da janela que criou a sessão. Se ela foi fechada, crie uma nova sessão.</p><a className="setup-link" href="/setup">Preparar nova sessão</a></> : <>
      <label>Endereço acessível pelo celular<input type="url" value={base} disabled={busy} onChange={e => { generation.current++; setBase(e.target.value); setPair(''); setQr(''); setCode(''); }} placeholder="http://192.168.1.10:4173" list="network-addresses" /></label><datalist id="network-addresses">{addresses.map(address => <option key={address} value={address} />)}</datalist>
      <div className="pairing-network"><strong>{remote ? 'Acesso pela internet' : 'Primeiro, confirme a conexão'}</strong><p>{remote ? 'O computador e o celular podem usar redes diferentes. Use a mesma origem HTTPS nos dois.' : 'O computador pode estar no cabo, mas o celular precisa estar no Wi-Fi do mesmo roteador. Desative os dados móveis durante o teste e evite o endereço de VPN.'}</p><p>Abra este endereço no celular:</p><a className="pairing-address" href={connectURL} target="_blank" rel="noreferrer">{connectURL}</a><button className="setup-link" onClick={() => copy(connectURL)}><Copy size={15} />Copiar endereço do controle</button><p>Se esse endereço não abrir, o QR também não abrirá. Confira a rede, o firewall e o isolamento de dispositivos do Wi-Fi.</p></div>
      <section className="pairing-network"><h2>Acesso com senha</h2>{defaultPasswordConfigured && <p>A senha inicial está configurada para as novas sessões. Abra o link abaixo no celular. Use o campo a seguir apenas se quiser trocar a senha.</p>}<p>Defina uma senha com pelo menos 5 caracteres. Ela vale para esta sessão, por até 12 horas. Trocar a senha desconecta os controles anteriores.</p><form onSubmit={event => { event.preventDefault(); void savePassword(); }}><label>Definir senha do controle<input type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="new-password" minLength={5} maxLength={128} disabled={busy} required /></label><button className="live-primary" disabled={busy || password.trim().length < 5}>{busy ? 'Salvando…' : 'Salvar senha do controle'}</button></form><p>Depois, abra este link no celular:</p><a className="pairing-address" href={passwordURL} target="_blank" rel="noreferrer">{passwordURL}</a><button className="setup-link" onClick={() => copy(passwordURL)}><Copy size={15} />Copiar link para entrar com senha</button></section>
      <button className="live-primary" disabled={busy || !base} onClick={generate}><Smartphone size={18} />{busy ? 'Gerando…' : 'Gerar pareamento temporário'}</button>
      {pair && remaining > 0 && qr && <div className="pairing-qr"><img src={qr} alt="QR code temporário de controle do apresentador" /><strong>Uso único · expira em {remaining}s</strong><p>Ou digite este código no celular:</p><output className="pairing-code" aria-label="Código temporário">{code.slice(0, 5)}-{code.slice(5)}</output><button onClick={() => copy(code)}><Copy size={16} />Copiar código</button><button onClick={() => copy(pairingURL)}><Copy size={16} />Copiar link privado</button></div>}
      {pair && remaining === 0 && <p role="status">Pareamento expirado. Gere um novo QR e código.</p>}
      <a className="setup-link" href={'/?session=' + id} target="synapse-projection">Abrir tela pública desta sessão<Maximize size={16} /></a><a className="setup-link" href={'/control?session=' + id} target="synapse-private-control">Abrir controle neste computador<BookOpen size={16} /></a>
      <button className="revoke-button" onClick={async () => { try { await api('/api/sessions/' + id + '/revoke', {}, credential(id)); setPair(''); setCode(''); setNotice('Controles remotos revogados. O acesso por senha foi desativado.'); } catch (e) { setError(message(e)); } }}>Revogar controles remotos</button>
    </>}
  </div>;
}
