// Exporta a apresentação para PDF (uma página por slide, 1920 × 1080).
// Requer o Playwright:  npm i -D playwright && npx playwright install chromium
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { mkdirSync } from 'node:fs';

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  console.error('Playwright não encontrado. Rode: npm i -D playwright && npx playwright install chromium');
  process.exit(1);
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'export', 'Palestra_CIPATR_Produzir_e_Voltar_para_Casa.pdf');
mkdirSync(dirname(out), { recursive: true });

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto(pathToFileURL(join(root, 'index.html')).href + '?print-pdf');
await page.waitForFunction(() => window.Reveal && Reveal.isReady());
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(1500);
await page.pdf({ path: out, width: '1920px', height: '1080px', printBackground: true, preferCSSPageSize: true });
await browser.close();
console.log('PDF gerado em', out);
