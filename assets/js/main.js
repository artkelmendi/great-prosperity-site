/* =====================================================================
   Great Prosperity — Hotel Supplies · interactions
   Vanilla JS, no dependencies.
   - SQ/EN language toggle (remembers choice)
   - Scroll progress bar + scroll-reveal choreography
   - Subtle hero parallax (continues while scrolling up/down)
   - Floating nav state + mobile menu
   - Catalogue category filter
   - Contact form (demo handler)
   ===================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Language toggle (i18n) ---------- */
  var STORAGE_KEY = 'gp-lang';

  function applyLang(lang) {
    document.documentElement.setAttribute('lang', lang === 'en' ? 'en' : 'sq');
    document.querySelectorAll('[data-sq]').forEach(function (el) {
      var val = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-sq');
      if (val === null) return;
      // Preserve <em>/markup tokens written as {em}...{/em}
      if (val.indexOf('{em}') !== -1) {
        el.innerHTML = val.replace(/\{em\}/g, '<em>').replace(/\{\/em\}/g, '</em>');
      } else {
        el.textContent = val;
      }
    });
    document.querySelectorAll('[data-sq-ph]').forEach(function (el) {
      el.setAttribute('placeholder', lang === 'en' ? el.getAttribute('data-en-ph') : el.getAttribute('data-sq-ph'));
    });
    document.querySelectorAll('.lang__btn').forEach(function (b) {
      b.classList.toggle('is-active', b.dataset.lang === lang);
      b.setAttribute('aria-pressed', b.dataset.lang === lang);
    });
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  var savedLang = 'sq';
  try { savedLang = localStorage.getItem(STORAGE_KEY) || 'sq'; } catch (e) {}
  applyLang(savedLang);

  document.querySelectorAll('.lang__btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (btn.classList.contains('is-active')) return;
      applyLang(btn.dataset.lang);
      if (reduceMotion) return;
      // Re-trigger the swap animation by forcing a reflow
      document.body.classList.remove('lang-switching');
      void document.body.offsetWidth;
      document.body.classList.add('lang-switching');
      window.setTimeout(function () { document.body.classList.remove('lang-switching'); }, 600);
    });
  });

  /* ---------- Floating nav state + mobile menu ---------- */
  var nav = document.querySelector('.nav');
  var burger = document.querySelector('.nav__burger');

  function onScrollNav() {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 20);
  }
  onScrollNav();

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open);
    });
    nav.querySelectorAll('.nav__link').forEach(function (l) {
      l.addEventListener('click', function () { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', false); });
    });
  }

  /* ---------- Scroll progress bar ---------- */
  var progress = document.querySelector('.scroll-progress');
  function onScrollProgress() {
    if (!progress) return;
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (h.scrollTop || window.scrollY) / max * 100 : 0;
    progress.style.width = pct + '%';
  }

  /* ---------- Parallax (continuous, position-based, runs up & down) ----------
     Any element with data-parallax="<speed>" drifts relative to its position in
     the viewport. Positive = moves with scroll, negative = against it. */
  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  var vh = window.innerHeight;
  window.addEventListener('resize', function () { vh = window.innerHeight; }, { passive: true });
  function onScrollParallax() {
    if (reduceMotion || !parallaxEls.length) return;
    parallaxEls.forEach(function (el) {
      var speed = parseFloat(el.getAttribute('data-parallax')) || 0.12;
      var rect = el.getBoundingClientRect();
      var center = rect.top + rect.height / 2;
      var offset = (vh / 2 - center) * speed;
      el.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
    });
  }

  /* ---------- Unified scroll handler (rAF throttled) ---------- */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      onScrollNav();
      onScrollProgress();
      onScrollParallax();
      updateDotnav();
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScrollProgress();
  onScrollParallax();

  /* ---------- Animated number counter ---------- */
  function countUp(el) {
    var target = parseInt(el.textContent, 10);
    if (isNaN(target)) return;
    var dur = 1200, start = null;
    function tick(now) {
      if (start === null) start = now;
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick); else el.textContent = target;
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Scroll reveal choreography ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          var num = entry.target.querySelector('.stat__num b');
          if (num && !num.dataset.counted) { num.dataset.counted = '1'; countUp(num); }
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Side section navigator (right rail) ---------- */
  var navSections = Array.prototype.slice.call(document.querySelectorAll('[data-dot-sq]'));
  var navItems = [], navFill = null;

  if (navSections.length >= 2 && window.innerWidth > 860) {
    var dn = document.createElement('nav');
    dn.className = 'dotnav';
    dn.setAttribute('aria-label', 'Section navigation');
    var track = document.createElement('span'); track.className = 'dotnav__track';
    navFill = document.createElement('span'); navFill.className = 'dotnav__fill';
    track.appendChild(navFill); dn.appendChild(track);

    var curLang = document.documentElement.getAttribute('lang') === 'en' ? 'en' : 'sq';
    navSections.forEach(function (sec, i) {
      if (!sec.id) sec.id = 'sec-' + i;
      var a = document.createElement('a');
      a.className = 'dotnav__item' + (i === 0 ? ' is-active' : '');
      a.href = '#' + sec.id;
      var dot = document.createElement('span'); dot.className = 'dotnav__dot';
      var label = document.createElement('span'); label.className = 'dotnav__label';
      label.setAttribute('data-sq', sec.getAttribute('data-dot-sq'));
      label.setAttribute('data-en', sec.getAttribute('data-dot-en'));
      label.textContent = curLang === 'en' ? sec.getAttribute('data-dot-en') : sec.getAttribute('data-dot-sq');
      a.appendChild(dot); a.appendChild(label);
      dn.appendChild(a);
      navItems.push(a);
    });
    document.body.appendChild(dn);
  }

  function updateDotnav() {
    if (!navItems.length) return;
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    if (navFill) navFill.style.height = (max > 0 ? (window.scrollY / max * 100) : 0) + '%';
    var pos = window.scrollY + window.innerHeight * 0.35;
    var activeIdx = 0;
    navSections.forEach(function (s, i) { if (s.offsetTop <= pos) activeIdx = i; });
    navItems.forEach(function (a, i) { a.classList.toggle('is-active', i === activeIdx); });
  }
  updateDotnav();

  /* ---------- Catalogue category filter ---------- */
  var filterBtns = document.querySelectorAll('.filter__btn');
  var products = document.querySelectorAll('.product');
  var emptyMsg = document.querySelector('.empty');

  if (filterBtns.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cat = btn.dataset.filter;
        filterBtns.forEach(function (b) { b.classList.remove('is-active'); b.setAttribute('aria-pressed', false); });
        btn.classList.add('is-active'); btn.setAttribute('aria-pressed', true);

        var shown = 0;
        products.forEach(function (p) {
          var match = cat === 'all' || p.dataset.cat === cat;
          p.style.display = match ? '' : 'none';
          if (match) { shown++; p.classList.add('is-in'); }
        });
        if (emptyMsg) emptyMsg.style.display = shown === 0 ? 'block' : 'none';
      });
    });
  }

  /* ---------- Contact form (demo handler) ---------- */
  var form = document.querySelector('.form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = form.querySelector('.form__success');
      if (ok) ok.classList.add('is-visible');
      form.reset();
      if (ok) ok.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
