# Colocar o SYNAPSE online

O repositório é [expeditodeviago/apresenta-o-ia](https://github.com/expeditodeviago/apresenta-o-ia). A apresentação usa um servidor Node para pareamento, controle pelo celular, notas e sincronização. Publique o projeto como **Web Service**, com o frontend e o servidor na mesma origem.

## Caminho preparado: Render

O arquivo [render.yaml](../render.yaml) configura o serviço, build, Node 24, chave administrativa e disco de sessões. O serviço e o disco são pagos; confira o total no painel antes de confirmar. Discos persistentes exigem um serviço pago e preservam os arquivos entre reinícios. [Documentação dos discos](https://render.com/docs/disks).

1. Entre em [dashboard.render.com](https://dashboard.render.com) e conecte sua conta GitHub.
2. Clique em **New → Blueprint** e selecione `expeditodeviago/apresenta-o-ia`, branch `main`.
3. Use `render.yaml`, na raiz, como configuração. Revise o serviço e os custos mostrados e confirme a criação. O Render usa esse arquivo para criar a infraestrutura. [Como usar Blueprints](https://render.com/docs/infrastructure-as-code).
4. Aguarde o build e o status **Live**. O endereço será o domínio HTTPS `onrender.com` mostrado no serviço; copie o endereço real do painel.
5. Em **Environment**, localize `SYNAPSE_ADMIN_KEY` e copie o valor gerado para uso privado. O YAML pede que o Render gere o segredo, sem incluí-lo no Git. [Variáveis e segredos em Blueprints](https://render.com/docs/blueprint-spec#generating-random-secrets).
6. No computador do apresentador, abra `https://SEU-ENDERECO.onrender.com/setup`. Cole a chave administrativa, clique em **Criar sessão** e mantenha essa aba aberta.
7. Clique em **Abrir tela pública desta sessão**. É essa janela que vai para o projetor. A abertura normal do site, sem sessão, não cria uma sessão administrativa automaticamente.
8. Na preparação, confira se o endereço do celular começa com o domínio HTTPS do serviço. Clique em **Gerar pareamento temporário** e leia o QR com o telefone.
9. Como alternativa ao QR, abra `https://SEU-ENDERECO.onrender.com/control` no celular e digite o código temporário exibido no computador.
10. Avance um módulo pelo celular, altere um parâmetro e confira a projeção. Depois abra as notas no celular e confirme que elas continuam privadas.

O app reconhece `RENDER_EXTERNAL_URL`, fornecido pelo Render, e usa esse endereço no pareamento. Para um domínio personalizado, defina `PUBLIC_BASE_URL` com a origem HTTPS exata e reinicie o serviço. [Variáveis padrão do Render](https://render.com/docs/environment-variables).

Com a hospedagem online, computador e celular podem usar redes diferentes, inclusive Wi-Fi e 4G/5G. Ambos precisam alcançar o mesmo endereço HTTPS do serviço.

## Se preferir configurar manualmente

No Render, use **New → Web Service**, conecte o repositório e preencha os campos abaixo. Esses são os comandos deste projeto; o fluxo de criação de um serviço Node permite definir build e start personalizados. [Guia de serviço Node](https://render.com/docs/deploy-node-express-app).

| Campo | Valor |
| --- | --- |
| Language / Runtime | Node |
| Branch | main |
| Root directory | Deixar vazio |
| Build command | `npm ci --include=dev && npm run build` |
| Start command | `npm start` |
| Health check | `/api/health` |
| Instâncias | 1 |
| Auto-deploy | Desativado, para evitar reinício durante a apresentação |
| Disco | 1 GB montado em `/var/data` |

Configure as variáveis:

| Variável | Valor |
| --- | --- |
| `NODE_VERSION` | `24.15.0` |
| `NODE_ENV` | `production` |
| `SYNAPSE_DATA_DIR` | `/var/data/synapse` |
| `SYNAPSE_ADMIN_KEY` | Um segredo longo e aleatório, criado no painel |
| `PUBLIC_BASE_URL` | Opcional no Render; necessário ao usar domínio próprio |

O projeto também fixa a versão em `.node-version` e `package.json`. [Configurar Node no Render](https://render.com/docs/node-version). Não use variáveis com prefixo `VITE_` para a chave: elas são destinadas ao código do navegador.

Para um ensaio gratuito, você pode criar manualmente um serviço **Free**, sem disco, e usar `.runtime` em `SYNAPSE_DATA_DIR`. Isso altera a garantia de persistência: sessões podem desaparecer quando a instância reiniciar. O plano gratuito também pode suspender por inatividade e levar tempo para voltar. Use a configuração com disco para uma apresentação em que a continuidade importa. [Limites do plano gratuito](https://render.com/docs/free).

## Quando o QR não funciona

| Sintoma | O que fazer |
| --- | --- |
| O endereço não abre no celular | Primeiro abra o endereço `/control` mostrado na preparação. No modo local, use o Wi-Fi do mesmo roteador do computador; em hospedagem, use o domínio HTTPS. |
| QR não é reconhecido pela câmera | Aumente o brilho, deixe o QR inteiro visível ou digite o código no endereço `/control`. |
| Pareamento expirado ou já utilizado | Gere um novo QR/código. A validade é de 120 segundos e o uso é único; usar um deles invalida o outro. |
| Abriu dentro de WhatsApp/Instagram | Abra o endereço no Safari ou Chrome e use um código novo. |
| Preparação pede a janela criadora | Abra a preparação pela apresentação original. Se perdeu essa janela, crie uma sessão nova em `/setup`. |
| Site mostra só a apresentação e não conecta | Confirme que publicou o servidor Node e que `/api/health` responde com `{"ok":true}`. |
| Servidor exige a chave administrativa | Configure `SYNAPSE_ADMIN_KEY` no painel e use-a somente em `/setup`. |

Um QR com `192.168.x.x` aponta para uma rede local. Ele não torna o computador acessível pela internet. Também não use o endereço do adaptador VPN quando o telefone estiver no Wi-Fi doméstico. A verificação no próprio computador não comprova acesso a partir do telefone.

## Atualizar depois

Envie seus commits para `main`. Como o arquivo preparado desativa o deploy automático, entre no serviço do Render e use **Manual Deploy → Deploy latest commit** fora do horário da apresentação. Depois confira `/api/health`, crie uma sessão e teste o pareamento.

As sessões são salvas no disco, mas QR/códigos ainda não utilizados expiram no reinício. Gere outro depois de um deploy. Mantenha uma única instância: o pareamento e a comunicação ao vivo usam memória do processo. Não escale horizontalmente sem adaptar esse armazenamento.

## Outro provedor

Use Node 24, `npm ci --include=dev && npm run build` no build e `npm start` para iniciar. Configure uma origem HTTPS em `PUBLIC_BASE_URL`, a chave administrativa e um diretório persistente em `SYNAPSE_DATA_DIR`. O processo usa `PORT` e escuta em `0.0.0.0`.

Se houver proxy reverso, mantenha conexões SSE e desative buffering na rota `/api/sessions/*/events`. Publique apenas o que o servidor serve em `dist/`; `.runtime/`, backups, arquivos `.env` e notas exportadas não devem ser servidos como arquivos estáticos.

GitHub armazena o código. GitHub Pages não executa o servidor Node necessário a esta versão. A publicação no repositório e o deploy no provedor são passos separados.
