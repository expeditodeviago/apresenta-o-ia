import http from 'node:http';
import { randomBytes, createHash, timingSafeEqual } from 'node:crypto';
import { readFile, writeFile, mkdir, rename, stat } from 'node:fs/promises';
import { networkInterfaces } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initialState, reduce } from '../shared/engine.ts';
import type { State, Command } from '../shared/engine.ts';
import { getNotes } from './notes.ts';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.PORT || 4173);
const PUBLIC_BASE = (process.env.PUBLIC_BASE_URL || process.env.RENDER_EXTERNAL_URL || '').replace(/\/$/, '');
const DATA = path.resolve(process.env.SYNAPSE_DATA_DIR || path.join(ROOT, '.runtime'));
const TTL = 12 * 60 * 60 * 1000;
type Session = { id: string; secretHash: string; expires: number; state: State; seen: string[]; controllers: string[] };
const sessions = new Map<string, Session>();
const clients = new Map<string, Set<http.ServerResponse>>();
const pairings = new Map<string, { session: string; expires: number }>();
const attempts = new Map<string, { count: number; until: number }>();
const token = () => randomBytes(32).toString('base64url');
const hash = (value: string) => createHash('sha256').update(value).digest('hex');
const equals = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));
const local = (req: http.IncomingMessage) => ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.socket.remoteAddress || '');
await mkdir(DATA, { recursive: true, mode: 0o700 });
try {
  const saved: Session[] = JSON.parse(await readFile(path.join(DATA, 'sessions.json'), 'utf8'));
  for (const session of saved) if (session.expires > Date.now()) { delete (session as Session & { password?: unknown }).password; session.state.running = false; session.state.autoplay = false; session.state.storyPlaying = false; session.state.clockAt = Date.now(); sessions.set(session.id, session); }
} catch (error: any) { if (error.code !== 'ENOENT') console.error('Não foi possível restaurar sessões. O arquivo foi preservado.'); }
let writeQueue = Promise.resolve();
function persist() {
  const data = JSON.stringify([...sessions.values()]);
  writeQueue = writeQueue.catch(() => {}).then(async () => { await writeFile(path.join(DATA, 'sessions.tmp'), data, { mode: 0o600 }); await rename(path.join(DATA, 'sessions.tmp'), path.join(DATA, 'sessions.json')); });
  return writeQueue;
}
function publish(session: Session) { const packet = 'data: ' + JSON.stringify({ state: session.state, serverTime: Date.now(), expires: session.expires }) + '\n\n'; for (const client of clients.get(session.id) ?? []) client.write(packet); }
function json(res: http.ServerResponse, status: number, value: unknown) { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(value)); }
async function body(req: http.IncomingMessage) { let text = ''; for await (const chunk of req) { text += chunk; if (text.length > 32_000) throw Error('Corpo muito grande'); } return JSON.parse(text || '{}'); }
function authorized(req: http.IncomingMessage, session: Session) { const auth = req.headers.authorization?.replace(/^Bearer /, '') ?? ''; const digest = hash(auth); return equals(digest, session.secretHash) || session.controllers.some(item => equals(item, digest)); }
function limited(key: string, limit: number) {
  const now = Date.now(), previous = attempts.get(key);
  const attempt = previous && previous.until > now ? previous : { count: 0, until: now + 60_000 };
  attempt.count++; attempts.set(key, attempt);
  return attempt.count > limit;
}
function urls() { if (PUBLIC_BASE) return [PUBLIC_BASE]; return Object.values(networkInterfaces()).flat().filter(item => item && !item.internal && item.family === 'IPv4').map(item => item!.address).sort((a, b) => Number(/^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/.test(b)) - Number(/^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/.test(a))).map(address => 'http://' + address + ':' + PORT); }
function allowMutation(req: http.IncomingMessage) {
  const origin = req.headers.origin;
  const expected = PUBLIC_BASE ? new URL(PUBLIC_BASE).host : req.headers.host;
  return (!origin || new URL(origin).host === expected) && req.headers['content-type']?.startsWith('application/json');
}
const server = http.createServer(async (req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'");
  try {
    const url = new URL(req.url || '/', 'http://localhost');
    const route = url.pathname;
    if (route.startsWith('/api/')) {
      if (req.method !== 'GET' && !allowMutation(req)) return json(res, 403, { error: 'Origem ou formato não autorizado.' });
      if (route === '/api/info') return json(res, 200, { addresses: local(req) ? urls() : [], local: local(req) && !PUBLIC_BASE, publicBase: PUBLIC_BASE || null });
      if (route === '/api/health') return json(res, 200, { ok: true });
      if (route === '/api/sessions' && req.method === 'POST') {
        if (limited('create:' + req.socket.remoteAddress, 20)) return json(res, 429, { error: 'Muitas tentativas. Aguarde um minuto.' });
        if (sessions.size >= 30) return json(res, 429, { error: 'Limite de sessões ativas.' });
        const secret = token(), id = randomBytes(16).toString('hex');
        const session: Session = { id, secretHash: hash(secret), expires: Date.now() + TTL, state: initialState(), seen: [], controllers: [] };
        sessions.set(id, session); await persist(); return json(res, 201, { id, secret, expires: session.expires });
      }
      if (route === '/api/pair' && req.method === 'POST') {
        const ip = req.socket.remoteAddress ?? 'unknown';
        const attempt = attempts.get(ip) ?? { count: 0, until: Date.now() + 60_000 };
        if (attempt.until < Date.now()) { attempt.count = 0; attempt.until = Date.now() + 60_000; }
        attempt.count++; attempts.set(ip, attempt);
        if (attempt.count > 20) return json(res, 429, { error: 'Muitas tentativas. Aguarde um minuto.' });
        const input = await body(req), supplied = String(input.pair ?? '').trim();
        const normalized = /^[a-f0-9\s-]{10,14}$/i.test(supplied) ? supplied.replace(/[\s-]/g, '').toUpperCase() : supplied;
        const digest = hash(normalized), pair = pairings.get(digest);
        if (!pair || pair.expires < Date.now()) return json(res, 403, { error: 'Pareamento inválido, expirado ou já utilizado.' });
        const session = sessions.get(pair.session);
        if (!session || session.expires <= Date.now()) return json(res, 410, { error: 'Sessão expirada.' });
        for (const [key, entry] of pairings) if (entry === pair) pairings.delete(key);
        const secret = token(); session.controllers.push(hash(secret)); await persist(); return json(res, 200, { id: session.id, secret });
      }
      const match = /^\/api\/sessions\/([a-f0-9]{32})(?:\/(state|events|command|notes|pair|revoke|restore|connect))?$/.exec(route);
      if (!match) return json(res, 404, { error: 'Rota não encontrada.' });
      const session = sessions.get(match[1]);
      if (!session || session.expires <= Date.now()) return json(res, 410, { error: 'Sessão encerrada ou expirada.' });
      const action = match[2] ?? 'state';
      if (action === 'connect' && req.method === 'POST') {
        if (limited('connect:' + req.socket.remoteAddress, 60)) return json(res, 429, { error: 'Muitas conexões. Aguarde um minuto.' });
        const secret = token(); session.controllers.push(hash(secret)); await persist(); return json(res, 200, { id: session.id, secret });
      }
      if (action === 'state' && req.method === 'GET') return json(res, 200, { state: session.state, serverTime: Date.now(), expires: session.expires });
      if (action === 'events' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache, no-transform', Connection: 'keep-alive', 'X-Accel-Buffering': 'no' });
        res.write('retry: 1500\n\n'); const set = clients.get(session.id) ?? new Set(); set.add(res); clients.set(session.id, set); publish(session); req.on('close', () => set.delete(res)); return;
      }
      if (!authorized(req, session)) return json(res, 403, { error: 'Controle não autorizado.' });
      if (action === 'notes' && req.method === 'GET') return json(res, 200, getNotes(session.state.module, session.state.stage, Boolean(session.state.mathMode), { sim: session.state.sims[session.state.module], quizIndex: session.state.sims[13]?.tick, variant: Number(session.state.sims[session.state.module]?.values.aiVariant || 0), networkQuestion: Number(session.state.sims[14]?.values.networkQuestion || 0) }));
      if (action === 'pair' && req.method === 'POST') { for (const [key, pair] of pairings) if (pair.session === session.id) pairings.delete(key); const pair = token(); let code: string; do { code = randomBytes(5).toString('hex').toUpperCase(); } while (pairings.has(hash(code))); const entry = { session: session.id, expires: Date.now() + 120_000 }; pairings.set(hash(pair), entry); pairings.set(hash(code), entry); return json(res, 200, { pair, code, expires: entry.expires, addresses: urls() }); }
      if (action === 'revoke' && req.method === 'POST') { if (!equals(hash(req.headers.authorization?.replace(/^Bearer /, '') ?? ''), session.secretHash)) return json(res, 403, { error: 'Somente o computador criador pode revogar controles.' }); session.controllers = []; for (const [key, pair] of pairings) if (pair.session === session.id) pairings.delete(key); await persist(); return json(res, 200, { ok: true }); }
      if (action === 'restore' && req.method === 'POST') {
        const input = await body(req);
        if (!equals(hash(req.headers.authorization?.replace(/^Bearer /, '') ?? ''), session.secretHash)) return json(res, 403, { error: 'Restauração permitida apenas ao computador criador.' });
        if (input.baseVersion !== session.state.version) return json(res, 409, { error: 'O servidor já recebeu mudanças. O estado online foi mantido.', state: session.state });
        if (!Array.isArray(input.commands) || input.commands.length > 500) return json(res, 400, { error: 'Fila inválida.' });
        let next = session.state;
        for (const command of input.commands) { if (command.type === 'tick') continue; next = reduce(next, command); }
        session.state = next; await persist(); publish(session); return json(res, 200, { state: next, serverTime: Date.now() });
      }
      if (action === 'command' && req.method === 'POST') {
        const input = await body(req);
        if (typeof input.id !== 'string' || !/^[a-zA-Z0-9_-]{8,100}$/.test(input.id)) return json(res, 400, { error: 'Identificador de comando inválido.' });
        if (!session.seen.includes(input.id)) { session.state = reduce(session.state, input.command as Command); session.seen.push(input.id); session.seen = session.seen.slice(-2000); await persist(); publish(session); }
        return json(res, 200, { state: session.state, serverTime: Date.now() });
      }
      return json(res, 405, { error: 'Método não permitido.' });
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') return json(res, 405, { error: 'Método não permitido.' });
    const normalized = path.resolve(ROOT, 'dist', '.' + decodeURIComponent(route));
    const root = path.join(ROOT, 'dist') + path.sep;
    if (!normalized.startsWith(root) && normalized !== path.join(ROOT, 'dist')) return json(res, 403, { error: 'Acesso negado.' });
    let file = normalized;
    try { if (!(await stat(file)).isFile()) file = path.join(ROOT, 'dist/index.html'); } catch { file = route.includes('.') ? normalized : path.join(ROOT, 'dist/index.html'); }
    const types: Record<string, string> = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.json': 'application/json' };
    const data = await readFile(file); res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream'); res.setHeader('Cache-Control', route.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'no-cache'); res.end(req.method === 'HEAD' ? undefined : data);
  } catch (error: any) { if (!res.headersSent) json(res, error.code === 'ENOENT' ? 404 : 400, { error: error.code === 'ENOENT' ? 'Arquivo indisponível. Execute npm run build.' : 'Solicitação inválida.' }); else res.end(); }
});
let lastSaved = 0;
setInterval(() => {
  for (const [id, session] of sessions) {
    if (session.expires <= Date.now()) { for (const res of clients.get(id) ?? []) { res.write('event: expired\ndata: {}\n\n'); res.end(); } clients.delete(id); sessions.delete(id); continue; }
    if (session.state.running || session.state.autoplay || session.state.storyPlaying) { session.state = reduce(session.state, { type: 'tick' }); publish(session); }
  }
  for (const [key, pair] of pairings) if (pair.expires < Date.now()) pairings.delete(key);
  for (const [key, attempt] of attempts) if (attempt.until < Date.now()) attempts.delete(key);
  if (Date.now() - lastSaved > 5000) { lastSaved = Date.now(); persist().catch(() => console.error('Falha ao salvar a sessão.')); }
}, 250).unref();
setInterval(() => { for (const set of clients.values()) for (const res of set) res.write(': heartbeat\n\n'); }, 15_000).unref();
server.listen(PORT, '0.0.0.0', () => { console.log('SYNAPSE: http://localhost:' + PORT); for (const address of urls()) console.log('Rede local: ' + address); });
for (const signal of ['SIGINT', 'SIGTERM'] as const) process.on(signal, async () => { for (const session of sessions.values()) { session.state = reduce(session.state, { type: 'clock', value: false }); session.state.autoplay = false; session.state.storyPlaying = false; } await persist(); process.exit(0); });
