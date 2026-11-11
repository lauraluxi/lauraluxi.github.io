/* Se carga en <head> antes de pintar: aplica tema e idioma guardados para evitar parpadeos. */
(function () {
  var r = document.documentElement; r.classList.add('js');
  try {
    var t = localStorage.getItem('lc-theme');
    var m = t === 'light' || t === 'dark' ? t : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    r.setAttribute('data-mode', m);
    if (localStorage.getItem('lc-lang') === 'en') { r.setAttribute('data-ui', 'en'); r.lang = 'en'; }
  } catch (e) { r.setAttribute('data-mode', 'light'); }
})();
