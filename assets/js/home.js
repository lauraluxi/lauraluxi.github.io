/* =====================================================================
   Laura Cruz · Portfolio V3 — home.js
   Solo en index.html: textos ES/EN del Home,
   portada animada de Data Marketplace y aparición al hacer scroll.
   Requiere core.js e i18n-home.js.
   ===================================================================== */
(function () {
  'use strict';
  var reduce = LC.reduce;
  var DICT = window.LC_I18N_HOME || { es: {}, en: {} };
  var home = document.getElementById('home');

  /* ---------------- textos del Home ---------------- */
  LC.onLang(function (l) {
    if (!home) return;
    home.querySelectorAll('[data-i18n]').forEach(function (el) {
      var val = DICT[l][el.getAttribute('data-i18n')];
      if (val === undefined) return;
      var attr = el.getAttribute('data-i18n-attr');
      if (attr) el.setAttribute(attr, val.replace(/<[^>]+>/g, ''));
      else el.innerHTML = val;
    });
  });


  /* ---------------- libros y comentarios (datos en home-data.js) ----------------
     Las secciones están ocultas (hidden) y solo se muestran si hay contenido real. */
  var DATA = window.LC_HOME_DATA || { books: { carrera: [], otros: [] }, comments: [] };
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function bi(v) { return typeof v === 'string' ? esc(v) : '<span lang="es">' + esc(v.es) + '</span><span lang="en">' + esc(v.en || v.es) + '</span>'; }
  var books = DATA.books || {}, nBooks = 0;
  document.querySelectorAll('[data-books]').forEach(function (ul) {
    var list = books[ul.getAttribute('data-books')] || [];
    nBooks += list.length;
    ul.closest('.lib-col').hidden = !list.length;
    ul.innerHTML = list.map(function (b, i) {
      return '<li class="lib-item"><span class="lib-cover" aria-hidden="true" style="--h:' + ((i * 47) % 360) + '"><i>' + esc(b.title).slice(0, 1) + '</i></span>' +
        '<span class="lib-meta"><b>' + esc(b.title) + '</b><span>' + esc(b.author) + '</span>' + (b.note ? '<em>' + bi(b.note) + '</em>' : '') + '</span></li>';
    }).join('');
  });
  var lib = document.getElementById('library'); if (lib) lib.hidden = nBooks === 0;
  var cm = document.querySelector('[data-comments]'), cs = DATA.comments || [];
  function paras(v) {
    function p(t) { return esc(t).split(/\n\s*\n/).map(function (x) { return '<p>' + x + '</p>'; }).join(''); }
    return typeof v === 'string' ? p(v) : '<div lang="es">' + p(v.es) + '</div><div lang="en">' + p(v.en || v.es) + '</div>';
  }
  function initials(n) { return n.split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0); }).join('').toUpperCase(); }
  var LI = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.6 8.65 21 11.2 21 14.5V21h-4v-5.6c0-1.34-.03-3.06-1.86-3.06-1.87 0-2.15 1.46-2.15 2.96V21H9z"/></svg>';
  if (cm) {
    cm.innerHTML = cs.map(function (c, i) {
      var id = 'cm-q-' + i;
      return '<figure class="cm-card' + (i === 0 ? ' cm-featured' : '') + '">' +
        '<span class="cm-mark" aria-hidden="true">“</span>' +
        '<blockquote class="cm-quote" id="' + id + '">' + paras(c.quote) + '</blockquote>' +
        '<button type="button" class="cm-more" aria-expanded="false" aria-controls="' + id + '" hidden><span lang="es">Leer completo</span><span lang="en">Read full</span></button>' +
        '<figcaption><span class="cm-avatar" aria-hidden="true">' + esc(initials(c.name)) + '</span><span class="cm-who">' +
        (c.linkedin ? '<a class="cm-name" href="' + esc(c.linkedin) + '" target="_blank" rel="noopener">' + esc(c.name) + LI + '<span class="sr-only"> (LinkedIn)</span></a>' : '<b class="cm-name">' + esc(c.name) + '</b>') +
        (c.role ? '<span class="cm-role">' + bi(c.role) + (c.relation ? ' · ' + bi(c.relation) : '') + '</span>' : '') +
        '<span class="cm-tr" lang="en">Translated from Spanish</span></span></figcaption></figure>';
    }).join('');
    var sec = document.getElementById('comments'); if (sec) sec.hidden = cs.length === 0;
    /* «Leer completo» solo donde el texto se recorta */
    function clampCheck() {
      cm.querySelectorAll('.cm-card').forEach(function (card) {
        var q = card.querySelector('.cm-quote'), b = card.querySelector('.cm-more');
        if (card.classList.contains('is-open')) return;
        b.hidden = q.scrollHeight <= q.clientHeight + 2;
      });
    }
    cm.addEventListener('click', function (e) {
      var b = e.target.closest('.cm-more'); if (!b) return;
      var card = b.closest('.cm-card'), open = !card.classList.contains('is-open');
      card.classList.toggle('is-open', open);
      b.setAttribute('aria-expanded', String(open));
      b.innerHTML = open ? '<span lang="es">Mostrar menos</span><span lang="en">Show less</span>' : '<span lang="es">Leer completo</span><span lang="en">Read full</span>';
    });
    requestAnimationFrame(clampCheck);
    window.addEventListener('resize', clampCheck);
    LC.onLang(function () { requestAnimationFrame(clampCheck); });
  }

  /* numeración de secciones continua (01, 02…) solo entre las secciones visibles */
  function renumber() {
    var n = 0;
    home.querySelectorAll('section .section-num').forEach(function (el) {
      if (el.closest('section').hidden) return;
      n++;
      var num = (n < 10 ? '0' : '') + n;
      var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) { var t = walker.currentNode; if (/^\s*\d{2}\s*\//.test(t.nodeValue)) t.nodeValue = t.nodeValue.replace(/\d{2}/, num); }
    });
  }
  if (home) { renumber(); LC.onLang(renumber); }

  /* ---------------- DMP: las pantallas de la portada siguen al cursor ---------------- */
  (function coverTilt() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    var card = document.querySelector('#home .flagship-card'); if (!card) return;
    var wrap = card.querySelector('.flagship-visual-wrap'), raf = 0, ev = null;
    function apply() {
      raf = 0; if (!ev || reduce.matches) return;
      var r = wrap.getBoundingClientRect();
      var x = Math.max(-.5, Math.min(.5, (ev.clientX - r.left) / r.width - .5));
      var y = Math.max(-.5, Math.min(.5, (ev.clientY - r.top) / r.height - .5));
      card.style.setProperty('--mx', (x * 2).toFixed(3)); card.style.setProperty('--my', (y * 2).toFixed(3));
    }
    card.addEventListener('pointerenter', function () { setTimeout(function () { card.classList.add('is-tilting'); }, 600); });
    card.addEventListener('pointermove', function (e) { ev = e; if (!raf) raf = requestAnimationFrame(apply); });
    card.addEventListener('pointerleave', function () { card.classList.remove('is-tilting'); ev = null; card.style.removeProperty('--mx'); card.style.removeProperty('--my'); });
  })();

  /* ---------------- aparición al hacer scroll ---------------- */
  (function reveal() {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || reduce.matches) { els.forEach(function (e) { e.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (e) { io.observe(e); });
    setTimeout(function () { els.forEach(function (e) { e.classList.add('is-in'); }); }, 4000); // red de seguridad
  })();

})();

/* ---------------------------------------------------------------------
   Tarjetas de proyecto clicables en toda su superficie.
   El enlace real sigue siendo el botón «Ver caso de estudio» (teclado y lectores
   de pantalla lo usan igual); un clic en cualquier otra parte de la tarjeta lo activa.
   Ctrl/Cmd + clic o clic central: nueva pestaña. Seleccionar texto no navega.
   --------------------------------------------------------------------- */
(function () {
  'use strict';
  document.querySelectorAll('article.flagship-card, article.case').forEach(function (card) {
    var cta = card.querySelector('a.flagship-cta, a.case-cta');
    if (!cta) return;
    card.setAttribute('data-card-link', '');
    card.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.target.closest('a, button, input, select, textarea, summary, [role="button"]')) return;
      var sel = window.getSelection ? String(window.getSelection()) : '';
      if (sel.length > 2) return;
      if (e.ctrlKey || e.metaKey || e.shiftKey) { window.open(cta.href, '_blank', 'noopener'); return; }
      cta.click();
    });
    card.addEventListener('auxclick', function (e) {
      if (e.button === 1 && !e.target.closest('a')) { e.preventDefault(); window.open(cta.href, '_blank', 'noopener'); }
    });
  });
})();
