/* =====================================================================
   Laura Cruz · Portfolio V3 — lock.js
   Acceso a casos protegidos. Cada caso tiene su propia contraseña.

   Marcado esperado en la página del caso:
     <form class="lc-lock-form" data-lock="ID" data-lock-mode="crypto|demo">
     <div data-lock-wrap="ID">      contenedor del formulario (se oculta al abrir)
     <main data-lock-target="ID">   destino del contenido descifrado
     <script type="application/octet-stream" id="enc-ID">  contenido cifrado

   Formato del contenido cifrado (lo genera tools/build.py):
     base64( salt[16] | iv[12] | AES-GCM-256(JSON {html}) ), clave PBKDF2-SHA256 600 000 it.
     Variante de caso autónomo: JSON {doc, files} comprimido con gzip antes de cifrar.
   La contraseña nunca está en el código. La clave derivada se guarda solo en
   sessionStorage para no pedirla de nuevo en la misma sesión.
   Requiere core.js y case.js.
   ===================================================================== */
(function () {
  'use strict';
  var ENC_ITER = 600000, KEY_STORE = 'lc-unlock-';
  var t = LC.t;

  function b64(buf) { var s = '', a = new Uint8Array(buf); for (var i = 0; i < a.length; i += 8192) s += String.fromCharCode.apply(null, a.subarray(i, i + 8192)); return btoa(s); }
  function unb64(str) { var bin = atob(str), a = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i); return a; }
  function payload(id) { var el = document.getElementById('enc-' + id); return el ? unb64(el.textContent.trim()) : null; }
  function deriveKey(pw, salt) {
    return crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveKey']).then(function (base) {
      return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: salt, iterations: ENC_ITER, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, true, ['decrypt']);
    });
  }
  function decryptWith(key, id) {
    var d = payload(id); if (!d) return Promise.reject(new Error('sin contenido'));
    return crypto.subtle.decrypt({ name: 'AES-GCM', iv: d.slice(16, 28) }, key, d.slice(28)).then(function (buf) {
      var u = new Uint8Array(buf);
      /* contenido comprimido con gzip (casos grandes, p. ej. Smart Sales AI) */
      if (u[0] === 0x1f && u[1] === 0x8b && window.DecompressionStream) {
        return new Response(new Blob([u]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
      }
      return new TextDecoder().decode(buf);
    });
  }
  function storedKey(id) {
    try {
      var raw = sessionStorage.getItem(KEY_STORE + id); if (!raw) return Promise.resolve(null);
      return crypto.subtle.importKey('raw', unb64(raw), { name: 'AES-GCM' }, true, ['decrypt']);
    } catch (e) { return Promise.resolve(null); }
  }

  /* Caso autónomo (documento completo con sus propios estilos y scripts, p. ej. Smart Sales AI):
     sustituye la página por el caso descifrado. Los archivos auxiliares (prototipo) se sirven como blob. */
  function renderDocument(data) {
    var doc = data.doc, files = data.files || {};
    Object.keys(files).forEach(function (path) {
      var url = URL.createObjectURL(new Blob([files[path]], { type: 'text/html' }));
      doc = doc.split(path).join(url);
    });
    document.open(); document.write(doc); document.close();
  }

  function reveal(id, json, viaForm) {
    var data = JSON.parse(json);
    if (data.doc) { renderDocument(data); return; }
    var host = document.querySelector('[data-lock-target="' + id + '"]');
    var page = host.closest('.page');
    host.innerHTML = data.html;
    LC.resolveAssetRefs(host);
    var enc = document.getElementById('enc-' + id); if (enc) enc.remove();
    var wrap = document.querySelector('[data-lock-wrap="' + id + '"]'); if (wrap) wrap.hidden = true;
    var skip = page.querySelector('.skip'); if (skip && host.id) skip.setAttribute('href', '#' + host.id);
    host.hidden = false;
    page.classList.add('is-open');
    if (LC.initCase) LC.initCase(page, true);
    if (LC.playTours) LC.playTours(page);
    LC.setLang(LC.lang());
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (viaForm) {
      LC.announce(t('Acceso concedido. Caso abierto.', 'Access granted. Case opened.'));
      var h = host.querySelector('h1'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    }
  }

  /* desbloqueo automático si ya se abrió en esta sesión */
  LC.tryStoredUnlock = function () {
    document.querySelectorAll('form.lc-lock-form[data-lock-mode="crypto"]').forEach(function (form) {
      var id = form.getAttribute('data-lock'), page = form.closest('.page');
      if (!document.getElementById('enc-' + id) || page.classList.contains('is-open') || page.hidden) return;
      storedKey(id).then(function (key) {
        if (!key) return;
        decryptWith(key, id).then(function (json) { reveal(id, json, false); }, function () {});
      });
    });
  };

  function msg(form, text, kind) {
    var m = form.querySelector('.lc-lock-msg');
    m.className = 'lc-lock-msg' + (kind ? ' is-' + kind : '');
    m.textContent = text;
  }

  /* mostrar / ocultar contraseña */
  document.addEventListener('click', function (e) {
    var eye = e.target.closest && e.target.closest('.lc-lock-eye');
    if (!eye) return;
    var input = document.getElementById(eye.getAttribute('aria-controls'));
    var showing = input.type === 'text';
    input.type = showing ? 'password' : 'text';
    eye.setAttribute('aria-pressed', String(!showing));
    var es = showing ? 'Mostrar contraseña' : 'Ocultar contraseña', en = showing ? 'Show password' : 'Hide password';
    eye.setAttribute('data-aria-es', es); eye.setAttribute('data-aria-en', en); eye.setAttribute('aria-label', t(es, en));
    input.focus();
  });

  /* envío del formulario */
  document.addEventListener('submit', function (e) {
    var form = e.target.closest && e.target.closest('form.lc-lock-form'); if (!form) return;
    e.preventDefault();
    var id = form.getAttribute('data-lock'), mode = form.getAttribute('data-lock-mode');
    var input = form.querySelector('input'), btn = form.querySelector('.lc-lock-submit');
    if (btn.getAttribute('aria-busy') === 'true') return;
    if (!input.value) {
      input.setAttribute('aria-invalid', 'true');
      msg(form, t('Escribe la contraseña para continuar.', 'Enter the password to continue.'), 'error');
      input.focus(); return;
    }
    if (mode === 'demo') {
      input.removeAttribute('aria-invalid');
      msg(form, t('Demostración: este caso todavía no tiene contenido protegido, así que no hay contraseña que validar. Puedes revisar la estructura del caso.',
                  'Demo: this case has no protected content yet, so there is no password to check. You can review the case structure.'), 'info');
      var alt = form.parentNode.querySelector('.lc-lock-alt button'); if (alt) alt.focus();
      return;
    }
    var d = payload(id);
    if (!d || !window.crypto || !crypto.subtle) {
      msg(form, t('Este navegador no puede abrir el caso. Prueba con una versión reciente de Chrome, Safari, Firefox o Edge.', "This browser can't open the case. Try a recent version of Chrome, Safari, Firefox or Edge."), 'error');
      return;
    }
    btn.setAttribute('aria-busy', 'true');
    msg(form, t('Verificando…', 'Checking…'), 'info');
    deriveKey(input.value, d.slice(0, 16)).then(function (key) {
      return decryptWith(key, id).then(function (json) {
        crypto.subtle.exportKey('raw', key).then(function (raw) { try { sessionStorage.setItem(KEY_STORE + id, b64(raw)); } catch (x) {} });
        input.removeAttribute('aria-invalid');
        msg(form, t('Acceso concedido.', 'Access granted.'), 'ok');
        setTimeout(function () { btn.removeAttribute('aria-busy'); reveal(id, json, true); }, LC.reduce.matches ? 0 : 350);
      });
    }).catch(function () {
      btn.removeAttribute('aria-busy');
      input.setAttribute('aria-invalid', 'true');
      msg(form, t('La contraseña no es correcta. Revísala e inténtalo de nuevo.', "That password isn't correct. Check it and try again."), 'error');
      input.select();
    });
  });

  /* acceso demostrativo: abrir la estructura pública del caso */
  function openStructure(page, focus) {
    var id = page.querySelector('form.lc-lock-form').getAttribute('data-lock');
    var wrap = page.querySelector('[data-lock-wrap="' + id + '"]'); if (wrap) wrap.hidden = true;
    var main = page.querySelector('[data-lock-target="' + id + '"]'); main.hidden = false;
    page.classList.add('is-open');
    try { sessionStorage.setItem('lc-open-' + id, '1'); } catch (e) {}
    if (LC.initCase) LC.initCase(page, true);
    if (focus) { window.scrollTo({ top: 0, behavior: 'instant' }); var h = main.querySelector('h1'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); } }
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-open-structure]');
    if (b) openStructure(b.closest('.page'), true);
  });
  LC.restoreDemoOpen = function () {
    document.querySelectorAll('form.lc-lock-form[data-lock-mode="demo"]').forEach(function (form) {
      var id = form.getAttribute('data-lock');
      try { if (sessionStorage.getItem('lc-open-' + id) === '1') openStructure(form.closest('.page'), false); } catch (e) {}
    });
  };

  LC.tryStoredUnlock();
  LC.restoreDemoOpen();
})();
