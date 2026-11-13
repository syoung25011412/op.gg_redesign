/* ============================================================
   EVENT — 시즌 캠페인 페이지 공통 스크립트
   christmas.html(Winter Blue) 과 party.html(Party Night) 이 함께 씁니다.
   페이지별 스크립트(christmas.js / party.js)보다 먼저 불러옵니다.

   규칙
   - 짧은 반응(170ms) / 펼침(230ms)
   - prefers-reduced-motion 이면 연출을 끄고 내용만 보여줍니다.
   - JS 가 꺼져 있어도 본문은 전부 보입니다.
   ============================================================ */
(() => {
  'use strict';

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 떠다니는 입자 (눈송이 / 컨페티) ----------
     레이어에 data-particles="개수", 선택으로 data-colors="#a,#b" 를 둡니다.
     모양과 색은 테마 CSS 가 정합니다.                                  */
  function particles() {
    const layer = $('[data-particles]');
    if (!layer || reduceMotion || window.innerWidth <= 560) return;

    const count = Math.max(0, Math.min(80, parseInt(layer.dataset.particles, 10) || 0));
    const colors = (layer.dataset.colors || '').split(',').map(s => s.trim()).filter(Boolean);
    const frag = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
      const el = document.createElement('i');
      const w = 2 + Math.random() * 5;
      el.style.left = (Math.random() * 100).toFixed(2) + '%';
      el.style.width = w.toFixed(1) + 'px';
      el.style.height = (colors.length ? w * (1.4 + Math.random()) : w).toFixed(1) + 'px';
      el.style.opacity = (0.25 + Math.random() * 0.45).toFixed(2);
      el.style.animationDuration = (9 + Math.random() * 11).toFixed(1) + 's';
      el.style.animationDelay = (-Math.random() * 20).toFixed(1) + 's';
      el.style.setProperty('--drift', (Math.random() * 90 - 45).toFixed(0) + 'px');
      el.style.setProperty('--spin', (Math.random() * 1080 - 540).toFixed(0) + 'deg');
      if (colors.length) el.style.setProperty('--confetti', colors[i % colors.length]);
      frag.appendChild(el);
    }
    layer.appendChild(frag);
  }

  /* ---------- 기록 막대 ----------
     <div data-bars="총칸수" data-bars-on="칠할칸수"></div>          */
  function bars() {
    $$('[data-bars]').forEach(box => {
      const total = parseInt(box.dataset.bars, 10) || 0;
      const on = parseInt(box.dataset.barsOn, 10) || 0;
      const frag = document.createDocumentFragment();
      for (let i = 0; i < total; i++) {
        const b = document.createElement('i');
        if (i < on) b.className = 'on';
        frag.appendChild(b);
      }
      box.replaceChildren(frag);
    });
  }

  /* ---------- 결과 뽑기 (선물 상자 / 룰렛 공통) ----------
     items: [{ kind, title, body }]
     onPick(index) 로 페이지별 연출을 덧붙입니다.
     같은 결과가 연속으로 나오지 않게 한 번 다시 뽑습니다.             */
  function drawer(items, onPick) {
    const empty = $('[data-draw-empty]');
    const card  = $('[data-draw-card]');
    if (!card) return () => {};
    let last = -1;

    return function pick() {
      let i = Math.floor(Math.random() * items.length);
      if (i === last && items.length > 1) i = (i + 1) % items.length;
      last = i;
      const it = items[i];

      if (empty) empty.hidden = true;
      card.hidden = false;
      card.style.animation = 'none';
      void card.offsetWidth;            /* 다시 뽑을 때도 등장 연출이 보이도록 */
      card.style.animation = '';

      $('[data-draw-kind]').textContent  = it.kind;
      $('[data-draw-title]').textContent = it.title;
      $('[data-draw-body]').textContent  = it.body;

      if (typeof onPick === 'function') onPick(i, it);
    };
  }

  /* ---------- 스크롤 등장 ---------- */
  let revealPending = $$('[data-reveal]');

  function revealCheck() {
    if (!revealPending.length) return;
    const limit = window.innerHeight * 0.92;
    revealPending = revealPending.filter(el => {
      if (el.getBoundingClientRect().top > limit) return true;
      el.classList.add('is-in');
      return false;
    });
  }

  function initReveal() {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealPending.forEach(el => el.classList.add('is-in'));
      revealPending = [];
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        revealPending = revealPending.filter(el => el !== entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0 });
    revealPending.forEach(el => io.observe(el));
    revealCheck();
  }

  /* ---------- 진행률 · 현재 섹션 ---------- */
  const sections = $$('main > section[id]');
  const progress = $('[data-progress]');
  const railLinks = $$('.rail nav a');
  let ticking = false;

  function onScroll() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    if (progress) progress.style.width = (max > 0 ? (doc.scrollTop / max) * 100 : 0) + '%';

    if (sections.length) {
      const line = doc.clientHeight * 0.35;
      let active = sections[0];
      sections.forEach(s => { if (s.getBoundingClientRect().top <= line) active = s; });
      railLinks.forEach(a => {
        if (a.getAttribute('href') === '#' + active.id) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    }

    revealCheck();
    ticking = false;
  }

  /* ---------- 앵커 이동 후 포커스 넘기기 ---------- */
  function initAnchors() {
    $$('[data-nav]').forEach(a => {
      a.addEventListener('click', () => {
        const id = a.getAttribute('href');
        if (!id || !id.startsWith('#')) return;
        const t = $(id);
        if (!t) return;
        setTimeout(() => {
          t.setAttribute('tabindex', '-1');
          t.focus({ preventScroll: true });
        }, reduceMotion ? 0 : 460);
      });
    });
  }

  /* ---------- 시작 ---------- */
  particles();
  bars();
  initReveal();
  initAnchors();

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(onScroll);
  }, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  /* 페이지별 스크립트에서 쓰는 도구 */
  window.EventPage = { $, $$, reduceMotion, drawer };
})();
