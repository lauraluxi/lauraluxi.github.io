/* =====================================================================
   Laura Cruz · Portfolio V3 — protect.js
   Disuasión de copia en casos confidenciales: bloquea seleccionar, copiar, cortar,
   arrastrar imágenes, el menú contextual, guardar, imprimir y ver el código con atajos.
   No impide capturas de pantalla (las hace el sistema operativo, no el navegador).
   Los campos de formulario siguen funcionando con normalidad.
   ===================================================================== */
(function () {
  'use strict';
  var root = document.documentElement; if (root.hasAttribute('data-lc-protect')) return; root.setAttribute('data-lc-protect', '');
  function allowed(t) { return t && t.closest && t.closest('input, textarea, select, [contenteditable="true"]'); }
  /* solo dentro de [data-protect]: la página del caso protegido o el caso abierto */
  function guarded(t) {
    if (allowed(t)) return false;
    return !!((t && t.closest && t.closest('[data-protect]')) || (document.body && document.body.hasAttribute('data-protect')));
  }
  ['copy', 'cut', 'contextmenu', 'dragstart', 'selectstart'].forEach(function (ev) {
    document.addEventListener(ev, function (e) { if (guarded(e.target)) e.preventDefault(); }, true);
  });
  document.addEventListener('keydown', function (e) {
    var k = (e.key || '').toLowerCase();
    if (!guarded(e.target)) return;
    if ((e.ctrlKey || e.metaKey) && ['c', 'x', 's', 'p', 'u', 'a'].indexOf(k) > -1) e.preventDefault();
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['i', 'j', 'c'].indexOf(k) > -1) e.preventDefault();
    if (k === 'printscreen') { try { navigator.clipboard.writeText(''); } catch (x) {} }
  }, true);
})();
