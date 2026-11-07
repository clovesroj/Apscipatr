// Copia as dependências (reveal.js, fontes e ícones) de node_modules para vendor/,
// para que a apresentação funcione 100% offline — inclusive abrindo o index.html direto.
import { cpSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const nm = (p) => join(root, 'node_modules', p);
const out = (p) => join(root, 'vendor', p);

rmSync(out(''), { recursive: true, force: true });
mkdirSync(out('reveal/plugin'), { recursive: true });
mkdirSync(out('fonts'), { recursive: true });

// reveal.js (build UMD: funciona via file:// sem servidor)
for (const f of ['reveal.js', 'reveal.css', 'reset.css']) cpSync(nm(`reveal.js/dist/${f}`), out(`reveal/${f}`));
cpSync(nm('reveal.js/dist/plugin/notes.js'), out('reveal/plugin/notes.js'));
cpSync(nm('reveal.js/LICENSE'), out('reveal/LICENSE'));

// Fontes (apenas o subconjunto latino, que cobre todo o português)
const fonts = [
  ['@fontsource-variable/inter-tight/files/inter-tight-latin-wght-normal.woff2', 'inter-tight-latin-wght.woff2'],
  ['@fontsource-variable/inter/files/inter-latin-wght-normal.woff2', 'inter-latin-wght.woff2'],
  ['@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2', 'instrument-serif-latin-400.woff2'],
  ['@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2', 'instrument-serif-latin-400-italic.woff2'],
];
for (const [src, dst] of fonts) cpSync(nm(src), out(`fonts/${dst}`));
cpSync(nm('@fontsource-variable/inter-tight/LICENSE'), out('fonts/LICENSE-inter-tight-OFL.txt'));
cpSync(nm('@fontsource-variable/inter/LICENSE'), out('fonts/LICENSE-inter-OFL.txt'));
cpSync(nm('@fontsource/instrument-serif/LICENSE'), out('fonts/LICENSE-instrument-serif-OFL.txt'));

// Ícones Lucide usados no deck → vendor/icons.js (window.ICONS)
const icons = [
  'house', 'heart', 'users', 'hourglass', 'triangle-alert', 'octagon-x', 'octagon-pause', 'shield-check',
  'hard-hat', 'tractor', 'truck', 'wrench', 'cog', 'mountain', 'eye', 'ear', 'hand', 'megaphone',
  'message-circle', 'circle-check', 'route', 'calendar-check', 'gauge', 'lock', 'zap', 'sprout',
  'battery-low', 'wheat', 'repeat', 'footprints', 'handshake', 'target', 'timer', 'user-check', 'siren',
  'hand-heart', 'search', 'clipboard-check', 'lightbulb', 'building-2', 'users-round', 'sunset', 'brain',
  'flame', 'message-square-warning', 'ban', 'shield-alert', 'quote', 'arrow-right', 'circle-pause',
  'graduation-cap', 'refresh-ccw', 'cloud-rain', 'construction', 'factory', 'clock',
];
const map = {};
for (const name of icons) {
  const svg = readFileSync(nm(`lucide-static/icons/${name}.svg`), 'utf8')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s*\n\s*/g, ' ')
    .replace(/ width="24" height="24"/, '')
    .trim();
  map[name] = svg;
}
writeFileSync(
  out('icons.js'),
  `/* Ícones Lucide (ISC) — gerado por scripts/vendor.mjs */\nwindow.ICONS = ${JSON.stringify(map, null, 0)};\n`,
);
cpSync(nm('lucide-static/LICENSE'), out('LICENSE-lucide.txt'));

console.log('vendor/ atualizado.');
