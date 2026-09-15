# Preparação de palco

## Antes de a plateia entrar

1. Ligue o computador à energia e confirme a resolução do projetor, preferencialmente 1920×1080 ou 1280×720.
2. Use monitores estendidos. Deixe somente a janela pública no projetor; preparação, QR e notas ficam no monitor privado.
3. Inicie o servidor, abra a apresentação em localhost e pareie o celular usando o IP da rede Wi-Fi.
4. Pelo celular, avance, volte, altere um parâmetro e revele uma resposta. Confira o destaque na projeção.
5. Teste o modo palco, volume e movimento reduzido. Verifique a leitura do fundo da sala.
6. Passe pela abertura e pela missão. Volte à abertura, reinicie o experimento e inicie o cronômetro quando começar a falar.
7. Silencie notificações e desative suspensão automática durante a sessão.

## Ritmo e surpresa

Na abertura, recolha a votação antes dos números. Mostre 10.000, depois 160.000 e, só então, 100 milhões. Faça uma pausa curta. A conta mostra por que a intuição falha.

No labirinto, use a mesma estrutura para comparar BFS e DFS. Mostre a distância encontrada e a quantidade de vértices visitados. No jogo, convide alguém a escolher uma retirada e só depois revele o estado múltiplo de quatro. Nas gavetas, peça uma distribuição sem colisão: deixe a impossibilidade aparecer nas tentativas.

Na missão, corrija um bloqueio por vez. Deixe a turma prever qual será o próximo. A última execução reúne os conceitos anteriores e verifica cada condição em sequência.

A transição do Bit dura menos de um segundo. Ela não bloqueia comandos. O efeito de revelação também é curto, sem flashes ou som obrigatório.

## Se a rede falhar

Continue pela aba aberta no computador usando teclado, mouse e modo palco. Não recarregue enquanto o servidor estiver inacessível. Ao reconectar, o controle reenvia as ações pendentes, em ordem, usando os mesmos IDs para evitar repetição. Confira o módulo e os parâmetros antes de retomar o celular. A sessão não depende de internet nem de uma API de IA para executar os experimentos.

## Rede local

O servidor escuta em todas as interfaces na porta TCP 4173. O QR deve usar o IPv4 da conexão entre computador e celular. Redes de convidados podem isolar dispositivos. Se o telefone não abrir o endereço, confirme rede, IP, isolamento do Wi-Fi e a regra do Firewall do Windows para Node.js na rede privada. Nenhuma mudança de firewall é feita automaticamente.

Foi possível verificar controle em navegador com tela móvel; isso não substitui um teste com telefone físico e projetor no local.

## Hospedagem

O projeto não está publicado. Para hospedar, use um servidor Node 24 com volume persistente, HTTPS e suporte a SSE sem buffering. Hospedagem puramente estática não fornece pareamento, notas autenticadas ou sincronização. Configure:

- `PORT`: porta do processo.
- `PUBLIC_BASE_URL`: origem HTTPS pública, sem barra final.
- `SYNAPSE_DATA_DIR`: diretório persistente e privado.

Crie a sessão pela página `/setup` sem senha. No proxy, mantenha conexões SSE e desative o buffering em `/api/sessions/*/events`. Não exponha `.runtime/`, backups ou notas exportadas. Verifique autenticação, expiração, atualização e reconexão na infraestrutura real antes de anunciar uma URL pública.
