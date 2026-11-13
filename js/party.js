/* ============================================================
   HALL OF FAME — 유리 구슬 속 명장면
   공통 동작(컨페티·스크롤 등장·내비게이션)은 js/event.js 에 있습니다.

   ───────────── 내용 추가·수정하는 법 ─────────────
   아래 MOMENTS 배열에 항목을 하나 넣으면 구슬이 하나 늘어납니다.

   {
     id:      '고유값(영문·숫자)',
     year:    2025,                       // 연도 거르기에 쓰입니다
     event:   '2025 월즈 결승',
     title:   '화면에 크게 보일 한 줄',
     score:   'T1 3 - 2 KT 롤스터',       // 없으면 생략됩니다
     desc:    '두세 줄 설명',
     player:  '구마유시 (이민형) · T1',
     champion:'MissFortune',              // Data Dragon 영문 키 (띄어쓰기 없이)
     champKo: '미스 포츈',                // 화면에 보일 한글 이름
     skinNum: 0,                          // 0 = 기본 스킨. 월즈 스킨이면 그 번호
     skinKo:  '',                         // 스킨 한글 이름. 비우면 "확인 중"
     items:   [3031, 6676],               // Data Dragon 아이템 번호. 비우면 "확인 중"
     video:   '',                         // 유튜브 영상 ID. 넣으면 상세에 영상이 뜹니다
     status:  'verified',                 // 'verified' 또는 'checking'
     sources: [{ label: '출처 이름', url: 'https://...' }]
   }

   · champion 값은 Data Dragon 키입니다. 예) 아트록스 Aatrox, 미스 포츈 MissFortune,
     리 신 LeeSin, 트위스티드 페이트 TwistedFate, 신 짜오 XinZhao.
   · 이미지는 Riot 의 공개 데이터를 주소로만 불러옵니다. 따로 저장하지 않습니다.
   · 확실하지 않은 항목은 status 를 'checking' 으로 두세요. 화면에 '확인 중' 이 붙습니다.
   ============================================================ */
(() => {
  'use strict';
  const { $, $$, reduceMotion } = window.EventPage;

  const DDRAGON = 'https://ddragon.leagueoflegends.com';
  let ddVersion = '15.21.1';            /* 아이템 아이콘용 기본값. 아래에서 최신본으로 갱신합니다 */

  /* ============================================================
     ▼▼▼ 내용 교체 지점 ▼▼▼
     지금은 여러 매체에서 같게 적고 있는 내용만 넣어 두었습니다.
     챔피언·스킨·아이템은 경기별 확인이 끝나는 대로 채웁니다.
     ============================================================ */
  const MOMENTS = [
    {
      id: 'w2022-final',
      year: 2022,
      event: '2022 월즈 결승',
      title: '데프트의 마지막 춤',
      score: 'DRX 3 - 2 T1',
      desc: '플레이-인부터 올라온 팀이 결승에서 T1 을 잡았어요.\n데뷔 10년 차 데프트의 첫 우승이었습니다.',
      player: '킹겐 (황성훈) · DRX · 결승 MVP',
      champion: 'Aatrox',
      champKo: '아트록스',
      skinNum: 0,
      skinKo: 'DRX 아트록스 (월즈 우승 스킨)',
      items: [],
      video: '',
      status: 'verified',
      sources: [
        { label: '위키백과 · 2022 월즈 결승', url: 'https://en.wikipedia.org/wiki/2022_League_of_Legends_World_Championship_final' },
        { label: 'esports.gg', url: 'https://esports.gg/news/league-of-legends/drx-win-the-2022-league-of-legends-world-championship' }
      ]
    },
    {
      id: 'w2023-final',
      year: 2023,
      event: '2023 월즈 결승',
      title: '홈에서 든 소환사의 컵',
      score: 'T1 3 - 0 WBG',
      desc: '서울에서 열린 결승에서 T1 이 세 판을 내리 가져갔어요.\n제우스가 결승 MVP 를 받았습니다.',
      player: '제우스 (최우제) · T1 · 결승 MVP',
      champion: 'Jayce',
      champKo: '제이스',
      skinNum: 0,
      skinKo: 'T1 제이스 (월즈 우승 스킨)',
      items: [],
      video: '',
      status: 'checking',
      sources: [
        { label: 'esports.net · 월즈 스킨 정리', url: 'https://www.esports.net/wiki/guides/lol-worlds-skins' }
      ]
    },
    {
      id: 'w2024-final',
      year: 2024,
      event: '2024 월즈 결승',
      title: '다섯 번째 우승',
      score: 'T1 3 - 2 BLG',
      desc: '다섯 판까지 간 결승이었어요.\n페이커가 다섯 번째 우승을 들어 올렸습니다.',
      player: 'T1',
      champion: 'Sylas',
      champKo: '사일러스',
      skinNum: 0,
      skinKo: 'T1 사일러스 (월즈 우승 스킨 · 프레스티지)',
      items: [],
      video: '',
      status: 'checking',
      sources: [
        { label: 'esports.net · 월즈 스킨 정리', url: 'https://www.esports.net/wiki/guides/lol-worlds-skins' }
      ]
    },
    {
      id: 'w2025-final',
      year: 2025,
      event: '2025 월즈 결승',
      title: '사상 첫 3연패, 그리고 통신사 대전',
      score: 'T1 3 - 2 KT 롤스터',
      desc: '같은 리그의 두 팀이 결승에서 만났어요.\n다섯 번째 판에서 구마유시의 미스 포츈이 경기를 끝냈습니다.',
      player: '구마유시 (이민형) · T1 · 결승 MVP',
      champion: 'MissFortune',
      champKo: '미스 포츈',
      skinNum: 0,
      skinKo: '',
      items: [],
      video: '',
      status: 'verified',
      sources: [
        { label: 'Inven Global', url: 'https://www.invenglobal.com/articles/19880/t1-makes-esports-history-with-third-straight-lol-worlds-championship-win' },
        { label: 'sheepesports', url: 'https://www.sheepesports.com/articles/lol-worlds-2025-t1-claim-their-sixth-title-after-winning-the-greatest-telecom-war-in-history/en' }
      ]
    },
    {
      id: 'msi2026-final',
      year: 2026,
      event: '2026 MSI 결승',
      title: '한화생명의 첫 국제 우승',
      score: 'HLE 3 - 2 BLG',
      desc: '다섯 판 접전 끝에 한화생명이 MSI 를 가져갔어요.',
      player: '한화생명 e스포츠',
      champion: 'Ahri',
      champKo: '확인 중',
      skinNum: 0,
      skinKo: '',
      items: [],
      video: '',
      status: 'checking',
      sources: [
        { label: 'sheepesports', url: 'https://www.sheepesports.com/us/lol/articles/hanwha-life-esports-crowned-msi-2026-champion-after-3-2-against-bilibili-gaming/en' }
      ]
    },
    {
      id: 'w2026-semi',
      year: 2026,
      event: '2026 월즈 4강',
      title: '왕조의 문이 닫힌 날',
      score: 'BLG 3 - 1 T1',
      desc: '3연패를 하던 팀이 4강에서 멈췄어요.\n2026 월즈 결승은 11월 14일 뉴욕에서 열립니다.',
      player: 'Bilibili Gaming',
      champion: 'Jinx',
      champKo: '확인 중',
      skinNum: 0,
      skinKo: '',
      items: [],
      video: '',
      status: 'checking',
      sources: [
        { label: 'sheepesports', url: 'https://www.sheepesports.com/de/articles/bilibili-gaming-is-the-second-worlds-2026-finalist-after-defeating-t1-3-1/en' }
      ]
    }
  ];
  /* ▲▲▲ 내용 교체 지점 끝 ▲▲▲ */

  const grid = $('[data-orbs]');
  const dlg = $('[data-moment]');
  if (!grid || !dlg) return;

  const splash = (champ, num) => `${DDRAGON}/cdn/img/champion/splash/${champ}_${num || 0}.jpg`;
  const itemIcon = id => `${DDRAGON}/cdn/${ddVersion}/img/item/${id}.png`;

  /* ---------- 구슬 그리기 ---------- */
  function orb(m, i) {
    const li = document.createElement('li');
    li.className = 'orb-cell';
    li.style.setProperty('--i', i);
    li.dataset.year = m.year;

    li.innerHTML = `
      <button type="button" class="orb" data-open="${m.id}">
        <span class="orb-media">
          <img src="${splash(m.champion, m.skinNum)}" alt="" loading="lazy" decoding="async">
        </span>
        <span class="orb-glass" aria-hidden="true"></span>
        <span class="orb-year" aria-hidden="true">${m.year}</span>
        ${m.status === 'checking' ? '<span class="orb-flag" aria-hidden="true">확인 중</span>' : ''}
        <span class="sr-only">${m.event} · ${m.title}${m.status === 'checking' ? ' (확인 중)' : ''}</span>
      </button>
      <p class="orb-cap"><b>${m.event}</b><span>${m.title}</span></p>
    `;
    /* 이미지가 없으면 구슬만 남기고 조용히 넘어갑니다 */
    const img = $('img', li);
    img.addEventListener('error', () => { img.remove(); }, { once: true });
    return li;
  }

  function render(year) {
    const list = year === 'all' ? MOMENTS : MOMENTS.filter(m => String(m.year) === String(year));
    grid.replaceChildren(...list.map(orb));
    const note = $('[data-orb-count]');
    if (note) {
      const checking = list.filter(m => m.status === 'checking').length;
      note.textContent = `${list.length}개의 구슬`
        + (checking ? ` · 그중 ${checking}개는 아직 확인 중이에요.` : '');
    }
  }

  /* ---------- 연도 거르기 ---------- */
  const years = ['all', ...Array.from(new Set(MOMENTS.map(m => m.year))).sort()];
  const filters = $('[data-filters]');
  if (filters) {
    filters.replaceChildren(...years.map((y, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'orb-filter';
      b.textContent = y === 'all' ? '전체' : y + '년';
      b.setAttribute('aria-pressed', String(i === 0));
      b.addEventListener('click', () => {
        $$('.orb-filter', filters).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
        render(y);
      });
      return b;
    }));
  }

  /* ---------- 상세 ---------- */
  let lastFocus = null;

  function open(id) {
    const m = MOMENTS.find(x => x.id === id);
    if (!m) return;
    lastFocus = document.activeElement;

    /* 이미지를 못 불러오면 큰 빈 칸이 남지 않도록 머리 영역을 접습니다 */
    const media = $('.moment-media');
    const art = $('[data-moment-art]');
    media.classList.remove('is-empty');
    art.style.display = '';
    art.onerror = () => { art.style.display = 'none'; media.classList.add('is-empty'); };
    art.alt = `${m.champKo || m.champion} 일러스트`;
    art.src = splash(m.champion, m.skinNum);

    const vid = $('[data-moment-video]');
    if (m.video) {
      vid.hidden = false;
      vid.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${m.video}"
        title="${m.title} 하이라이트" loading="lazy" allowfullscreen
        referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
    } else {
      vid.hidden = true;
      vid.replaceChildren();
    }

    $('[data-moment-year]').textContent = m.year + '년';
    $('[data-moment-event]').textContent = m.event;
    $('[data-moment-title]').textContent = m.title;
    $('[data-moment-score]').textContent = m.score || '';
    $('[data-moment-desc]').textContent = m.desc || '';
    $('[data-moment-player]').textContent = m.player || '확인 중';
    $('[data-moment-champ]').textContent = m.champKo || m.champion || '확인 중';
    $('[data-moment-skin]').textContent = m.skinKo || '확인 중';

    const items = $('[data-moment-items]');
    if (m.items && m.items.length) {
      items.className = 'moment-items';
      items.replaceChildren(...m.items.map(id2 => {
        const im = document.createElement('img');
        im.src = itemIcon(id2);
        im.alt = '';
        im.loading = 'lazy';
        im.addEventListener('error', () => im.remove(), { once: true });
        return im;
      }));
    } else {
      items.className = 'moment-pending';
      items.textContent = '확인 중이에요. 경기별 기록을 대조한 뒤 채웁니다.';
    }

    const src = $('[data-moment-sources]');
    src.innerHTML = (m.sources && m.sources.length)
      ? '출처 · ' + m.sources.map(s =>
          `<a href="${s.url}" target="_blank" rel="noopener">${s.label} ↗</a>`).join(' · ')
      : '출처를 확인하는 중이에요.';

    dlg.dataset.status = m.status;
    dlg.showModal();
  }

  function close() {
    $('[data-moment-video]').replaceChildren();   /* 영상 소리가 남지 않도록 */
    dlg.close();
  }

  grid.addEventListener('click', e => {
    const btn = e.target.closest('[data-open]');
    if (btn) open(btn.dataset.open);
  });
  $('[data-moment-close]').addEventListener('click', close);
  dlg.addEventListener('click', e => { if (e.target === dlg) close(); });
  dlg.addEventListener('close', () => {
    $('[data-moment-video]').replaceChildren();
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  });

  /* ---------- 시작 ---------- */
  render('all');

  /* 아이템 아이콘 주소에 쓸 최신 버전을 받아 둡니다. 실패해도 페이지는 그대로 돌아갑니다. */
  fetch(`${DDRAGON}/api/versions.json`)
    .then(r => r.ok ? r.json() : null)
    .then(v => { if (Array.isArray(v) && v[0]) ddVersion = v[0]; })
    .catch(() => {});

  /* 구슬이 천천히 떠 있는 느낌 — 동작 줄이기면 멈춥니다 */
  if (reduceMotion) grid.classList.add('no-float');
})();
