// Exporta PNGs (2x), painel geral e a página de apresentação.
// Uso: node exportar.js <dir-fontes-fontsource> <dir-saida> <arquivo-html-da-pagina>
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { pecas, fontes } = require('./build.js');

const [, , dirFontes, dirSaida, paginaHtml] = process.argv;
const css = fontes(dirFontes);
const lista = pecas();

const NOTAS = {
  'trofeu-1': ['Taça Asas de Águia', 'Taça clássica com alças em forma de asas e medalhão esmaltado azul.'],
  'trofeu-2': ['Escudo do Guerreiro', 'Escudo com espadas cruzadas e campo esmaltado verde.'],
  'trofeu-3': ['Ferradura do Campeão', 'Ferradura com cravos e medalhão esmaltado vinho.'],
};

function pagina() {
  const card = pc => {
    const t = pc.t;
    const chave = `${pc.tipo}-${t.pos}`;
    const nota = NOTAS[chave];
    return `<figure class="peca ${pc.tipo} pos${t.pos}">
      ${pc.svg}
      <figcaption>
        <span class="lugar">${t.pos}º lugar · ${t.metal}</span>
        <strong>Equipe ${t.nome.split(' ').map(w => w.length > 2 ? w[0] + w.slice(1).toLowerCase() : w.toLowerCase()).join(' ')}</strong>
        ${nota ? `<span class="nota"><b>${nota[0]}.</b> ${nota[1]}</span>` : ''}
      </figcaption>
    </figure>`;
  };
  const tro = lista.filter(p => p.tipo === 'trofeu').map(card).join('\n');
  const med = lista.filter(p => p.tipo === 'medalha').map(card).join('\n');
  return fs.readFileSync(path.join(__dirname, 'pagina.tpl.html'), 'utf8').replace('{{TROFEUS}}', tro).replace('{{MEDALHAS}}', med);
}

(async () => {
  fs.mkdirSync(path.join(dirSaida, 'png'), { recursive: true });
  const b = await chromium.launch();
  for (const pc of lista) {
    const [w, h] = pc.tipo === 'medalha' ? [600, 800] : [640, 970];
    const pg = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 3 });
    await pg.setContent(`<style>${css}html,body{margin:0;background:transparent}svg{display:block;width:${w}px;height:${h}px}</style>${pc.svg}`);
    await pg.evaluate(() => document.fonts.ready);
    await pg.screenshot({ path: path.join(dirSaida, 'png', pc.arq + '.png'), omitBackground: true });
    await pg.close();
  }
  // painel geral
  const pg = await b.newPage({ viewport: { width: 1800, height: 1000 }, deviceScaleFactor: 2 });
  const linha = tipo => lista.filter(p => p.tipo === tipo).map(p => `<div>${p.svg}</div>`).join('');
  await pg.setContent(`<style>${css}
    html,body{margin:0}body{background:radial-gradient(ellipse at 50% 30%,#1a2a22,#08110d 70%);color:#f5f2e9;font-family:Oswald,sans-serif;padding:56px 70px 60px;width:1800px;box-sizing:border-box}
    h1{font-family:Cinzel,serif;font-weight:900;font-size:58px;margin:0;letter-spacing:4px;text-align:center;color:#f4b740}
    p{text-align:center;letter-spacing:8px;font-size:22px;margin:8px 0 34px;text-transform:uppercase;opacity:.8}
    .l{display:grid;grid-template-columns:repeat(3,1fr);gap:30px;align-items:end;justify-items:center}
    .l div{width:100%}.m div{width:72%}.m{margin-top:46px}svg{width:100%;height:auto;display:block}
  </style><h1>TROFÉUS E MEDALHAS</h1><p>Final de Safra 2026 • Usina CRV</p><div class="l">${linha('trofeu')}</div><div class="l m">${linha('medalha')}</div>`);
  await pg.evaluate(() => document.fonts.ready);
  await pg.screenshot({ path: path.join(dirSaida, 'painel-geral.png'), fullPage: true });
  await b.close();
  if (paginaHtml) fs.writeFileSync(paginaHtml, pagina());
  console.log('ok');
})();
