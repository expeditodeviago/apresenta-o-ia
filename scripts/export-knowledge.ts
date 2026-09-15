import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { deflateRawSync } from 'node:zlib';
import { KNOWLEDGE_NODES, KNOWLEDGE_EDGES, NETWORK_GROUPS, BRIDGES } from '../shared/knowledge.ts';

const vault = path.resolve('artifacts/SYNAPSE-Obsidian');
const entries: { name: string; content: Buffer }[] = [];
const filenames = new Map(KNOWLEDGE_NODES.map(node => [node.id, node.group ? String(node.group).padStart(2, '0') + '-' + NETWORK_GROUPS[node.group - 1] + '/' + node.id : 'COMECE-AQUI']));
const nodes = new Map(KNOWLEDGE_NODES.map(node => [node.id, node]));
const neighbours = new Map(KNOWLEDGE_NODES.map(node => [node.id, new Set<string>()]));
for (const [a, b] of KNOWLEDGE_EDGES) {
  if (!nodes.has(a) || !nodes.has(b)) throw Error('Link sem nota de destino.');
  neighbours.get(a)!.add(b); neighbours.get(b)!.add(a);
}
for (const node of KNOWLEDGE_NODES) {
  const introduction = node.kind === 'root' ? [
    `Este cofre contém **${KNOWLEDGE_NODES.length} notas** e **${KNOWLEDGE_EDGES.length} ligações distintas**, organizadas em 12 temas.`,
    '', '## Abra a rede', '',
    'Abra esta pasta como cofre no Obsidian e clique em **Abrir visão de grafo** na barra lateral. Use a roda do mouse para aproximar e arraste para explorar. Clique em um ponto para abrir a nota.',
    '', 'Nas configurações do grafo, use **Animar** para revelar as notas ao longo do tempo. Desative a exibição de tags e anexos se quiser mostrar apenas as notas. Para colorir temas, crie grupos usando a busca `path:01-Tokens`, por exemplo.',
    '', '## Uma distinção que ajuda', '',
    'Este é um grafo de conhecimento: notas e links escolhidos para estudar. Uma rede neural real faz cálculos com unidades, camadas e pesos ajustados no treinamento. O formato visual deste cofre é uma metáfora, e não uma reprodução dos parâmetros ou dos pensamentos de um modelo.',
    '', 'As perguntas que aparecem na apresentação iluminam percursos previamente preparados. Você pode acrescentar outras notas e links para construir seus próprios percursos.',
    '', '## Para continuar aprendendo', '',
    '- [Grafo do Obsidian](https://help.obsidian.md/Plugins/Graph+view)',
    '- [Links entre notas](https://help.obsidian.md/Linking+notes+and+files/Internal+links)',
    '- [Redes neurais — Google Machine Learning Crash Course](https://developers.google.com/machine-learning/crash-course/neural-networks)',
  ].join('\n') : '';
  const bridges = node.kind === 'hub' ? BRIDGES.filter(([a, b]) => a === node.group || b === node.group).map(([a, b, why]) => '- ' + why + ' [[' + filenames.get('grupo-' + (a === node.group ? b : a)) + '|' + NETWORK_GROUPS[(a === node.group ? b : a) - 1] + ']]').join('\n') : '';
  const text = [
    '---', 'title: ' + JSON.stringify(node.title), 'tags:', '  - synapse', '  - tema-' + node.group, '---', '', '# ' + node.title, '', node.text, '',
    '## Para visualizar', '', node.example, '', introduction,
    ...(bridges ? ['', '## Pontes para outros temas', '', bridges] : []),
    '', '## Ideias conectadas', '',
    ...[...neighbours.get(node.id)!].map(id => '- [[' + filenames.get(id) + '|' + nodes.get(id)!.title + ']]'), '',
  ].join('\n');
  const name = filenames.get(node.id)! + '.md', content = Buffer.from(text, 'utf8');
  await mkdir(path.dirname(path.join(vault, name)), { recursive: true });
  await writeFile(path.join(vault, name), content);
  entries.push({ name: 'SYNAPSE-Obsidian/' + name, content });
}

// A portable ZIP with UTF-8 names, using only Node's built-in compression.
const crcTable = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ c >>> 1 : c >>> 1; return c >>> 0; });
const crc32 = (data: Buffer) => { let c = 0xffffffff; for (const b of data) c = crcTable[(c ^ b) & 255] ^ c >>> 8; return (c ^ 0xffffffff) >>> 0; };
const local: Buffer[] = [], directory: Buffer[] = []; let offset = 0;
for (const entry of entries) {
  const name = Buffer.from(entry.name), compressed = deflateRawSync(entry.content), crc = crc32(entry.content);
  const header = Buffer.alloc(30); header.writeUInt32LE(0x04034b50); header.writeUInt16LE(20, 4); header.writeUInt16LE(0x800, 6); header.writeUInt16LE(8, 8); header.writeUInt16LE(0x21, 12); header.writeUInt32LE(crc, 14); header.writeUInt32LE(compressed.length, 18); header.writeUInt32LE(entry.content.length, 22); header.writeUInt16LE(name.length, 26);
  const central = Buffer.alloc(46); central.writeUInt32LE(0x02014b50); central.writeUInt16LE(20, 4); central.writeUInt16LE(20, 6); central.writeUInt16LE(0x800, 8); central.writeUInt16LE(8, 10); central.writeUInt16LE(0x21, 14); central.writeUInt32LE(crc, 16); central.writeUInt32LE(compressed.length, 20); central.writeUInt32LE(entry.content.length, 24); central.writeUInt16LE(name.length, 28); central.writeUInt32LE(offset, 42);
  local.push(header, name, compressed); directory.push(central, name); offset += header.length + name.length + compressed.length;
}
const central = Buffer.concat(directory), end = Buffer.alloc(22); end.writeUInt32LE(0x06054b50); end.writeUInt16LE(entries.length, 8); end.writeUInt16LE(entries.length, 10); end.writeUInt32LE(central.length, 12); end.writeUInt32LE(offset, 16);
await mkdir('public/downloads', { recursive: true });
await writeFile('public/downloads/SYNAPSE-Obsidian.zip', Buffer.concat([...local, central, end]));
console.log(`Obsidian: ${entries.length} notas, ${KNOWLEDGE_EDGES.length} ligações. Cofre e ZIP gerados.`);
