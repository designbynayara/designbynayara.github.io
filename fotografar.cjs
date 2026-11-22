// Fotografa as opções da página sem abrir janela.
// Uso: node fotografar.cjs [pasta-de-saida]
const pup = require('C:/Users/User/AppData/Roaming/npm/node_modules/puppeteer-core');
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

const DIR = __dirname;
const OUT = process.argv[2] || path.join(DIR, '_fotos');
fs.mkdirSync(OUT, { recursive: true });
const espera = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const b = await pup.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--hide-scrollbars', '--no-first-run'] });
  const relatorio = [];
  for (const op of ['A', 'B']) {
    const arq = path.join(DIR, `opcao-${op}.html`);
    if (!fs.existsSync(arq)) continue;
    for (const [nome, w, h] of [['computador', 1280, 900], ['celular', 390, 844]]) {
      const p = await b.newPage();
      const erros = [];
      p.on('pageerror', e => erros.push(e.message));
      await p.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
      await p.goto(pathToFileURL(arq).href, { waitUntil: 'networkidle0' });
      await espera(600);
      await p.screenshot({ path: path.join(OUT, `${op}-${nome}-pagina.png`), fullPage: true });
      // Recorte do formulário
      const form = await p.$('#contato');
      await form.screenshot({ path: path.join(OUT, `${op}-${nome}-form.png`) });
      // Estouro horizontal
      const largura = await p.evaluate(() => document.documentElement.scrollWidth);
      // Interação: tenta avançar sem responder (deve mostrar erro), responde e avança
      let interacao = '';
      if (op === 'A') {
        await p.click('[data-etapa="0"] [data-avancar]');
        const erro = await p.$eval('[data-etapa="0"] .q', q => q.classList.contains('invalida'));
        await p.type('[data-etapa="0"] .campo', 'Ana');
        await p.click('[data-etapa="0"] [data-avancar]');
        await espera(400);
        await p.type('[data-etapa="1"] .campo', 'Empresa X');
        await p.keyboard.press('Enter');
        await espera(400);
        await form.screenshot({ path: path.join(OUT, `${op}-${nome}-etapa3.png`) });
        const etapa = await p.$eval('[data-atual]', e => e.textContent);
        interacao = `erro sem resposta: ${erro}; etapa depois de 2 respostas: ${etapa}`;
      } else {
        await p.click('#contato button[type=submit]');
        await espera(600);
        const n = await p.$$eval('.q.invalida', a => a.length);
        interacao = `perguntas marcadas sem resposta ao enviar vazio: ${n}`;
      }
      relatorio.push({ op, nome, largura, erros, interacao });
      await p.close();
    }
  }
  await b.close();
  console.log(JSON.stringify(relatorio, null, 1));
})();
