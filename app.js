/* Prédio Vivo · protótipo navegável (sem servidor; o estado fica no navegador de quem usa). */
(function () {
  'use strict';

  var CHAVE = 'predio-vivo-v1';
  var app = document.getElementById('app');
  var doca = document.getElementById('doca');
  var selecionada = null; // ação aberta no prédio
  var aviso = '';

  // ---------------------------------------------------------------- estado
  function exemplo() {
    return {
      org: { nome: 'ESMPU', pessoas: '' },
      plano: PLANO_ESMPU.map(function (a, i) { return { id: 'e' + i, cat: a.cat, titulo: a.titulo, resp: a.resp, status: a.status }; }),
      lanc: {},
      exemplo: true,
    };
  }
  function carregar() {
    try {
      var t = localStorage.getItem(CHAVE);
      if (t) { var o = JSON.parse(t); if (o && o.plano && o.org) return o; }
    } catch (e) { /* sem armazenamento: segue em memória */ }
    return exemplo();
  }
  function salvar() { try { localStorage.setItem(CHAVE, JSON.stringify(S)); } catch (e) { /* idem */ } }
  var S = carregar();

  // ---------------------------------------------------------------- utilidades
  var IC = {
    predio: '<path d="M5 21V5l9-2v18"/><path d="M14 9h5v12"/><path d="M3 21h18"/><path d="M8.5 8v.01M8.5 12v.01M8.5 16v.01"/>',
    plano: '<path d="M7 3h8l4 4v14H7z"/><path d="M15 3v4h4"/><path d="M10 12h6M10 16h6"/>',
    lancar: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
    rua: '<path d="M3 21V11l4-2v12"/><path d="M9 21V6l5-3v18"/><path d="M16 21V10l5 2v9"/><path d="M2 21h20"/>',
    seta: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    raio: '<path d="M13 2L5 14h6l-1 8 8-12h-6z"/>',
    gota: '<path d="M12 3c4 5 6 8 6 11a6 6 0 01-12 0c0-3 2-6 6-11z"/>',
    recicla: '<path d="M7 19H4l3-5M17 19h3l-3-5M12 4l3 5H9z"/><path d="M7 19h10M5.5 16.5L10 9M18.5 16.5L14 9"/>',
    torneira: '<path d="M4 9h9a4 4 0 014 4v2"/><path d="M8 9V5M6 5h4"/><path d="M17 18v2"/>',
    megafone: '<path d="M4 10v4l3 1 9 4V5L7 9z"/><path d="M19 9c1 1 1 5 0 6"/>',
    medidor: '<path d="M4 16a8 8 0 0116 0"/><path d="M12 16l4-5"/><path d="M3 20h18"/>',
    chuva: '<path d="M7 14a4 4 0 01.5-8 5 5 0 019.5 1.5A3.5 3.5 0 0117 14z"/><path d="M9 17v3M13 17v3M17 17v2"/>',
    reuso: '<path d="M4 12a8 8 0 0114-5l2 2"/><path d="M20 5v4h-4"/><path d="M20 12a8 8 0 01-14 5l-2-2"/><path d="M4 19v-4h4"/>',
    carrinho: '<path d="M3 5h3l2 10h10l2-7H7"/><circle cx="10" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/>',
    sol: '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/>',
    lixeira: '<path d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13"/>',
    mais: '<path d="M12 5v14M5 12h14"/>',
    lapis: '<path d="M4 20l1-4L16 5l3 3L8 19z"/><path d="M14 7l3 3"/>',
    imprimir: '<path d="M7 8V4h10v4"/><rect x="4" y="8" width="16" height="8" rx="1.5"/><path d="M7 14h10v6H7z"/>',
    aviso: '<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17.5v.01"/>',
    pesquisa: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.5-4.5"/>',
  };
  function ico(n, t) {
    t = t || 20;
    return '<svg aria-hidden="true" width="' + t + '" height="' + t + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + IC[n] + '</svg>';
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function cat(id) { for (var i = 0; i < CATALOGO.length; i++) if (CATALOGO[i].id === id) return CATALOGO[i]; return null; }
  function eixoDe(a) { return cat(a.cat).eixo; }
  function fmt(n, d) { return isFinite(n) ? n.toLocaleString('pt-BR', { maximumFractionDigits: d == null ? 0 : d, minimumFractionDigits: 0 }) : '—'; }
  function num(s) { if (s == null || s === '') return NaN; return parseFloat(String(s).replace(/\./g, '').replace(',', '.')); }
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function hashTxt(s) { var h = 7; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return h; }
  function acesas() { return S.plano.filter(function (a) { return a.status === 'feito' || a.status === 'andamento'; }).length; }
  function marca() {
    return '<a class="marca" href="#/"><svg aria-hidden="true" width="24" height="24" viewBox="0 0 20 20"><rect x="2" y="2" width="7" height="7" rx="1.5" fill="#FFC53D"/><rect x="11" y="2" width="7" height="7" rx="1.5" fill="#1F3352"/><rect x="2" y="11" width="7" height="7" rx="1.5" fill="#5BB6FF"/><rect x="11" y="11" width="7" height="7" rx="1.5" fill="#4ADE80"/></svg>prédio vivo</a>';
  }
  function topo(ctx) { return '<header class="topo">' + marca() + '<span class="ctx">' + (ctx || esc(S.org.nome) + ' · ' + S.plano.length + ' ações no plano') + '</span></header>'; }
  function estrelas(seed, n, w, h) { var r = rng(seed), s = ''; for (var i = 0; i < n; i++) s += '<circle cx="' + Math.round(r() * w) + '" cy="' + Math.round(r() * h) + '" r="' + (r() > .7 ? 1.5 : 1) + '" fill="#6E86A6"/>'; return s; }

  // a rua real: cada janela é uma iniciativa da base da pesquisa
  var ORD = ['energia', 'residuos', 'agua'];
  CATALOGO.forEach(function (c) { c.registros = BASE.filter(function (r) { return r[4] === c.id; }).length; });
  function semAcento(t) { return String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function predios() { var o = {}; BASE.forEach(function (r) { o[r[2]] = 1; }); return Object.keys(o); }
  function ruaReal(aceso, interativo, selIdx) {
    var por = {}, chaves = [], s = '';
    BASE.forEach(function (r, i) { var k = (r[5] ? 'm|' : 'o|') + r[2]; if (!por[k]) { por[k] = []; chaves.push(k); } por[k].push(i); });
    [['o', 176, 'ÓRGÃOS DE', 'REFERÊNCIA'], ['m', 300, 'UNIDADES', 'DO MPU']].forEach(function (L) {
      var ks = chaves.filter(function (k) { return k[0] === L[0]; }).sort(function (a, b) { return por[b].length - por[a].length; }), base = L[1], x = 104;
      var f = ' font-family="IBM Plex Sans, sans-serif"';
      s += '<text x="0" y="' + (base - 30) + '" font-size="11" font-weight="700" letter-spacing="1" fill="#A9B8CA"' + f + '>' + L[2] + '</text><text x="0" y="' + (base - 16) + '" font-size="11" font-weight="700" letter-spacing="1" fill="#A9B8CA"' + f + '>' + L[3] + '</text>' +
        '<text x="0" y="' + (base + 1) + '" font-size="11" fill="#A9B8CA"' + f + '>' + ks.length + ' prédios</text>';
      ks.forEach(function (k) {
        var its = por[k], n = its.length, c = n >= 30 ? 5 : n >= 13 ? 4 : n >= 8 ? 3 : n >= 2 ? 2 : 1, w = c * 15 - 4 + 12, vaga = Math.max(w, 56), bx = x + (vaga - w) / 2;
        var grupos = ORD.map(function (e) { return its.filter(function (i) { return BASE[i][0] === e; }); }).filter(function (g) { return g.length; });
        var linhas = 0; grupos.forEach(function (g) { linhas += Math.ceil(g.length / c); });
        var h = linhas * 15 - 4 + 14 + (grupos.length - 1) * 4, topo = base - h, tem = its.some(function (i) { return aceso(BASE[i], i); }), y = topo + 7;
        s += '<rect x="' + bx + '" y="' + topo + '" width="' + w + '" height="' + h + '" rx="2.5" fill="#16263B" stroke="' + (tem ? '#7C93B3' : '#2F4666') + '" stroke-width="' + (tem ? 1.5 : 1) + '"/>';
        grupos.forEach(function (g) {
          var cor = EIXOS[BASE[g[0]][0]].cor;
          g.forEach(function (i, j) {
            var r = BASE[i], on = aceso(r, i), at = 'x="' + (bx + 6 + (j % c) * 15) + '" y="' + (y + Math.floor(j / c) * 15) + '" width="11" height="11" rx="1.5" fill="' + (on ? cor : '#1F3352') + '"';
            if (interativo) s += '<rect class="jan' + (selIdx === i ? ' sel' : '') + '" data-act="janela" data-i="' + i + '" data-dica="' + esc(r[3]) + '|' + esc(r[2]) + ' · ' + EIXOS[r[0]].curto + ' · ' + esc(cat(r[4]).nome) + '" ' + at + '/>';
            else s += '<rect ' + at + '/>';
          });
          y += Math.ceil(g.length / c) * 15 + 4;
        });
        s += '<text x="' + (x + vaga / 2) + '" y="' + (base + 15) + '" text-anchor="middle" font-size="10.5" font-weight="600" fill="' + (tem ? '#F4F7FB' : '#A9B8CA') + '"' + f + '>' + esc(k.slice(2).replace('PRM ', '').replace('Vit. ', '')) + '</text>' +
          '<text x="' + (x + vaga / 2) + '" y="' + (base + 28) + '" text-anchor="middle" font-size="10" fill="#A9B8CA"' + f + '>' + n + '</text>';
        x += vaga + 12;
      });
      s += '<path d="M94 ' + base + 'H1108" stroke="#2F4666" stroke-width="1.5"/>';
    });
    return '<svg class="rua-svg" role="img" aria-label="Duas ruas de prédios: em cima os órgãos de referência, embaixo as unidades do MPU. Cada janela é uma iniciativa da pesquisa." viewBox="0 20 1108 316">' + s + '</svg>';
  }
  function noPlano(i) { return S.plano.some(function (a) { return a.base === i; }); }
  function alternaBase(i) {
    if (noPlano(i)) S.plano = S.plano.filter(function (a) { return a.base !== i; });
    else { var r = BASE[i]; S.plano.push({ id: novoId(), cat: r[4], titulo: r[3], resp: 'A definir', status: 'planejada', origem: r[2], base: i }); }
    salvar();
  }

  // prédio de fachada (rua)
  function fachada(x, base, w, andares, cols, seed, modo, cor, destaque, fh) {
    var r = rng(seed), pad = Math.max(4, w * .1), topoY = base - andares * fh - 12, ww = (w - pad * (cols + 1)) / cols;
    var s = '<rect x="' + x + '" y="' + topoY + '" width="' + w + '" height="' + (base - topoY) + '" rx="3" fill="#16263B" stroke="' + (destaque ? '#FFC53D' : '#2F4666') + '" stroke-width="' + (destaque ? 2.5 : 1) + '"/>';
    for (var a = 0; a < andares; a++) for (var c = 0; c < cols; c++) {
      var v = r(), f = '#1F3352';
      if (modo === 'um') f = v > .45 ? cor : '#1F3352';
      else if (modo === 'misto') f = v < .38 ? '#1F3352' : ['#FFC53D', '#FFC53D', '#5BB6FF', '#4ADE80', '#4ADE80'][Math.floor(r() * 5)];
      else r();
      s += '<rect x="' + (x + pad + c * (ww + pad)).toFixed(1) + '" y="' + (topoY + 10 + a * fh) + '" width="' + ww.toFixed(1) + '" height="' + Math.round(fh * .55) + '" rx="1.5" fill="' + f + '"/>';
    }
    return { svg: s, topo: topoY };
  }
  var CAPA = [['STF', 9], ['STJ', 11], ['TST', 7], ['STM', 5], ['TCU', 10], ['Senado', 12], ['Câmara', 9], ['TJBA', 6], ['TJRJ', 8], ['MPBA', 7], ['MPPE', 5], ['MPRS', 6], ['MPRJ', 8]];
  function svgCapa() {
    var W = 1180, H = 340, base = H - 40, l = CAPA.slice(); l.splice(7, 0, [S.org.nome || 'Seu órgão', 4, true]);
    var passo = (W - 20) / l.length, w = passo * .82, s = '', rotulo = '';
    l.forEach(function (o, i) {
      var x = 10 + i * passo, eu = !!o[2], p = fachada(x, base, w, o[1], 4, 100 + i, 'misto', null, eu, 20);
      s += p.svg + '<text x="' + (x + w / 2) + '" y="' + (base + 22) + '" text-anchor="middle" font-size="12" font-weight="' + (eu ? 700 : 500) + '" fill="' + (eu ? '#FFC53D' : '#A9B8CA') + '" font-family="IBM Plex Sans, sans-serif">' + esc(o[0]) + '</text>';
      if (eu) rotulo = '<text x="' + (x + w / 2) + '" y="' + (p.topo - 12) + '" text-anchor="middle" font-size="12" font-weight="700" fill="#FFC53D" font-family="IBM Plex Sans, sans-serif">o seu</text>';
    });
    return '<svg class="rua-svg" role="img" aria-label="Rua com os prédios dos órgãos de referência; o seu em destaque" viewBox="0 0 ' + W + ' ' + H + '">' + estrelas(7, 40, W, H * .4) +
      '<rect x="0" y="' + base + '" width="' + W + '" height="40" fill="#101D2F"/>' + s + rotulo + '<path d="M0 ' + base + 'h' + W + '" stroke="#2F4666" stroke-width="2"/></svg>';
  }

  // ---------------------------------------------------------------- abertura
  function vAbertura() {
    return '<header class="topo">' + marca() + '<a href="#/predio" style="font-size:14px;font-weight:600">Entrar no prédio da ' + esc(S.org.nome) + '</a></header>' +
      '<section class="heroi"><div>' +
      '<div class="sobre" style="color:var(--en)">Plano de Logística Sustentável, sem planilha</div>' +
      '<h1>Todo órgão é um prédio.<br><span>Acenda o seu.</span></h1>' +
      '<p class="lead">Cada janela acesa é uma ação de sustentabilidade. Responda a algumas perguntas, veja o PLS do seu órgão se montar sozinho e acompanhe água, energia e resíduos circulando pelo prédio.</p>' +
      '<div class="acoes"><a class="btn" href="#/montar/0">Montar o meu prédio ' + ico('seta', 18) + '</a><a class="btn linha" href="#/pesquisa">' + ico('pesquisa', 18) + 'A pesquisa: boas práticas</a><a class="btn linha" href="#/rua">Passear pela rua</a></div>' +
      '</div><ul class="legenda">' +
      '<li><i style="background:var(--en)"></i><span><strong>Energia elétrica</strong>eficiência, solar, uso racional</span></li>' +
      '<li><i style="background:var(--ag)"></i><span><strong>Água</strong>consumo, chuva, reúso</span></li>' +
      '<li><i style="background:var(--re)"></i><span><strong>Resíduos sólidos</strong>redução, coleta, destino</span></li>' +
      '<li class="rod"><strong>' + BASE.length + ' ações reais</strong> de ' + predios().length + ' órgãos e unidades, prontas para você escolher em “A pesquisa”.</li>' +
      '</ul></section>' +
      svgCapa() +
      '<p class="creditos">Protótipo do grupo de pesquisa “Ministério Público da União Verde: liderando a transformação da gestão sustentável” (ESMPU, Edital nº 162/2024). Nesta capa os prédios são ilustrativos; as ações de “A pesquisa” vêm dos Planos de Logística Sustentável de STF, STJ, TST, STM, TCU, Senado, Câmara, TJBA, TJRJ, MPBA, MPPE, MPRS e MPRJ e de 13 unidades do MPU (base de ' + BASE_DATA + ').</p>';
  }

  // ---------------------------------------------------------------- montar
  var PASSOS = ['orgao', 'agua', 'energia', 'residuos'];
  function miniPredio() {
    var s = estrelas(3, 18, 380, 90) + '<rect x="60" y="120" width="250" height="300" rx="4" fill="#16263B" stroke="#2F4666"/>';
    var extraN = 0;
    ANDARES.forEach(function (an, k) {
      var y = 120 + k * 100, E = EIXOS[an[0]], acts = porEixo(an[0]);
      s += '<path d="M60 ' + (y + 100) + 'h250" stroke="#2F4666"/><text x="48" y="' + (y + 56) + '" text-anchor="end" font-size="12" font-weight="700" fill="' + E.cor + '" font-family="IBM Plex Sans, sans-serif">' + E.curto + '</text>';
      for (var c = 0; c < 5; c++) {
        var a = acts[c], f = '#1F3352', st = '';
        if (a) { f = E.cor; if (a.status === 'planejada') st = ' stroke="#F4F7FB" stroke-width="2"'; }
        s += '<rect x="' + (82 + c * 45) + '" y="' + (y + 28) + '" width="34" height="46" rx="3" fill="' + f + '"' + st + '/>';
      }
      extraN += Math.max(0, acts.length - 5);
    });
    s += '<path d="M0 420h380" stroke="#2F4666" stroke-width="2"/>';
    var extra = '';
    return '<aside class="lado"><div class="cab"><small>Seu prédio até agora</small><b>' + S.plano.length + (S.plano.length === 1 ? ' janela' : ' janelas') + extra + '</b></div>' +
      '<svg role="img" aria-label="Prédio em montagem com ' + S.plano.length + ' janelas" viewBox="0 0 380 440">' + s + '</svg>';
  }
  function vMontar(p) {
    p = Math.max(0, Math.min(3, p | 0));
    var pts = PASSOS.map(function (_, i) { return '<span class="' + (i < p ? 'feito' : i === p ? 'atual' : '') + '"></span>'; }).join('');
    var cab = '<header class="topo">' + marca() + '<div class="acoes"><div class="pontos" role="img" aria-label="Passo ' + (p + 1) + ' de 4">' + pts + '</div><span class="ctx">' + (p + 1) + ' de 4</span></div></header>';
    var corpo, dica;
    if (p === 0) {
      corpo = '<div class="sobre" style="color:var(--en)">' + ico('predio', 16) + 'O seu órgão</div><h1>De quem é este prédio?</h1>' +
        '<p class="lead">' + (S.exemplo ? 'O plano da ESMPU (PLS 2026–2028) já está carregado como exemplo. Você pode seguir com ele ou começar um prédio do zero.' : 'Ajuste os dados e siga para as perguntas.') + '</p>' +
        '<div class="campo"><label for="f-nome">Nome ou sigla do órgão</label><input id="f-nome" data-campo="nome" value="' + esc(S.org.nome) + '" autocomplete="organization"></div>' +
        '<div class="campo"><label for="f-pes">Quantas pessoas usam o prédio, em média?</label><input id="f-pes" data-campo="pessoas" inputmode="numeric" value="' + esc(S.org.pessoas) + '" placeholder="servidores, terceirizados e público"><small>Serve para calcular o consumo por pessoa. Pode preencher depois.</small></div>' +
        '<div class="acoes" style="margin-top:22px"><a class="btn" href="#/montar/1">Seguir com este plano ' + ico('seta', 18) + '</a><button class="btn linha" data-act="zerar">Começar do zero</button></div>';
      dica = '<p class="dica" style="--c:var(--en)"><strong>Três perguntas.</strong> Uma para água, uma para energia e uma para resíduos. Cada resposta acende janelas e já traz o indicador sugerido.</p>';
    } else {
      var ex = PASSOS[p], E = EIXOS[ex], perg = { agua: 'para gastar menos água?', energia: 'para gastar menos energia?', residuos: 'para gerar e descartar menos?' }[ex];
      var tiles = CATALOGO.filter(function (c) { return c.eixo === ex; }).sort(function (a, b) { return b.registros - a.registros; }).map(function (c, i) {
        var on = S.plano.some(function (a) { return a.cat === c.id; });
        return '<button class="tile" style="--c:' + E.cor + '" aria-pressed="' + on + '" data-act="alternar" data-cat="' + c.id + '"><span class="ic">' + ico(c.icone, 26) + '</span><span class="tx"><b>' + esc(c.nome) + '</b><small>' +
          (c.registros ? (i === 0 ? 'A mais comum: ' : '') + c.registros + (c.registros === 1 ? ' registro' : ' registros') + ' na base da pesquisa' : 'Nenhum registro na base da pesquisa') + '</small>' + '</span><span class="mk">' + ico('check', 14) + '</span></button>';
      }).join('');
      corpo = '<div class="sobre" style="color:' + E.cor + '">' + ico(E.icone, 16) + esc(E.curto) + '</div><h1>O que ' + (S.org.nome ? 'a ' + esc(S.org.nome) : 'o seu órgão') + ' faz, ou quer fazer, ' + perg + '</h1>' +
        '<p class="lead">Toque em tudo que vale. Cada escolha acende uma janela e já entra no plano com indicador sugerido.</p><div class="tiles">' + tiles + '</div>' +
        '<div class="acoes" style="margin-top:22px"><a class="btn linha" href="#/montar/' + (p - 1) + '">Voltar</a>' +
        (p < 3 ? '<a class="btn" href="#/montar/' + (p + 1) + '">Próxima: ' + EIXOS[PASSOS[p + 1]].curto.toLowerCase() + ' ' + ico('seta', 18) + '</a>' : '<a class="btn" href="#/predio">Ver o meu prédio ' + ico('seta', 18) + '</a>') + '</div>';
      var monit = { agua: 'ag-monit', energia: 'en-monit', residuos: 're-monit' }[ex];
      var tem = S.plano.some(function (a) { return a.cat === monit; });
      dica = '<p class="dica" style="--c:' + E.cor + '">' + (tem ? '<strong>Boa escolha.</strong> Com medição mensal, as metas deste eixo podem ser comprovadas no relatório anual.'
        : '<strong>Falta medir.</strong> Sem “' + esc(cat(monit).nome) + '”, a meta deste eixo não pode ser comprovada. Foi a principal lacuna que a pesquisa encontrou.') + '</p>';
    }
    return cab + '<section class="montar"><div>' + corpo + '</div>' + miniPredio() + dica + '</aside></section>';
  }

  // ---------------------------------------------------------------- prédio (tela principal)
  // um andar por eixo: [eixo, topo do andar, vagas, etiquetas de atraso visíveis]
  var ANDARES = [['energia', 150, 7, 2], ['residuos', 240, 7, 2], ['agua', 330, 5, 1]];
  function porEixo(e) { return S.plano.filter(function (a) { return eixoDe(a) === e; }); }
  function vagasDe(k) {
    var v = [], y = ANDARES[k][1];
    for (var i = 0; i < 7; i++) { if (k === 2 && (i === 2 || i === 3)) continue; v.push({ x: 392 + i * 58, y: y + 22 }); }
    return v;
  }
  function corta(t, n) { return t.length > n ? t.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : t; }
  function cena() {
    var BX = 330, BW = 500, s = '<g transform="translate(0 40)">', etqs = '';
    s += '<rect x="0" y="420" width="1180" height="170" fill="#101D2F"/>';
    s += '<rect x="' + BX + '" y="150" width="' + BW + '" height="270" fill="#16263B" stroke="#2F4666" stroke-width="1.5"/>';
    s += '<rect x="' + BX + '" y="420" width="' + BW + '" height="80" fill="#0D1828" stroke="#2F4666" stroke-width="1.5"/>';
    s += '<path d="M330 240h500M330 330h500" stroke="#2F4666" stroke-width="1.5"/>';
    s += '<text x="318" y="466" text-anchor="end" font-size="12" fill="#A9B8CA" font-family="IBM Plex Sans, sans-serif">Garagem</text>';
    s += '<rect x="516" y="356" width="88" height="64" rx="3" fill="#22395A" stroke="#2F4666"/><path d="M560 356v64" stroke="#2F4666"/>';
    ANDARES.forEach(function (an, k) {
      var E = EIXOS[an[0]], topo = an[1], acts = porEixo(an[0]), v = vagasDe(k), atras = 0;
      s += '<text x="318" y="' + (topo + 44) + '" text-anchor="end" font-size="13" font-weight="700" fill="' + E.cor + '" font-family="IBM Plex Sans, sans-serif">' + E.curto + '</text>' +
        '<text x="318" y="' + (topo + 60) + '" text-anchor="end" font-size="11" fill="#A9B8CA" font-family="IBM Plex Sans, sans-serif">' + acts.length + (acts.length === 1 ? ' ação' : ' ações') + '</text>';
      v.forEach(function (p, i) {
        var a = acts[i];
        if (!a) { s += '<rect x="' + p.x + '" y="' + p.y + '" width="46" height="46" rx="3" fill="#1F3352"/>'; return; }
        var c = E.cor, at = 'fill="' + c + '"';
        if (a.status === 'planejada') at = 'fill="#1F3352" stroke="' + c + '" stroke-width="2.5" stroke-dasharray="5 4"';
        if (a.status === 'atrasada') at = 'fill="#1F3352" stroke="#FF8A7A" stroke-width="2.5" stroke-dasharray="5 4"';
        s += '<rect class="jan' + (selecionada === a.id ? ' sel' : '') + '" tabindex="0" role="button" aria-label="' + esc(a.titulo) + ', ' + STATUS[a.status].nome + '" data-act="abrir" data-id="' + a.id + '" data-dica="' + esc(a.titulo) + '|' + esc(a.resp) + ' · ' + STATUS[a.status].nome + '" x="' + p.x + '" y="' + p.y + '" width="46" height="46" rx="3" ' + at + '/>';
        if (a.status === 'feito') s += '<path d="M' + (p.x + 13) + ' ' + (p.y + 24) + 'l7 7 13-14" fill="none" stroke="#0B1626" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" pointer-events="none"/>';
        if (a.status === 'atrasada' && atras < an[3]) {
          // etiqueta sempre visível para ação atrasada: à direita do prédio; no térreo, à esquerda
          var cx = p.x + 23, ty = topo + 8 + atras * 30, yl = topo + 13 - atras * 5, esq = k === 2;
          var tx = esq ? 28 : 848, tw = esq ? 222 : 286;
          etqs += '<path d="M' + cx + ' ' + p.y + 'V' + yl + 'H' + (esq ? 258 : 840) + 'V' + (ty + 12) + 'H' + (esq ? 250 : 848) + '" fill="none" stroke="#FF8A7A" stroke-width="1.5" stroke-dasharray="3 4"/>' +
            '<g class="etq" data-act="abrir" data-id="' + a.id + '"><rect x="' + tx + '" y="' + ty + '" width="' + tw + '" height="24" rx="6" fill="#1B2E48" stroke="#FF8A7A"/><circle cx="' + (tx + 12) + '" cy="' + (ty + 12) + '" r="4" fill="#FF8A7A"/>' +
            '<text x="' + (tx + 22) + '" y="' + (ty + 16) + '" font-size="11.5" font-weight="600" fill="#F4F7FB" font-family="IBM Plex Sans, sans-serif">' + esc(corta(a.titulo, esq ? 36 : 46)) + '</text></g>';
          atras++;
        }
      });
      if (acts.length > v.length) s += '<text x="822" y="' + (topo + 84) + '" text-anchor="end" font-size="11" fill="#A9B8CA" font-family="IBM Plex Sans, sans-serif">+' + (acts.length - v.length) + ' na lista</text>';
    });
    s += '<rect x="772" y="112" width="52" height="38" rx="4" fill="#16263B" stroke="#5BB6FF" stroke-width="2.5"/>';
    for (var i = 0; i < 6; i++) { var x = 440 + i * 48; s += '<path d="M' + x + ' 148l10-22h30l-10 22z" fill="#1D3B63" stroke="#FFC53D" stroke-width="2" stroke-linejoin="round"/>'; }
    s += '<path d="M700 482h84v-12l-12-4-10-12h-34l-12 12-16 4z" fill="#22395A" stroke="#2F4666"/><circle cx="720" cy="484" r="7" fill="#0B1626" stroke="#2F4666"/><circle cx="766" cy="484" r="7" fill="#0B1626" stroke="#2F4666"/>';
    s += '<path d="M0 512h360V138h84" fill="none" stroke="#FFC53D" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>';
    [195, 285, 375, 460].forEach(function (y) { s += '<circle cx="360" cy="' + y + '" r="6" fill="#0B1626" stroke="#FFC53D" stroke-width="3"/>'; });
    s += '<path d="M1180 530H812V150" fill="none" stroke="#5BB6FF" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>';
    [195, 285, 375].forEach(function (y) { s += '<circle cx="812" cy="' + y + '" r="6" fill="#0B1626" stroke="#5BB6FF" stroke-width="3"/>'; });
    s += '<path d="M830 318h236" fill="none" stroke="#4ADE80" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 11"/>';
    [[916, 'Cooperativa', '#4ADE80'], [991, 'Compostagem', '#4ADE80'], [1066, 'Aterro', '#8496AD']].forEach(function (b) {
      s += '<path d="M' + b[0] + ' 318v66" stroke="' + b[2] + '" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 9"/><rect x="' + (b[0] - 22) + '" y="386" width="44" height="34" rx="4" fill="#16263B" stroke="' + b[2] + '" stroke-width="2.5"/><path d="M' + (b[0] - 26) + ' 386h52" stroke="' + b[2] + '" stroke-width="3" stroke-linecap="round"/>' +
        '<text x="' + b[0] + '" y="438" text-anchor="middle" font-size="10.5" fill="#A9B8CA" font-family="IBM Plex Sans, sans-serif">' + b[1] + '</text>';
    });
    [276, 298].forEach(function (x) { s += '<path d="M' + x + ' 420v-14M' + x + ' 410c-8-2-10-8-10-12 6 0 10 4 10 12zM' + x + ' 406c8-2 10-8 10-12-6 0-10 4-10 12z" fill="none" stroke="#4ADE80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'; });
    s += '<path d="M0 420h330M830 420h350" stroke="#2F4666" stroke-width="2"/>' + etqs + '</g>';
    return '<svg class="cena" role="group" aria-label="Corte do prédio: um andar por eixo; cada janela é uma ação do plano" viewBox="10 80 1160 520">' + estrelas(11, 40, 1180, 150) + s + '</svg>';
  }

  // ---- metas: marcos do plano e ritmo calculado pelos lançamentos
  function ritmo(campo) {
    var ms = Object.keys(S.lanc).sort(), ano = ms.length ? ms[ms.length - 1].slice(0, 4) : null; if (!ano) return null;
    var soma = 0, n = 0;
    ms.forEach(function (m) { if (m.slice(0, 4) === ano && S.lanc[m][campo] != null) { soma += S.lanc[m][campo]; n++; } });
    return n ? { ano: ano, n: n, proj: soma / n * 12 } : null;
  }
  function desvio() {
    var ms = Object.keys(S.lanc).sort().reverse();
    for (var i = 0; i < ms.length; i++) { var l = S.lanc[ms[i]], t = (l.recic || 0) + (l.organ || 0) + (l.rejeito || 0); if (t) return { mes: ms[i], pct: ((l.recic || 0) + (l.organ || 0)) / t * 100 }; }
    return null;
  }
  function metas() {
    return ANDARES.map(function (an) {
      var k = an[0], E = EIXOS[k], M = S.exemplo ? METAS_ESMPU[k] : null, corpo;
      var cab = '<div class="mcab">' + ico(E.icone, 16) + esc(E.curto) + '</div>';
      if (!M) {
        var r0 = k === 'residuos' ? null : ritmo(k);
        return '<div class="meta" style="--c:' + E.cor + '">' + cab + '<p>' + (r0 ? 'Projeção de ' + r0.ano + ': ' + fmt(r0.proj) + ' ' + E.un + ' (' + r0.n + (r0.n === 1 ? ' mês lançado' : ' meses lançados') + ').' : 'Sem lançamentos ainda.') + '</p><em>Meta ainda não definida para este órgão.</em></div>';
      }
      var marcos = M.marcos.map(function (m) { return '<span><b>' + m[0] + '</b>−' + String(m[1]).replace('.', ',') + '%</span>'; }).join('');
      var linha, pos = null;
      if (k === 'residuos') {
        var d = desvio();
        linha = d ? '<em>' + NOMES_MES[parseInt(d.mes.slice(5), 10) - 1] + ' de ' + d.mes.slice(0, 4) + ': ' + fmt(d.pct) + '% dos resíduos pesados não foram para o aterro.</em>' : '<em class="neutro">Sem pesagem lançada: ainda não dá para medir.</em>';
      } else {
        var r = ritmo(k);
        if (r) {
          var v = (r.proj - BASE_ESMPU[k].valor) / BASE_ESMPU[k].valor * 100, marco = M.marcos.filter(function (m) { return String(m[0]) === r.ano; })[0] || M.marcos[0];
          var ok = -v >= marco[1]; pos = Math.max(0, Math.min(1, -v / M.marcos[M.marcos.length - 1][1]));
          linha = '<em class="' + (ok ? 'ok' : 'alerta') + '">' + (ok ? 'No ritmo' : 'Abaixo do marco') + ' de ' + marco[0] + ': projeção de ' + (v > 0 ? '+' : '−') + fmt(Math.abs(v), 1) + '% no consumo total, com ' + r.n + (r.n === 1 ? ' mês lançado' : ' meses lançados') + '.</em>';
        } else linha = '<em class="neutro">Sem lançamentos: ainda não dá para saber o ritmo.</em>';
      }
      return '<div class="meta" style="--c:' + E.cor + '">' + cab + '<b>' + fmt(BASE_ESMPU[k].valor) + ' <span>' + E.un + ' em 2025</span></b><p>' + esc(M.texto) + '</p>' +
        (k === 'residuos' ? '' : '<div class="trilho"' + (pos != null ? ' style="--p:' + (pos * 100).toFixed(0) + '%"' : '') + '><i' + (pos == null ? ' hidden' : '') + '></i></div>') + '<div class="marcos">' + marcos + '</div>' + linha + '</div>';
    }).join('');
  }
  function cartao() {
    var a = S.plano.filter(function (x) { return x.id === selecionada; })[0];
    if (!a) {
      var atr = S.plano.filter(function (x) { return x.status === 'atrasada'; }).length;
      return '<div class="cartao"><small class="rot">' + acesas() + ' de ' + S.plano.length + ' janelas acesas</small>' +
        (S.plano.length ? (atr ? '<span style="color:var(--erro);font-weight:600">' + atr + (atr === 1 ? ' ação atrasada' : ' ações atrasadas') + '</span>. ' : 'Nenhuma ação atrasada. ') + 'Toque em uma janela para ver a ação, o indicador e quem responde por ela.' : 'O prédio ainda está apagado. <a href="#/montar/1">Monte o plano</a> para acender as primeiras janelas.') + '</div>';
    }
    var c = cat(a.cat), E = EIXOS[c.eixo];
    var seg = Object.keys(STATUS).map(function (k) { return '<button style="--c:' + STATUS[k].cor + '" aria-pressed="' + (a.status === k) + '" data-act="status" data-id="' + a.id + '" data-st="' + k + '">' + STATUS[k].nome + '</button>'; }).join('');
    return '<div class="cartao"><small class="rot" style="color:' + E.cor + '">' + esc(E.nome) + '</small><h2>' + esc(a.titulo) + '</h2><dl>' +
      '<div><dt>Tipo de ação</dt><dd>' + esc(c.nome) + '</dd></div><div><dt>Quem responde</dt><dd>' + esc(a.resp) + '</dd></div>' +
      '<div><dt>Indicador sugerido</dt><dd>' + esc(c.indicador) + '</dd></div><div><dt>' + (a.origem ? 'Inspirada no plano de' : 'Na pesquisa') + '</dt><dd>' + (a.origem ? esc(a.origem) : c.registros + ' registros deste tipo') + '</dd></div></dl>' +
      '<div class="seg" role="group" aria-label="Situação">' + seg + '</div></div>';
  }
  function vPredio() {
    var lista = S.plano.map(function (a) { return '<li><button data-act="abrir" data-id="' + a.id + '"><span class="bol" style="--c:' + STATUS[a.status].cor + '"></span>' + esc(a.titulo) + '</button></li>'; }).join('');
    var leg = '<ul class="leg" aria-label="Como ler o prédio">' +
      '<li><svg aria-hidden="true" width="18" height="18"><rect x="1" y="1" width="16" height="16" rx="2" fill="#FFC53D"/></svg>em andamento</li>' +
      '<li><svg aria-hidden="true" width="18" height="18"><rect x="1" y="1" width="16" height="16" rx="2" fill="#FFC53D"/><path d="M4.5 9.5l3 3 6-6.5" fill="none" stroke="#0B1626" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>feita</li>' +
      '<li><svg aria-hidden="true" width="18" height="18"><rect x="1.5" y="1.5" width="15" height="15" rx="2" fill="#1F3352" stroke="#FFC53D" stroke-width="2" stroke-dasharray="4 3"/></svg>planejada</li>' +
      '<li><svg aria-hidden="true" width="18" height="18"><rect x="1.5" y="1.5" width="15" height="15" rx="2" fill="#1F3352" stroke="#FF8A7A" stroke-width="2" stroke-dasharray="4 3"/></svg>atrasada</li>' +
      '<li><svg aria-hidden="true" width="18" height="18"><rect x="1" y="1" width="16" height="16" rx="2" fill="#1F3352"/></svg>espaço livre</li></ul>';
    return topo() + '<section class="predio-topo"><div><h1>O prédio da ' + esc(S.org.nome || 'sua unidade') + ', hoje</h1>' +
      '<p class="como-ler"><strong>Cada andar é um eixo. Cada janela é uma ação do plano.</strong> Passe o mouse ou toque em uma janela para ver qual.</p></div>' + leg + '</section>' +
      cena() +
      '<section class="metas" aria-label="Metas por eixo">' + metas() + '</section>' +
      '<section class="predio-baixo"><div>' + cartao() + '</div>' + (lista ? '<ul class="lista-jan" aria-label="Todas as ações">' + lista + '</ul>' : '') + '</section>' +
      '<div class="rodape-cena"><p>As metas usam os marcos do plano e o que foi lançado mês a mês. Sem lançamento, o prédio não tem como dizer se o órgão está no ritmo.</p>' +
      '<div class="acoes"><a class="btn" href="#/lancar">Lançar o mês ' + ico('seta', 18) + '</a><a class="btn linha" href="#/plano">Ver o plano completo</a></div></div>';
  }

  // ---------------------------------------------------------------- plano
  function vPlano() {
    var grupos = Object.keys(EIXOS).map(function (k) {
      var E = EIXOS[k], itens = S.plano.filter(function (a) { return eixoDe(a) === k; });
      var linhas = itens.map(function (a) {
        var c = cat(a.cat), ops = Object.keys(STATUS).map(function (s) { return '<option value="' + s + '"' + (a.status === s ? ' selected' : '') + '>' + STATUS[s].nome + '</option>'; }).join('');
        return '<div class="acao"><div><b>' + esc(a.titulo) + '</b><small>' + esc(c.nome) + (a.origem ? ' · inspirada no plano de: ' + esc(a.origem) : '') + ' · indicador: ' + esc(c.indicador) + '</small></div>' +
          '<input aria-label="Responsável por: ' + esc(a.titulo) + '" data-campo="resp" data-id="' + a.id + '" value="' + esc(a.resp) + '">' +
          '<input aria-label="Prazo de: ' + esc(a.titulo) + '" data-campo="prazo" data-id="' + a.id + '" value="' + esc(a.prazo || '') + '" placeholder="Prazo">' +
          '<select aria-label="Situação de: ' + esc(a.titulo) + '" data-campo="status" data-id="' + a.id + '">' + ops + '</select>' +
          '<button class="rm" aria-label="Remover: ' + esc(a.titulo) + '" data-act="remover" data-id="' + a.id + '">' + ico('x', 18) + '</button></div>';
      }).join('');
      return '<section class="grupo" style="--c:' + E.cor + '"><h2>' + ico(E.icone, 20) + esc(E.nome) + ' <span class="suave" style="font-size:14px;font-weight:500">' + itens.length + '</span></h2>' + (linhas || '<div class="vazio">Nenhuma ação neste eixo. <a href="#/rua">Veja o que os vizinhos fazem.</a></div>') + '</section>';
    }).join('');
    return topo() + '<section class="pagina"><h1>O plano</h1><p class="lead">É o mesmo prédio, em forma de lista: as ações do PLS com responsável, situação e indicador sugerido. Edite aqui e as janelas mudam.</p>' +
      '<div class="acoes"><a class="btn" href="#/imprimir">Montar e imprimir ' + ico('seta', 18) + '</a><a class="btn linha" href="#/pesquisa">Buscar boas práticas</a><a class="btn linha" href="#/relatorio">Relatório do ano</a><button class="btn linha" data-act="baixar">Baixar o plano (JSON)</button><button class="btn linha" data-act="exemplo">Recarregar o exemplo da ESMPU</button></div>' + grupos + '</section>';
  }

  // ---------------------------------------------------------------- a rua (o que falta no meu prédio)
  function lacunas() {
    var ordem = { residuos: 0, agua: 1, energia: 2 };
    return CATALOGO.filter(function (c) { return !S.plano.some(function (a) { return a.cat === c.id; }); })
      .sort(function (a, b) { return ordem[a.eixo] - ordem[b.eixo] || b.registros - a.registros; });
  }
  function quantos(c) { var u = {}; BASE.forEach(function (r) { if (r[4] === c.id) u[r[2]] = 1; }); return Object.keys(u).length; }
  function vRua(id) {
    var l = lacunas(), sel = l.filter(function (c) { return c.id === id; })[0] || l[0];
    if (!sel) return topo() + '<section class="pagina"><h1>A rua</h1><p class="lead">Seu prédio já tem os 17 tipos de ação que a pesquisa encontrou.</p></section>' + ruaReal(function () { return true; }, false);
    var E = EIXOS[sel.eixo], m = quantos(sel);
    var li = l.map(function (c) { return '<li><button style="--c:' + EIXOS[c.eixo].cor + '" aria-pressed="' + (c.id === sel.id) + '" data-act="lacuna" data-cat="' + c.id + '"><i></i><span>' + esc(c.nome) + '</span><em>' + c.registros + '</em></button></li>'; }).join('');
    return topo() + '<div class="modo" role="group" aria-label="Modo da rua"><a href="#/rua" aria-current="page">O que falta no meu prédio</a><a href="#/rua/comparar">Como estou perto dos outros</a></div>' +
      '<section class="rua-grade"><div><h1 style="font-size:38px;font-weight:800">A rua</h1><p class="suave" style="font-size:14px;line-height:1.45;margin:8px 0 0">' + l.length + (l.length === 1 ? ' tipo de ação que a pesquisa encontrou' : ' tipos de ação que a pesquisa encontrou') + ' e o seu prédio ainda não tem. Escolha um para ver quem já acendeu.</p><ul class="lacunas">' + li + '</ul></div>' +
      '<div><div class="rua-cab"><div><div class="sobre" style="color:' + E.cor + '">' + esc(E.curto) + '</div><h2>' + esc(sel.nome) + '</h2><p>' +
      (sel.registros ? sel.registros + (sel.registros === 1 ? ' janela acesa em ' : ' janelas acesas em ') + m + (m === 1 ? ' prédio. ' : ' prédios. ') : 'Nenhum órgão desta base registrou esse tipo. ') + esc(sel.oficial) + '.</p></div>' +
      '<div class="acoes">' + (sel.registros ? '<button class="btn" data-act="verpraticas" data-cat="' + sel.id + '">Ver as práticas ' + ico('seta', 18) + '</button>' : '') + '<button class="btn linha" data-act="acender" data-cat="' + sel.id + '">Acender no meu prédio</button></div></div>' +
      ruaReal(function (r) { return r[4] === sel.id; }, false) +
      '<p class="creditos">Dados reais: acendem os órgãos que registraram esse tipo de ação na base da pesquisa de ' + BASE_DATA + '. Nessa base, fora do MPU, só a Câmara tem ações de resíduos.</p></div></section>';
  }

  // ---------------------------------------------------------------- a pesquisa (boas práticas)
  var P = { eixo: null, tipo: null, busca: '', sel: null, tudo: false };
  function filtroP() {
    var q = semAcento(P.busca.trim());
    if (q) return function (r) { return semAcento(r[3]).indexOf(q) >= 0; };
    if (P.tipo) return function (r) { return r[4] === P.tipo; };
    if (P.eixo) return function (r) { return r[0] === P.eixo; };
    return function () { return true; };
  }
  function pil(txt, n, cor, on, act, val, icone) {
    return '<button class="pil" style="--c:' + cor + '" aria-pressed="' + !!on + '" data-act="' + act + '" data-v="' + (val || '') + '">' + (icone ? ico(icone, 16) : '') + esc(txt) + '<span>' + n + '</span></button>';
  }
  function cartaoPratica(i) {
    var r = BASE[i], d = noPlano(i);
    return '<li class="pratica' + (d ? ' dentro' : '') + '" style="--c:' + EIXOS[r[0]].cor + '"><span class="tx"><span>' + esc(r[3]) + '</span><small><b>' + esc(r[2]) + '</b> · ' + esc(r[1]) + ' · ' + esc(cat(r[4]).nome) + (d ? ' · no seu plano' : '') + '</small></span>' +
      '<button class="mais" aria-pressed="' + d + '" aria-label="' + (d ? 'Tirar do meu plano: ' : 'Pôr no meu plano: ') + esc(r[3]) + '" data-act="por" data-i="' + i + '">' + ico(d ? 'check' : 'mais', 20) + '</button></li>';
  }
  function vPesquisa() {
    var f = filtroP(), q = P.busca.trim(), idx = [], us = {}, mpu = 0;
    BASE.forEach(function (r, i) { if (f(r, i)) { idx.push(i); us[r[2]] = 1; if (r[5]) mpu++; } });
    var n = idx.length, m = Object.keys(us).length, total = predios().length, tit, sub, filtrado = !!(q || P.eixo);
    if (q) {
      tit = n ? '“' + esc(q) + '” aparece em ' + n + (n === 1 ? ' janela.' : ' janelas.') : 'Nenhuma janela fala em “' + esc(q) + '”.';
      var ex = {}; idx.forEach(function (i) { ex[EIXOS[BASE[i][0]].curto.toLowerCase()] = 1; });
      var exs = Object.keys(ex);
      sub = n ? 'Em ' + m + (m === 1 ? ' prédio' : ' prédios') + ', ' + (exs.length === 1 ? 'no eixo ' : 'nos eixos ') + exs.join(', ') + '. ' + (mpu ? mpu + (mpu === 1 ? ' é de unidade do MPU.' : ' são de unidades do MPU.') : 'Nenhuma é de unidade do MPU.') : 'Tente outra palavra, como LED, copo, chuva ou campanha.';
    } else if (P.tipo) {
      var c = cat(P.tipo);
      tit = m === 1 ? 'Só um prédio tem “' + esc(c.nome) + '”.' : esc(c.nome) + ': ' + n + ' janelas em ' + m + ' prédios.';
      sub = (m === 1 ? n + (n === 1 ? ' janela, em: ' : ' janelas, todas em: ') + esc(Object.keys(us)[0]) + '. ' : '') + (mpu ? mpu + ' de unidades do MPU e ' + (n - mpu) + ' de órgãos de referência.' : 'Nenhuma unidade do MPU tem essa ação no plano.');
    } else if (P.eixo) {
      var E = EIXOS[P.eixo];
      tit = n + ' janelas de ' + E.curto.toLowerCase() + '.'; sub = 'Em ' + m + ' dos ' + total + ' prédios. Escolha um tipo de ação para ver só as práticas dele.';
    } else { tit = BASE.length + ' ações em ' + total + ' prédios.'; sub = 'Cada janela é uma boa prática que um órgão escreveu no próprio plano. Escolha as que servem para você e saia com o seu PLS pronto para imprimir.'; }
    var np = S.plano.length;
    var l1 = pil('Tudo', BASE.length, '#F4F7FB', !filtrado, 'peixo', '') + ORD.map(function (e) { return pil(EIXOS[e].curto, BASE.filter(function (r) { return r[0] === e; }).length, EIXOS[e].cor, !q && P.eixo === e && !P.tipo, 'peixo', e, EIXOS[e].icone); }).join('');
    var l2 = P.eixo && !q ? CATALOGO.filter(function (c) { return c.eixo === P.eixo && c.registros; }).sort(function (a, b) { return b.registros - a.registros; }).map(function (c) { return pil(c.nome, c.registros, EIXOS[P.eixo].cor, P.tipo === c.id, 'ptipo', c.id); }).join('')
      : '<span class="suave" style="font-size:13px">Escolha um eixo para ver os tipos de ação. Toque em qualquer janela para ler o que o órgão escreveu e levar para o seu plano.</span>';
    var gav;
    if (P.sel != null) gav = '<ul class="praticas uma">' + cartaoPratica(P.sel) + '</ul>';
    else if (!filtrado) {
      var med = BASE.filter(function (r) { return /-monit$/.test(r[4]); }), um = {}; med.forEach(function (r) { um[r[2]] = 1; });
      var fora = {}; BASE.forEach(function (r) { if (r[0] === 'residuos' && !r[5]) fora[r[2]] = 1; });
      var nf = Object.keys(fora).length, ne = BASE.filter(function (r) { return r[0] === 'energia'; }).length;
      var ach = function (num, cor, txt, rot, act, v) { return '<div class="achado"><b style="color:' + cor + '">' + num + '</b><span>' + txt + '<br><button class="lk" data-act="' + act + '" data-v="' + v + '">' + rot + '</button></span></div>'; };
      gav = '<div class="achados">' + ach(ne, EIXOS.energia.cor, 'janelas são de <strong>energia</strong>: quase metade de tudo o que os planos prometem.', 'Acender só a energia', 'peixo', 'energia') +
        ach(med.length, '#F4F7FB', 'janelas são de <strong>medição</strong>. Em ' + (total - Object.keys(um).length) + ' dos ' + total + ' prédios, nenhuma.', 'Procurar “monitor”', 'pbusca', 'monitor') +
        ach(nf, EIXOS.residuos.cor, (nf === 1 ? 'prédio fora do MPU tem' : 'prédios fora do MPU têm') + ' ação de <strong>resíduos</strong> nesta base' + (nf === 1 ? ': ' + esc(Object.keys(fora)[0]) + '.' : '.'), 'Acender os resíduos', 'peixo', 'residuos') + '</div>';
    } else {
      var mostra = P.tudo ? idx : idx.slice(0, 3);
      gav = n ? '<ul class="praticas">' + mostra.map(cartaoPratica).join('') + '</ul>' + (n > 3 ? '<button class="lk" data-act="ptudo">' + (P.tudo ? 'Mostrar só 3' : 'Ver as ' + n + ' ações') + '</button>' : '') : '';
    }
    return '<header class="topo">' + marca() + '<a class="btn peq' + (np ? '' : ' linha') + '" href="#/imprimir">' + ico('plano', 17) + 'Meu plano · ' + (np ? np + (np === 1 ? ' ação' : ' ações') : 'vazio') + '</a></header>' +
      '<section class="pesq-topo"><div><h1>' + tit + '</h1><p>' + sub + '</p></div>' +
      '<div class="busca"><label for="p-busca" class="oculto">Procurar uma palavra nos planos</label>' + ico('pesquisa', 20) + '<input id="p-busca" type="search" value="' + esc(P.busca) + '" placeholder="Procure uma palavra: torneira, LED, copo…" autocomplete="off"></div></section>' +
      '<div class="pils" role="group" aria-label="Acender por eixo">' + l1 + '</div><div class="pils" role="group" aria-label="Acender por tipo de ação">' + l2 + '</div>' +
      ruaReal(f, true, P.sel) + '<section class="gaveta" aria-live="polite">' + gav + '</section>' +
      '<div class="rodape-cena"><p>Base pública da pesquisa de ' + BASE_DATA + ': ' + BASE.length + ' iniciativas. Fora do MPU, só a Câmara tem ações de resíduos nessa base. O texto de cada janela é o do plano do órgão.</p>' +
      '<div class="acoes"><a class="btn" href="#/imprimir">' + ico('imprimir', 18) + 'Montar e imprimir</a></div></div>';
  }

  // ---------------------------------------------------------------- o PLS para imprimir
  function vImprimir() {
    var o = S.org, op = S.imp || (S.imp = { origem: true, indicador: true });
    var secoes = ORD.map(function (e) {
      var E = EIXOS[e], acs = S.plano.filter(function (a) { return eixoDe(a) === e; }); if (!acs.length) return '';
      var linhas = acs.map(function (a) {
        var c = cat(a.cat);
        return '<tr><td><b>' + esc(a.titulo) + '</b>' + (op.origem && a.origem ? '<small>Inspirada no plano de: ' + esc(a.origem) + '</small>' : '') + '</td>' + (op.indicador ? '<td>' + esc(c.indicador) + '</td>' : '') +
          '<td>' + (a.resp && a.resp !== 'A definir' ? esc(a.resp) : '<i></i>') + '</td><td>' + (a.prazo ? esc(a.prazo) : '<i></i>') + '</td></tr>';
      }).join('');
      return '<h3><span style="background:' + E.cor + '"></span>' + esc(E.nome) + '</h3><table><thead><tr><th>Ação</th>' + (op.indicador ? '<th class="c2">Indicador</th>' : '') + '<th class="c3">Quem responde</th><th class="c4">Prazo</th></tr></thead><tbody>' + linhas + '</tbody></table>';
    }).join('');
    var comEixo = ORD.filter(function (e) { return S.plano.some(function (a) { return eixoDe(a) === e; }); });
    var semMed = ORD.filter(function (e) { return !S.plano.some(function (a) { return eixoDe(a) === e && /-monit$/.test(a.cat); }); });
    var semResp = S.plano.filter(function (a) { return !a.resp || a.resp === 'A definir'; }).length, semPrazo = S.plano.filter(function (a) { return !a.prazo; }).length;
    function it(ok, t) { return '<li class="' + (ok ? 'ok' : 'falta') + '">' + ico(ok ? 'check' : 'aviso', 17) + '<span>' + t + '</span></li>'; }
    function nomes(l) { return l.map(function (e) { return EIXOS[e].curto.toLowerCase(); }).join(' e '); }
    var fontes = {}; S.plano.forEach(function (a) { if (a.origem) fontes[a.origem] = 1; });
    var nf = Object.keys(fontes).length, n = S.plano.length;
    return '<header class="topo">' + marca() + '<a href="#/pesquisa" style="font-size:14px;font-weight:600">Voltar à pesquisa e escolher mais</a></header>' +
      '<section class="imp-grade"><div class="imp-lado"><h1>' + (n ? 'Seu PLS já tem cara de documento.' : 'Seu plano ainda está vazio.') + '</h1>' +
      '<p class="lead">' + (n ? n + (n === 1 ? ' ação' : ' ações') + (nf ? ', com boas práticas de ' + nf + (nf === 1 ? ' órgão' : ' órgãos') : '') + ', em um plano com indicadores e a origem de cada ideia.' : 'Escolha boas práticas na pesquisa ou responda às perguntas para montar o prédio.') + '</p>' +
      (n ? '<ul class="confere">' + it(comEixo.length === 3, comEixo.length === 3 ? 'Os 3 eixos têm pelo menos uma ação.' : 'Só ' + comEixo.length + ' de 3 eixos têm ação.') +
        it(!semMed.length, semMed.length ? 'Sem ação de medição em ' + nomes(semMed) + '. É ela que permite comprovar a meta.' : 'Os 3 eixos têm ação de medição, que é o que permite comprovar a meta.') +
        it(!semResp && !semPrazo, semResp || semPrazo ? 'Faltam ' + semResp + (semResp === 1 ? ' responsável e ' : ' responsáveis e ') + semPrazo + (semPrazo === 1 ? ' prazo' : ' prazos') + '. Dá para preencher na tela Plano ou imprimir e completar à caneta.' : 'Todas as ações têm responsável e prazo.') + '</ul>' : '') +
      '<div class="campo"><label for="i-org">Nome do órgão</label><input id="i-org" data-campo="nome" value="' + esc(o.nome) + '"></div>' +
      '<div class="campo"><label for="i-ciclo">Ciclo do plano</label><input id="i-ciclo" data-campo="ciclo" value="' + esc(o.ciclo || '') + '" placeholder="por exemplo: 2027 a 2029"></div>' +
      '<fieldset class="opcoes"><legend>O que entra no documento</legend>' +
      '<label><input type="checkbox" data-imp="origem"' + (op.origem ? ' checked' : '') + '> De onde veio cada ação</label><label><input type="checkbox" data-imp="indicador"' + (op.indicador ? ' checked' : '') + '> Indicador sugerido para cada ação</label></fieldset>' +
      '<a class="regua-link" href="#/regua">' + ico('plano', 20) + '<span><b>' + (op.regua && REGUAS[op.regua] ? 'Anexo incluído: ' + REGUAS[op.regua].pil : 'Conferir com a norma do seu órgão') + '</b>Veja quais temas da norma o plano cobre e leve a correspondência como anexo.</span></a>' +
      '<div class="acoes"><button class="btn" data-act="imprimir">' + ico('imprimir', 18) + 'Imprimir ou salvar PDF</button><a class="btn linha" href="#/plano">Preencher responsáveis</a></div></div>' +
      '<article class="papel" aria-label="Prévia do plano para impressão"><div class="p-sobre">Plano de Logística Sustentável</div><div class="p-org" id="p-org">' + (esc(o.nome) || '[NOME DO ÓRGÃO]') + '</div>' +
      '<div class="p-linha"><span id="p-ciclo">Ciclo ' + (esc(o.ciclo) || '[ANO INICIAL] a [ANO FINAL]') + '</span> · ' + (comEixo.length ? 'eixos ' + comEixo.map(function (e) { return EIXOS[e].curto.toLowerCase(); }).join(', ') + ' · ' : '') + n + (n === 1 ? ' ação' : ' ações') + '</div>' +
      (secoes || '<p class="p-vazio">Nenhuma ação escolhida ainda.</p>') +
      '<div class="p-pe">Ações escolhidas com apoio do levantamento de ' + BASE.length + ' iniciativas de ' + predios().length + ' órgãos e unidades, feito pelo grupo de pesquisa “Ministério Público da União Verde” (ESMPU, Edital nº 162/2024).</div>' +
      (op.regua && REGUAS[op.regua] ? '<div class="p-anexo">' + anexoRegua(op.regua) + '</div>' : '') + '</article></section>';
  }

  // ---------------------------------------------------------------- a rua por baixo (comparar consumo)
  var C = { eixo: 'energia', base: 'pessoa' };
  var VIZ = { // consumo anual dos 12 vizinhos de exemplo
    energia: { pessoa: [1600, 1800, 2000, 2100, 2400, 2600, 2700, 2900, 3400, 3700, 4100, 4600], m2: [48, 55, 61, 66, 72, 79, 85, 92, 104, 115, 128, 141] },
    agua: { pessoa: [6.1, 7.4, 8.2, 9, 9.8, 11, 12.3, 13.5, 15.2, 17, 19.4, 22], m2: [0.21, 0.26, 0.3, 0.34, 0.38, 0.43, 0.48, 0.55, 0.63, 0.72, 0.84, 0.97] },
    residuos: { pessoa: [12, 15, 17, 20, 23, 26, 29, 33, 38, 44, 51, 60], m2: [0.5, 0.6, 0.7, 0.9, 1, 1.2, 1.3, 1.5, 1.8, 2.1, 2.5, 3] }
  };
  function unComp() {
    var u = { energia: { pessoa: ['MWh por pessoa', 1000, 1], m2: ['kWh por m²', 1, 0] }, agua: { pessoa: ['m³ por pessoa', 1, 1], m2: ['litros por m²', 0.001, 0] }, residuos: { pessoa: ['kg por pessoa', 1, 0], m2: ['kg por m²', 1, 1] } };
    return u[C.eixo][C.base];
  }
  function anual(k) { // consumo do ano: projeção dos lançamentos; sem eles, o ano-base do exemplo
    var ms = Object.keys(S.lanc).sort(), ano = ms.length ? ms[ms.length - 1].slice(0, 4) : null, soma = 0, n = 0;
    if (ano) ms.forEach(function (m) {
      if (m.slice(0, 4) !== ano) return; var l = S.lanc[m], v = k === 'residuos' ? ((l.recic || 0) + (l.organ || 0) + (l.rejeito || 0)) || null : l[k];
      if (v != null) { soma += v; n++; }
    });
    if (n) return { v: soma / n * 12, de: 'projeção de ' + ano + ', com ' + n + (n === 1 ? ' mês lançado' : ' meses lançados') };
    if (S.exemplo) return { v: BASE_ESMPU[k].valor, de: 'consumo de 2025' };
    return null;
  }
  function vizinhos() { // planos de exemplo: quem gasta menos tem mais ações
    return 'ABCDEFGHIJKL'.split('').map(function (L, i) {
      var r = rng(hashTxt('viz' + L)), cats = CATALOGO.filter(function (c) { return r() < (/-monit$/.test(c.id) ? 1.15 - i * 0.1 : 0.85 - i * 0.055); }).map(function (c) { return c.id; });
      return { nome: L, cats: cats, v: VIZ[C.eixo][C.base][i] };
    });
  }
  function vComparar() {
    var E = EIXOS[C.eixo], un = unComp(), a = anual(C.eixo), den = num(C.base === 'pessoa' ? S.org.pessoas : S.org.area), meu = a && den > 0 ? a.v / den : null;
    var viz = vizinhos(), fila = viz.map(function (z) { return { nome: z.nome, cats: z.cats, v: z.v }; });
    if (meu != null) fila.push({ eu: true, v: meu });
    fila.sort(function (x, y) { return x.v - y.v; });
    if (meu == null) fila.push({ eu: true, v: null });
    function nv(v) { return (v / un[1]).toFixed(un[2]).replace('.', ','); }
    var abaixo = meu == null ? 0 : viz.filter(function (z) { return z.v < meu; }).length;
    var oq = { energia: 'energia', agua: 'água', residuos: 'resíduos' }[C.eixo], por = C.base === 'pessoa' ? 'por pessoa' : 'por m²';
    var tit = meu == null ? 'Falta um número para o seu prédio entrar na fila.' : abaixo === 0 ? 'Ninguém na rua ' + (C.eixo === 'residuos' ? 'gera menos ' : 'gasta menos ') + oq + ' ' + por + ' que você.' :
      'Você ' + (C.eixo === 'residuos' ? 'gera mais ' : 'gasta mais ') + oq + ' ' + por + ' que ' + abaixo + ' dos 12 vizinhos.';
    var sub = meu == null ? (a ? 'Informe ' + (C.base === 'pessoa' ? 'quantas pessoas usam o prédio' : 'a área do prédio') + ' e a conta sai sozinha.' : 'Lance pelo menos um mês de ' + oq + ' na tela Lançar.') :
      'A rua está em fila, de quem gasta menos para quem gasta mais. O número é o consumo do ano em ' + un[0] + ' (o seu: ' + a.de + ').';
    // desenho
    var chao = 176, x0 = 96, vaga = 50, bw = 34, maxv = Math.max.apply(null, fila.map(function (f) { return f.v || 0; })), esc2 = 150 / maxv, s = '', f = ' font-family="IBM Plex Sans, sans-serif"';
    s += '<text x="0" y="' + (chao - 40) + '" font-size="11" font-weight="700" letter-spacing="1" fill="#A9B8CA"' + f + '>EM CIMA</text><text x="0" y="' + (chao - 25) + '" font-size="11.5" fill="#A9B8CA"' + f + '>o que cada</text><text x="0" y="' + (chao - 11) + '" font-size="11.5" fill="#A9B8CA"' + f + '>um faz</text>' +
      '<text x="0" y="' + (chao + 28) + '" font-size="11" font-weight="700" letter-spacing="1" fill="' + E.cor + '"' + f + '>EMBAIXO</text><text x="0" y="' + (chao + 43) + '" font-size="11.5" fill="#A9B8CA"' + f + '>o que cada</text><text x="0" y="' + (chao + 57) + '" font-size="11.5" fill="#A9B8CA"' + f + '>um ' + (C.eixo === 'residuos' ? 'gera' : 'gasta') + '</text>';
    fila.forEach(function (p, i) {
      var x = x0 + i * vaga, bx = x + (vaga - bw) / 2, cores = (p.eu ? S.plano.map(function (q) { return EIXOS[eixoDe(q)].cor; }) : p.cats.map(function (id) { return EIXOS[cat(id).eixo].cor; }));
      var andares = Math.max(2, Math.ceil(cores.length / 2)), h = andares * 15 + 10;
      s += '<rect x="' + bx + '" y="' + (chao - h) + '" width="' + bw + '" height="' + h + '" rx="2.5" fill="#16263B" stroke="' + (p.eu ? '#FFC53D' : '#7C93B3') + '" stroke-width="' + (p.eu ? 2.5 : 1) + '"/>';
      for (var j = 0; j < andares * 2; j++) s += '<rect x="' + (bx + 6 + (j % 2) * 12) + '" y="' + (chao - h + 7 + Math.floor(j / 2) * 15) + '" width="9.5" height="9.5" rx="1.5" fill="' + (cores[j] || '#1F3352') + '"/>';
      s += '<text x="' + (x + vaga / 2) + '" y="' + (chao - h - 8) + '" text-anchor="middle" font-size="' + (p.eu ? 11.5 : 10.5) + '" font-weight="' + (p.eu ? 700 : 500) + '" fill="' + (p.eu ? '#FFC53D' : '#A9B8CA') + '"' + f + '>' + (p.eu ? 'o seu' : p.nome) + '</text>';
      if (p.v == null) { s += '<rect x="' + (bx + 4) + '" y="' + (chao + 6) + '" width="' + (bw - 8) + '" height="60" rx="3" fill="none" stroke="#FFC53D" stroke-width="1.5" stroke-dasharray="3 3"/><text x="' + (x + vaga / 2) + '" y="' + (chao + 84) + '" text-anchor="middle" font-size="13" font-weight="700" fill="#FFC53D"' + f + '>?</text>'; return; }
      var d = Math.max(4, p.v * esc2);
      s += '<rect x="' + (bx + 4) + '" y="' + (chao + 6) + '" width="' + (bw - 8) + '" height="' + d.toFixed(0) + '" rx="3" fill="' + E.cor + '" opacity="' + (p.eu ? 1 : meu != null && p.v > meu ? 0.5 : 0.85) + '"/>' +
        '<text x="' + (x + vaga / 2) + '" y="' + (chao + 6 + d + 16).toFixed(0) + '" text-anchor="middle" font-size="12" font-weight="' + (p.eu ? 700 : 500) + '" fill="' + (p.eu ? '#FFC53D' : '#F4F7FB') + '"' + f + '>' + nv(p.v) + '</text>';
      if (p.eu && S.exemplo && C.eixo !== 'residuos') {
        var alvo = p.v * 0.85, ya = chao + 6 + alvo * esc2;
        s += '<path d="M' + (bx - 3) + ' ' + ya.toFixed(0) + 'h' + (bw + 6) + '" stroke="#F4F7FB" stroke-width="2.5"/><text x="' + (x + vaga / 2) + '" y="' + (chao + 6 + d + 32).toFixed(0) + '" text-anchor="middle" font-size="11.5" font-weight="600" fill="#F4F7FB"' + f + '>meta 2028:</text>' +
          '<text x="' + (x + vaga / 2) + '" y="' + (chao + 6 + d + 46).toFixed(0) + '" text-anchor="middle" font-size="11.5" font-weight="600" fill="#F4F7FB"' + f + '>' + nv(alvo) + '</text>';
      }
    });
    var vs = viz.map(function (z) { return z.v; }).sort(function (x, y) { return x - y; }), med = (vs[5] + vs[6]) / 2, ym = chao + 6 + med * esc2;
    s += '<path d="M86 ' + chao + 'H760" stroke="#2F4666" stroke-width="2"/><path d="M86 ' + ym.toFixed(0) + 'H760" stroke="#A9B8CA" stroke-width="1" stroke-dasharray="2 5"/>' +
      '<text x="0" y="' + (ym - 3).toFixed(0) + '" font-size="11.5" fill="#A9B8CA"' + f + '>metade da rua</text><text x="0" y="' + (ym + 11).toFixed(0) + '" font-size="11.5" fill="#A9B8CA"' + f + '>' + (C.eixo === 'residuos' ? 'gera' : 'gasta') + ' até aqui</text>';
    // o que os 4 mais econômicos têm em comum
    var top4 = viz.slice(0, 4), comuns = CATALOGO.filter(function (c) { return c.eixo === C.eixo; }).map(function (c) { return { c: c, n: top4.filter(function (z) { return z.cats.indexOf(c.id) >= 0; }).length }; })
      .filter(function (o) { return o.n >= 2; }).sort(function (x, y) { return y.n - x.n || y.c.registros - x.c.registros; }).slice(0, 3);
    var falta = comuns.filter(function (o) { return !S.plano.some(function (q) { return q.cat === o.c.id; }) && o.c.registros; })[0];
    var li = comuns.map(function (o) {
      var tem = S.plano.some(function (q) { return q.cat === o.c.id; });
      return '<li><b>' + o.n + ' de 4</b><span>têm “' + esc(o.c.nome) + '” no plano<em class="' + (tem ? 'ok' : 'falta') + '">' + ico(tem ? 'check' : 'aviso', 14) + (tem ? 'Você já tem essa ação' : 'Você ainda não tem essa ação') + '</em></span></li>';
    }).join('');
    var pede = meu == null && a ? '<div class="pede"><label for="c-den">' + (C.base === 'pessoa' ? 'Quantas pessoas usam o prédio, em média?' : 'Qual a área do prédio, em m²?') + '</label><div><input id="c-den" inputmode="numeric" data-campo="' + (C.base === 'pessoa' ? 'pessoas' : 'area') + '" value="' + esc(C.base === 'pessoa' ? S.org.pessoas : S.org.area || '') + '"><button class="btn" data-act="redesenhar">Entrar na fila</button></div></div>' :
      meu == null ? '<div class="pede"><a class="btn" href="#/lancar">Lançar um mês ' + ico('seta', 18) + '</a></div>' : '';
    return topo() + '<div class="modo" role="group" aria-label="Modo da rua"><a href="#/rua">O que falta no meu prédio</a><a href="#/rua/comparar" aria-current="page">Como estou perto dos outros</a></div>' +
      '<span class="tag-ex">Vizinhos e consumo deles: números de exemplo</span>' +
      '<section class="comp-topo"><h1>' + tit + '</h1><p>' + sub + '</p>' + pede + '</section>' +
      '<div class="pils" role="group" aria-label="Eixo e medida">' + ORD.map(function (e) { return '<button class="pil" style="--c:' + EIXOS[e].cor + '" aria-pressed="' + (C.eixo === e) + '" data-act="ceixo" data-v="' + e + '">' + ico(EIXOS[e].icone, 16) + esc(EIXOS[e].curto) + '</button>'; }).join('') +
      '<i class="sep" aria-hidden="true"></i><button class="pil" style="--c:#F4F7FB" aria-pressed="' + (C.base === 'pessoa') + '" data-act="cbase" data-v="pessoa">por pessoa</button><button class="pil" style="--c:#F4F7FB" aria-pressed="' + (C.base === 'm2') + '" data-act="cbase" data-v="m2">por m²</button></div>' +
      '<section class="comp-grade"><svg class="rua-svg" role="img" aria-label="Prédios em fila do que gasta menos para o que gasta mais. Em cima do chão, as ações de cada um; embaixo, o consumo em ' + un[0] + '." viewBox="0 0 770 400">' + s + '</svg>' +
      '<aside><h2>O que os 4 que menos gastam têm em comum</h2><p class="suave">Planos de exemplo. As práticas que o botão abre são reais, da base da pesquisa.</p><ul class="comum">' + li + '</ul>' +
      (falta ? '<button class="btn" style="width:100%;justify-content:center" data-act="verpraticas" data-cat="' + falta.c.id + '">Ver práticas de “' + esc(falta.c.nome) + '” ' + ico('seta', 18) + '</button>' : '<a class="btn" style="width:100%;justify-content:center" href="#/pesquisa">Ver as boas práticas ' + ico('seta', 18) + '</a>') +
      '<p class="suave" style="font-size:12px;margin-top:12px">Na versão completa os números viriam dos lançamentos de cada órgão e, para os tribunais, da base pública do Balanço da Sustentabilidade do CNJ.</p></aside></section>';
  }

  // ---------------------------------------------------------------- a régua da norma
  var REGUAS = {
    cnj: { pil: 'Judiciário · CNJ 400', doc: 'Resolução CNJ nº 400/2021', frase: 'temas que o CNJ mede', nota: 'Temas 2 a 20 do Anexo da Resolução CNJ nº 400/2021 (versão compilada de 2025).',
      temas: ['Papel', 'Copos descartáveis', 'Água envasada em embalagem plástica', 'Impressão', 'Energia elétrica', 'Água e esgoto', 'Gestão de resíduos', 'Reformas e construções', 'Limpeza', 'Vigilância', 'Telefonia', 'Veículos', 'Combustível', 'Apoio ao serviço administrativo', 'Aquisições e contratações', 'Qualidade de vida', 'Capacitação em sustentabilidade', 'Equidade e diversidade', 'Programa Justiça Carbono Zero'] },
    pdls: { pil: 'Executivo · PDLS', doc: 'Portaria Seges/ME nº 8.678/2021', frase: 'eixos do Plano Diretor de Logística Sustentável', nota: 'Seis eixos temáticos do Caderno de Logística do PDLS (MGI, versão 1.1, 2024).',
      temas: ['Racionalização e consumo consciente de bens e serviços', 'Racionalização da ocupação dos espaços físicos', 'Identificação dos objetos de menor impacto ambiental', 'Fomento à inovação no mercado', 'Inclusão dos negócios de impacto nas contratações públicas', 'Divulgação, conscientização e capacitação'] },
    a3p: { pil: 'A3P · 6 eixos', doc: 'Agenda Ambiental na Administração Pública (A3P)', frase: 'eixos da A3P', nota: 'Seis eixos temáticos do programa A3P, do Ministério do Meio Ambiente.',
      temas: ['Uso racional dos recursos naturais e bens públicos', 'Gestão adequada dos resíduos gerados', 'Qualidade de vida no ambiente de trabalho', 'Sensibilização e capacitação dos servidores', 'Compras públicas sustentáveis', 'Construções sustentáveis'] }
  };
  var RG = { escrevendo: null };
  function temaDe(id, a) {
    var t = semAcento(a.titulo), e = eixoDe(a), T = REGUAS[id].temas;
    if (id === 'cnj') {
      if (/copo/.test(t)) return T[1]; if (/papel|papeis|resma/.test(t)) return T[0]; if (/impress/.test(t)) return T[3]; if (/envasad|garraf|agua mineral/.test(t)) return T[2];
      return e === 'energia' ? T[4] : e === 'agua' ? T[5] : T[6];
    }
    if (id === 'pdls') return /-compras$/.test(a.cat) ? T[2] : /-camp$/.test(a.cat) ? T[5] : T[0];
    return /-compras$/.test(a.cat) ? T[4] : /-camp$/.test(a.cat) ? T[3] : e === 'residuos' ? T[1] : T[0];
  }
  function porTema(id) {
    var ex = S.extras || [];
    return REGUAS[id].temas.map(function (tema) {
      return { tema: tema, acoes: S.plano.filter(function (a) { return temaDe(id, a) === tema; }), extras: ex.filter(function (x) { return x.regua === id && x.tema === tema; }) };
    });
  }
  function anexoRegua(id) {
    var R = REGUAS[id], pt = porTema(id), cob = pt.filter(function (o) { return o.acoes.length + o.extras.length; }).length, tot = 0;
    var linhas = pt.map(function (o) {
      var itens = o.acoes.map(function (a) { return esc(a.titulo) + (a.origem ? ' (inspirada no plano de: ' + esc(a.origem) + ')' : ''); }).concat(o.extras.map(function (x) { return esc(x.titulo); }));
      tot += itens.length;
      return '<tr><td><b>' + esc(o.tema) + '</b></td><td>' + (itens.length ? itens.join(' · ') : '<span class="p-sem">Sem ação neste plano</span>') + '</td></tr>';
    }).join('');
    return '<div class="p-sobre">Plano de Logística Sustentável · ' + (esc(S.org.nome) || '[NOME DO ÓRGÃO]') + ' · anexo</div><div class="p-org" style="font-size:21px">Correspondência com: ' + esc(R.doc) + '</div>' +
      '<div class="p-linha">' + cob + ' de ' + R.temas.length + ' temas com ação · ' + tot + (tot === 1 ? ' ação' : ' ações') + '</div>' +
      '<table><thead><tr><th style="width:32%">Tema da norma</th><th>Ações deste plano</th></tr></thead><tbody>' + linhas + '</tbody></table>' +
      '<div class="p-pe">' + esc(R.nota) + ' A correspondência entre ação e tema é uma sugestão do Prédio Vivo e deve ser conferida pelo órgão.</div>';
  }
  function vRegua(id) {
    if (!REGUAS[id]) id = (S.imp && S.imp.regua) || 'cnj';
    var R = REGUAS[id], pt = porTema(id), cob = pt.filter(function (o) { return o.acoes.length + o.extras.length; }).length, dentro = S.imp && S.imp.regua === id;
    var li = pt.map(function (o, i) {
      var n = o.acoes.length + o.extras.length;
      var jan = o.acoes.map(function (a) { return '<i style="background:' + EIXOS[eixoDe(a)].cor + '" title="' + esc(a.titulo) + '"></i>'; }).join('') + o.extras.map(function (x) { return '<i class="ex" title="' + esc(x.titulo) + '"></i>'; }).join('') || '<i class="vz"></i>';
      var lado = RG.escrevendo === i ? '' : '<span class="qt">' + (n ? n + (n === 1 ? ' ação' : ' ações') : '') + '</span><button class="lk" data-act="rescrever" data-i="' + i + '">' + ico('lapis', 15) + (n ? 'Mais uma' : 'Escrever uma ação') + '</button>';
      var form = RG.escrevendo === i ? '<div class="novo"><label for="r-novo" class="oculto">Ação para o tema ' + esc(o.tema) + '</label><input id="r-novo" placeholder="Escreva a ação com as suas palavras"><button class="btn peq" data-act="rsalvar" data-i="' + i + '" data-r="' + id + '">Acrescentar</button><button class="lk" data-act="rescrever" data-i="-1">Cancelar</button></div>' : '';
      var exl = o.extras.map(function (x) { return '<div class="exl"><span>' + esc(x.titulo) + '</span><button class="rm" aria-label="Remover: ' + esc(x.titulo) + '" data-act="rremover" data-id="' + x.id + '">' + ico('lixeira', 16) + '</button></div>'; }).join('');
      return '<li class="' + (n ? 'on' : '') + '"><div class="ln"><span class="nm">' + esc(o.tema) + '</span><span class="js">' + jan + '</span>' + lado + '</div>' + form + exl + '</li>';
    }).join('');
    return '<header class="topo">' + marca() + '<a href="#/imprimir" style="font-size:14px;font-weight:600">Voltar ao plano para imprimir</a></header>' +
      '<section class="imp-grade regua-grade"><div><h1 class="t-regua">Seu plano cobre ' + cob + ' dos ' + R.temas.length + ' ' + R.frase + '.</h1>' +
      '<p class="lead" style="margin:8px 0 12px;font-size:14.5px;color:var(--suave)">Escolha a régua do seu órgão. Cada andar é um tema da norma; as janelas são as ações do seu plano que respondem a ele.</p>' +
      '<div class="pils" role="group" aria-label="Régua">' + Object.keys(REGUAS).map(function (k) { return '<a class="pil" style="--c:#F4F7FB" href="#/regua/' + k + '"' + (k === id ? ' aria-current="page"' : '') + '>' + REGUAS[k].pil + '</a>'; }).join('') + '</div>' +
      '<ul class="regua">' + li + '</ul>' +
      '<p class="suave" style="font-size:12.5px;line-height:1.45;margin:10px 0 0">Andares apagados são temas que a pesquisa não levantou (ela cobre energia, água e resíduos). A ação pode ser escrita à mão; janela branca é ação escrita por você. ' + esc(R.nota) + '</p></div>' +
      '<div><article class="papel" style="min-height:0" aria-label="Prévia do anexo de correspondência com a norma">' + anexoRegua(id) + '</article>' +
      '<div class="acoes" style="margin-top:16px;align-items:center"><button class="btn' + (dentro ? ' linha' : '') + '" data-act="rincluir" data-r="' + id + '">' + ico(dentro ? 'check' : 'imprimir', 18) + (dentro ? 'Incluído no PLS impresso (tirar)' : 'Incluir no PLS impresso') + '</button><span class="suave" style="font-size:12.5px">Vira a última página do documento.</span></div></div></section>';
  }

  // ---------------------------------------------------------------- o ano em uma página (relatório de desempenho)
  function somaAno(k, ano) {
    var soma = 0, n = 0;
    Object.keys(S.lanc).forEach(function (m) {
      if (m.slice(0, 4) !== ano) return; var l = S.lanc[m], v = k === 'residuos' ? ((l.recic || 0) + (l.organ || 0) + (l.rejeito || 0)) || null : l[k];
      if (v != null) { soma += v; n++; }
    });
    return { soma: soma, n: n };
  }
  function vRelatorio(ano) {
    var anos = {}; Object.keys(S.lanc).forEach(function (m) { anos[m.slice(0, 4)] = 1; }); anos[mesAtual().slice(0, 4)] = 1;
    anos = Object.keys(anos).sort(); if (anos.indexOf(ano) < 0) ano = anos[anos.length - 1];
    var op = S.rel || (S.rel = { acoes: true, metas: true, just: true }), n = S.plano.length, ct = { feito: 0, andamento: 0, planejada: 0, atrasada: 0 };
    S.plano.forEach(function (a) { ct[a.status] = (ct[a.status] || 0) + 1; });
    // mini prédio
    var mp = '', y = 12, maxc = 1;
    ORD.forEach(function (e) {
      var acs = S.plano.filter(function (a) { return eixoDe(a) === e; }); maxc = Math.max(maxc, acs.length);
      acs.forEach(function (a, k) {
        var x = 12 + k * 19, cor = EIXOS[e].cor;
        if (a.status === 'feito') mp += '<rect x="' + x + '" y="' + y + '" width="14" height="14" rx="2" fill="' + cor + '"/><path d="M' + (x + 3) + ' ' + (y + 7.5) + 'l3 3 5-6" fill="none" stroke="#10202F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
        else if (a.status === 'andamento') mp += '<rect x="' + x + '" y="' + y + '" width="14" height="14" rx="2" fill="' + cor + '"/>';
        else if (a.status === 'atrasada') mp += '<rect x="' + (x + 1) + '" y="' + (y + 1) + '" width="12" height="12" rx="2" fill="none" stroke="#C0392B" stroke-width="2"/>';
        else mp += '<rect x="' + (x + 1) + '" y="' + (y + 1) + '" width="12" height="12" rx="2" fill="none" stroke="#9AA7B5" stroke-width="1.5" stroke-dasharray="3 2"/>';
      });
      y += 22;
    });
    var pw = Math.max(90, 24 + maxc * 19);
    var predio = '<svg aria-hidden="true" width="' + pw + '" height="86" viewBox="0 0 ' + pw + ' 86"><rect x="2" y="2" width="' + (pw - 4) + '" height="82" rx="4" fill="#F4F7FB" stroke="#1B2430" stroke-width="1.5"/>' + mp + '</svg>';
    // metas
    var okM = 0, comM = 0, linhasM = ORD.map(function (e) {
      var E = EIXOS[e], sa = somaAno(e, ano), base = S.exemplo ? BASE_ESMPU[e].valor : null, res;
      if (!sa.n) res = '<span class="p-sem">Sem lançamentos em ' + ano + '</span>';
      else if (e === 'residuos') {
        var rec = 0, tot = 0; Object.keys(S.lanc).forEach(function (m) { if (m.slice(0, 4) === ano) { var l = S.lanc[m]; rec += (l.recic || 0) + (l.organ || 0); tot += (l.recic || 0) + (l.organ || 0) + (l.rejeito || 0); } });
        res = '<b>' + fmt(rec / tot * 100) + '% não foram para o aterro</b><small>A meta do plano para resíduos é outra (PGRS e copos) e não se mede por aqui.</small>';
      } else if (base == null) res = '<span class="p-sem">Sem ano-base para comparar</span>';
      else {
        var proj = sa.soma / sa.n * 12, v = (proj - base) / base * 100, marco = S.exemplo ? METAS_ESMPU[e].marcos.filter(function (m) { return String(m[0]) === ano; })[0] : null;
        if (marco) { comM++; var ok = -v >= marco[1]; if (ok) okM++;
          res = '<b style="color:' + (ok ? '#1E7B3C' : '#C0392B') + '">' + (v > 0 ? '+' : '−') + fmt(Math.abs(v), 1) + '% · meta −' + String(marco[1]).replace('.', ',') + '% · ' + (sa.n < 12 ? (ok ? 'no ritmo' : 'fora do ritmo') : (ok ? 'cumprida' : 'não cumprida')) + '</b>';
        } else res = '<b>' + (v > 0 ? '+' : '−') + fmt(Math.abs(v), 1) + '% sobre 2025</b>';
        if (sa.n < 12) res += '<small>Projeção do ano com ' + sa.n + (sa.n === 1 ? ' mês lançado' : ' meses lançados') + '; compara o consumo total, não por pessoa.</small>';
      }
      return '<tr><td><b><span class="q" style="background:' + E.cor + '"></span>' + esc(E.nome) + '</b></td><td>' + (base != null ? fmt(base) + ' ' + E.un : '—') + '</td><td><b>' + (sa.n ? fmt(sa.soma) + ' ' + E.un : '—') + '</b>' + (sa.n && sa.n < 12 ? '<small>' + sa.n + ' de 12 meses</small>' : '') + '</td><td>' + res + '</td></tr>';
    }).join('');
    var linhasA = S.plano.slice().sort(function (a, b) { return ORD.indexOf(eixoDe(a)) - ORD.indexOf(eixoDe(b)); }).map(function (a) {
      var cor = a.status === 'feito' ? '#1E7B3C' : a.status === 'atrasada' ? '#C0392B' : '#1B2430';
      return '<tr><td><b>' + esc(a.titulo) + '</b>' + (a.origem ? '<small>Inspirada no plano de: ' + esc(a.origem) + '</small>' : '') + (op.just && a.status === 'atrasada' ? '<small>Justificativa: ' + (a.just ? esc(a.just) : '[JUSTIFICATIVA DO RESPONSÁVEL]') + '</small>' : '') + '</td><td>' + (a.resp && a.resp !== 'A definir' ? esc(a.resp) : '<i></i>') + '</td><td style="font-weight:700;white-space:nowrap;color:' + cor + '">' + STATUS[a.status].nome + '</td></tr>';
    }).join('');
    var atras = S.plano.filter(function (a) { return a.status === 'atrasada'; });
    var just = op.just ? atras.map(function (a) { return '<div class="campo"><label for="j-' + a.id + '">Por que “' + esc(a.titulo) + '” atrasou?</label><textarea id="j-' + a.id + '" rows="2" data-campo="just" data-id="' + a.id + '">' + esc(a.just || '') + '</textarea></div>'; }).join('') : '';
    function cx(k, t) { return '<label><input type="checkbox" data-rel="' + k + '"' + (op[k] ? ' checked' : '') + '> ' + t + '</label>'; }
    var resumo = '<strong>' + ct.feito + ' de ' + n + (n === 1 ? ' ação feita.' : ' ações feitas.') + '</strong> ' + ct.andamento + ' em andamento, ' + ct.planejada + (ct.planejada === 1 ? ' planejada e ' : ' planejadas e ') + ct.atrasada + (ct.atrasada === 1 ? ' atrasada.' : ' atrasadas.') +
      (comM ? ' ' + okM + ' de ' + comM + (comM === 1 ? ' meta medida' : ' metas medidas') + ' no ano ' + (okM === 1 ? 'está em dia.' : 'estão em dia.') : '');
    return '<header class="topo">' + marca() + '<a href="#/predio" style="font-size:14px;font-weight:600">Voltar ao prédio</a></header>' +
      '<section class="imp-grade"><div class="imp-lado"><h1>O ano do seu prédio em uma página.</h1>' +
      '<p class="lead">O relatório de desempenho se escreve com o que você já lançou: o que foi feito, o que atrasou e se as metas foram cumpridas.</p>' +
      (S.exemplo ? '<p class="tag-ex" style="position:static;display:inline-flex;margin:0 0 14px">Situação das ações da ESMPU: ilustrativa</p>' : '') +
      '<div class="pils" role="group" aria-label="Ano do relatório">' + anos.map(function (a) { return '<a class="pil" style="--c:#F4F7FB" href="#/relatorio/' + a + '"' + (a === ano ? ' aria-current="page"' : '') + '>' + a + '</a>'; }).join('') + '</div>' +
      '<fieldset class="opcoes"><legend>O que entra no relatório</legend>' + cx('acoes', 'Situação de cada ação') + cx('metas', 'Metas por eixo, com o ano-base') + cx('just', 'Justificativa das ações atrasadas') + '</fieldset>' + just +
      '<div class="acoes"><button class="btn" data-act="imprimir">' + ico('imprimir', 18) + 'Imprimir ou salvar PDF</button><a class="btn linha" href="#/lancar">Lançar um mês</a></div></div>' +
      '<article class="papel" aria-label="Prévia do relatório de desempenho"><div class="p-cab"><div><div class="p-sobre">Relatório de desempenho do PLS · ' + ano + '</div><div class="p-org">' + (esc(S.org.nome) || '[NOME DO ÓRGÃO]') + '</div>' +
      '<p class="p-resumo">' + resumo + '</p></div><div class="p-predio">' + predio + '<div>energia · resíduos · água</div></div></div>' +
      (op.metas ? '<h3>Metas do ano</h3><table class="p-metas"><thead><tr><th>Eixo</th><th style="width:19%">' + (S.exemplo ? '2025 (base)' : 'Ano-base') + '</th><th style="width:19%">' + ano + '</th><th style="width:36%">Resultado</th></tr></thead><tbody>' + linhasM + '</tbody></table>' : '') +
      (op.acoes ? '<h3>O que mudou no prédio</h3><table><thead><tr><th>Ação</th><th class="c3">Quem responde</th><th class="c4" style="width:20%">Situação</th></tr></thead><tbody>' + linhasA + '</tbody></table>' : '') +
      '<div class="p-pe">Gerado no Prédio Vivo a partir do plano e dos lançamentos mensais do órgão.' + (S.exemplo ? ' Metas do PLS 2026–2028 da ESMPU, em relação a 2025.' : '') + '</div></article></section>';
  }

  // ---------------------------------------------------------------- lançar
  var NOMES_MES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  function mesAtual() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2); }
  function vLancar(mes) {
    if (!/^\d{4}-\d{2}$/.test(mes || '')) mes = mesAtual();
    var l = S.lanc[mes] || {}, ano = mes.slice(0, 4), m = parseInt(mes.slice(5), 10);
    function campo(k, eixo, rot, un, peq) {
      var E = EIXOS[eixo];
      return '<div class="num' + (peq ? ' peq' : '') + '" style="--c:' + E.cor + '"><label for="l-' + k + '">' + (peq ? '' : ico(E.icone, 18)) + rot + '</label><div class="cx"><input id="l-' + k + '" data-l="' + k + '" inputmode="decimal" value="' + (l[k] != null ? fmt(l[k], 2) : '') + '" placeholder="0"><span>' + un + '</span></div></div>';
    }
    var meses = '';
    for (var i = 1; i <= 12; i++) { var ch = ano + '-' + ('0' + i).slice(-2); meses += '<span class="' + (S.lanc[ch] ? 'ok' : i === m ? 'atual' : '') + '" title="' + NOMES_MES[i - 1] + '"></span>'; }
    var feitos = Object.keys(S.lanc).filter(function (k) { return k.slice(0, 4) === ano; }).length;
    return topo() + '<section class="lancar"><h1>Oi, ' + esc(S.org.nome || 'pessoal') + '.<br><span>Só alguns números.</span></h1>' +
      '<div class="campo" style="margin-top:14px"><label for="l-mes">Mês do lançamento</label><input id="l-mes" type="month" data-act-change="mes" value="' + mes + '"></div>' +
      campo('energia', 'energia', 'Energia da fatura', 'kWh') + campo('agua', 'agua', 'Água da fatura', 'm³') +
      '<div class="sobre" style="color:var(--re);margin-top:22px">' + ico('recicla', 16) + 'Resíduos pesados no mês</div><div class="tres">' +
      campo('recic', 'residuos', 'Recicláveis', 'kg', 1) + campo('organ', 'residuos', 'Orgânicos', 'kg', 1) + campo('rejeito', 'residuos', 'Rejeitos', 'kg', 1) + '</div>' +
      '<div class="campo" style="margin-top:18px"><label for="l-pes">Pessoas no prédio (média do mês)</label><input id="l-pes" data-l="pessoas" inputmode="numeric" value="' + esc(l.pessoas != null ? l.pessoas : S.org.pessoas) + '" placeholder="para calcular o consumo por pessoa"></div>' +
      '<div class="calc" id="calc" aria-live="polite"></div>' +
      '<div class="cartao" style="margin-top:18px"><b style="font-weight:600">' + feitos + (feitos === 1 ? ' mês lançado' : ' meses lançados') + ' em ' + ano + '</b><div class="meses" role="img" aria-label="' + feitos + ' de 12 meses lançados em ' + ano + '">' + meses + '</div><small class="suave">Cada mês em dia mantém as janelas de medição acesas.</small></div>' +
      (aviso ? '<div class="toast" role="status">' + aviso + '</div>' : '') +
      '<div class="acoes" style="margin-top:18px"><button class="btn" style="flex:1;height:56px;font-size:16px" data-act="enviar" data-mes="' + mes + '">Enviar e acender ' + ico('seta', 18) + '</button></div></section>';
  }
  function lerLanc() {
    var o = {};
    app.querySelectorAll('[data-l]').forEach(function (i) { var v = num(i.value); if (isFinite(v)) o[i.getAttribute('data-l')] = v; });
    return o;
  }
  function calcular() {
    var c = document.getElementById('calc'); if (!c) return;
    var o = lerLanc(), p = o.pessoas, tot = (o.recic || 0) + (o.organ || 0) + (o.rejeito || 0);
    function b(r, v, un) { return '<div><small>' + r + '</small><b>' + v + '</b> <span class="suave" style="font-size:13px">' + un + '</span></div>'; }
    c.innerHTML = b('Energia por pessoa', p && o.energia != null ? fmt(o.energia / p, 1) : '—', 'kWh') + b('Água por pessoa', p && o.agua != null ? fmt(o.agua / p, 2) : '—', 'm³') +
      b('Resíduos gerados', tot ? fmt(tot, 1) : '—', 'kg') + b('Desvio de aterro', tot ? fmt(((o.recic || 0) + (o.organ || 0)) / tot * 100) : '—', '%');
  }

  // ---------------------------------------------------------------- roteamento
  function rota() { var h = location.hash.replace(/^#\/?/, '').split('/'); return { nome: h[0] || '', arg: h[1] || '' }; }
  function desenhar(manterFoco) {
    var r = rota(), html;
    if (r.nome === 'montar') html = vMontar(r.arg);
    else if (r.nome === 'predio') html = vPredio();
    else if (r.nome === 'plano') html = vPlano();
    else if (r.nome === 'rua') html = r.arg === 'comparar' ? vComparar() : vRua(r.arg);
    else if (r.nome === 'regua') html = vRegua(r.arg);
    else if (r.nome === 'relatorio') html = vRelatorio(r.arg);
    else if (r.nome === 'lancar') html = vLancar(r.arg);
    else if (r.nome === 'pesquisa') html = vPesquisa();
    else if (r.nome === 'imprimir') html = vImprimir();
    else { r.nome = ''; html = vAbertura(); }
    app.innerHTML = html; dica.hidden = true;
    var itens = [['predio', 'Prédio', 'predio'], ['plano', 'Plano', 'plano'], ['lancar', 'Lançar', 'lancar'], ['rua', 'A rua', 'rua'], ['pesquisa', 'A pesquisa', 'pesquisa']];
    doca.hidden = r.nome === '' || r.nome === 'montar' || r.nome === 'imprimir' || r.nome === 'regua' || r.nome === 'relatorio';
    document.body.className = r.nome === 'imprimir' || r.nome === 'relatorio' ? 'imp' : '';
    doca.innerHTML = itens.map(function (i) { return '<a href="#/' + i[0] + '"' + (r.nome === i[0] ? ' aria-current="page"' : '') + '>' + ico(i[2], 19) + i[1] + '</a>'; }).join('');
    if (r.nome === 'lancar') calcular();
    aviso = '';
    if (!manterFoco) { window.scrollTo(0, 0); }
  }
  function mudar() { salvar(); desenhar(true); }
  function novoId() { return 'a' + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36); }

  app.addEventListener('click', function (ev) {
    var el = ev.target.closest('[data-act]'); if (!el) return;
    var act = el.getAttribute('data-act'), id = el.getAttribute('data-id'), c = el.getAttribute('data-cat');
    if (act === 'alternar') {
      if (S.plano.some(function (a) { return a.cat === c; })) S.plano = S.plano.filter(function (a) { return a.cat !== c; });
      else S.plano.push({ id: novoId(), cat: c, titulo: cat(c).nome, resp: 'A definir', status: 'planejada' });
      mudar();
      var b = app.querySelector('[data-act="alternar"][data-cat="' + c + '"]'); if (b) b.focus();
    } else if (act === 'zerar') { S = { org: S.org, plano: [], lanc: {}, exemplo: false }; salvar(); location.hash = '#/montar/1'; }
    else if (act === 'exemplo') { S = exemplo(); selecionada = null; mudar(); }
    else if (act === 'abrir') { selecionada = selecionada === id && el.tagName !== 'BUTTON' ? null : id; desenhar(true); }
    else if (act === 'status') { S.plano.forEach(function (a) { if (a.id === id) a.status = el.getAttribute('data-st'); }); mudar(); }
    else if (act === 'remover') { S.plano = S.plano.filter(function (a) { return a.id !== id; }); mudar(); }
    else if (act === 'imprimir') window.print();
    else if (act === 'ceixo') { C.eixo = el.getAttribute('data-v'); desenhar(true); }
    else if (act === 'cbase') { C.base = el.getAttribute('data-v'); desenhar(true); }
    else if (act === 'redesenhar') { salvar(); desenhar(true); }
    else if (act === 'rescrever') { var ri = parseInt(el.getAttribute('data-i'), 10); RG.escrevendo = ri < 0 ? null : ri; desenhar(true); var rn = document.getElementById('r-novo'); if (rn) rn.focus(); }
    else if (act === 'rsalvar') { var rv = document.getElementById('r-novo'), rid = el.getAttribute('data-r'); if (rv && rv.value.trim()) { S.extras = S.extras || []; S.extras.push({ id: novoId(), regua: rid, tema: REGUAS[rid].temas[parseInt(el.getAttribute('data-i'), 10)], titulo: rv.value.trim() }); S.imp = S.imp || { origem: true, indicador: true }; S.imp.regua = rid; RG.escrevendo = null; salvar(); desenhar(true); } else if (rv) rv.focus(); }
    else if (act === 'rremover') { S.extras = (S.extras || []).filter(function (x) { return x.id !== el.getAttribute('data-id'); }); salvar(); desenhar(true); }
    else if (act === 'rincluir') { S.imp = S.imp || { origem: true, indicador: true }; S.imp.regua = S.imp.regua === el.getAttribute('data-r') ? null : el.getAttribute('data-r'); salvar(); desenhar(true); }
    else if (act === 'peixo') { var ve = el.getAttribute('data-v'); P = { eixo: ve || null, tipo: null, busca: '', sel: null, tudo: false }; desenhar(true); }
    else if (act === 'ptipo') { var vt = el.getAttribute('data-v'); P.tipo = P.tipo === vt ? null : vt; P.sel = null; P.tudo = false; desenhar(true); }
    else if (act === 'pbusca') { P = { eixo: null, tipo: null, busca: el.getAttribute('data-v'), sel: null, tudo: false }; desenhar(true); }
    else if (act === 'ptudo') { P.tudo = !P.tudo; desenhar(true); }
    else if (act === 'janela') { var ji = parseInt(el.getAttribute('data-i'), 10); P.sel = P.sel === ji ? null : ji; desenhar(true); }
    else if (act === 'por') { alternaBase(parseInt(el.getAttribute('data-i'), 10)); desenhar(true); var bp = app.querySelector('[data-act="por"][data-i="' + el.getAttribute('data-i') + '"]'); if (bp) bp.focus(); }
    else if (act === 'verpraticas') { P = { eixo: cat(c).eixo, tipo: c, busca: '', sel: null, tudo: true }; location.hash = '#/pesquisa'; }
    else if (act === 'baixar') {
      var blob = new Blob([JSON.stringify({ orgao: S.org, plano: S.plano.map(function (a) { var k = cat(a.cat); return { eixo: EIXOS[k.eixo].nome, tipo: k.oficial, acao: a.titulo, responsavel: a.resp, situacao: STATUS[a.status].nome, indicador: k.indicador }; }), lancamentos: S.lanc }, null, 2)], { type: 'application/json' });
      var u = URL.createObjectURL(blob), aEl = document.createElement('a'); aEl.href = u; aEl.download = 'pls-' + (S.org.nome || 'orgao').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.json'; aEl.click(); setTimeout(function () { URL.revokeObjectURL(u); }, 500);
    } else if (act === 'lacuna') { history.replaceState(null, '', '#/rua/' + c); desenhar(true); var bl = app.querySelector('[data-act="lacuna"][data-cat="' + c + '"]'); if (bl) bl.focus(); }
    else if (act === 'acender') { var n = { id: novoId(), cat: c, titulo: cat(c).nome, resp: 'A definir', status: 'planejada' }; S.plano.push(n); selecionada = n.id; salvar(); location.hash = '#/predio'; }
    else if (act === 'enviar') {
      var o = lerLanc(), mes = el.getAttribute('data-mes');
      if (o.energia == null && o.agua == null && o.recic == null && o.organ == null && o.rejeito == null) { aviso = 'Preencha ao menos um número antes de enviar.'; desenhar(true); return; }
      S.lanc[mes] = o; if (o.pessoas) S.org.pessoas = String(o.pessoas);
      aviso = 'Lançamento de ' + NOMES_MES[parseInt(mes.slice(5), 10) - 1] + ' de ' + mes.slice(0, 4) + ' salvo neste navegador.'; salvar(); desenhar(true);
    }
  });
  app.addEventListener('keydown', function (ev) {
    if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.classList && ev.target.classList.contains('jan')) { ev.preventDefault(); selecionada = ev.target.getAttribute('data-id'); desenhar(true); var j = app.querySelector('.jan.sel'); if (j) j.focus(); }
  });
  app.addEventListener('input', function (ev) {
    var t = ev.target;
    if (t.hasAttribute('data-l')) { calcular(); return; }
    if (t.id === 'p-busca') { P.busca = t.value; P.sel = null; P.tudo = false; desenhar(true); var nb = document.getElementById('p-busca'); if (nb) { nb.focus(); nb.setSelectionRange(nb.value.length, nb.value.length); } return; }
    var campo = t.getAttribute('data-campo'); if (!campo) return;
    if (campo === 'nome') { S.org.nome = t.value; if (t.value !== 'ESMPU') S.exemplo = false; var po = document.getElementById('p-org'); if (po) po.textContent = t.value || '[NOME DO ÓRGÃO]'; }
    else if (campo === 'pessoas') S.org.pessoas = t.value;
    else if (campo === 'area') S.org.area = t.value;
    else if (campo === 'just') S.plano.forEach(function (a) { if (a.id === t.getAttribute('data-id')) a.just = t.value; });
    else if (campo === 'ciclo') { S.org.ciclo = t.value; var pc = document.getElementById('p-ciclo'); if (pc) pc.textContent = 'Ciclo ' + (t.value || '[ANO INICIAL] a [ANO FINAL]'); }
    else if (campo === 'prazo') S.plano.forEach(function (a) { if (a.id === t.getAttribute('data-id')) a.prazo = t.value; });
    else if (campo === 'resp') S.plano.forEach(function (a) { if (a.id === t.getAttribute('data-id')) a.resp = t.value; });
    salvar();
  });
  app.addEventListener('change', function (ev) {
    var t = ev.target;
    if (t.getAttribute('data-campo') === 'status') { S.plano.forEach(function (a) { if (a.id === t.getAttribute('data-id')) a.status = t.value; }); salvar(); }
    if (t.getAttribute('data-act-change') === 'mes' && t.value) location.hash = '#/lancar/' + t.value;
    if (t.getAttribute('data-campo') === 'just') { salvar(); desenhar(true); }
    if (t.hasAttribute('data-rel')) { S.rel = S.rel || {}; S.rel[t.getAttribute('data-rel')] = t.checked; salvar(); desenhar(true); }
    if (t.hasAttribute('data-imp')) { S.imp = S.imp || {}; S.imp[t.getAttribute('data-imp')] = t.checked; salvar(); desenhar(true); }
  });
  var dica = document.createElement('div'); dica.className = 'dica-jan'; dica.hidden = true; dica.setAttribute('role', 'tooltip'); document.body.appendChild(dica);
  function mostraDica(el) {
    var d = el.getAttribute('data-dica'); if (!d) return;
    var p = d.split('|'), r = el.getBoundingClientRect();
    dica.innerHTML = '<b>' + esc(p[0]) + '</b><span>' + esc(p[1]) + '</span>'; dica.hidden = false;
    var w = dica.offsetWidth, x = Math.max(8, Math.min(window.innerWidth - w - 8, r.left + r.width / 2 - w / 2));
    dica.style.left = x + 'px'; dica.style.top = Math.max(8, r.top - dica.offsetHeight - 10) + 'px';
  }
  ['mouseover', 'focusin'].forEach(function (t) { app.addEventListener(t, function (ev) { if (ev.target.classList && ev.target.classList.contains('jan')) mostraDica(ev.target); }); });
  ['mouseout', 'focusout'].forEach(function (t) { app.addEventListener(t, function (ev) { if (ev.target.classList && ev.target.classList.contains('jan')) dica.hidden = true; }); });
  window.addEventListener('scroll', function () { dica.hidden = true; }, { passive: true });
  window.addEventListener('hashchange', function () { desenhar(false); app.focus({ preventScroll: true }); });
  desenhar(false);
})();
