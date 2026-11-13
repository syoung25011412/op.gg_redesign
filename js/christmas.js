/* ============================================================
   WINTER BLUE — 겨울 시즌 캠페인 페이지 인터랙션
   본 페이지(main.js)와 같은 규칙을 따릅니다.
   - 짧은 반응(170ms) / 펼침(230ms)
   - prefers-reduced-motion 이면 연출을 끄고 내용만 보여줍니다.
   - JS 가 꺼져 있어도 본문은 전부 보입니다.
   ============================================================ */
(() => {
  'use strict';

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 눈 내리는 배경 ---------- */
  const snow = $('[data-snow]');
  if (snow && !reduceMotion && window.innerWidth > 560) {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 34; i++) {
      const f = document.createElement('i');
      const size = 2 + Math.random() * 4;
      f.style.left = (Math.random() * 100).toFixed(2) + '%';
      f.style.width = f.style.height = size.toFixed(1) + 'px';
      f.style.opacity = (0.25 + Math.random() * 0.4).toFixed(2);
      f.style.animationDuration = (9 + Math.random() * 11).toFixed(1) + 's';
      f.style.animationDelay = (-Math.random() * 20).toFixed(1) + 's';
      f.style.setProperty('--drift', (Math.random() * 90 - 45).toFixed(0) + 'px');
      frag.appendChild(f);
    }
    snow.appendChild(frag);
  }

  /* ---------- 포로의 선물 상자 ---------- */
  const GIFTS = [
    { kind: '오늘의 챔피언', title: '애니비아', body: '얼음 벽으로 길을 끊는 챔피언이에요.\n벽 하나로 싸움의 모양이 바뀌는 재미를 느껴 보세요.' },
    { kind: '오늘의 챔피언', title: '누누와 윌럼프', body: '눈덩이를 굴려 상대에게 덮치는 챔피언이에요.\n오래 굴릴수록 더 세게 부딪힙니다.' },
    { kind: '오늘의 챔피언', title: '세주아니', body: '얼음 멧돼지를 타고 먼저 들어가는 챔피언이에요.\n팀이 따라 들어올 길을 열어 줍니다.' },
    { kind: '전적 읽는 법', title: '승률만 보지 마세요', body: '20게임 60%와 200게임 60%는 의미가 달라요.\n게임 수를 함께 보면 그 숫자가 얼마나 단단한지 알 수 있어요.' },
    { kind: '전적 읽는 법', title: 'KDA는 비율이에요', body: '(킬 + 어시스트) ÷ 데스로 계산해요.\n죽지 않는 것만으로도 숫자가 올라간다는 뜻이에요.' },
    { kind: '첫 판 팁', title: '한 챔피언만 해보세요', body: '여러 챔피언을 번갈아 하기보다\n하나를 열 판 해보는 쪽이 훨씬 빨리 익숙해져요.' },
    { kind: '첫 판 팁', title: '죽는 이유를 한 가지만 찾기', body: '게임이 끝나면 "왜 죽었지?"를 한 번만 떠올려 보세요.\n그것만으로도 다음 판이 달라집니다.' },
    { kind: '겨울 인사', title: '포로가 인사를 건넸어요', body: '눈 내리는 칼바람 나락에서 포로가 손을 흔들어요.\n천천히 둘러보다 가도 괜찮아요.' }
  ];

  const giftBtn = $('[data-gift]');
  const giftOpen = $('[data-gift-open]');
  const giftAgain = $('[data-gift-again]');
  let lastIndex = -1;

  function drawGift() {
    /* 같은 결과가 연속으로 나오지 않게 한 번만 다시 뽑습니다. */
    let i = Math.floor(Math.random() * GIFTS.length);
    if (i === lastIndex) i = (i + 1) % GIFTS.length;
    lastIndex = i;
    const g = GIFTS[i];

    $('[data-gift-empty]').hidden = true;
    const card = $('[data-gift-card]');
    card.hidden = false;
    card.style.animation = 'none';
    void card.offsetWidth;          /* 다시 열 때도 등장 연출이 보이도록 */
    card.style.animation = '';

    $('[data-gift-kind]').textContent = g.kind;
    $('[data-gift-title]').textContent = g.title;
    $('[data-gift-body]').textContent = g.body;

    giftBtn.classList.add('is-open');
    $('.gift-label', giftBtn).textContent = '다시 누르면 새로 열려요';
    giftOpen.hidden = true;
    giftAgain.hidden = false;
  }

  [giftBtn, giftOpen, giftAgain].forEach(el => el && el.addEventListener('click', drawGift));

  /* ---------- 겨울 기록 막대 (32게임 중 19승) ---------- */
  const bars = $('[data-bars]');
  if (bars) {
    const total = 32, wins = 19;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < total; i++) {
      const b = document.createElement('i');
      if (i < wins) b.className = 'on';
      frag.appendChild(b);
    }
    bars.appendChild(frag);
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

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealPending.forEach(el => el.classList.add('is-in'));
    revealPending = [];
  } else {
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

    const line = doc.clientHeight * 0.35;
    let active = sections[0];
    sections.forEach(s => { if (s.getBoundingClientRect().top <= line) active = s; });

    railLinks.forEach(a => {
      if (a.getAttribute('href') === '#' + active.id) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });

    revealCheck();
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(onScroll);
  }, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  /* 앵커 이동 후 해당 섹션으로 포커스 이동 */
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

  onScroll();
})();
