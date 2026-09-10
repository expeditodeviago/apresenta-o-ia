import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const base = 'http://localhost:4184';
try {
  await fetch(base + '/api/health');
  throw Error('Porta 4184 ocupada. Encerre o servidor de teste anterior antes de continuar.');
} catch (error) { if (error.message.includes('ocupada')) throw error; }
// Own the Node child directly: shell process-tree shutdown can stall on Windows.
const server = spawn(process.execPath, ['server/index.ts'], {
  env: { ...process.env, PORT: '4184', SYNAPSE_DATA_DIR: '.runtime/e2e-' + Date.now() },
  stdio: 'ignore', windowsHide: true,
});
try {
  let ready = false;
  for (let i = 0; i < 80; i++) {
    try { if ((await fetch(base + '/api/health')).ok) { ready = true; break; } } catch {}
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  if (!ready) throw Error('Servidor de teste não iniciou.');
  const test = spawn(process.execPath, [require.resolve('@playwright/test/cli'), 'test', ...process.argv.slice(2)], { stdio: 'inherit', windowsHide: true });
  const [code] = await once(test, 'exit');
  process.exitCode = code ?? 1;
} finally {
  if (server.exitCode === null) { const exited = once(server, 'exit'); server.kill(); await exited; }
}
