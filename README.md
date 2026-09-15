# SYNAPSE

Apresentação interativa em português: 120 minutos para entender como a IA funciona, com abertura animada, 12 capítulos visuais, quiz e uma rede de conhecimento no encerramento. Os experimentos de Matemática Discreta ficam em “Explorar a matemática”. A apresentação roda no navegador; o celular tem seu próprio controle com notas privadas.

## Colocar online

Siga o [guia de publicação no Render](docs/COLOCAR-ONLINE.md). O repositório inclui `render.yaml` para configurar o servidor, HTTPS e persistência. Comece pela página `/setup` do endereço publicado.

## Abrir

Requer Node.js 24 e as dependências do projeto. No PowerShell:

```powershell
npm.cmd run build
npm.cmd start
```

Abra **http://localhost:4173** no computador. Mantenha esse processo aberto durante a apresentação. Se as dependências ainda não estiverem instaladas, rode `npm.cmd ci` antes do build.

O botão **Apresentar** ativa o modo palco e solicita tela cheia. **Modo palco** (F) amplia os experimentos e recolhe a coluna de controles; pode ser ligado pelo celular. Escape recupera os controles. A janela privada deve ficar no monitor do apresentador, com o sistema em **Estender**, para preservar as notas.

## Parear o celular

### Entrar pelo link

1. No computador, abra **Conectar celular**, ou abra **/setup** e clique em **Criar sessão**.
2. Clique em **Copiar link do controle** e abra o link no celular. O controle conecta automaticamente, sem senha.
3. Abra a tela pública pelo link da preparação e teste **Próximo módulo** no celular.

A preparação também dispensa chave administrativa. Quem tiver o link da sessão pode controlar a apresentação e consultar as notas. **Revogar controles remotos** desconecta os aparelhos atuais; o link permite entrar novamente. A sessão dura até 12 horas.

Online, computador e celular podem estar em redes diferentes. No modo local, os dois precisam alcançar o servidor pela mesma rede.

### Alternativa: QR ou código temporário

1. No modo local, conecte computador e celular à mesma rede. Online, ambos só precisam ter internet.
2. No computador, abra **Conectar celular**. A preparação aparece em outra janela.
3. Escolha o endereço da rede Wi-Fi anunciado pelo servidor. O IP pode mudar. Evite adaptadores VPN e endereços localhost.
4. Primeiro abra no celular o endereço do controle mostrado na preparação. Depois gere o QR temporário e leia com o celular. Se a câmera não abrir o link, digite o código de 10 caracteres na página `/control`. Ele expira em 120 segundos e só pode ser usado uma vez.
5. Avance um módulo pelo telefone e confira a projeção. As notas estão na aba **Notas privadas**.

O computador criador pode revogar os controles nessa mesma janela. A sessão vale por 12 horas. Não compartilhe o QR ou link privado com a plateia; eles autorizam o controle e as notas. O link da projeção não contém essa credencial.

## Conduzir a experiência

- Na abertura, use **Começar pela pergunta: ela pensa como a gente?** para acompanhar a descoberta. **Descobrir por dentro** abre o primeiro capítulo.
- Cada capítulo tem oito passos, animações e dois exemplos comparáveis. **Explorar a matemática** abre os experimentos; **Voltar à explicação de IA** retorna ao capítulo.
- Peça uma previsão antes de **Testar a hipótese**. A resposta dá lugar ao experimento após uma transição curta.
- **Auto-Play** executa os passos da simulação. **Pausar** conserva o progresso; **Reiniciar experimento** restaura os parâmetros padrão. Os módulos avançam sob seu comando.
- Na missão, cada condição é verificada em sequência. O primeiro bloqueio interrompe a execução. Corrija o parâmetro e rode novamente.
- O cronômetro privado é independente do Auto-Play. Ligue-o no início da fala.
- Som começa desligado. Ative nas configurações e interaja uma vez com a projeção para o navegador permitir áudio. Movimento reduzido respeita a preferência do sistema e a configuração da sessão.

| Tecla | Ação |
| --- | --- |
| → / PageDown | Próxima etapa |
| ← / PageUp | Etapa anterior |
| Shift + → / ← | Próximo módulo / módulo anterior |
| Espaço | Próxima etapa de IA; um passo na matemática; revelar/avançar no quiz |
| A | Iniciar/pausar Auto-Play |
| V | Revelar/ocultar explicação na matemática ou no quiz |
| R | Reiniciar experimento atual |
| M | Visão geral |
| F | Alternar modo palco |
| P | Abrir controle e notas privados |
| Escape | Fechar painel ou sair do modo palco |

Atalhos não interferem quando um campo, botão ou diálogo tem foco. Clique em uma área vazia para voltar a usá-los.

## Material do apresentador

- [Encerramento surpresa e cofre do Obsidian](docs/FINAL-OBSIDIAN.md): rede interativa com 493 notas e 984 ligações, revelada pelo celular. O botão no último módulo permite baixar o cofre.
- [Guia completo do apresentador](docs/ROTEIRO-PRIVADO.md): conceitos do zero, exemplos prontos, falas por etapa, cliques da demonstração, contas resolvidas e respostas às dúvidas. Inclui o roteiro principal de 120 minutos e os aprofundamentos matemáticos opcionais.
- [Mapeamento matemático e limites](docs/MAPEAMENTO.md)
- [Checklist de palco, rede e hospedagem](docs/PALCO.md)

Atualize os documentos gerados após mudar o currículo: `node scripts/export-notes.ts`. Os arquivos em `docs/` ficam fora do diretório servido ao público.

Em **Notas privadas**, a fala, a demonstração e a resposta esperada ficam abertas. Os demais tópicos podem ser expandidos para estudo e consulta. As notas acompanham a rodada do quiz, o exemplo selecionado e a troca entre explicação de IA e matemática. As perguntas matemáticas, alternativas e gabaritos acompanham os parâmetros atuais. Entrar em matemática pela primeira vez abre a primeira etapa; ao alternar os roteiros, cada um retoma a sua própria etapa. O quiz tem seis perguntas, com navegação e notas sincronizadas. O arquivo do guia também pode ser lido com o servidor desligado.

## Conexão e persistência

O servidor é a fonte autoritativa do estado. A projeção mantém uma cópia local e pode continuar recebendo comandos durante uma queda. Comandos pendentes guardam IDs e são reenviados em ordem; o servidor reconhece duplicatas. Ao reconectar, eles são aplicados sobre o estado atual do servidor. Alterações feitas em outro controle durante a queda também podem afetar o resultado final. Auto-Play offline é uma prévia; os instantes intermediários não são reproduzidos como eventos no servidor.

A fila sobrevive à atualização enquanto o site puder ser carregado. **Não há service worker**: recarregar a página com o servidor inacessível pode impedir a abertura, mesmo que os dados estejam salvos. Durante a queda, mantenha a aba aberta. Os controles do computador respondem imediatamente; o celular mostra ações pendentes até receber confirmação.

Sessões são persistidas em `.runtime/`. Reiniciar o servidor preserva o módulo e os parâmetros, mas pausa cronômetro e Auto-Play. O armazenamento contém credenciais protegidas por hash; nunca o publique nem o inclua em pacotes de distribuição.

## Verificação

```powershell
npm.cmd run test:unit
npm.cmd run test:e2e
node scripts/inspect-live.mjs
```

Os testes E2E usam servidor isolado na porta 4184 e dados separados. Screenshots, vídeo e trace ficam desligados nessa suíte. O script de inspeção visual separado produz imagens em `artifacts/` e nunca captura QR ou credenciais.

Os componentes antigos continuam preservados em `src/components/` e `src/App.tsx`. A entrada ativa é `src/live/LiveApp.tsx`. Backups recuperáveis ficam em `backups/`.
