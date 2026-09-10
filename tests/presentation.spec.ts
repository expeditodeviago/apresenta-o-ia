import { test, expect, type Page, type Browser } from '@playwright/test';

async function start(page: Page) {
  await page.goto('/');
  await expect(page.locator('.connection-dot.online')).toBeVisible();
}
async function chooseModule(page: Page, module: number) {
  await page.getByRole('button', { name: 'Visão geral dos módulos', exact: true }).click();
  const item = page.locator('.live-overview-grid > button').nth(module);
  await item.click();
  await expect(page.locator('[data-module="' + module + '"]')).toBeVisible();
}
async function phoneFor(page: Page, browser: Browser) {
  const id = new URL(page.url()).searchParams.get('session')!;
  const pair = await page.evaluate(async (session) => {
    const secret = sessionStorage.getItem('synapse-owner-' + session);
    const response = await fetch('/api/sessions/' + session + '/pair', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + secret }, body: '{}' });
    return (await response.json()).pair;
  }, id);
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const phone = await context.newPage();
  await phone.goto('http://localhost:4184/control#pair=' + pair);
  await expect(phone.getByText('Conectado', { exact: true })).toBeVisible();
  return { phone, context, id };
}

test('Navegação pelos 12 módulos, abertura, desafio e síntese sem erros', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await start(page);
  for (let module = 1; module <= 14; module++) {
    await page.getByRole('button', { name: 'Próximo módulo', exact: true }).click();
    await expect(page.locator('[data-module="' + module + '"]')).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test('Previsão vem antes do resultado; parâmetros alteram a fábrica; restaura após atualizar', async ({ page }) => {
  await start(page); await chooseModule(page, 1);
  await expect(page.locator('.prediction-panel')).toBeVisible();
  await expect(page.locator('.formula-strip')).toHaveCount(0);
  await page.getByRole('button', { name: 'Testar a hipótese', exact: true }).click();
  await expect(page.locator('.formula-strip strong')).toContainText('27');
  await page.getByRole('slider', { name: 'Opções por posição', exact: true }).focus();
  await page.keyboard.press('End');
  await expect(page.locator('.formula-strip strong')).toContainText('216');
  await page.reload();
  await expect(page.locator('[data-module="1"] .formula-strip strong')).toContainText('216');
});

test('Celular controla, mantém notas privadas, destaca a projeção e reconecta', async ({ page, browser }) => {
  await start(page);
  const { phone, context } = await phoneFor(page, browser);
  await phone.getByRole('button', { name: 'Próximo módulo', exact: true }).click();
  await expect(page.locator('[data-module="1"]')).toBeVisible();
  await phone.getByRole('button', { name: 'Notas privadas', exact: true }).click();
  await expect(phone.getByRole('heading', { name: 'Resposta esperada', exact: true })).toBeVisible();
  await expect(page.getByText('Fala sugerida', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Resposta esperada', { exact: true })).toHaveCount(0);
  await phone.getByRole('button', { name: 'Destaque', exact: true }).click();
  await phone.getByRole('button', { name: 'Área de destaque do projetor', exact: true }).click();
  await expect(page.locator('.projection-pointer')).toBeVisible();
  await context.setOffline(true);
  await page.getByRole('button', { name: 'Próximo módulo', exact: true }).click();
  await expect(page.locator('[data-module="2"]')).toBeVisible();
  await context.setOffline(false);
  await expect(phone.getByRole('heading', { name: 'Labirinto', exact: true })).toBeVisible();
  await phone.reload();
  await expect(phone.getByText('Conectado', { exact: true })).toBeVisible();
  await expect(phone.getByRole('heading', { name: 'Labirinto', exact: true })).toBeVisible();
  await context.close();
});

test('Cliques rápidos são relativos ao estado autoritativo', async ({ page, browser }) => {
  await start(page); const { phone, context } = await phoneFor(page, browser);
  await phone.getByRole('button', { name: 'Próximo módulo', exact: true }).click({ clickCount: 3, delay: 10 });
  await expect(page.locator('[data-module="3"]')).toBeVisible();
  await context.close();
});

test('Auto-Play inicia, pausa, retoma e reinicia o labirinto', async ({ page }) => {
  await start(page); await chooseModule(page, 2);
  await page.getByRole('button', { name: 'Iniciar Auto-Play', exact: true }).click();
  await expect(page.locator('.maze-cell.visited, .maze-cell.path')).not.toHaveCount(0);
  await page.getByRole('button', { name: 'Pausar Auto-Play', exact: true }).click();
  const count = await page.locator('.maze-cell.visited, .maze-cell.path').count();
  await page.waitForTimeout(1250);
  expect(await page.locator('.maze-cell.visited, .maze-cell.path').count()).toBe(count);
  await page.getByRole('button', { name: 'Iniciar Auto-Play', exact: true }).click();
  await expect.poll(() => page.locator('.maze-cell.visited, .maze-cell.path').count()).toBeGreaterThan(count);
  await page.getByRole('button', { name: 'Reiniciar experimento', exact: true }).click();
  await expect(page.locator('.maze-cell.visited, .maze-cell.path')).toHaveCount(0);
});

test('Computador mantém comando local na queda e reconcilia ao reconectar', async ({ page, context }) => {
  await start(page); await chooseModule(page, 1);
  await context.setOffline(true);
  await page.getByRole('button', { name: 'Próximo módulo', exact: true }).click();
  await expect(page.locator('[data-module="2"]')).toBeVisible();
  await context.setOffline(false);
  await expect(page.locator('.connection-dot.online')).toBeVisible();
  await page.reload();
  await expect(page.locator('[data-module="2"]')).toBeVisible();
});

test('QR usa endereço de rede; link público em outra sessão não revela notas', async ({ page, browser }) => {
  await start(page);
  const popupPromise = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Conectar celular', exact: true }).click();
  const setup = await popupPromise;
  await expect(setup.getByRole('combobox', { name: 'Endereço acessível pelo celular' })).not.toHaveValue(/localhost|127\.0\.0\.1/);
  await setup.getByRole('button', { name: 'Gerar pareamento temporário', exact: true }).click();
  await expect(setup.getByAltText('QR code temporário de controle do apresentador')).toBeVisible();
  await expect(page.locator('img[alt*="QR"]')).toHaveCount(0);
  const stranger = await browser.newContext(); const tab = await stranger.newPage();
  await tab.goto('http://localhost:4184/control?session=' + new URL(page.url()).searchParams.get('session'));
  await expect(tab.getByRole('heading', { name: 'Este controle precisa ser pareado.' })).toBeVisible();
  await expect(tab.getByText('Fala sugerida', { exact: true })).toHaveCount(0);
  await stranger.close();
});

test('Lógica e missão respondem às decisões, sem depender de modelos externos', async ({ page }) => {
  await start(page); await chooseModule(page, 3);
  await page.getByRole('button', { name: 'Testar a hipótese', exact: true }).click();
  await expect(page.getByText('Acesso negado', { exact: true })).toBeVisible();
  await page.getByRole('combobox', { name: 'Conector da regra' }).selectOption('or');
  await expect(page.getByText('Acesso permitido', { exact: true })).toBeVisible();
  await chooseModule(page, 12);
  await page.getByRole('button', { name: 'Executar missão', exact: true }).click();
  await expect(page.locator('.mission-result')).toContainText('Bloqueio');
  await page.getByRole('checkbox', { name: 'Pedido autorizado', exact: true }).check();
  await page.getByRole('checkbox', { name: 'Dependência circular', exact: true }).uncheck();
  await page.getByRole('slider', { name: 'Capacidade para evidências' }).focus(); await page.keyboard.press('End');
  await page.getByRole('button', { name: 'Executar missão', exact: true }).click();
  await expect(page.locator('.mission-result')).toContainText('Missão concluída');
});


test('Resposta HTTP perdida é repetida sem duplicar o comando, inclusive após atualizar', async ({ page }) => {
  await start(page);
  let loseResponse = true;
  await page.route('**/command', async route => {
    if (!loseResponse) { await route.continue(); return; }
    loseResponse = false;
    await route.fetch(); // The server commits; the client never receives the acknowledgment.
    await route.abort('failed');
  });
  await page.getByRole('button', { name: 'Próximo módulo', exact: true }).click();
  await expect(page.locator('[data-module="1"]')).toBeVisible();
  await expect(page.locator('.connection-dot.offline')).toBeVisible();
  await page.reload();
  await expect(page.locator('.connection-dot.online')).toBeVisible();
  await expect(page.locator('[data-module="1"]')).toBeVisible();
  const result = await page.request.get('/api/sessions/' + new URL(page.url()).searchParams.get('session'));
  expect((await result.json()).state.module).toBe(1);
});

test('Modo palco pode ser ativado pelo celular e encerrado pelo teclado', async ({ page, browser }) => {
  await start(page);
  const { phone, context } = await phoneFor(page, browser);
  await phone.getByRole('button', { name: 'Próximo módulo', exact: true }).click();
  await phone.getByRole('button', { name: 'Modo palco no projetor', exact: true }).click();
  await expect(page.locator('.live-app.stage-mode')).toBeVisible();
  await expect(page.locator('.live-console')).toBeHidden();
  await page.locator('body').click({ position: { x: 3, y: 150 } });
  await page.keyboard.press('Escape');
  await expect(page.locator('.live-console')).toBeVisible();
  await context.close();
});


test('Código alternativo pareia o celular e invalida o mesmo QR', async ({ page, browser }) => {
  await start(page);
  const popupPromise = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Conectar celular', exact: true }).click();
  const setup = await popupPromise;
  await setup.getByRole('button', { name: 'Gerar pareamento temporário', exact: true }).click();
  await expect(setup.getByAltText('QR code temporário de controle do apresentador')).toBeVisible();
  const code = await setup.getByLabel('Código temporário').innerText();
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const phone = await context.newPage();
  await phone.goto('http://localhost:4184/control');
  await phone.getByLabel('Código de pareamento').fill(code);
  await phone.getByRole('button', { name: 'Conectar com código', exact: true }).click();
  await expect(phone.getByText('Conectado', { exact: true })).toBeVisible();
  await phone.getByRole('button', { name: 'Próximo módulo', exact: true }).click();
  await expect(page.locator('[data-module="1"]')).toBeVisible();
  const second = await context.newPage();
  await second.goto('http://localhost:4184/control');
  await second.getByLabel('Código de pareamento').fill(code);
  await second.getByRole('button', { name: 'Conectar com código', exact: true }).click();
  await expect(second.getByRole('alert')).toContainText('já utilizado');
  await context.close();
});

test('QR inválido oferece recuperação por código em vez de travar na conexão', async ({ page }) => {
  await page.goto('/control#pair=invalid-test-code');
  await expect(page.getByRole('alert')).toContainText('Pareamento inválido');
  await expect(page.getByLabel('Código de pareamento')).toBeEnabled();
  expect(new URL(page.url()).hash).toBe('');
});
