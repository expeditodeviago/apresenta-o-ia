import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

await mkdir('artifacts', { recursive: true });
const base = 'http://localhost:4185';
const server = spawn(process.execPath, ['server/index.ts'], { env: { ...process.env, PORT: '4185', SYNAPSE_DATA_DIR: '.runtime/visual-' + Date.now() }, stdio: 'ignore', windowsHide: true });
let browser;
try {
  for (let i = 0; i < 80; i++) { try { if ((await fetch(base + '/api/health')).ok) break; } catch {} await new Promise(resolve => setTimeout(resolve, 50)); }
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, reducedMotion: 'reduce' });
  const errors = [], layouts = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base);
  await page.locator('.connection-dot.online').waitFor();
  const command = async command => {
    await page.evaluate(async command => {
      const session = new URL(location.href).searchParams.get('session');
      const secret = sessionStorage.getItem('synapse-owner-' + session);
      const response = await fetch('/api/sessions/' + session + '/command', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + secret }, body: JSON.stringify({ id: crypto.randomUUID(), command }) });
      if (!response.ok) throw Error('Inspection command rejected');
    }, command);
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  };
  async function inspect(label, screenshot = false) {
    const layout = await page.evaluate(() => {
      const main = document.querySelector('.live-main'), visual = document.querySelector('.live-visual'), dock = document.querySelector('.live-dock');
      return { pageOverflow: document.documentElement.scrollWidth - innerWidth, mainOverflow: main.scrollWidth - main.clientWidth, contentHeight: main.scrollHeight, availableHeight: main.clientHeight, boardBottom: Math.round(visual.getBoundingClientRect().bottom), dockTop: Math.round(dock.getBoundingClientRect().top) };
    });
    layouts.push({ label, ...layout });
    if (screenshot) await page.screenshot({ path: 'artifacts/' + label + '.png' });
  }
  for (const size of [{ width: 1280, height: 720 }, { width: 1920, height: 1080 }]) {
    await page.setViewportSize(size);
    await command({ type: 'module', value: 0 });
    await command({ type: 'stageMode', value: false });
    await inspect('opening-' + size.width, true);
    await command({ type: 'stage', value: 4 });
    await inspect('opening-surprise-' + size.width, true);
    await command({ type: 'stageMode', value: true });
    for (let module = 1; module <= 14; module++) {
      await command({ type: 'module', value: module });
      await inspect('prediction-' + module + '-' + size.width, module === 1);
      await command({ type: 'stage', value: 3 });
      await inspect('experiment-' + module + '-' + size.width, true);
      if (module === 14) {
        for (const stage of [0, 1, 2, 4, 6, 7]) {
          await command({ type: 'stage', value: stage });
          await inspect('network-stage-' + stage + '-' + size.width, stage === 2 || stage === 4);
        }
        await command({ type: 'set', key: 'networkFocus', value: 12 });
        await inspect('network-detail-' + size.width, true);
        await command({ type: 'set', key: 'networkFocus', value: 0 });
      }
      if (module < 13) {
        await command({ type: 'stage', value: 5 });
        await inspect('reveal-' + module + '-' + size.width, module === 3);
        await command({ type: 'storyVariant', value: 1 });
        await inspect('ai-alternative-' + module + '-' + size.width, true);
        await command({ type: 'mathMode', value: true });
        await inspect('math-' + module + '-' + size.width);
        await command({ type: 'mathMode', value: false });
      }
    }
  }
  await page.setViewportSize({ width: 1280, height: 720 });
  await command({ type: 'module', value: 12 });
  await command({ type: 'mathMode', value: true });
  for (const [key, value] of [['authorized', true], ['cyclic', false], ['capacity', 3]]) await command({ type: 'set', key, value });
  await command({ type: 'action', key: 'launch' });
  await page.getByText('Missão concluída: resposta com evidências e fluxo verificado.', { exact: true }).waitFor();
  await inspect('mission-success-1280', true);
  const pair = await page.evaluate(async () => {
    const id = new URL(location.href).searchParams.get('session');
    const response = await fetch('/api/sessions/' + id + '/pair', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + sessionStorage.getItem('synapse-owner-' + id) }, body: '{}' });
    return (await response.json()).pair;
  });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const phone = await context.newPage();
  await phone.goto(base + '/control#pair=' + pair);
  await phone.getByText('Conectado', { exact: true }).waitFor();
  await phone.screenshot({ path: 'artifacts/control-mobile.png' });
  await phone.getByRole('button', { name: 'Notas privadas', exact: true }).click();
  await phone.getByRole('heading', { name: 'Fala sugerida', exact: true }).waitFor();
  await phone.screenshot({ path: 'artifacts/control-notes-mobile.png' });
  const mobileOverflow = await phone.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  await command({ type: 'module', value: 14 });
  await phone.getByRole('button', { name: 'Comandos', exact: true }).click();
  await phone.getByRole('button', { name: 'Revelar a rede inteira', exact: true }).click();
  await phone.screenshot({ path: 'artifacts/network-remote-mobile.png', fullPage: true });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await command({ type: 'stage', value: 3 });
  // Wait for the intentional 1.6-second reveal, then inspect the animated canvas.
  await page.evaluate(() => new Promise(resolve => { const end = performance.now() + 1800; const frame = () => performance.now() >= end ? resolve() : requestAnimationFrame(frame); requestAnimationFrame(frame); }));
  await inspect('network-animated-1280', true);
  await writeFile('artifacts/visual-report.json', JSON.stringify({ errors, mobileOverflow, layouts }, null, 2));
  console.log(JSON.stringify({ errors, mobileOverflow, overflow: layouts.filter(row => row.pageOverflow > 1 || row.mainOverflow > 1), clipped: layouts.filter(row => row.boardBottom > row.dockTop + 2), checked: layouts.length }, null, 2));
} finally {
  await browser?.close();
  if (server.exitCode === null) { const exited = once(server, 'exit'); server.kill(); await exited; }
}

