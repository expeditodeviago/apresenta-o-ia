import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { once } from 'node:events';

test('Servidor: autorização, notas privadas, pareamento único, duplicação, restauração e persistência', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'synapse-test-'));
  const port = 43100 + Math.floor(Math.random() * 900), base = 'http://127.0.0.1:' + port;
  const start = async () => { const child = spawn(process.execPath, ['server/index.ts'], { env: { ...process.env, PORT: String(port), SYNAPSE_DATA_DIR: dir }, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true }); for (let i = 0; i < 80; i++) { try { if ((await fetch(base + '/api/health')).ok) return child; } catch {} await new Promise(r => setTimeout(r, 50)); } throw Error('Servidor de teste não iniciou.'); };
  let child = await start();
  const request = (route: string, method = 'GET', value?: any, secret?: string, origin?: string) => fetch(base + route, { method, headers: { ...(method !== 'GET' ? { 'Content-Type': 'application/json' } : {}), ...(secret ? { Authorization: 'Bearer ' + secret } : {}), ...(origin ? { Origin: origin } : {}) }, body: value === undefined ? undefined : JSON.stringify(value) });
  try {
    const created = await request('/api/sessions', 'POST', {}); assert.equal(created.status, 201); const { id, secret } = await created.json(); const session = '/api/sessions/' + id;
    const publicState = await (await request(session)).json(); assert.ok(publicState.state); assert.equal(JSON.stringify(publicState).includes('speech'), false); assert.equal(JSON.stringify(publicState).includes(secret), false);
    assert.equal((await request(session + '/notes')).status, 403);
    assert.equal((await request(session + '/command', 'POST', { id: 'command_001', command: { type: 'module', value: 1 } })).status, 403);
    assert.equal((await request(session + '/command', 'POST', { id: 'command_001', command: { type: 'module', value: 1 } }, secret, 'https://hostile.example')).status, 403);
    const send = (command: any, commandId: string) => request(session + '/command', 'POST', { id: commandId, command }, secret);
    await send({ type: 'module', value: 9 }, 'module_0001'); await send({ type: 'action', key: 'sample100' }, 'sample_0001'); await send({ type: 'action', key: 'sample100' }, 'sample_0001');
    let state = (await (await request(session)).json()).state; assert.equal(state.sims[9].counts.reduce((a: number, b: number) => a + b, 0), 100);
    const notes = await (await request(session + '/notes', 'GET', undefined, secret)).json(); assert.ok(notes.speech); assert.ok(notes.expected);
    const pair = await (await request(session + '/pair', 'POST', {}, secret)).json(); const claimed = await request('/api/pair', 'POST', { pair: pair.pair }); assert.equal(claimed.status, 200); const phone = await claimed.json();
    assert.equal((await request('/api/pair', 'POST', { pair: pair.pair })).status, 403);
    assert.equal((await request('/api/pair', 'POST', { pair: pair.code })).status, 403);
    assert.equal((await request(session + '/notes', 'GET', undefined, phone.secret)).status, 200);
    const password = 'Teste-privado-2026';
    assert.equal((await request(session + '/password', 'POST', { password })).status, 403);
    assert.equal((await request(session + '/password', 'POST', { password }, phone.secret)).status, 403);
    assert.equal((await request(session + '/password', 'POST', { password: 'curta' }, secret)).status, 400);
    assert.equal((await request(session + '/password', 'POST', { password }, secret)).status, 200);
    assert.equal((await request(session + '/notes', 'GET', undefined, phone.secret)).status, 403);
    assert.equal((await request(session + '/login', 'POST', { password: 'incorreta' })).status, 403);
    assert.equal((await request(session + '/login', 'POST', { password }, undefined, 'https://hostile.example')).status, 403);
    const login = await request(session + '/login', 'POST', { password }); assert.equal(login.status, 200);
    const passwordPhone = await login.json();
    assert.equal((await request(session + '/notes', 'GET', undefined, passwordPhone.secret)).status, 200);
    assert.equal((await request(session + '/password', 'POST', { password }, passwordPhone.secret)).status, 403);
    const persisted = await readFile(path.join(dir, 'sessions.json'), 'utf8');
    assert.equal(persisted.includes(password), false);
    assert.equal(JSON.stringify(await (await request(session)).json()).includes('digest'), false);
    const manual = await (await request(session + '/pair', 'POST', {}, secret)).json();
    assert.ok(/^[A-F0-9]{10}$/.test(manual.code));
    const formattedCode = manual.code.slice(0, 5).toLowerCase() + '-' + manual.code.slice(5).toLowerCase();
    assert.equal((await request('/api/pair', 'POST', { pair: formattedCode })).status, 200);
    assert.equal((await request('/api/pair', 'POST', { pair: manual.pair })).status, 403);
    assert.equal((await request('/api/pair', 'POST', { pair: manual.code })).status, 403);
    const savedVersion = state.version;
    const restore = await request(session + '/restore', 'POST', { baseVersion: savedVersion, commands: [{ type: 'module', value: 6 }] }, secret); assert.equal(restore.status, 200);
    assert.equal((await request(session + '/restore', 'POST', { baseVersion: savedVersion, commands: [{ type: 'module', value: 2 }] }, secret)).status, 409);
    await request(session + '/revoke', 'POST', {}, secret); assert.equal((await request(session + '/notes', 'GET', undefined, phone.secret)).status, 403);
    assert.equal((await request(session + '/notes', 'GET', undefined, passwordPhone.secret)).status, 403);
    assert.equal((await request(session + '/login', 'POST', { password })).status, 403);
    await request(session + '/password', 'POST', { password }, secret);
    await send({ type: 'clock', value: true }, 'clock_0001');
    const exit = once(child, 'exit'); child.kill(); await exit; child = await start();
    state = (await (await request(session)).json()).state; assert.equal(state.module, 6); assert.equal(state.running, false); assert.equal(state.autoplay, false);
    assert.equal((await request(session + '/notes', 'GET', undefined, secret)).status, 200);
    assert.equal((await request(session + '/login', 'POST', { password })).status, 200);
    for (let i = 0; i < 9; i++) assert.equal((await request(session + '/login', 'POST', { password: 'incorreta' })).status, 403);
    assert.equal((await request(session + '/login', 'POST', { password })).status, 429);
    const exit2 = once(child, 'exit'); child.kill(); await exit2;
    const data = JSON.parse(await readFile(path.join(dir, 'sessions.json'), 'utf8')); data[0].expires = Date.now() - 1; await writeFile(path.join(dir, 'sessions.json'), JSON.stringify(data)); child = await start();
    assert.equal((await request(session)).status, 410);
  } finally { if (child.exitCode === null) { const exited = once(child, 'exit'); child.kill(); await exited; } }
});

test('Hospedagem reconhece a origem HTTPS e exige chave administrativa mesmo por proxy local', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'synapse-hosted-'));
  const port = 45200 + Math.floor(Math.random() * 500), base = 'http://127.0.0.1:' + port;
  const publicBase = 'https://synapse-test.example', admin = 'test-only-admin-' + Date.now();
  const child = spawn(process.execPath, ['server/index.ts'], { env: { ...process.env, PORT: String(port), SYNAPSE_DATA_DIR: dir, PUBLIC_BASE_URL: '', RENDER_EXTERNAL_URL: publicBase, SYNAPSE_ADMIN_KEY: admin }, stdio: 'ignore', windowsHide: true });
  try {
    let ready = false;
    for (let i = 0; i < 80; i++) { try { if ((await fetch(base + '/api/health')).ok) { ready = true; break; } } catch {} await new Promise(resolve => setTimeout(resolve, 50)); }
    assert.ok(ready);
    const info = await (await fetch(base + '/api/info')).json();
    assert.equal(info.publicBase, publicBase); assert.equal(info.local, false);
    const post = (route: string, data: unknown, key?: string, origin = publicBase) => fetch(base + route, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin, ...(key ? { Authorization: 'Bearer ' + key } : {}) }, body: JSON.stringify(data) });
    assert.equal((await post('/api/sessions', {})).status, 403);
    const response = await post('/api/sessions', {}, admin); assert.equal(response.status, 201);
    const session = await response.json();
    const paired = await post('/api/sessions/' + session.id + '/pair', {}, session.secret); assert.equal(paired.status, 200);
    const pairing = await paired.json(); assert.deepEqual(pairing.addresses, [publicBase]);
    assert.equal((await post('/api/pair', { pair: pairing.code }, undefined, 'https://wrong.example')).status, 403);
    assert.equal((await post('/api/pair', { pair: pairing.code })).status, 200);
  } finally { if (child.exitCode === null) { const exited = once(child, 'exit'); child.kill(); await exited; } }
});
