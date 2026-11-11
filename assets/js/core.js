/* =====================================================================
   Laura Cruz · Portfolio V3 — core.js
   Compartido por todas las páginas: idioma ES/EN, tema claro/oscuro,
   Back to Top, anclas internas, anuncios accesibles e imágenes repetidas.
   Expone window.LC para home.js, case.js y lock.js.
   ===================================================================== */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  var LS_LANG = 'lc-lang', LS_THEME = 'lc-theme';
  var CV = {
    es: 'https://drive.google.com/file/d/1-UAsClaPK90afyYOHK1Wqlof7n6BKKwY/view?usp=sharing',
    en: 'https://drive.google.com/file/d/1rS0pBQkfqXLws4v-OhXgfwaoUh8_VszM/view?usp=sharing'
  };
  var langHandlers = [];

  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function read(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lang() { return root.getAttribute('data-ui') === 'en' ? 'en' : 'es'; }
  function t(es, en) { return lang() === 'en' ? en : es; }
  function visiblePage() { return [].slice.call(document.querySelectorAll('.page')).filter(function (p) { return !p.hidden; })[0]; }

  function announce(msg) {
    var r = document.getElementById('lc-live'); if (!r) return;
    r.textContent = ''; setTimeout(function () { r.textContent = msg; }, 30);
  }

  function resolveAssetRefs(scope) {
    (scope || document).querySelectorAll('img[data-asset-ref]').forEach(function (img) {
      var id = img.getAttribute('data-asset-ref');
      var src = (scope || document).querySelector('img[data-asset-id="' + id + '"]') || document.querySelector('img[data-asset-id="' + id + '"]');
      if (src) img.src = src.getAttribute('src');
    });
  }

  /* ---------------- idioma ---------------- */
  function setTitle() {
    var p = visiblePage(); if (!p) return;
    var tt = p.getAttribute('data-title-' + lang()); if (tt) document.title = tt;
  }
  function setLang(l) {
    l = l === 'en' ? 'en' : 'es';
    root.setAttribute('data-ui', l);
    root.lang = l;
    document.querySelectorAll('.lang-btn').forEach(function (b) {
      var on = b.getAttribute('data-lang') === l;
      b.classList.toggle('active', on); b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    document.querySelectorAll('[data-set-lang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-set-lang') === l)); });
    document.querySelectorAll('[data-aria-' + l + ']').forEach(function (e) { e.setAttribute('aria-label', e.getAttribute('data-aria-' + l)); });
    document.querySelectorAll('img[data-alt-' + l + ']').forEach(function (i) { i.alt = i.getAttribute('data-alt-' + l); });
    document.querySelectorAll('[data-cv]').forEach(function (a) { a.href = CV[l]; });
    var tt = document.getElementById('to-top'); if (tt) tt.setAttribute('aria-label', t('Volver arriba', 'Back to top'));
    langHandlers.forEach(function (fn) { fn(l); });
    syncThemeLabels();
    setTitle();
    store(LS_LANG, l);
  }

  /* ---------------- tema ---------------- */
  function forcedTheme() { var v = read(LS_THEME); return v === 'light' || v === 'dark' ? v : null; }
  function mode() { return forcedTheme() || (mq.matches ? 'dark' : 'light'); }
  function syncThemeLabels() {
    var dark = root.getAttribute('data-mode') === 'dark';
    document.querySelectorAll('[data-theme-toggle]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(dark));
      b.setAttribute('aria-label', dark ? t('Activar modo claro', 'Switch to light mode') : t('Activar modo oscuro', 'Switch to dark mode'));
    });
    document.querySelectorAll('[data-theme-set]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-theme-set') === (dark ? 'dark' : 'light'))); });
  }
  function applyTheme(animate) {
    if (animate && !reduce.matches) { root.classList.add('theme-anim'); setTimeout(function () { root.classList.remove('theme-anim'); }, 420); }
    root.setAttribute('data-mode', mode());
    syncThemeLabels();
  }
  function setTheme(m) { store(LS_THEME, m); applyTheme(true); }
  if (mq.addEventListener) mq.addEventListener('change', function () { applyTheme(true); });

  document.addEventListener('click', function (e) {
    if (!e.target.closest) return;
    var b;
    if ((b = e.target.closest('.lang-btn'))) { setLang(b.getAttribute('data-lang')); return; }
    if ((b = e.target.closest('[data-set-lang]'))) { setLang(b.getAttribute('data-set-lang')); return; }
    if ((b = e.target.closest('[data-theme-toggle]'))) { setTheme(root.getAttribute('data-mode') === 'dark' ? 'light' : 'dark'); return; }
    if ((b = e.target.closest('[data-theme-set]'))) { setTheme(b.getAttribute('data-theme-set')); return; }
  });

  /* ---------------- anclas internas (#seccion) con desplazamiento suave ---------------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || a.hasAttribute('data-route')) return;
    var id = decodeURIComponent(a.getAttribute('href').slice(1));
    if (!id) { e.preventDefault(); return; }
    var el = document.getElementById(id);
    if (!el) return;
    var page = el.closest('.page');
    if (page && page.hidden) return;              // la vista previa en un solo archivo lo resuelve
    e.preventDefault();
    if (id === 'top') window.scrollTo({ top: 0, behavior: reduce.matches ? 'auto' : 'smooth' });
    else el.scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'start' });
    if (a.classList.contains('skip') || a.classList.contains('skip-link')) {
      if (!el.hasAttribute('tabindex') && !/^(INPUT|BUTTON|A|TEXTAREA|SELECT)$/.test(el.tagName)) el.setAttribute('tabindex', '-1');
      el.focus({ preventScroll: true });
    }
  });

  /* ---------------- Back to Top ---------------- */
  var tt = document.getElementById('to-top'), tick = false;
  function ttSync() { tick = false; if (tt) tt.classList.toggle('is-visible', window.scrollY > 600); }
  window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(ttSync); } }, { passive: true });
  if (tt) tt.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduce.matches ? 'auto' : 'smooth' });
    var p = visiblePage(); var f = p && p.querySelector('.nav-brand, .lx-logo'); if (f) f.focus({ preventScroll: true });
  });

  /* ---------------- menú principal fijo + barra secundaria de casos ----------------
     --sn-h: altura actual del menú principal (la barra del recorrido se pega debajo).
     scroll-padding-top: los saltos a secciones quedan visibles bajo ambas barras. */
  function measureHeader() {
    var p = visiblePage(); if (!p) return;
    var sn = p.querySelector('.sn'), lx = p.querySelector('.lx-top');
    var snh = sn ? sn.offsetHeight : 0, lxh = lx ? lx.offsetHeight : 0;
    root.style.setProperty('--sn-h', snh + 'px');
    p.style.setProperty('--lx-h', lxh + 'px');
    root.style.scrollPaddingTop = (snh + lxh + 16) + 'px';
  }
  function stickState() {
    var stuck = window.scrollY > 4;
    document.querySelectorAll('.sn').forEach(function (n) { n.classList.toggle('is-stuck', stuck); });
  }
  window.addEventListener('resize', measureHeader);
  window.addEventListener('scroll', stickState, { passive: true });
  if ('ResizeObserver' in window) {
    var ro = new ResizeObserver(measureHeader);
    document.querySelectorAll('.sn, .lx-top').forEach(function (el) { ro.observe(el); });
  }

  /* ---------------- menú móvil (cajón) compartido ---------------- */
  (function drawers() {
    var open = null, last = null;
    function items(d) { return [].slice.call(d.querySelectorAll('a,button:not([disabled])')).filter(function (x) { return x.offsetParent !== null; }); }
    function onKey(e) {
      if (!open) return;
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'Tab') {
        var x = items(open); if (!x.length) return;
        var a = x[0], z = x[x.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    }
    function show(d) {
      last = document.activeElement; open = d;
      d.setAttribute('data-open', 'true'); d.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      var x = items(d); if (x[0]) x[0].focus();
      document.addEventListener('keydown', onKey);
    }
    function close() {
      if (!open) return;
      open.setAttribute('data-open', 'false'); open.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = ''; document.removeEventListener('keydown', onKey);
      open = null; if (last && last.focus) last.focus();
    }
    document.addEventListener('click', function (e) {
      if (!e.target.closest) return;
      var t = e.target.closest('[data-drawer-toggle]');
      if (t) { var d = document.getElementById(t.getAttribute('aria-controls')); if (d) show(d); return; }
      if (open && (e.target.closest('[data-drawer-close]') || e.target.classList.contains('scrim') || e.target.closest('.sn-drawer a'))) close();
    });
  })();

  /* ---------------- API compartida ---------------- */
  window.LC = {
    lang: lang, t: t, setLang: setLang, announce: announce, reduce: reduce,
    onLang: function (fn) { langHandlers.push(fn); },
    resolveAssetRefs: resolveAssetRefs, visiblePage: visiblePage,
    refresh: function () { setTitle(); stickState(); measureHeader(); ttSync(); }
  };

  /* ---------------- arranque ---------------- */
  resolveAssetRefs(document);
  applyTheme(false);
  document.addEventListener('DOMContentLoaded', function () {
    var start = read(LS_LANG); setLang(start === 'en' ? 'en' : 'es');   // primera visita: español
    measureHeader(); stickState(); ttSync();
    var p = visiblePage();
    if (p && !reduce.matches) { p.classList.add('page-enter'); p.addEventListener('animationend', function h() { p.classList.remove('page-enter'); p.removeEventListener('animationend', h); }); }
  });
})();
