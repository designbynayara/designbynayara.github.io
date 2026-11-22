// Gera a página "Trabalhe comigo" a partir do pagina.json.
// Uso: node gerar-pagina.cjs            -> gera opcao-A.html (formulário em etapas) e opcao-B.html (formulário inteiro)
//      node gerar-pagina.cjs A          -> gera só a opção A
// O conteúdo mora no JSON; aqui fica só a estrutura, o estilo e o comportamento.
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const C = JSON.parse(fs.readFileSync(path.join(DIR, 'pagina.json'), 'utf8'));
const pedidas = process.argv.slice(2).map(s => s.toUpperCase());
const opcoes = pedidas.length ? pedidas : ['A', 'B'];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const LETRAS = 'ABCDEFGHIJ';

const CSS = `
:root{
  --violet-50:#F8F0FE;--violet-100:#EEDCFD;--violet-400:#AE50F2;--violet-600:#852DD9;--violet-700:#6B21B6;--violet-800:#52208A;
  --magenta-500:#FB1FAA;--magenta-700:#A00C69;
  --ink-950:#04020F;--ink-800:#211E2B;--ink-700:#3A3743;--ink-600:#5B5866;--ink-300:#C7C5CE;
  --cloud:#EFEFEF;--paper:#FFFFFF;--line:#D8D7DD;--line-strong:#BFBDC7;
  --danger-500:#C41D5B;
  --font-display:"Montserrat","Poppins",system-ui,sans-serif;
  --font-body:"Poppins","Montserrat",system-ui,sans-serif;
  --shadow-sm:0 2px 6px rgba(4,2,15,.08);--shadow-md:0 6px 18px rgba(4,2,15,.10);--shadow-lg:0 16px 38px rgba(4,2,15,.12);
  --focus:0 0 0 3px rgba(133,45,217,.45);
  --ease:cubic-bezier(.22,1,.36,1);
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--cloud);color:var(--ink-950);font-family:var(--font-body);font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased}
img{max-width:100%;display:block}
a{color:var(--violet-700)}
a:hover{color:var(--violet-800)}
:focus-visible{outline:none;box-shadow:var(--focus);border-radius:6px}
.wrap{max-width:1120px;margin:0 auto;padding:0 24px}
.eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--violet-700)}
.eyebrow::before{content:"";width:8px;height:8px;border-radius:999px;background:var(--magenta-500);flex:none}
h1,h2,h3,.q-titulo{font-family:var(--font-display);text-wrap:balance}
p{text-wrap:pretty}
.btn{display:inline-flex;align-items:center;gap:8px;border:0;cursor:pointer;font:600 16px/1 var(--font-body);padding:14px 22px;border-radius:6px;text-decoration:none;transition:transform .12s var(--ease),background .2s var(--ease)}
.btn-primario{background:var(--violet-700);color:#fff}
.btn-primario:hover{background:var(--violet-800);color:#fff}
.btn-primario:active{transform:translateY(1px)}
.btn-secundario{background:transparent;color:var(--ink-700);border:1px solid var(--line-strong)}
.btn-secundario:hover{background:var(--paper);color:var(--ink-950)}
.btn svg{width:18px;height:18px}

/* Topo */
.topo{padding:20px 0}
.topo .wrap{display:flex;align-items:center;justify-content:space-between;gap:16px}
.assinatura{display:flex;align-items:center;gap:12px;text-decoration:none;color:inherit}
.assinatura img.av{width:44px;height:44px;border-radius:999px;object-fit:cover}
.assinatura .nome{display:flex;align-items:center;gap:6px;font-weight:600;font-size:16px;line-height:1.2}
.assinatura .nome img{width:16px;height:16px}
.assinatura .arroba{font-size:14px;color:var(--ink-600);line-height:1.2}
.topo .btn{padding:11px 18px;font-size:15px}

/* Abertura */
.abertura{padding:48px 0 72px}
.abertura .wrap{display:grid;grid-template-columns:1.05fr 1fr;gap:56px;align-items:center}
.caixas{margin:20px 0 0;display:flex;flex-direction:column;align-items:flex-start;gap:8px;font-weight:700;font-size:clamp(27px,4vw,50px);line-height:1.04;letter-spacing:-.02em}
.caixas span{display:inline-block;padding:4px 14px;border-radius:4px;white-space:nowrap}
.caixas span:nth-child(1){background:var(--paper);color:var(--ink-950)}
.caixas span:nth-child(2){background:var(--violet-700);color:#fff;margin-left:clamp(16px,3vw,44px)}
.caixas span:nth-child(3){background:var(--ink-800);color:#fff;margin-left:clamp(8px,1.4vw,18px)}
.abertura p.lead{margin:28px 0 0;font-size:18px;line-height:1.65;color:var(--ink-700);max-width:540px}
.destaque{display:inline-flex;align-items:center;gap:8px;margin-top:20px;padding:8px 12px;border:1px solid var(--violet-100);background:var(--violet-50);border-radius:4px;color:var(--violet-700);font-size:15px;font-weight:500;line-height:1.4;text-decoration:none;max-width:540px}
.destaque:hover{border-color:var(--violet-200);color:var(--violet-700)}
.destaque:focus-visible{outline:none;box-shadow:var(--focus)}
.destaque svg{flex:none;width:20px;height:20px}
.destaque svg:last-child{width:14px;height:14px}
.acoes{display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-top:32px}
.acoes .nota{font-size:14px;color:var(--ink-600)}
.vitrine{position:relative}
.janela{background:var(--paper);border:1px solid var(--line);border-radius:8px;box-shadow:var(--shadow-lg);overflow:hidden}
.janela .barra{display:flex;gap:6px;padding:10px 12px;border-bottom:1px solid var(--line)}
.janela .barra i{width:9px;height:9px;border-radius:999px;background:var(--line)}
.janela img{width:100%;aspect-ratio:1280/900;object-fit:cover;object-position:top}
.vitrine .mini{position:absolute;width:46%;left:-28px;bottom:-32px}

/* Seções */
section{scroll-margin-top:24px}
.secao{padding:72px 0}
.secao h2{margin:14px 0 0;font-weight:700;font-size:clamp(28px,3.4vw,38px);line-height:1.12;letter-spacing:-.015em}
.secao .sub{margin:12px 0 0;color:var(--ink-700);font-size:17px;max-width:620px}
.trabalhos{background:var(--paper);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.grade-trabalhos{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:36px}
@media (max-width:980px){.grade-trabalhos{grid-template-columns:repeat(2,1fr)}}
.trabalho{display:block;text-decoration:none;color:inherit;border:1px solid var(--line);border-radius:8px;overflow:hidden;background:var(--paper);transition:transform .2s var(--ease),box-shadow .2s var(--ease)}
.trabalho:hover{transform:translateY(-3px);box-shadow:var(--shadow-md);color:inherit}
.trabalho img{width:100%;height:auto;aspect-ratio:1280/860;object-fit:cover;object-position:top;border-bottom:1px solid var(--line);background:var(--cloud)}
.trabalho .info{padding:16px 20px 20px}
.trabalho h3{margin:0;font-size:18px;font-weight:600;line-height:1.3}
.trabalho p{margin:6px 0 0;font-size:15px;color:var(--ink-700)}
.link-mais{display:inline-block;margin-top:28px;font-weight:600;font-size:15px}
.link-mais svg{width:16px;height:16px;display:inline;vertical-align:-2px;margin-left:6px}
.grade-formatos{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-top:36px}
.formato{background:var(--paper);border:1px solid var(--line);border-radius:8px;padding:24px}
.grade-formatos .formato:nth-child(odd):nth-last-child(2):has(+ .nota-card),.grade-formatos .formato:nth-child(odd):last-child:not(.nota-card){grid-column:1/-1}
.formato .num{font:600 13px/1 var(--font-body);letter-spacing:.14em;color:var(--violet-700)}
.formato h3{margin:12px 0 0;font-size:18px;font-weight:600;line-height:1.3}
.formato p{margin:8px 0 0;font-size:15px;color:var(--ink-700)}
.formato.nota-card{grid-column:1/-1;background:var(--violet-50);border-color:var(--violet-100)}
.formato.nota-card p{color:var(--ink-950);margin:0;font-size:15px}

/* Formulário */
.form-sec{padding:72px 0 96px}
.form-sec .wrap{display:grid;grid-template-columns:.8fr 1.2fr;gap:56px;align-items:start}
.form-sec .lado{position:sticky;top:32px}
.cartao{background:var(--paper);border:1px solid var(--line);border-radius:8px;padding:36px}
.progresso{height:6px;background:var(--cloud);border-radius:999px;overflow:hidden}
.progresso i{display:block;height:100%;width:0;background:var(--violet-700);border-radius:999px;transition:width .35s var(--ease)}
.contador{margin-top:12px;font-size:13px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-600)}
.q{border:0;margin:0;padding:0;min-width:0}
.q-titulo{display:block;margin:20px 0 0;font-size:22px;font-weight:600;line-height:1.3;color:var(--ink-950)}
.q-titulo .opc{font-family:var(--font-body);font-size:13px;font-weight:500;color:var(--ink-600);margin-left:8px;letter-spacing:0}
.q-ajuda{margin:6px 0 0;color:var(--ink-700);font-size:15px}
.campo{width:100%;margin-top:18px;font:400 17px/1.5 var(--font-body);color:var(--ink-950);background:var(--paper);border:1px solid var(--line-strong);border-radius:6px;padding:13px 14px}
.campo:focus{outline:none;border-color:var(--violet-600);box-shadow:var(--focus)}
textarea.campo{min-height:132px;resize:vertical}
.opcoes{display:grid;gap:10px;margin-top:18px}
.opcao{position:relative;display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--line-strong);border-radius:6px;cursor:pointer;font-size:16px;line-height:1.4;transition:border-color .15s,background .15s}
.opcao:hover{border-color:var(--violet-600)}
.opcao input{position:absolute;opacity:0;pointer-events:none}
.opcao .tecla{flex:none;width:26px;height:26px;display:grid;place-items:center;border-radius:4px;border:1px solid var(--line-strong);font-size:12px;font-weight:600;color:var(--ink-700);background:var(--paper)}
.opcao .marca{flex:none;width:20px;height:20px;border-radius:4px;border:1.5px solid var(--line-strong);display:grid;place-items:center;background:var(--paper)}
.opcao .marca svg{width:14px;height:14px;opacity:0;color:#fff}
.opcao:has(input:checked){border-color:var(--violet-700);background:var(--violet-50)}
.opcao:has(input:checked) .tecla{background:var(--violet-700);border-color:var(--violet-700);color:#fff}
.opcao:has(input:checked) .marca{background:var(--violet-700);border-color:var(--violet-700)}
.opcao:has(input:checked) .marca svg{opacity:1}
.opcao:has(input:focus-visible){box-shadow:var(--focus)}
.form-sec .wrap>*,.abertura .wrap>*{min-width:0}
.opcao span:last-child{overflow-wrap:anywhere}
.erro-envio{margin:16px 0 0;color:var(--danger-500);font-size:15px;font-weight:500}
.arquivo{margin-top:18px;display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:16px;border:1px dashed var(--line-strong);border-radius:6px;color:var(--ink-700);font-size:15px}
.arquivo input{position:absolute;width:1px;height:1px;opacity:0}
.arquivo .btn{padding:10px 16px;font-size:15px}
.arquivo:has(input:focus-visible) .btn{box-shadow:var(--focus)}
.arquivo [data-nome-arquivo]{overflow-wrap:anywhere;min-width:0}
.erro{margin:10px 0 0;color:var(--danger-500);font-size:14px;font-weight:500;display:none}
.q.invalida .erro{display:block}
.q.invalida .campo,.q.invalida .opcao{border-color:var(--danger-500)}
.nav{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:32px}
.nav .dica{font-size:13px;color:var(--ink-600)}
.etapa{display:none}
.etapa.ativa{display:block;animation:entra .35s var(--ease)}
@keyframes entra{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.grupo+.grupo{margin-top:40px;padding-top:32px;border-top:1px solid var(--line)}
.grupo-titulo{margin:0;font:600 13px/1 var(--font-body);letter-spacing:.14em;text-transform:uppercase;color:var(--violet-700)}
.grupo .q{margin-top:8px}
.grupo .q+.q{margin-top:28px}
.grupo .q-titulo{font-size:18px}
.fim{display:none;text-align:left}
.fim.ativa{display:block;animation:entra .35s var(--ease)}
.fim .ok{width:48px;height:48px;border-radius:999px;background:var(--violet-50);color:var(--violet-700);display:grid;place-items:center}
.fim .ok svg{width:26px;height:26px}
.fim h3{margin:20px 0 0;font-size:26px;font-weight:700}
.fim p{margin:10px 0 0;color:var(--ink-700);font-size:17px}

/* Rodapé */
footer{border-top:1px solid var(--line);padding:28px 0 40px;font-size:14px;color:var(--ink-600)}
footer .wrap{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap}
footer nav{display:flex;gap:20px}

@media (max-width:900px){
  .abertura .wrap,.form-sec .wrap{grid-template-columns:1fr;gap:40px}
  .form-sec .lado{position:static}
  .grade-formatos{grid-template-columns:1fr 1fr}
  .vitrine .mini{display:none}
}
@media (max-width:640px){
  .wrap{padding:0 16px}
  .topo .btn{display:none}
  .vitrine{display:none}
  .abertura{padding:24px 0 56px}
  .abertura p.lead{font-size:17px}
  .secao,.form-sec{padding:56px 0}
  .grade-trabalhos,.grade-formatos{grid-template-columns:1fr}
  .cartao{padding:24px 20px}
  .q-titulo{font-size:20px}
  .nav .dica{display:none}
}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}}
`;

const ICO = {
  trofeu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 4h8v5a4 4 0 0 1-8 0V4z"/><path d="M8 6H5a1 1 0 0 0-1 1 3 3 0 0 0 3 3h1M16 6h3a1 1 0 0 1 1 1 3 3 0 0 1-3 3h-1"/><path d="M12 13v4M8.5 20h7M10 17h4"/></svg>',
  seta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  voltar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>',
  externo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
};

function pergunta(q, modo) {
  const F = C.formulario;
  const id = `q-${q.id}`;
  const opc = q.obrigatoria ? '' : `<span class="opc">${esc(F.opcional)}</span>`;
  const ajuda = q.ajuda ? `<p class="q-ajuda" id="${id}-ajuda">${esc(q.ajuda)}</p>` : '';
  const desc = q.ajuda ? ` aria-describedby="${id}-ajuda"` : '';
  const req = q.obrigatoria ? ' required' : '';
  let corpo = '';
  if (q.tipo === 'texto_curto') {
    corpo = `<input class="campo" id="${id}-in" name="${q.id}" type="text" autocomplete="${q.id === 'nome' ? 'name' : q.id === 'empresa' ? 'organization' : 'on'}"${req}${desc}>`;
  } else if (q.tipo === 'texto_longo') {
    corpo = `<textarea class="campo" id="${id}-in" name="${q.id}"${req}${desc}></textarea>`;
  } else if (q.tipo === 'arquivo') {
    corpo = `<label class="arquivo"><input id="${id}-in" name="${q.id}" type="file" accept="image/*,.pdf"${desc}><span class="btn btn-secundario">${esc(q.rotulo_arquivo)}</span><span data-nome-arquivo>${esc(q.sem_arquivo)}</span></label>`;
  } else {
    const multi = q.tipo === 'multipla_escolha';
    corpo = `<div class="opcoes">` + q.opcoes.map((o, i) => {
      const indicador = multi ? `<span class="marca">${ICO.check}</span>` : `<span class="tecla" aria-hidden="true">${LETRAS[i]}</span>`;
      return `<label class="opcao"><input type="${multi ? 'checkbox' : 'radio'}" name="${q.id}" value="${esc(o)}"${!multi && i === 0 ? req : ''}>${indicador}<span>${esc(o)}</span></label>`;
    }).join('') + `</div>`;
  }
  const ehGrupo = ['escolha_unica', 'multipla_escolha'].includes(q.tipo);
  const titulo = ehGrupo
    ? `<legend class="q-titulo">${esc(q.pergunta)}${opc}</legend>`
    : `<label class="q-titulo" for="${id}-in">${esc(q.pergunta)}${opc}</label>`;
  const tag = ehGrupo ? 'fieldset' : 'div';
  return `<${tag} class="q" data-q="${q.id}" data-obrigatoria="${q.obrigatoria ? 1 : 0}" data-tipo="${q.tipo}">${titulo}${ajuda}${corpo}<p class="erro" role="alert">${esc(F.obrigatoria_msg)}</p></${tag}>`;
}

function formularioA() {
  const F = C.formulario;
  const total = F.perguntas.length;
  const etapas = F.perguntas.map((q, i) => `
      <div class="etapa${i === 0 ? ' ativa' : ''}" data-etapa="${i}">
        ${pergunta(q, 'A')}
        <div class="nav">
          ${i === 0 ? '<span></span>' : `<button type="button" class="btn btn-secundario" data-voltar>${ICO.voltar}${esc(F.botao_voltar)}</button>`}
          <span class="dica">${q.tipo === 'texto_longo' ? '' : 'ou aperte Enter'}</span>
          ${i === total - 1
            ? `<button type="submit" class="btn btn-primario">${esc(F.botao_enviar)}${ICO.seta}</button>`
            : `<button type="button" class="btn btn-primario" data-avancar>${esc(F.botao_avancar)}${ICO.seta}</button>`}
        </div>
      </div>`).join('');
  return `
    <div class="cartao" data-modo="A">
      <div class="cabeca-form">
        <div class="progresso" aria-hidden="true"><i></i></div>
        <p class="contador" aria-live="polite"><span data-atual>1</span> de ${total}</p>
      </div>
      <form novalidate data-form>${etapas}
        <p class="erro-envio" data-erro-envio role="alert" hidden>${esc(F.envio.erro)}</p>
      </form>
      ${fim()}
    </div>`;
}

function formularioB() {
  const F = C.formulario;
  const porId = Object.fromEntries(F.perguntas.map(q => [q.id, q]));
  const grupos = F.grupos.map(g => `
        <div class="grupo">
          <h3 class="grupo-titulo">${esc(g.titulo)}</h3>
          ${g.perguntas.map(id => pergunta(porId[id], 'B')).join('\n          ')}
        </div>`).join('');
  return `
    <div class="cartao" data-modo="B">
      <form novalidate data-form>${grupos}
        <div class="nav"><span></span><button type="submit" class="btn btn-primario">${esc(F.botao_enviar)}${ICO.seta}</button></div>
        <p class="erro-envio" data-erro-envio role="alert" hidden>${esc(F.envio.erro)}</p>
      </form>
      ${fim()}
    </div>`;
}

function fim() {
  const f = C.formulario.fechamento;
  return `<div class="fim" data-fim tabindex="-1"><div class="ok">${ICO.check}</div><h3>${esc(f.titulo)}</h3><p>${esc(f.texto)}</p></div>`;
}

const JS = `
(() => {
  const cartao = document.querySelector('.cartao');
  const form = cartao.querySelector('[data-form]');
  const fim = cartao.querySelector('[data-fim]');
  const modo = cartao.dataset.modo;

  function respondida(q) {
    if (q.dataset.obrigatoria !== '1') return true;
    const t = q.dataset.tipo;
    if (t === 'escolha_unica' || t === 'multipla_escolha') return !!q.querySelector('input:checked');
    const c = q.querySelector('.campo');
    return c && c.value.trim().length > 0;
  }
  function valida(q) {
    const ok = respondida(q);
    q.classList.toggle('invalida', !ok);
    return ok;
  }
  form.addEventListener('input', e => { const q = e.target.closest('.q'); if (q && q.classList.contains('invalida')) valida(q); });
  form.addEventListener('change', e => { const q = e.target.closest('.q'); if (q && q.classList.contains('invalida')) valida(q); });
  form.addEventListener('change', e => { if (e.target.type === 'file') { const n = e.target.closest('.arquivo').querySelector('[data-nome-arquivo]'); if (e.target.files[0]) n.textContent = e.target.files[0].name; } });

  const ENVIO = ${JSON.stringify((({ url, campos, enviando, erro }) => ({ url, campos, enviando, erro }))(C.formulario.envio))};
  let enviando = false;
  function valor(id) {
    const els = [...form.querySelectorAll('[name="' + id + '"]')];
    if (!els.length) return '';
    if (els[0].type === 'radio' || els[0].type === 'checkbox') return els.filter(e => e.checked).map(e => e.value).join(', ');
    return els[0].value.trim();
  }
  async function concluir() {
    if (enviando) return;
    const erro = form.querySelector('[data-erro-envio]');
    const botao = form.querySelector('button[type="submit"]');
    if (ENVIO.url) {
      enviando = true;
      erro.hidden = true;
      const rotulo = botao.innerHTML;
      botao.disabled = true;
      botao.textContent = ENVIO.enviando;
      const dados = new URLSearchParams();
      Object.entries(ENVIO.campos).forEach(([id, entry]) => dados.append(entry, valor(id)));
      try {
        await fetch(ENVIO.url, { method: 'POST', mode: 'no-cors', body: dados });
      } catch (e) {
        botao.disabled = false;
        botao.innerHTML = rotulo;
        erro.hidden = false;
        enviando = false;
        return;
      }
    }
    form.style.display = 'none';
    const cab = cartao.querySelector('.cabeca-form'); if (cab) cab.style.display = 'none';
    fim.classList.add('ativa');
    fim.focus();
  }

  if (modo === 'A') {
    const etapas = [...form.querySelectorAll('.etapa')];
    const barra = cartao.querySelector('.progresso i');
    const atual = cartao.querySelector('[data-atual]');
    let i = 0;
    const mostra = n => {
      etapas[i].classList.remove('ativa');
      i = n;
      etapas[i].classList.add('ativa');
      atual.textContent = i + 1;
      barra.style.width = ((i) / etapas.length * 100) + '%';
      const foco = etapas[i].querySelector('.campo, input');
      if (foco && window.matchMedia('(hover:hover)').matches) foco.focus({ preventScroll: true });
    };
    const avanca = () => { const q = etapas[i].querySelector('.q'); if (!valida(q)) return; if (i < etapas.length - 1) mostra(i + 1); };
    form.addEventListener('click', e => {
      if (e.target.closest('[data-avancar]')) avanca();
      if (e.target.closest('[data-voltar]') && i > 0) mostra(i - 1);
    });
    form.addEventListener('keydown', e => {
      if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.type !== 'submit') {
        e.preventDefault();
        if (i < etapas.length - 1) avanca(); else form.requestSubmit();
      }
    });
    form.addEventListener('submit', e => { e.preventDefault(); const q = etapas[i].querySelector('.q'); if (valida(q)) { barra.style.width = '100%'; concluir(); } });
    barra.style.width = '0%';
  } else {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const qs = [...form.querySelectorAll('.q')];
      const ruins = qs.filter(q => !valida(q));
      if (ruins.length) { ruins[0].scrollIntoView({ behavior: 'smooth', block: 'center' }); const c = ruins[0].querySelector('.campo, input'); if (c) c.focus({ preventScroll: true }); return; }
      concluir();
    });
  }
})();
`;

function pagina(opcao) {
  const P = C.pessoa, T = C.topo, A = C.abertura, W = C.trabalhos, Fo = C.formatos, F = C.formulario, R = C.rodape;
  const [img1, img2] = W.itens;
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(C.titulo_aba)}</title>
<meta name="description" content="${esc(C.descricao)}">
<meta property="og:title" content="${esc(C.titulo_aba)}">
<meta property="og:description" content="${esc(C.descricao)}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Poppins:wght@400;500;600&display=swap">
<style>${CSS}</style>
</head>
<body>
<header class="topo">
  <div class="wrap">
    <a class="assinatura" href="${esc(P.instagram)}" target="_blank" rel="noopener">
      <img class="av" src="${esc(P.avatar)}" alt="Foto de ${esc(P.nome)}">
      <span><span class="nome">${esc(P.nome)} <img src="${esc(P.selo)}" alt="Perfil verificado"></span><span class="arroba">${esc(P.arroba)}</span></span>
    </a>
    <a class="btn btn-primario" href="#contato">${esc(T.botao)}</a>
  </div>
</header>

<main>
<section class="abertura">
  <div class="wrap">
    <div>
      <span class="eyebrow">${esc(T.etiqueta)}</span>
      <h1 class="caixas">${A.linhas_titulo.map(l => `<span>${esc(l)}</span>`).join('')}</h1>
      <p class="lead">${esc(A.texto)}</p>
      ${A.destaque ? `<a class="destaque" href="${esc(A.destaque.link)}" target="_blank" rel="noopener">${ICO.trofeu}<span>${esc(A.destaque.texto)}</span>${ICO.externo}</a>` : ''}
      <div class="acoes">
        <a class="btn btn-primario" href="#contato">${esc(A.botao)}${ICO.seta}</a>
        ${A.nota ? `<span class="nota">${esc(A.nota)}</span>` : ''}
      </div>
    </div>
    <div class="vitrine" aria-hidden="true">
      <div class="janela"><div class="barra"><i></i><i></i><i></i></div><img src="${esc(img1.imagem)}" alt=""></div>
      <div class="janela mini"><img src="${esc(img2.imagem)}" alt=""></div>
    </div>
  </div>
</section>

<section class="secao trabalhos" id="trabalhos">
  <div class="wrap">
    <span class="eyebrow">${esc(W.etiqueta)}</span>
    <h2>${esc(W.titulo)}</h2>
    <p class="sub">${esc(W.texto)}</p>
    <div class="grade-trabalhos">
      ${W.itens.map(t => `<a class="trabalho" href="${esc(t.link || t.imagem)}" target="_blank" rel="noopener"><img src="${esc(t.imagem)}" alt="${esc(t.alt)}" width="1280" height="860"><div class="info"><h3>${esc(t.nome)}</h3><p>${esc(t.texto)}</p></div></a>`).join('\n      ')}
    </div>
    <a class="link-mais" href="${esc(P.comunidade)}" target="_blank" rel="noopener">${esc(W.link_mais)}${ICO.externo}</a>
  </div>
</section>

<section class="secao" id="formatos">
  <div class="wrap">
    <span class="eyebrow">${esc(Fo.etiqueta)}</span>
    <h2>${esc(Fo.titulo)}</h2>
    <div class="grade-formatos">
      ${Fo.itens.map((f, i) => `<div class="formato"><span class="num">${String(i + 1).padStart(2, '0')}</span><h3>${esc(f.nome)}</h3><p>${esc(f.texto)}</p></div>`).join('\n      ')}
      ${Fo.nota ? `<div class="formato nota-card"><p>${esc(Fo.nota)}</p></div>` : ''}
    </div>
  </div>
</section>

<section class="form-sec" id="contato">
  <div class="wrap">
    <div class="lado">
      <span class="eyebrow">${esc(F.etiqueta)}</span>
      <h2 style="margin:14px 0 0;font-weight:700;font-size:clamp(28px,3.4vw,38px);line-height:1.12;letter-spacing:-.015em">${esc(F.titulo)}</h2>
      <p class="sub" style="margin:12px 0 0;color:var(--ink-700);font-size:17px">${esc(F.texto)}</p>
    </div>
    ${opcao === 'A' ? formularioA() : formularioB()}
  </div>
</section>
</main>

<footer>
  <div class="wrap">
    <span>${esc(R.texto)}</span>
    <nav aria-label="Redes">${R.links.map(l => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.texto)}</a>`).join('')}</nav>
  </div>
</footer>
<script>${JS}</script>
</body>
</html>
`;
}

// "node gerar-pagina.cjs site" gera o index.html publicado, com a opção escolhida por ela em 22/11/2026 (A, em etapas)
if (process.argv[2] === 'site') {
  const saida = path.join(DIR, 'index.html');
  fs.writeFileSync(saida, pagina('A'), 'utf8');
  console.log('Gerado:', saida);
} else {
  for (const o of opcoes) {
    const saida = path.join(DIR, `opcao-${o}.html`);
    fs.writeFileSync(saida, pagina(o), 'utf8');
    console.log('Gerado:', saida);
  }
}
