// Gera privacidade.html a partir de privacidade.json.
// Uso: node gerar-privacidade.cjs
const fs = require('fs');
const path = require('path');

const d = JSON.parse(fs.readFileSync(path.join(__dirname, 'privacidade.json'), 'utf8'));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const secoes = d.secoes.map(s => `
    <section>
      <h2>${esc(s.titulo)}</h2>
      <p>${esc(s.texto)}</p>
    </section>`).join('');

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(d.titulo)} · Design by Nayara</title>
<meta name="robots" content="noindex">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
<style>
:root{--ink-950:#04020F;--ink-700:#3F3D4A;--violet-700:#6B21B6;--cloud:#EFEFEF;--paper:#FFFFFF;--line:#D8D7DD}
*{box-sizing:border-box}
body{margin:0;background:var(--cloud);color:var(--ink-950);font-family:"Poppins","Montserrat",system-ui,sans-serif;font-size:16px;line-height:1.65;-webkit-font-smoothing:antialiased}
main{max-width:720px;margin:0 auto;padding:48px 16px 64px}
.cartao{background:var(--paper);border:1px solid var(--line);border-radius:8px;padding:clamp(24px,5vw,48px)}
h1{font-family:"Montserrat","Poppins",system-ui,sans-serif;font-weight:700;font-size:clamp(28px,4vw,38px);line-height:1.15;margin:0}
.data{margin:8px 0 0;color:var(--ink-700);font-size:14px}
.abertura{margin:24px 0 0;color:var(--ink-700)}
h2{font-family:"Montserrat","Poppins",system-ui,sans-serif;font-weight:600;font-size:19px;line-height:1.3;margin:32px 0 0}
section p{margin:8px 0 0;color:var(--ink-700)}
a{color:var(--violet-700);font-weight:600}
a:focus-visible{outline:3px solid rgba(133,45,217,.45);outline-offset:2px}
.voltar{display:inline-block;margin-top:32px}
</style>
</head>
<body>
<main>
  <div class="cartao">
    <h1>${esc(d.titulo)}</h1>
    <p class="data">Atualizada em ${esc(d.atualizada)}</p>
    <p class="abertura">${esc(d.abertura)}</p>${secoes}
    <a class="voltar" href="${esc(d.voltar.url)}">${esc(d.voltar.texto)}</a>
  </div>
</main>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'privacidade.html'), html, 'utf8');
console.log('Gerado: privacidade.html');
