// Gera troféus e medalhas (SVG) do Final de Safra — Usina CRV.
// Uso: node build.js <dir-fontes-fontsource> <dir-saida>
const fs = require('fs');
const path = require('path');
const E = require('./emblemas.js');

const EVENTO = 'FINAL DE SAFRA 2026';
const EMPRESA = 'USINA CRV';

const METAIS = {
  ouro:   { l: '#fff6c2', m: '#f0be2c', d: '#a8720a', x: '#5e3c04' },
  prata:  { l: '#ffffff', m: '#c6ced6', d: '#7b8591', x: '#3a424c' },
  bronze: { l: '#ffdcb8', m: '#cf8748', d: '#8a4a1e', x: '#4a260d' },
};

const EQUIPES = [
  { id: 'elite', nome: 'ELITE DA PRODUÇÃO', pos: 1, metal: 'ouro',   emb: E.aguia,  cor: '#1c56b0', fundo: '#0a2452', escuro: '#04122b' },
  { id: 'gato',  nome: 'GATO GUERREIRO',    pos: 2, metal: 'prata',  emb: E.gato,   olho: '#ffc93c', cor: '#1d8a56', fundo: '#0c4a30', escuro: '#04241a' },
  { id: 'puro',  nome: 'PURO SANGUE',       pos: 3, metal: 'bronze', emb: E.cavalo, cor: '#b02a3a', fundo: '#5c101e', escuro: '#2c060d' },
];

const r1 = n => Math.round(n * 10) / 10;

function defs(p, t) {
  const m = METAIS[t.metal];
  return `<defs>
    <linearGradient id="${p}v" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${m.l}"/><stop offset=".22" stop-color="${m.m}"/><stop offset=".5" stop-color="${m.d}"/>
      <stop offset=".56" stop-color="${m.l}"/><stop offset=".8" stop-color="${m.m}"/><stop offset="1" stop-color="${m.d}"/>
    </linearGradient>
    <linearGradient id="${p}h" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${m.d}"/><stop offset=".18" stop-color="${m.m}"/><stop offset=".36" stop-color="${m.l}"/>
      <stop offset=".6" stop-color="${m.m}"/><stop offset="1" stop-color="${m.d}"/>
    </linearGradient>
    <linearGradient id="${p}d" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${m.l}"/><stop offset=".35" stop-color="${m.m}"/><stop offset=".62" stop-color="${m.d}"/>
      <stop offset=".78" stop-color="${m.m}"/><stop offset="1" stop-color="${m.l}"/>
    </linearGradient>
    <linearGradient id="${p}e" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${m.l}"/><stop offset=".5" stop-color="${m.m}"/><stop offset="1" stop-color="${m.d}"/>
    </linearGradient>
    <radialGradient id="${p}n" cx=".38" cy=".3" r=".85">
      <stop offset="0" stop-color="${t.cor}"/><stop offset=".6" stop-color="${t.fundo}"/><stop offset="1" stop-color="${t.escuro}"/>
    </radialGradient>
    <linearGradient id="${p}r" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${t.fundo}"/><stop offset=".6" stop-color="${t.cor}"/><stop offset="1" stop-color="${t.fundo}"/>
    </linearGradient>
    <linearGradient id="${p}b" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#0b0f0d"/><stop offset=".3" stop-color="#27302b"/><stop offset=".55" stop-color="#141a17"/><stop offset="1" stop-color="#050706"/>
    </linearGradient>
    <filter id="${p}s" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="6" stdDeviation="7" flood-color="#000" flood-opacity=".45"/>
    </filter>
    <filter id="${p}s2" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity=".5"/>
    </filter>
  </defs>`;
}

function emblema(p, t, cx, cy, tam) {
  const m = METAIS[t.metal];
  const c = { main: `url(#${p}e)`, shade: m.d, line: t.escuro, accent: m.l, eye: t.olho || '#ffffff' };
  const k = tam / 200;
  return `<g transform="translate(${r1(cx - tam / 2)} ${r1(cy - tam / 2)}) scale(${r1(k * 1000) / 1000})" filter="url(#${p}s2)">${t.emb(c)}</g>`;
}

const F_TIT = `font-family="Cinzel, 'Times New Roman', serif"`;
const F_TXT = `font-family="Oswald, 'Arial Narrow', Arial, sans-serif"`;

/* ---------------- MEDALHA ---------------- */
function medalha(t) {
  const p = `m${t.pos}`;
  const m = METAIS[t.metal];
  const cx = 300, cy = 540;
  // fita: duas faixas em V
  const faixa = (s) => {
    const X = x => (s > 0 ? x : 600 - x);
    const pts = (a, b) => `${X(118 + 132 * a)},-4 ${X(118 + 132 * b)},-4 ${X(262 + 92 * b)},${300 - 34 * b} ${X(262 + 92 * a)},${300 - 34 * a}`;
    return `<polygon points="${pts(0, 1)}" fill="url(#${p}r)"/>
      <polygon points="${pts(.1, .2)}" fill="${m.m}" opacity=".9"/>
      <polygon points="${pts(.42, .58)}" fill="#f5f2e9" opacity=".92"/>
      <polygon points="${pts(.8, .9)}" fill="${m.m}" opacity=".9"/>
      <polygon points="${pts(0, 1)}" fill="none" stroke="${t.escuro}" stroke-width="2"/>`;
  };
  const contas = [];
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2;
    contas.push(`<circle cx="${r1(cx + 153 * Math.cos(a))}" cy="${r1(cy + 153 * Math.sin(a))}" r="3.6"/>`);
  }
  const dentes = [];
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * 360;
    dentes.push(`<rect x="${cx - 9}" y="${cy - 246}" width="18" height="20" rx="5" transform="rotate(${a} ${cx} ${cy})"/>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" role="img" aria-label="Medalha de ${t.pos}º lugar — Equipe ${t.nome}">
  ${defs(p, t)}
  <g filter="url(#${p}s)">
    <g opacity=".85">${faixa(-1)}</g>
    ${faixa(1)}
    <rect x="262" y="262" width="76" height="34" rx="8" fill="url(#${p}h)" stroke="${m.x}" stroke-width="2"/>
    <rect x="276" y="272" width="48" height="14" rx="5" fill="${t.escuro}" opacity=".75"/>
  </g>
  <g filter="url(#${p}s)">
    <g fill="url(#${p}d)" stroke="${m.x}" stroke-width="1">${dentes.join('')}</g>
    <circle cx="${cx}" cy="${cy}" r="236" fill="url(#${p}d)" stroke="${m.x}" stroke-width="2"/>
    <circle cx="${cx}" cy="${cy}" r="222" fill="none" stroke="${m.x}" stroke-width="2" opacity=".55"/>
    <circle cx="${cx}" cy="${cy}" r="218" fill="url(#${p}e)"/>
    <circle cx="${cx}" cy="${cy}" r="160" fill="${m.x}"/>
    <g fill="${m.l}" stroke="${m.d}" stroke-width=".8">${contas.join('')}</g>
    <circle cx="${cx}" cy="${cy}" r="145" fill="url(#${p}n)" stroke="${m.x}" stroke-width="2"/>
    <path d="M${cx - 120} ${cy - 62} A 135 135 0 0 1 ${cx + 60} ${cy - 122} A 190 190 0 0 0 ${cx - 120} ${cy - 62} Z" fill="#fff" opacity=".12"/>
  </g>
  <path id="${p}a" d="M${cx - 177} ${cy} A 177 177 0 0 1 ${cx + 177} ${cy}" fill="none"/>
  <path id="${p}c" d="M${cx - 202} ${cy} A 202 202 0 0 0 ${cx + 202} ${cy}" fill="none"/>
  <text ${F_TIT} font-weight="900" font-size="${t.nome.length > 15 ? 30 : 34}" letter-spacing="2" fill="${t.escuro}" text-anchor="middle">
    <textPath href="#${p}a" startOffset="50%">${t.nome}</textPath></text>
  <text ${F_TXT} font-weight="600" font-size="23" letter-spacing="3.5" fill="${t.escuro}" text-anchor="middle">
    <textPath href="#${p}c" startOffset="50%">${EVENTO} • ${EMPRESA}</textPath></text>
  <g fill="${t.escuro}">
    <path transform="translate(${cx - 189} ${cy + 4})" d="M0-11 3 -4 11-4 5 2 7 10 0 5-7 10-5 2-11-4-3-4Z"/>
    <path transform="translate(${cx + 189} ${cy + 4})" d="M0-11 3 -4 11-4 5 2 7 10 0 5-7 10-5 2-11-4-3-4Z"/>
  </g>
  ${emblema(p, t, cx, cy - 22, 196)}
  <g filter="url(#${p}s2)">
    <path d="M${cx - 92} ${cy + 84} L${cx + 92} ${cy + 84} L${cx + 78} ${cy + 104} L${cx + 92} ${cy + 124} L${cx - 92} ${cy + 124} L${cx - 78} ${cy + 104} Z" fill="url(#${p}h)" stroke="${m.x}" stroke-width="2"/>
    <text x="${cx}" y="${cy + 114}" ${F_TIT} font-weight="900" font-size="27" letter-spacing="2" fill="${t.escuro}" text-anchor="middle">${t.pos}º LUGAR</text>
  </g>
</svg>`;
}

/* ---------------- TROFÉUS ---------------- */
function base(p, t) {
  const m = METAIS[t.metal];
  return `<g filter="url(#${p}s)">
    <rect x="96" y="930" width="448" height="26" rx="5" fill="url(#${p}h)" stroke="${m.x}" stroke-width="2"/>
    <rect x="116" y="806" width="408" height="126" fill="url(#${p}b)" stroke="#000" stroke-width="2"/>
    <rect x="102" y="782" width="436" height="26" rx="5" fill="url(#${p}h)" stroke="${m.x}" stroke-width="2"/>
    <rect x="142" y="822" width="356" height="96" rx="6" fill="url(#${p}d)" stroke="${m.x}" stroke-width="2"/>
    <rect x="149" y="829" width="342" height="82" rx="3" fill="none" stroke="${m.x}" stroke-width="1" opacity=".6"/>
    <g fill="${m.x}"><circle cx="156" cy="836" r="2.4"/><circle cx="484" cy="836" r="2.4"/><circle cx="156" cy="904" r="2.4"/><circle cx="484" cy="904" r="2.4"/></g>
  </g>
  <text x="320" y="858" ${F_TIT} font-weight="900" font-size="28" letter-spacing="3" fill="${t.escuro}" text-anchor="middle">${t.pos}º LUGAR</text>
  <text x="320" y="882" ${F_TIT} font-weight="700" font-size="17.5" letter-spacing="1.2" fill="${t.escuro}" text-anchor="middle">EQUIPE ${t.nome}</text>
  <text x="320" y="902" ${F_TXT} font-weight="500" font-size="12.5" letter-spacing="3" fill="${t.escuro}" text-anchor="middle">${EVENTO} • ${EMPRESA}</text>`;
}

function haste(p, t, yTopo, larg) {
  const m = METAIS[t.metal];
  const w = larg || 22;
  return `<g stroke="${m.x}" stroke-width="2">
    <path d="M${320 - w} ${yTopo} C${320 - w + 6} ${yTopo + 50} ${320 - w - 2} ${yTopo + 90} ${320 - 58} 742 L${320 + 58} 742 C${320 + w + 2} ${yTopo + 90} ${320 + w - 6} ${yTopo + 50} ${320 + w} ${yTopo} Z" fill="url(#${p}h)"/>
    <ellipse cx="320" cy="${yTopo + 26}" rx="${w + 22}" ry="13" fill="url(#${p}h)"/>
    <rect x="240" y="740" width="160" height="20" rx="6" fill="url(#${p}h)"/>
    <rect x="212" y="758" width="216" height="26" rx="6" fill="url(#${p}h)"/>
  </g>`;
}

function coroa(p, t, cx, cy, r) {
  // coroa de folhas de cana ao redor do medalhão
  const m = METAIS[t.metal];
  let s = '';
  for (const lado of [1, -1]) {
    for (let i = 0; i < 9; i++) {
      const a = (100 + i * 17) * Math.PI / 180; // a partir de baixo, subindo
      const x = cx + lado * r * Math.sin(a) * -1 * -1, y = cy - r * Math.cos(a) * -1 * -1;
      const px = cx + lado * r * Math.sin(Math.PI - a + Math.PI), py = cy + r * Math.cos(a);
      const rot = lado > 0 ? (-(i * 17) - 55) : (180 + (i * 17) + 55);
      const X = cx + lado * r * Math.sin((20 + i * 17) * Math.PI / 180);
      const Y = cy + r * Math.cos((20 + i * 17) * Math.PI / 180);
      s += `<path transform="translate(${r1(X)} ${r1(Y)}) rotate(${rot})" d="M0 0 Q16 -11 40 0 Q16 9 0 0Z"/>`;
    }
  }
  return `<g fill="url(#${p}e)" stroke="${m.x}" stroke-width="1.4">${s}</g>`;
}

function asa(p, t) {
  const m = METAIS[t.metal];
  let s = '';
  for (let i = 7; i >= 0; i--) {
    const rx = 214 + i * 2.5, ry = 300 + i * 24;
    const tx = 34 + i * 15 + i * i * 1.2, ty = 96 + i * 52;
    const mx = (rx + tx) / 2, my = (ry + ty) / 2;
    const dx = tx - rx, dy = ty - ry, L = Math.hypot(dx, dy);
    const nx = -dy / L, ny = dx / L;
    const w = 50 - i * 2.5;
    s += `<path d="M${r1(rx)} ${r1(ry)} Q${r1(mx - nx * w - dx * .1)} ${r1(my - ny * w)} ${r1(tx)} ${r1(ty)} Q${r1(mx + nx * w * .5)} ${r1(my + ny * w * .5)} ${r1(rx + 6)} ${r1(ry + 26)} Z"/>`;
  }
  return `<g fill="url(#${p}d)" stroke="${m.x}" stroke-width="2" stroke-linejoin="round">${s}
    <path d="M224 276 C196 262 168 262 150 276 C176 290 196 330 214 470 L236 470 Z" fill="url(#${p}h)"/></g>`;
}

function trofeu1(t) {
  const p = `t${t.pos}`, m = METAIS[t.metal];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 970" role="img" aria-label="Troféu de ${t.pos}º lugar — Equipe ${t.nome}">
  ${defs(p, t)}
  <g filter="url(#${p}s)">
    ${asa(p, t)}
    <g transform="translate(640 0) scale(-1 1)">${asa(p, t)}</g>
    ${haste(p, t, 610)}
    <path d="M196 262 L444 262 C444 430 400 566 320 618 C240 566 196 430 196 262 Z" fill="url(#${p}h)" stroke="${m.x}" stroke-width="2.5"/>
    <path d="M222 280 C224 400 250 510 300 572 C262 500 246 400 246 280 Z" fill="#fff" opacity=".35"/>
    <rect x="180" y="238" width="280" height="30" rx="12" fill="url(#${p}v)" stroke="${m.x}" stroke-width="2.5"/>
    <g fill="${m.x}" opacity=".8">
      ${[-2, -1, 0, 1, 2].map(i => `<path transform="translate(${320 + i * 44} 253) scale(.8)" d="M0-11 3 -4 11-4 5 2 7 10 0 5-7 10-5 2-11-4-3-4Z"/>`).join('')}
    </g>
  </g>
  ${coroa(p, t, 320, 408, 104)}
  <g filter="url(#${p}s2)">
    <circle cx="320" cy="408" r="94" fill="url(#${p}d)" stroke="${m.x}" stroke-width="2"/>
    <circle cx="320" cy="408" r="82" fill="url(#${p}n)" stroke="${m.x}" stroke-width="2"/>
  </g>
  ${emblema(p, t, 322, 408, 132)}
  ${base(p, t)}
</svg>`;
}

function espada(p, t, ang) {
  const m = METAIS[t.metal];
  return `<g transform="rotate(${ang} 320 400) translate(320 400)" stroke="${m.x}" stroke-width="2" stroke-linejoin="round">
    <path d="M-11 -290 L0 -338 L11 -290 L11 186 L-11 186 Z" fill="url(#${p}h)"/>
    <path d="M0 -330 L0 186" stroke="${m.x}" stroke-width="1.5" opacity=".6"/>
    <path d="M-52 184 Q0 172 52 184 L52 200 Q0 190 -52 200 Z" fill="url(#${p}v)"/>
    <rect x="-8" y="196" width="16" height="54" fill="${t.fundo}"/>
    <circle cx="0" cy="262" r="14" fill="url(#${p}d)"/>
  </g>`;
}

function trofeu2(t) {
  const p = `t${t.pos}`, m = METAIS[t.metal];
  const esc = 'M164 196 Q320 150 476 196 L476 400 C476 520 404 592 320 646 C236 592 164 520 164 400 Z';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 970" role="img" aria-label="Troféu de ${t.pos}º lugar — Equipe ${t.nome}">
  ${defs(p, t)}
  <g filter="url(#${p}s)">
    ${haste(p, t, 630, 26)}
    ${espada(p, t, 36)}${espada(p, t, -36)}
    <path d="${esc}" fill="url(#${p}d)" stroke="${m.x}" stroke-width="2.5"/>
    <path d="${esc}" transform="translate(320 400) scale(.86) translate(-320 -396)" fill="url(#${p}n)" stroke="${m.x}" stroke-width="2.5"/>
    <path d="M196 226 Q320 190 444 226 L444 300 Q320 230 196 330 Z" fill="#fff" opacity=".1"/>
    <g fill="${m.l}" stroke="${m.x}" stroke-width="1.2">
      <circle cx="177" cy="206" r="5"/><circle cx="463" cy="206" r="5"/><circle cx="174" cy="400" r="5"/><circle cx="466" cy="400" r="5"/>
      <circle cx="320" cy="172" r="5"/><circle cx="320" cy="633" r="5"/><circle cx="222" cy="545" r="5"/><circle cx="418" cy="545" r="5"/>
    </g>
  </g>
  ${emblema(p, t, 320, 392, 236)}
  ${base(p, t)}
</svg>`;
}

function trofeu3(t) {
  const p = `t${t.pos}`, m = METAIS[t.metal];
  const cravos = [];
  for (const a of [-70, -46, -22, 22, 46, 70]) {
    cravos.push(`<rect x="313" y="${372 - 172}" width="14" height="24" rx="3" transform="rotate(${a} 320 372)"/>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 970" role="img" aria-label="Troféu de ${t.pos}º lugar — Equipe ${t.nome}">
  ${defs(p, t)}
  <g filter="url(#${p}s)">
    ${haste(p, t, 640, 26)}
    <rect x="130" y="618" width="380" height="30" rx="8" fill="url(#${p}v)" stroke="${m.x}" stroke-width="2.5"/>
    <path d="M124 372 A196 196 0 0 1 516 372 C516 470 506 550 492 620 L420 620 C436 550 446 470 446 372 A126 126 0 0 0 194 372 C194 470 204 550 220 620 L148 620 C134 550 124 470 124 372 Z"
      fill="url(#${p}d)" stroke="${m.x}" stroke-width="2.5"/>
    <path d="M142 372 A178 178 0 0 1 498 372" fill="none" stroke="#fff" stroke-width="5" opacity=".35"/>
    <g fill="${m.x}">${cravos.join('')}
      <rect x="150" y="470" width="24" height="13" rx="3" transform="rotate(8 162 476)"/><rect x="466" y="470" width="24" height="13" rx="3" transform="rotate(-8 478 476)"/>
      <rect x="162" y="548" width="24" height="13" rx="3" transform="rotate(10 174 554)"/><rect x="454" y="548" width="24" height="13" rx="3" transform="rotate(-10 466 554)"/>
    </g>
  </g>
  <g filter="url(#${p}s2)">
    <circle cx="320" cy="388" r="130" fill="url(#${p}v)" stroke="${m.x}" stroke-width="2.5"/>
    <circle cx="320" cy="388" r="114" fill="url(#${p}n)" stroke="${m.x}" stroke-width="2"/>
    <path d="M222 340 A108 108 0 0 1 370 292 A150 150 0 0 0 222 340 Z" fill="#fff" opacity=".12"/>
  </g>
  ${emblema(p, t, 318, 390, 178)}
  ${base(p, t)}
</svg>`;
}

const TROFEUS = { 1: trofeu1, 2: trofeu2, 3: trofeu3 };

/* ---------------- SAÍDA ---------------- */
function fontes(dir) {
  const f = (pkg, file, fam, w) => {
    const b = fs.readFileSync(path.join(dir, pkg, 'files', file)).toString('base64');
    return `@font-face{font-family:'${fam}';font-weight:${w};src:url(data:font/woff2;base64,${b}) format('woff2')}`;
  };
  return [
    f('cinzel', 'cinzel-latin-700-normal.woff2', 'Cinzel', 700),
    f('cinzel', 'cinzel-latin-900-normal.woff2', 'Cinzel', 900),
    f('oswald', 'oswald-latin-500-normal.woff2', 'Oswald', 500),
    f('oswald', 'oswald-latin-600-normal.woff2', 'Oswald', 600),
  ].join('');
}

function pecas() {
  const out = [];
  for (const t of EQUIPES) {
    out.push({ arq: `trofeu-${t.pos}-${t.id}`, tipo: 'trofeu', t, svg: TROFEUS[t.pos](t) });
    out.push({ arq: `medalha-${t.pos}-${t.id}`, tipo: 'medalha', t, svg: medalha(t) });
  }
  return out;
}

if (require.main === module) {
  const [, , dirFontes, dirSaida] = process.argv;
  const css = fontes(dirFontes);
  fs.mkdirSync(path.join(dirSaida, 'svg'), { recursive: true });
  for (const pc of pecas()) {
    const svg = pc.svg.replace(/(<svg[^>]*>)/, `$1<style>${css}</style>`);
    fs.writeFileSync(path.join(dirSaida, 'svg', pc.arq + '.svg'), svg);
  }
  console.log('ok');
}

module.exports = { pecas, EQUIPES, METAIS, fontes };
