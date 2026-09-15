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

test('Link conecta sem senha e permite reconectar sem repetir comandos antigos', async ({ page, browser }) => {
  await start(page);
  const id = new URL(page.url()).searchParams.get('session')!;
  await page.goto('/setup?session=' + id);
  await expect(page.locator('input[type="password"]')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Copiar link do controle', exact: true })).toBeVisible();
  const projection = await page.context().newPage();
  await projection.goto('/?session=' + id);
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  try {
    const phone = await context.newPage();
    await phone.goto('http://localhost:4184/control?session=' + id);
    await expect(phone.getByText('Conectado', { exact: true })).toBeVisible();
    await expect(phone.locator('input[type="password"]')).toHaveCount(0);
    await phone.getByRole('button', { name: 'Próximo módulo', exact: true }).click();
    await expect(projection.locator('[data-module="1"]')).toBeVisible();
    await page.getByRole('button', { name: 'Revogar controles remotos', exact: true }).click();
    await expect(page.getByRole('status')).toContainText('desconectados');
    await phone.getByRole('button', { name: 'Próximo módulo', exact: true }).click();
    await expect(phone.getByText('Controle desconectado. Conecte novamente.')).toBeVisible();
    await phone.getByRole('button', { name: 'Reconectar controle', exact: true }).click();
    await expect(phone.getByText('Conectado', { exact: true })).toBeVisible();
    await expect(projection.locator('[data-module="1"]')).toBeVisible();
    await phone.getByRole('button', { name: 'Próximo módulo', exact: true }).click();
    await expect(projection.locator('[data-module="2"]')).toBeVisible();
  } finally { await context.close(); }
});

test('Preparação cria sessão sem campo de senha', async ({ page }) => {
  await page.goto('/setup');
  await page.getByRole('button', { name: 'Criar sessão', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Copiar link do controle', exact: true })).toBeVisible();
  await expect(page.locator('input[type="password"]')).toHaveCount(0);
});

test('Encerramento revela a rede pelo celular, explora perguntas e conserva a cena após recarregar', async ({ page, browser }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await start(page); const { phone, context } = await phoneFor(page, browser);
  try {
    await chooseModule(page, 14);
    await expect(page.locator('.knowledge-finale')).toHaveAttribute('data-network-count', '13');
    await phone.getByRole('button', { name: 'Conectar as ideias', exact: true }).click();
    await expect(page.locator('.knowledge-finale')).toHaveAttribute('data-network-count', '109');
    await phone.getByRole('button', { name: 'Revelar a rede inteira', exact: true }).click();
    await expect(page.locator('.knowledge-finale')).toHaveAttribute('data-network-count', '493');
    await phone.getByRole('button', { name: 'Fazer a rede acender', exact: true }).click();
    await expect(page.getByRole('link', { name: 'Levar esta rede para o Obsidian' })).toBeVisible();
    await phone.getByRole('button', { name: 'Por que a IA pode errar?', exact: true }).click();
    await expect(page.locator('.knowledge-answer')).toContainText('conferir as fontes');
    await phone.getByLabel('Explorar um tema').selectOption('9');
    await expect(page.locator('.knowledge-note h2')).toHaveText('Probabilidade');
    await page.reload();
    await expect(page.locator('.knowledge-finale')).toHaveAttribute('data-network-stage', '4');
    await expect(page.locator('.knowledge-note h2')).toHaveText('Probabilidade');
    await page.getByRole('button', { name: 'Voltar à rede inteira', exact: true }).click();
    await expect(page.locator('.knowledge-note')).toHaveCount(0);
    await page.getByRole('button', { name: 'Ampliar a rede' }).click();
    await expect(page.locator('.knowledge-zoom')).toContainText('120%');
    await page.getByRole('button', { name: 'Centralizar a rede' }).click();
    await expect(page.locator('.knowledge-zoom')).toContainText('100%');
    const download = page.waitForEvent('download');
    await page.getByRole('link', { name: 'Levar esta rede para o Obsidian' }).click();
    const file = await download; expect(file.suggestedFilename()).toBe('SYNAPSE-Obsidian.zip'); expect(await file.failure()).toBeNull();
  } finally { await context.close(); }
});

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
  await page.getByRole('button', { name: 'Explorar a matemática', exact: true }).click();
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
  await expect(phone.getByRole('heading', { name: 'Resposta esperada e como explicar', exact: true })).toBeVisible();
  await expect(page.getByText('Fala sugerida', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Resposta esperada e como explicar', { exact: true })).toHaveCount(0);
  await phone.getByRole('button', { name: 'Destaque', exact: true }).click();
  await phone.getByRole('button', { name: 'Área de destaque do projetor', exact: true }).click();
  await expect(page.locator('.projection-pointer')).toBeVisible();
  await context.setOffline(true);
  await page.getByRole('button', { name: 'Próximo módulo', exact: true }).click();
  await expect(page.locator('[data-module="2"]')).toBeVisible();
  await context.setOffline(false);
  await expect(phone.getByRole('heading', { name: 'Significados', exact: true })).toBeVisible();
  await phone.reload();
  await expect(phone.getByText('Conectado', { exact: true })).toBeVisible();
  await expect(phone.getByRole('heading', { name: 'Significados', exact: true })).toBeVisible();
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
  await page.getByRole('button', { name: 'Explorar a matemática', exact: true }).click();
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
  await tab.goto('http://localhost:4184/?session=' + new URL(page.url()).searchParams.get('session'));
  await expect(tab.locator('.connection-dot.online')).toBeVisible();
  await expect(tab.getByText('Fala sugerida', { exact: true })).toHaveCount(0);
  await stranger.close();
});

test('Lógica e missão respondem às decisões, sem depender de modelos externos', async ({ page }) => {
  await start(page); await chooseModule(page, 3);
  await page.getByRole('button', { name: 'Explorar a matemática', exact: true }).click();
  await page.getByRole('button', { name: 'Testar a hipótese', exact: true }).click();
  await expect(page.getByText('Acesso negado', { exact: true })).toBeVisible();
  await page.getByRole('combobox', { name: 'Conector da regra' }).selectOption('or');
  await expect(page.getByText('Acesso permitido', { exact: true })).toBeVisible();
  await chooseModule(page, 12);
  await page.getByRole('button', { name: 'Explorar a matemática', exact: true }).click();
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
  await expect(page.locator('.live-app.stage-mode')).toHaveCount(0);
  await expect(page.locator('.ai-journey')).toBeVisible();
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

test('Explicação de IA sincroniza exemplos, animação e aprofundamento pelo celular', async ({ page, browser }) => {
  await start(page);
  await chooseModule(page, 5);
  const { phone, context } = await phoneFor(page, browser);
  try {
    await expect(page.locator('.ai-journey')).toBeVisible();
    await expect(page.locator('.live-console')).toHaveCount(0);
    await expect(page.locator('.attention-answer')).toContainText('Um lugar para sentar');
    await phone.getByRole('button', { name: 'Banco da conta', exact: true }).click();
    await expect(page.locator('.attention-answer')).toContainText('Uma instituição financeira');
    await page.reload();
    await expect(page.locator('.attention-answer')).toContainText('Uma instituição financeira');
    await phone.getByLabel('Movimento reduzido', { exact: true }).check();
    await expect(page.locator('.live-app')).toHaveClass(/reduce-motion/);
    const active = await page.locator('.ai-journey').evaluate(el => el.getAnimations({ subtree: true }).filter(a => a.playState === 'running').length);
    expect(active).toBe(0);
    await phone.getByRole('button', { name: 'Explorar a matemática', exact: true }).click();
    await expect(page.locator('.math-route-banner')).toBeVisible();
    await expect(page.locator('.live-console')).toBeVisible();
    await phone.getByRole('button', { name: 'Voltar à explicação de IA', exact: true }).click();
    await expect(page.locator('.attention-answer')).toContainText('Uma instituição financeira');
    await phone.getByRole('button', { name: 'Notas privadas', exact: true }).click();
    await expect(phone.locator('.private-notes')).toContainText('Uma palavra ganha sentido junto das outras');
  } finally { await context.close(); }
});

test('Notas ensinam a demonstração e acompanham a rodada do quiz e a matemática', async ({ page, browser }) => {
  await start(page);
  const { phone, context } = await phoneFor(page, browser);
  try {
    await chooseModule(page, 13);
    await phone.getByRole('button', { name: 'Notas privadas', exact: true }).click();
    await expect(phone.locator('[data-note="speech"]')).toContainText('Uma palavra sempre corresponde');
    await page.getByRole('button', { name: 'Próxima rodada', exact: true }).click();
    await expect(phone.locator('.notes-intro')).toContainText('pergunta 2 de 6');
    await expect(phone.locator('[data-note="speech"]')).toContainText('O que o treinamento de uma rede neural ajusta?');
    await expect(phone.locator('[data-note="expected"]')).toContainText('A — Os pesos');
    await chooseModule(page, 1);
    await phone.getByRole('button', { name: 'Abrir comandos da demonstração', exact: true }).click();
    await phone.getByRole('button', { name: 'Explorar a matemática', exact: true }).click();
    await phone.getByRole('button', { name: 'Notas privadas', exact: true }).click();
    await expect(phone.locator('[data-note="speech"]')).toContainText('3 pães e 2 recheios');
    await expect(phone.locator('[data-note="demonstration"]')).toContainText('Comprimento da sequência');
    await phone.locator('[data-note="glossary"] summary').click();
    await expect(phone.locator('[data-note="glossary"] p')).toBeVisible();
    await expect(phone.locator('[data-note="glossary"]')).toContainText('n: quantidade de posições');
    await chooseModule(page, 14);
    await page.getByRole('button', { name: 'Conectar as ideias', exact: true }).click();
    await page.getByRole('button', { name: 'Revelar a rede inteira', exact: true }).click();
    await page.getByRole('button', { name: 'Fazer a rede acender', exact: true }).click();
    await page.getByRole('button', { name: 'Como a IA ajuda no dia a dia?', exact: true }).click();
    await expect(phone.locator('[data-note="speech"]')).toContainText('Como a IA ajuda no dia a dia?');
    await page.getByRole('button', { name: 'Por que mais informação não basta?', exact: true }).click();
    await expect(phone.locator('[data-note="speech"]')).toContainText('Por que mais informação não basta?');
  } finally { await context.close(); }
});

test('Abertura anima o caminho e os 12 capítulos oferecem comparações visuais', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await start(page);
  await expect(page.getByRole('heading', { name: 'O que acontece dentro de uma IA?' })).toBeVisible();
  const signals = page.locator('.machine-network .neural-signal').first();
  const before = await signals.evaluate(el => getComputedStyle(el).strokeDashoffset);
  await expect.poll(() => signals.evaluate(el => getComputedStyle(el).strokeDashoffset)).not.toBe(before);
  for (let module = 1; module <= 12; module++) {
    await chooseModule(page, module);
    await expect(page.locator('.ai-illustration')).toBeVisible();
    await page.locator('.ai-example-controls button').nth(1).click();
    await expect(page.locator('.ai-example-controls button').nth(1)).toHaveAttribute('aria-pressed', 'true');
  }
});


test('Revisão dos 12 experimentos: perguntas, alternativas, títulos e notas concordam', async ({ page, browser }) => {
  test.setTimeout(90000);
  await start(page);
  const { phone, context } = await phoneFor(page, browser);
  const expected = [
    ['sequências', '27 sequências'], ['labirinto', 'Olhar por perto, em camadas (BFS)'],
    ['trocar E por OU', 'Quem tem apenas uma das duas credenciais'], ['Na rede atual', 'Em apenas um sentido'],
    ['Restam 7 peças', 'Retirar 3'], ['relógio de 12 posições', '4'],
    ['dependências atuais', 'Sim, respeitando os grupos de dependências'], ['4 gavetas', '5 objetos'],
    ['100 escolhas', 'Não, a amostragem pode produzir diferenças'], ['estado “inicial”', 'Recusar o evento e manter o estado atual'],
    ['um milhão', 'n!'], ['execução da missão', 'Permissão'],
  ];
  try {
    for (let module = 1; module <= 12; module++) {
      await chooseModule(page, module);
      await expect(page.locator('.prediction-panel')).toHaveCount(0);
      await expect(page.locator('.dock-reveal')).toHaveCount(0);
      await page.getByRole('button', { name: 'Explorar a matemática', exact: true }).click();
      await expect(page.locator('.prediction-panel h3')).toContainText(expected[module - 1][0]);
      await expect(page.locator('.prediction-options')).toContainText(expected[module - 1][1]);
      const question = await page.locator('.prediction-panel h3').innerText();
      await phone.getByRole('button', { name: 'Notas privadas', exact: true }).click();
      await expect(phone.locator('[data-note="question"]')).toContainText(question);
      await expect(phone.locator('[data-note="expected"]')).toContainText(expected[module - 1][1]);
      await expect(phone.locator('.notes-intro')).toContainText(await page.locator('.live-lesson-heading h1').innerText());
      await page.getByRole('button', { name: 'Voltar à explicação de IA', exact: true }).click();
      await expect(phone.locator('.notes-intro')).toContainText(await page.locator('.ai-story-copy h1').innerText());
    }
  } finally { await context.close(); }
});

test('Valores alterados e sessão recarregada mantêm o palpite e o gabarito correspondentes', async ({ page, browser }) => {
  await start(page); await chooseModule(page, 5);
  const { phone, context } = await phoneFor(page, browser);
  try {
    await page.getByRole('button', { name: 'Explorar a matemática', exact: true }).click();
    await page.getByRole('button', { name: 'Testar a hipótese', exact: true }).click();
    await page.getByRole('button', { name: 'Retirar 3', exact: true }).click();
    await page.getByRole('navigation', { name: 'Etapas do módulo' }).getByRole('button').nth(2).click();
    await expect(page.locator('.prediction-panel h3')).toContainText('Restam 4 peças');
    await page.locator('.prediction-options button').last().click();
    await expect(page.locator('.prediction-options button').last()).toHaveAttribute('aria-pressed', 'true');
    await phone.getByRole('button', { name: 'Notas privadas', exact: true }).click();
    await expect(phone.locator('[data-note="expected"]')).toContainText('D — Nenhuma retirada garante vitória');
    await page.reload();
    await expect(page.locator('.prediction-panel h3')).toContainText('Restam 4 peças');
    await expect(page.locator('.prediction-options button').last()).toHaveAttribute('aria-pressed', 'true');
    await page.getByRole('button', { name: 'Voltar à explicação de IA', exact: true }).click();
    await expect(page.locator('.attention-scene')).toBeVisible();
    await expect(page.locator('.prediction-panel')).toHaveCount(0);
  } finally { await context.close(); }
});

test('As seis rodadas do quiz sincronizam pergunta, alternativas, navegação e notas', async ({ page, browser }) => {
  test.setTimeout(30000);
  await start(page); await chooseModule(page, 13);
  const { phone, context } = await phoneFor(page, browser);
  try {
    await phone.getByRole('button', { name: 'Notas privadas', exact: true }).click();
    for (let round = 0; round < 6; round++) {
      const question = await page.locator('.final-quiz h3').innerText();
      await expect(phone.locator('[data-note="question"]')).toContainText(question);
      await expect(phone.locator('.control-stage')).toContainText('PERGUNTA ' + (round + 1) + ' / 6');
      await page.getByRole('button', { name: 'Revelar resposta', exact: true }).click();
      const correct = await page.locator('.quiz-options .correct strong').innerText();
      await expect(phone.locator('[data-note="expected"]')).toContainText(correct);
      if (round < 5) await page.getByRole('button', { name: 'Próxima etapa', exact: true }).click();
    }
    await expect(page.getByRole('button', { name: 'Próxima etapa', exact: true })).toBeDisabled();
  } finally { await context.close(); }
});
