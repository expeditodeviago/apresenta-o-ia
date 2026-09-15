import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdir, writeFile } from 'node:fs/promises';

const base = 'http://localhost:4186';
const server = spawn(process.execPath, ['server/index.ts'], {
  env: { ...process.env, PORT: '4186', SYNAPSE_DATA_DIR: '.runtime/notes-qa-' + Date.now() },
  stdio: 'ignore', windowsHide: true,
});
let browser;
try {
  let ready = false;
  for (let i = 0; i < 80; i++) {
    try { if ((await fetch(base + '/api/health')).ok) { ready = true; break; } } catch {}
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  if (!ready) throw Error('Notes inspection server did not start.');
  const created = await (await fetch(base + '/api/sessions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })).json();
  const command = async command => {
    const response = await fetch(base + '/api/sessions/' + created.id + '/command', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + created.secret }, body: JSON.stringify({ id: crypto.randomUUID(), command }) });
    if (!response.ok) throw Error('Notes inspection command failed.');
  };
  browser = await chromium.launch({ headless: true });
  await mkdir('artifacts', { recursive: true });
  const errors = [], layouts = [];
  for (const viewport of [{ width: 390, height: 844 }, { width: 1280, height: 720 }]) {
    const page = await browser.newPage({ viewport, reducedMotion: 'reduce' });
    page.on('pageerror', error => errors.push(error.message));
    await command({ type: 'module', value: 1 });
    await page.goto(base + '/control?session=' + created.id);
    await page.getByText('Conectado', { exact: true }).waitFor();
    await page.getByRole('button', { name: 'Notas privadas', exact: true }).click();
    await page.locator('[data-note="speech"]').waitFor();
    await page.locator('.notes-intro').scrollIntoViewIfNeeded();
    await page.screenshot({ path: 'artifacts/notes-tokens-' + viewport.width + '.png' });
    for (const key of ['foundations', 'example', 'glossary', 'questions', 'sources']) {
      await page.locator('[data-note="' + key + '"] summary').click();
      await page.locator('[data-note="' + key + '"] p').waitFor({ state: 'visible' });
    }
    layouts.push({ width: viewport.width, mode: 'AI', overflow: await page.evaluate(() => document.documentElement.scrollWidth - innerWidth) });
    await command({ type: 'mathMode', value: true });
    await page.locator('[data-note="speech"]').filter({ hasText: '3 pães e 2 recheios' }).waitFor();
    await page.locator('[data-note="example"]').scrollIntoViewIfNeeded();
    await page.screenshot({ path: 'artifacts/notes-example-' + viewport.width + '.png' });
    layouts.push({ width: viewport.width, mode: 'math', overflow: await page.evaluate(() => document.documentElement.scrollWidth - innerWidth) });
    await page.close();
  }
  await writeFile('artifacts/notes-visual-report.json', JSON.stringify({ errors, layouts }, null, 2));
  if (errors.length || layouts.some(row => row.overflow > 1)) throw Error('Notes visual inspection failed.');
  console.log(JSON.stringify({ errors, layouts }));
} finally {
  await browser?.close();
  if (server.exitCode === null) { const exited = once(server, 'exit'); server.kill(); await exited; }
}
