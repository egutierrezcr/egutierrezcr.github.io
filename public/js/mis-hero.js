/* MiS · vocabulario de rutas para el hero del homepage.
   Adaptado del export de Claude Design: colores leidos de las variables CSS
   de .mis-page (via getComputedStyle) para que reaccione al toggle claro/oscuro
   ya existente en el sitio, en vez de usar hex fijos. */
(function () {
  var NS = 'http://www.w3.org/2000/svg';

  function paleta(host) {
    var cs = getComputedStyle(host.closest('.mis-page') || document.documentElement);
    var v = function (name, fallback) { var val = cs.getPropertyValue(name); return val ? val.trim() : fallback; };
    return {
      PAN: v('--mis-panel', '#fff'),
      AZUL: v('--mis-azul', '#1b56d3'),
      AZUR: v('--mis-azur', '#5e93f7'),
      LIN: v('--mis-linea', '#dce4ef'),
      NAVY2: v('--mis-navy2', '#33507f'),
      GRIS: v('--mis-gris', '#93a3b8'),
      VERDE: v('--mis-verde', '#12b981'),
      AMBAR: v('--mis-ambar', '#f5b301')
    };
  }

  function el(t, a, p) { var n = document.createElementNS(NS, t); for (var k in a) n.setAttribute(k, a[k]); if (p) p.appendChild(n); return n; }
  function ruta(x1, y1, x2, y2, q, r) {
    r = r || 10; var mx = x1 + (x2 - x1) * (q === undefined ? .5 : q), s1 = x2 > x1 ? 1 : -1, s2 = y2 > y1 ? 1 : -1;
    if (Math.abs(y2 - y1) < 1) return 'M' + x1 + ' ' + y1 + 'H' + x2;
    if (Math.abs(x2 - x1) < 2 * r) return 'M' + x1 + ' ' + y1 + 'V' + y2;
    return 'M' + x1 + ' ' + y1 + 'H' + (mx - r * s1) + 'Q' + mx + ' ' + y1 + ' ' + mx + ' ' + (y1 + r * s2) + 'V' + (y2 - r * s2) + 'Q' + mx + ' ' + y2 + ' ' + (mx + r * s1) + ' ' + y2 + 'H' + x2;
  }
  function terminal(pa, x, y, col, rr, PAN) { el('circle', { cx: x, cy: y, r: rr || 4.2, fill: PAN, stroke: col, 'stroke-width': 2 }, pa); }

  var idFoto = 0;
  function nodo(pa, n, C) {
    var COL = { activo: C.VERDE, espera: C.AMBAR, frio: C.GRIS };
    var g = el('g', { opacity: 0 }, pa), w = n.w || 132, h = n.h || 58, fuerte = !!n.fuerte;
    el('rect', { x: n.x, y: n.y, width: w, height: h, rx: 7, fill: C.PAN, stroke: fuerte ? C.AZUL : C.LIN, 'stroke-width': fuerte ? 2.2 : 1.8 }, g);
    if (n.foto) {
      var cid = 'mf' + (++idFoto), iw = w - 20, ih = n.fotoAlto || (h - 64);
      var cp = el('clipPath', { id: cid }, g);
      el('rect', { x: n.x + 10, y: n.y + 10, width: iw, height: ih, rx: 4 }, cp);
      el('image', { x: n.x + 10, y: n.y + 10, width: iw, height: ih, href: n.foto, preserveAspectRatio: 'xMidYMid slice', 'clip-path': 'url(#' + cid + ')' }, g);
      el('text', { x: n.x + 13, y: n.y + ih + 30, 'font-family': 'IBM Plex Mono, monospace', 'font-size': 9.5, 'letter-spacing': '1.2', fill: C.NAVY2 }, g).textContent = n.et;
      el('text', { x: n.x + 13, y: n.y + ih + 43, 'font-family': 'IBM Plex Mono, monospace', 'font-size': 9, 'letter-spacing': '1.1', fill: C.GRIS }, g).textContent = n.pie || '';
      el('circle', { cx: n.x + w - 13, cy: n.y + ih + 27, r: 3.8, fill: COL[n.estado] || C.VERDE }, g);
      n.g = g; n.w = w; n.h = h; return g;
    }
    el('text', { x: n.x + 13, y: n.y + 20, 'font-family': 'IBM Plex Mono, monospace', 'font-size': 9.5, 'letter-spacing': '1.3', fill: C.NAVY2 }, g).textContent = n.et;
    var bw = w - 26;
    el('rect', { x: n.x + 13, y: n.y + 30, width: bw * (n.b1 || .62), height: 3.4, rx: 1.7, fill: fuerte ? C.AZUL : C.AZUR }, g);
    el('rect', { x: n.x + 13, y: n.y + 39, width: bw * (n.b2 || .34), height: 3.4, rx: 1.7, fill: C.LIN }, g);
    el('circle', { cx: n.x + w - 12, cy: n.y + 14, r: 3.6, fill: COL[n.estado] || C.VERDE }, g);
    if (n.pie) el('text', { x: n.x + 13, y: n.y + h + 15, 'font-family': 'IBM Plex Mono, monospace', 'font-size': 9, 'letter-spacing': '1.1', fill: C.GRIS }, g).textContent = n.pie;
    n.g = g; n.w = w; n.h = h; return g;
  }
  function anclas(a, b) {
    var ax, ay = a.y + a.h / 2, bx, by = b.y + b.h / 2;
    if (b.x > a.x + a.w - 4) { ax = a.x + a.w; bx = b.x; }
    else if (b.x + b.w < a.x + 4) { ax = a.x; bx = b.x + b.w; }
    else { return [a.x + a.w / 2, a.y + (by > ay ? a.h : 0), b.x + b.w / 2, b.y + (by > ay ? 0 : b.h)]; }
    return [ax, ay, bx, by];
  }

  window.MIS_HERO = function (sel, spec) {
    var host = typeof sel === 'string' ? document.querySelector(sel) : sel;
    if (!host) return;

    function dibujar() {
      var activeSpec = spec.movil && matchMedia('(max-width:860px)').matches ? spec.movil : spec;
      host.innerHTML = '';
      var C = paleta(host);
      var W = activeSpec.w || 520, H = activeSpec.h || 420;
      var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': activeSpec.alt || '' }, host);
      var gFan = el('g', {}, svg), gLin = el('g', {}, svg), gNod = el('g', {}, svg);
      var N = activeSpec.nodos, i;
      (activeSpec.fantasma || []).forEach(function (f) { el('path', { d: ruta(f[0], f[1], f[2], f[3], f[4] === undefined ? .5 : f[4], 9), stroke: C.LIN, 'stroke-width': 1.4, fill: 'none', 'stroke-dasharray': '3 6', opacity: .6 }, gFan); });
      for (i = 0; i < N.length; i++) nodo(gNod, N[i], C);
      var vias = [];
      (activeSpec.enlaces || []).forEach(function (L) {
        var a = N[L[0]], b = N[L[1]], p = anclas(a, b), q = L[2] === undefined ? .5 : L[2];
        var d = ruta(p[0], p[1], p[2], p[3], q, 10);
        var base = el('path', { d: d, stroke: C.LIN, 'stroke-width': 1.6, fill: 'none', 'stroke-linecap': 'round' }, gLin);
        var len = base.getTotalLength ? base.getTotalLength() : 240;
        base.setAttribute('stroke-dasharray', len); base.setAttribute('stroke-dashoffset', len);
        terminal(gLin, p[0], p[1], C.LIN, 4.2, C.PAN); terminal(gLin, p[2], p[3], C.LIN, 4.2, C.PAN);
        var paq = null;
        if (L[3] !== false) { paq = el('circle', { r: 3.2, fill: C.AZUL, opacity: 0 }, gLin); }
        vias.push({ b: base, L: len, p: paq, ruta: base, v: .22 + Math.random() * .18, t: Math.random() });
      });
      var t0 = null, dur = 1150, quieto = matchMedia('(prefers-reduced-motion:reduce)').matches;
      function paso(ts) {
        if (!t0) t0 = ts; var e = (ts - t0) / dur;
        vias.forEach(function (v, k) { var p = Math.max(0, Math.min(1, (e - k * .055) / .55)); v.b.setAttribute('stroke-dashoffset', v.L * (1 - p * p * (3 - 2 * p))); });
        N.forEach(function (n, k) { var p = Math.max(0, Math.min(1, (e - .18 - k * .07) / .5)); n.g.setAttribute('opacity', p); n.g.setAttribute('transform', 'translate(0 ' + (1 - p) * 10 + ')'); });
        if (e < 1.05) requestAnimationFrame(paso); else corre();
      }
      if (quieto) { vias.forEach(function (v) { v.b.setAttribute('stroke-dashoffset', 0); }); N.forEach(function (n) { n.g.setAttribute('opacity', 1); }); }
      else requestAnimationFrame(paso);
      function corre() {
        if (quieto) return;
        (function bucle() {
          vias.forEach(function (v) {
            if (!v.p) return;
            v.t += v.v / 60; if (v.t > 1.35) v.t -= 1.35;
            var u = v.t;
            if (u > 1) { v.p.setAttribute('opacity', 0); return; }
            var pt = v.ruta.getPointAtLength(u * v.L);
            v.p.setAttribute('cx', pt.x); v.p.setAttribute('cy', pt.y);
            v.p.setAttribute('opacity', u < .06 ? u / .06 : (u > .94 ? (1 - u) / .06 : 1));
          });
          requestAnimationFrame(bucle);
        })();
      }
    }

    dibujar();
    new MutationObserver(dibujar).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    var resizeT;
    window.addEventListener('resize', function () {
      clearTimeout(resizeT);
      resizeT = setTimeout(dibujar, 150);
    });
  };
})();
