/* ============================================================
   OP.GG FIRST PLAY — 인터랙션
   원칙(05_Design_System / 04 MOTION)
   - 클릭·탭 170ms, 펼침 230ms. 짧고 가볍게.
   - 스크롤 등장은 '선택 항목'만. 핵심 정보는 항상 보이게.
   - prefers-reduced-motion 이 켜져 있으면 모든 연출을 끈다.
   ============================================================ */
(() => {
  'use strict';

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 한글 받침에 맞춰 조사를 고릅니다. 예) 아리는 / 가렌은 */
  function josa(word, withFinal, withoutFinal) {
    const last = word.charCodeAt(word.length - 1);
    const isHangul = last >= 0xAC00 && last <= 0xD7A3;
    const hasFinal = isHangul && (last - 0xAC00) % 28 !== 0;
    return word + (hasFinal ? withFinal : withoutFinal);
  }

  /* ---------- 데이터 : 챔피언 ---------- */
  const CHAMPIONS = {
    agility: {
      pref: '기동성', tone: 'agility', initial: 'A', label: 'AHRI / 아리', name: '아리',
      summary: '마법과 이동을 활용해 전투의 기회를 만드는',
      title: '움직임으로<br>기회를 만드는 아리.',
      lead: '마법과 이동을 활용하는 챔피언을<br>쉬운 설명부터 만나보세요.',
      panels: {
        trait: ['이동하며 전투의 기회를 만들어요.', '궁극기의 이동 능력처럼, 챔피언의 특징을 하나씩 살펴볼 수 있어요.'],
        skill: ['맞히는 스킬과 빠져나오는 이동을 함께 써요.', '스킬을 맞혀 상대를 붙잡고, 이동으로 안전하게 빠져나오는 순서를 익히면 돼요.'],
        use:   ['기회를 만든 뒤 한 번에 들어가요.', '팀원이 상대를 붙잡았을 때 들어가면 가장 안전하게 기회를 살릴 수 있어요.']
      }
    },
    easy: {
      pref: '쉬운 조작', tone: 'easy', initial: 'G', label: 'GAREN / 가렌', name: '가렌',
      summary: '간단한 조작으로 앞에서 버티며 싸우는',
      title: '기본에 충실해<br>단단하게 버티는 가렌.',
      lead: '조작이 간단한 챔피언으로<br>게임의 기본기를 먼저 익혀보세요.',
      panels: {
        trait: ['버티면서 싸움을 길게 끌어요.', '복잡한 조작 없이도 체력과 방어력으로 교전을 버틸 수 있어요.'],
        skill: ['누르는 순서만 익히면 돼요.', '달려들기 → 공격 → 마무리. 세 가지 순서만 기억하면 충분해요.'],
        use:   ['먼저 앞에 서서 길을 열어요.', '팀보다 조금 앞에 서서 상대의 시선을 끌어주는 역할이 잘 맞아요.']
      }
    },
    support: {
      pref: '팀 지원', tone: 'support', initial: 'L', label: 'LEONA / 레오나', name: '레오나',
      summary: '팀이 먼저 싸움을 열 수 있게 돕는',
      title: '팀과 함께<br>싸움을 여는 레오나.',
      lead: '혼자보다 함께일 때 강한 챔피언을<br>쉬운 설명부터 만나보세요.',
      panels: {
        trait: ['팀이 싸울 수 있게 길을 만들어요.', '상대를 붙잡아 두면 팀원이 안전하게 공격할 시간이 생겨요.'],
        skill: ['붙잡는 스킬을 이어서 써요.', '다가가서 묶고, 주변을 함께 멈추는 순서로 쓰면 효과가 가장 커요.'],
        use:   ['시작 신호를 팀에게 알려요.', '내가 먼저 들어가는 순간이 팀 전체의 공격 신호가 돼요.']
      }
    }
  };

  /* ---------- 데이터 : 전적 지표 ---------- */
  const METRICS = {
    winrate: {
      value: '60%', countTo: 60, suffix: '%', sub: '12승 8패',
      title: '20번 중 12번 이긴 기록이에요.',
      body: '기간과 게임 수를 함께 보며 이해해 주세요.',
      recap: '승률',
      viz: () => blocks(20, 12, 'on')
    },
    kda: {
      value: '4.0', countTo: 4, suffix: '', decimals: 1, sub: '8킬 · 4데스 · 8어시스트',
      title: '(킬 + 어시스트) ÷ 데스 = 4.0이에요.',
      body: '최근 1경기 기준이에요. 평균은 게임 수가 쌓여야 의미가 생겨요.',
      recap: 'KDA',
      viz: () => rows([['킬', 8, 8], ['데스', 4, 8], ['어시스트', 8, 8]])
    },
    games: {
      value: '20게임', countTo: 20, suffix: '게임', sub: '개인/2인 랭크 · 최근 20경기',
      title: '20경기를 기준으로 계산한 기록이에요.',
      body: '게임 수가 적으면 승률이 크게 흔들려요. 기준을 함께 보는 습관이 중요해요.',
      recap: '게임 수',
      viz: () => blocks(20, 20, 'alt')
    }
  };

  function blocks(total, on, cls) {
    const wrap = document.createElement('div');
    wrap.className = 'viz-blocks';
    wrap.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < total; i++) {
      const i2 = document.createElement('i');
      if (i < on) i2.className = cls;
      wrap.appendChild(i2);
    }
    return wrap;
  }

  function rows(list) {
    const wrap = document.createElement('div');
    wrap.className = 'viz-rows';
    wrap.setAttribute('aria-hidden', 'true');
    list.forEach(([label, v, max]) => {
      const row = document.createElement('div');
      row.className = 'viz-row';
      row.innerHTML = `<span>${label}</span><div class="viz-track"><i></i></div><b>${v}</b>`;
      wrap.appendChild(row);
      requestAnimationFrame(() => { $('i', $('.viz-track', row)).style.width = (v / max * 100) + '%'; });
    });
    return wrap;
  }

  /* ---------- 데이터 : 가이드 질문 ---------- */
  const QUESTIONS = {
    champ: {
      ask: c => `${josa(c.name, '은', '는')} 어떤 챔피언인가요?`,
      answer: c => `${josa(c.name, '은', '는')} ${c.summary} 챔피언이에요.\n${c.panels.trait[1]}\n특징부터 살펴보고 스킬을 확인해 보세요.`,
      link: '챔피언 소개 다시 보기 →', href: '#champion', recap: '챔피언 특징'
    },
    record: {
      ask: () => '전적은 어떻게 읽나요?',
      answer: () => '승률은 이긴 비율이고, KDA는 (킬 + 어시스트) ÷ 데스예요.\n숫자 하나만 보지 말고 기간과 게임 수를 함께 보면\n그 기록이 어떤 상황에서 나온 건지 알 수 있어요.',
      link: '전적 해석 다시 보기 →', href: '#records', recap: '전적 읽는 법'
    },
    start: {
      ask: () => '무엇부터 보면 좋을까요?',
      answer: () => '먼저 마음에 드는 플레이 방식을 하나 고르고,\n그 챔피언의 기록을 읽어 보세요.\n모르는 용어가 나오면 다시 질문하면 돼요.',
      link: '취향 선택으로 가기 →', href: '#preference', recap: '시작하는 순서'
    }
  };

  /* ---------- 데이터 : 시즌 테마 ---------- */
  const THEMES = {
    winter: {
      name: 'Winter Blue', desc: '차분한 겨울 분위기의 캠페인 예시', image: true,
      cta: { href: './christmas.html', label: 'Winter Blue 캠페인 열어보기 ↗' }
    },
    party:  {
      name: 'Party Night', desc: '밝고 들뜬 분위기의 캠페인 예시', image: false,
      cta: { href: './party.html', label: 'Party Night 캠페인 열어보기 ↗' }
    }
  };

  /* ---------- 상태 ---------- */
  const state = {
    preference: null,     // 선택 전에는 null → 03 섹션은 기본 예시(아리)로 보여줌
    metric: 'winrate',
    metricsSeen: new Set(),
    question: null,
    theme: 'winter'
  };
  const currentChampion = () => CHAMPIONS[state.preference || 'agility'];

  /* 내용 교체 시 아주 짧은 페이드 */
  function swap(el, apply) {
    if (!el) return;
    if (reduceMotion) { apply(); return; }
    el.classList.add('is-swapping');
    setTimeout(() => { apply(); el.classList.remove('is-swapping'); }, 120);
  }

  /* ============================================================
     02 취향 선택
     ============================================================ */
  const choiceBtns = $$('[data-choice]');
  const choiceFeedback = $('[data-choice-feedback]');
  const choiceNext = $('[data-choice-next]');

  choiceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      state.preference = btn.dataset.choice;
      choiceBtns.forEach(b => b.setAttribute('aria-checked', String(b === btn)));

      const champ = currentChampion();
      choiceFeedback.textContent = `선택: ${champ.pref} · ${champ.name} 소개 예시로 이어집니다.`;
      choiceFeedback.classList.add('is-on');

      choiceNext.classList.remove('is-disabled');
      choiceNext.removeAttribute('aria-disabled');

      renderChampion();
      renderQuestionLabels();
      if (state.question) renderAnswer(state.question);
      renderRecap();
    });
  });

  /* 키보드: 라디오 그룹은 좌우 방향키로 이동 */
  $$('[role="radiogroup"]').forEach(group => {
    const items = $$('[role="radio"]', group);
    group.addEventListener('keydown', e => {
      const i = items.indexOf(document.activeElement);
      if (i < 0) return;
      let next = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = items[(i + 1) % items.length];
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   next = items[(i - 1 + items.length) % items.length];
      if (!next) return;
      e.preventDefault();
      next.focus();
      next.click();
    });
  });

  /* ============================================================
     03 챔피언
     ============================================================ */
  const champTabs = $$('[data-tab]');
  let champTab = 'trait';

  function renderChampion() {
    const c = currentChampion();
    const portrait = $('[data-champ-portrait]');

    swap($('[data-champ-title]'), () => {
      portrait.dataset.tone = c.tone;
      $('[data-champ-initial]').textContent = c.initial;
      $('[data-champ-label]').textContent = c.label;
      $('[data-champ-pref]').textContent = c.pref;
      $('[data-champ-title]').innerHTML = c.title;
      $('[data-champ-lead]').innerHTML = c.lead;
    });
    renderChampPanel();
  }

  function renderChampPanel() {
    const [h, p] = currentChampion().panels[champTab];
    const title = $('[data-champ-panel-title]');
    const body = $('[data-champ-panel-body]');
    swap(title, () => { title.textContent = h; body.textContent = p; });
  }

  champTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      champTab = btn.dataset.tab;
      champTabs.forEach(b => {
        const on = b === btn;
        b.setAttribute('aria-selected', String(on));
        b.tabIndex = on ? 0 : -1;
      });
      $('#panel-champ').setAttribute('aria-labelledby', btn.id);
      renderChampPanel();
    });
  });

  /* ============================================================
     04 전적 지표
     ============================================================ */
  const metricTabs = $$('[data-metric]');
  let recordInView = false;

  function renderMetric(animateNumber, markSeen = true) {
    const m = METRICS[state.metric];
    const valueEl = $('[data-metric-value]');
    const vizEl = $('[data-metric-viz]');

    swap(valueEl, () => {
      $('[data-metric-sub]').textContent = m.sub;
      $('[data-metric-title]').textContent = m.title;
      $('[data-metric-body]').textContent = m.body;
      vizEl.replaceChildren(m.viz());

      if (animateNumber && !reduceMotion) countUp(valueEl, m);
      else valueEl.textContent = m.value;
    });

    if (markSeen) state.metricsSeen.add(state.metric);
    renderRecap();
  }

  /* 토스식 숫자 카운트업: 섹션에 처음 들어왔을 때와 탭 전환 때만 */
  function countUp(el, m) {
    const dur = 620, t0 = performance.now(), dec = m.decimals || 0;
    const tick = now => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (m.countTo * eased).toFixed(dec) + m.suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = m.value;
    };
    requestAnimationFrame(tick);
  }

  metricTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      state.metric = btn.dataset.metric;
      metricTabs.forEach(b => {
        const on = b === btn;
        b.setAttribute('aria-selected', String(on));
        b.tabIndex = on ? 0 : -1;
      });
      $('#panel-record').setAttribute('aria-labelledby', btn.id);
      renderMetric(true);
    });
  });

  /* 탭 공통 키보드 조작 */
  $$('[role="tablist"]').forEach(list => {
    const tabs = $$('[role="tab"]', list);
    list.addEventListener('keydown', e => {
      const i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      let next = null;
      if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowLeft')  next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === 'Home') next = tabs[0];
      if (e.key === 'End')  next = tabs[tabs.length - 1];
      if (!next) return;
      e.preventDefault();
      next.focus();
      next.click();
    });
  });

  /* ============================================================
     05 AI 가이드
     ============================================================ */
  const qBtns = $$('[data-question]');

  function renderQuestionLabels() {
    const label = $('[data-question-label]');
    if (label) label.textContent = QUESTIONS.champ.ask(currentChampion());
  }

  function renderAnswer(key) {
    const q = QUESTIONS[key];
    const c = currentChampion();
    $('[data-chat-empty]').hidden = true;

    const ask = $('[data-chat-ask]');
    const answer = $('[data-chat-answer]');
    ask.hidden = answer.hidden = false;

    /* 다시 눌렀을 때도 등장 모션이 보이도록 애니메이션 재시작 */
    [ask, answer].forEach(el => { el.style.animation = 'none'; void el.offsetWidth; el.style.animation = ''; });

    ask.textContent = q.ask(c);
    $('[data-chat-text]').textContent = q.answer(c);
    const link = $('[data-chat-link]');
    link.textContent = q.link;
    link.setAttribute('href', q.href);
  }

  qBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      state.question = btn.dataset.question;
      qBtns.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
      renderAnswer(state.question);
      renderRecap();
    });
  });

  /* ============================================================
     06 시즌 테마
     ============================================================ */
  const themeBtns = $$('[data-theme]');

  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      state.theme = btn.dataset.theme;
      themeBtns.forEach(b => b.setAttribute('aria-checked', String(b === btn)));

      const t = THEMES[state.theme];
      $('[data-theme-img]').hidden = !t.image;
      $('[data-theme-alt]').hidden = t.image;
      $('[data-theme-alt] span').textContent = t.name;
      $('[data-theme-caption]').textContent = `선택한 시즌 테마 비주얼 · ${t.name}`;

      const fb = $('[data-theme-feedback]');
      fb.textContent = `선택한 테마: ${t.name} · ${t.desc}`;
      fb.classList.add('is-on');

      /* Winter Blue 는 별도 캠페인 페이지로, Party Night 는 체험 정리로 이어집니다. */
      const cta = $('[data-theme-cta]');
      if (cta) {
        cta.setAttribute('href', t.cta.href);
        cta.textContent = t.cta.label;
      }
    });
  });

  /* ============================================================
     07 체험 요약
     ============================================================ */
  function renderRecap() {
    const map = {
      pref: state.preference
        ? `${CHAMPIONS[state.preference].pref} → ${CHAMPIONS[state.preference].name}`
        : null,
      metric: state.metricsSeen.size
        ? Array.from(state.metricsSeen).map(k => METRICS[k].recap).join(' · ')
        : null,
      question: state.question ? QUESTIONS[state.question].recap : null
    };

    $$('[data-recap]').forEach(card => {
      const v = map[card.dataset.recap];
      const el = $('[data-recap-value]', card);
      el.textContent = v || '아직 둘러보지 않았어요';
      card.classList.toggle('is-done', Boolean(v));
    });
  }

  /* ============================================================
     08 전적 검색 → 실제 OP.GG로 이동
     ============================================================ */
  const form = $('[data-search]');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const raw = $('#summoner', form).value.trim();
      const note = $('[data-search-note]', form);

      if (!raw) {
        note.textContent = '소환사명을 입력해 주세요. 예: PLAY#KR1';
        $('#summoner', form).focus();
        return;
      }
      const hasTag = raw.includes('#');
      const query = hasTag ? raw.replace('#', '-') : raw;
      note.textContent = hasTag
        ? '실제 OP.GG 전적 페이지를 새 탭에서 엽니다.'
        : '태그를 함께 넣으면 더 정확해요. 예: PLAY#KR1';
      window.open(`https://www.op.gg/summoners/kr/${encodeURIComponent(query)}`, '_blank', 'noopener');
    });
  }

  /* ============================================================
     스크롤 등장 (선택 항목만)
     ============================================================ */
  let revealPending = $$('[data-reveal]');

  function revealAll() {
    revealPending.forEach(el => el.classList.add('is-in'));
    revealPending = [];
  }

  /* 뷰포트 안이거나 이미 지나간 요소는 무조건 보이게 합니다.
     IntersectionObserver 는 빠른 점프 스크롤에서 중간 위치를 건너뛸 수 있는데,
     그 경우에도 본문이 숨겨진 채 남지 않도록 하는 안전장치입니다. */
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
    revealAll();
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

  /* 04 섹션에 처음 들어왔을 때 숫자 카운트업 한 번 */
  const recordCard = $('.record-card');
  if (recordCard && 'IntersectionObserver' in window) {
    const io2 = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || recordInView) return;
        recordInView = true;
        renderMetric(true, false);   /* 지나가며 본 것은 '체험함'으로 세지 않습니다 */
        obs.disconnect();
      });
    }, { threshold: 0.35 });
    io2.observe(recordCard);
  }

  /* ============================================================
     스크롤 진행률 · 현재 섹션 표시
     ============================================================ */
  const sections = $$('main > section[id]');
  const progress = $('[data-progress]');
  const navLinks = $$('.gnb a');
  const dots = $$('[data-dot]');
  let ticking = false;

  function onScroll() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    if (progress) progress.style.width = (max > 0 ? (doc.scrollTop / max) * 100 : 0) + '%';

    const line = doc.clientHeight * 0.35;
    let active = sections[0];
    sections.forEach(s => { if (s.getBoundingClientRect().top <= line) active = s; });

    navLinks.forEach(a => {
      const on = a.getAttribute('href') === '#' + active.id;
      if (on) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
    dots.forEach(d => {
      const on = d.getAttribute('href') === '#' + active.id;
      d.setAttribute('aria-current', on ? 'true' : 'false');
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

  /* 앵커 이동 후 해당 섹션으로 포커스를 넘겨 키보드 사용자도 따라가게 */
  $$('[data-nav]').forEach(a => {
    a.addEventListener('click', () => {
      const id = a.getAttribute('href');
      if (!id || !id.startsWith('#')) return;
      const target = $(id);
      if (!target) return;
      setTimeout(() => {
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }, reduceMotion ? 0 : 460);
    });
  });

  /* ---------- 초기 렌더 ---------- */
  renderChampion();
  renderQuestionLabels();
  renderMetric(false, false);
  renderRecap();
  onScroll();
})();
