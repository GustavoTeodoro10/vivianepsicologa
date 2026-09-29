(function () {
  'use strict';

  /* ===== Configuração ===== */
  var WHATSAPP = '5511945424194';
  // Cole aqui o ID real. Enquanto for placeholder, nenhum script de rastreio é carregado.
  var GA_ID = 'G-XXXXXXXXXX';
  var META_PIXEL_ID = ''; // ex.: '1234567890123456'

  document.documentElement.classList.add('js');

  /* ===== Analytics (GA4 + Meta Pixel opcional) ===== */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  if (GA_ID && GA_ID.indexOf('XXXX') === -1) {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', GA_ID);
  }
  if (META_PIXEL_ID) {
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  function track(name, params) {
    try {
      gtag('event', name, params || {});
      if (window.fbq) window.fbq('trackCustom', name, params || {});
    } catch (e) { /* rastreio nunca deve quebrar o site */ }
  }

  /* ===== CTAs do WhatsApp com mensagem contextual ===== */
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    a.href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(a.dataset.wa);
    a.target = '_blank';
    a.rel = 'noopener';
    a.addEventListener('click', function () {
      track('whatsapp_click', { section: a.dataset.section || 'geral' });
      if (window.fbq) window.fbq('track', 'Contact');
    });
  });
  document.querySelectorAll('[data-track]').forEach(function (a) {
    a.addEventListener('click', function () { track(a.dataset.track); });
  });

  /* ===== Header ===== */
  var header = document.querySelector('.site-header');
  var btn = document.getElementById('menuBtn');
  var menu = document.getElementById('mobileMenu');

  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 12); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  function setMenu(open) {
    menu.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    btn.innerHTML = '<svg class="h-6 w-6"><use href="#' + (open ? 'i-x' : 'i-menu') + '"/></svg>';
    header.classList.toggle('is-open', open);
  }
  btn.addEventListener('click', function () { setMenu(menu.hidden); });
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); btn.focus(); } });

  /* ===== Link ativo na navegação ===== */
  var links = document.querySelectorAll('.nav-link');
  var map = {};
  links.forEach(function (l) { map[l.getAttribute('href').slice(1)] = l; });
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && map[en.target.id]) {
          links.forEach(function (l) { l.classList.remove('is-active'); });
          map[en.target.id].classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { var el = document.getElementById(id); if (el) spy.observe(el); });
  }

  /* ===== Scroll reveal ===== */
  var items = document.querySelectorAll('.reveal');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || reduce) {
    items.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    items.forEach(function (el) {
      // escalonamento leve entre irmãos (listas e grids)
      var i = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.setProperty('--d', Math.min(i, 5) * 0.07 + 's');
      io.observe(el);
    });
  }

  /* ===== Contador dos números do hero ===== */
  if (!reduce && 'IntersectionObserver' in window) {
    document.querySelectorAll('[data-count]').forEach(function (el) {
      var target = parseInt(el.dataset.count, 10), pre = el.dataset.prefix || '';
      var t0, dur = 1400;
      function step(t) {
        t0 = t0 || t;
        var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
        el.textContent = pre + Math.round(target * e);
        if (p < 1) requestAnimationFrame(step);
      }
      el.textContent = pre + '0';
      requestAnimationFrame(step);
    });
  }
})();
