/* =====================================================================
   Laura Cruz · Portfolio V3 — mobile-type.js
   Tipografía mínima en móvil: en pantallas de hasta 480 px, todo texto que mida
   menos de 11,5 px pasa a 11,5 px. Mide cada elemento, así que nunca reduce un texto
   más grande. Atiende el contenido que aparece después (caso desbloqueado, desplegables)
   y deshace el ajuste al volver a una pantalla más ancha. Excluye las ilustraciones
   decorativas, donde el texto pequeño forma parte del dibujo.
   ===================================================================== */
(function () {
  'use strict';
  var MIN = 11.5, Q = window.matchMedia('(max-width: 480px)');
  var SKIP = 'svg, iframe, script, style, [aria-hidden="true"], .mock, .mock-funnel, .case-visual, .flagship-visual, .lab-visual, .skip-link, .sr-only';
  function bump(root) {
    if (!Q.matches || !root) return;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), n, seen = [];
    while ((n = w.nextNode())) {
      var p = n.parentElement;
      if (!p || seen.indexOf(p) > -1 || !n.nodeValue.trim()) continue;
      seen.push(p);
      if (p.hasAttribute('data-lc-mt') || p.closest(SKIP)) continue;
      var fs = parseFloat(getComputedStyle(p).fontSize);
      if (fs && fs < MIN) { p.style.setProperty('font-size', MIN + 'px', 'important'); p.setAttribute('data-lc-mt', String(fs)); }
    }
  }
  function reset() {
    document.querySelectorAll('[data-lc-mt]').forEach(function (e) { e.style.removeProperty('font-size'); e.removeAttribute('data-lc-mt'); });
  }
  var t = 0;
  function later() { clearTimeout(t); t = setTimeout(function () { bump(document.body); }, 120); }
  function start() {
    bump(document.body);
    new MutationObserver(later).observe(document.body, { childList: true, subtree: true });
    (Q.addEventListener ? Q.addEventListener('change', onChange) : Q.addListener(onChange));
  }
  function onChange() { if (Q.matches) bump(document.body); else reset(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
