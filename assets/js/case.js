/* =====================================================================
   Laura Cruz · Portfolio V3 — case.js
   Páginas de caso (<div class="page case-page">): índice contextual con
   seguimiento del scroll, pestañas accesibles, lightbox y vídeos de recorrido.
   Requiere core.js. lock.js llama a LC.initCase() tras desbloquear un caso.
   ===================================================================== */
(function () {
  'use strict';
  var reduce = LC.reduce;

  function initCase(view) {
    if (!view || view.__ready) return;
    view.__ready = true;
    var LCv = window.LC;
    var links = [].slice.call(view.querySelectorAll('.pnav a[href^="#"]')).filter(function (a) {
      var id = a.getAttribute('href').slice(1); return id && id !== 'work' && document.getElementById(id) && view.contains(document.getElementById(id));
    });
    var map = {}; links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var ids = Object.keys(map), ticking = false;
    function activate(id) {
      links.forEach(function (a) { a.removeAttribute('aria-current'); });
      var a = map[id]; var ol = view.querySelector('.pnav ol');
      if (!a) return;
      a.setAttribute('aria-current', 'true');
      if (ol && ol.scrollWidth > ol.clientWidth) {
        var back = ol.querySelector('li:first-child'); var off = back ? back.offsetWidth + 8 : 16;
        ol.scrollTo({ left: Math.max(0, a.offsetLeft - ol.offsetLeft - off), behavior: reduce.matches ? 'auto' : 'smooth' });
      }
    }
    function update() {
      ticking = false;
      if (view.hidden || !ids.length) return;
      var visible = ids.filter(function (k) { var el = document.getElementById(k); return el && el.offsetParent !== null; });
      if (!visible.length) return;
      var id = visible[0], doc = document.documentElement;
      if (window.scrollY + window.innerHeight >= doc.scrollHeight - 4) id = visible[visible.length - 1];
      else {
        var line = window.innerHeight * 0.4;
        visible.forEach(function (k) { if (document.getElementById(k).getBoundingClientRect().top <= line) id = k; });
      }
      if (!map[id].hasAttribute('aria-current')) activate(id);
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    view.__update = update;

    view.querySelectorAll('[role="tablist"]').forEach(function (list) {
      var tabs = [].slice.call(list.querySelectorAll('[role="tab"]'));
      function select(tb, focus) {
        tabs.forEach(function (x) {
          var on = x === tb; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1;
          var p = document.getElementById(x.getAttribute('aria-controls')); if (p) p.hidden = !on;
        });
        if (focus) tb.focus();
      }
      tabs.forEach(function (tb, i) {
        tb.addEventListener('click', function () { select(tb); });
        tb.addEventListener('keydown', function (e) {
          var n = null;
          if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
          else if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
          else if (e.key === 'Home') n = tabs[0]; else if (e.key === 'End') n = tabs[tabs.length - 1];
          if (n) { e.preventDefault(); select(n, true); }
        });
      });
    });

    var dlg = view.querySelector('dialog.lb');
    if (dlg) {
      var li = dlg.querySelector('img'), lc = dlg.querySelector('p'), opener = null;
      view.querySelectorAll('.zoom').forEach(function (b) {
        b.addEventListener('click', function () {
          var img = b.querySelector('img'); opener = b;
          li.src = img.currentSrc || img.src; li.alt = img.alt; lc.textContent = img.alt;
          if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
          dlg.querySelector('button').focus();
        });
      });
      dlg.querySelector('button').addEventListener('click', function () { dlg.close(); });
      dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
      dlg.addEventListener('close', function () { if (opener) opener.focus(); });
    }

    view.querySelectorAll('.tour-wrap').forEach(function (w) {
      var v = w.querySelector('video.tour'), b = w.querySelector('.tour-toggle'); if (!v || !b) return;
      v.removeAttribute('autoplay'); v.muted = true;
      function sync() {
        var playing = !v.paused; b.dataset.state = playing ? 'playing' : 'paused';
        var es = playing ? 'Pausar recorrido' : 'Reproducir recorrido', en = playing ? 'Pause walkthrough' : 'Play walkthrough';
        b.setAttribute('data-aria-es', es); b.setAttribute('data-aria-en', en); b.setAttribute('aria-label', LC.t(es, en));
      }
      v.addEventListener('play', sync); v.addEventListener('pause', sync);
      b.addEventListener('click', function () {
        if (v.paused) { v.dataset.userPaused = '0'; var r = v.play(); if (r && r.catch) r.catch(sync); }
        else { v.dataset.userPaused = '1'; v.pause(); }
      });
      sync();
    });
  }

  /* progreso de lectura en la barra del recorrido */
  var pTick = false;
  function progress() {
    pTick = false;
    var p = LC.visiblePage(); if (!p || !p.classList.contains('case-page')) return;
    var bar = p.querySelector('.lx-progress'); if (!bar) return;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.setProperty('--lx-progress', max > 0 ? Math.min(1, window.scrollY / max).toFixed(4) : 0);
  }
  window.addEventListener('scroll', function () { if (!pTick) { pTick = true; requestAnimationFrame(progress); } }, { passive: true });
  window.addEventListener('resize', progress);
  LC.progress = progress;

  LC.initCase = function (view, force) {
    if (force) view.__ready = false;
    initCase(view);
    if (view.__update) view.__update();
    LC.refresh();
    progress();
  };
  /* Los recorridos se reproducen siempre en automático (en silencio y en bucle), también con
     «reducir movimiento» activado; el botón de pausa de cada vídeo permite detenerlos (WCAG 2.2.2)
     y una pausa manual se respeta hasta que la persona vuelva a reproducir. */
  LC.playTours = function (view) {
    view.querySelectorAll('video.tour').forEach(function (vd) {
      if (vd.dataset.userPaused === '1') return;
      vd.muted = true; var p = vd.play(); if (p && p.catch) p.catch(function () {});
    });
  };
  document.querySelectorAll('.case-page').forEach(function (v) {
    initCase(v);
    if (!v.hidden) { LC.playTours(v); if (v.__update) v.__update(); }
  });
})();
