/* ============================================================
   PARTY NIGHT — 파티 룰렛
   공통 동작(컨페티·스크롤 등장·내비게이션)은 js/event.js 에 있습니다.

   ※ 내용 미정 상태입니다.
     아래 SPINS 배열만 바꾸면 룰렛 결과가 통째로 바뀝니다.
     칸 수(룰렛 조각)는 SEGMENTS 로 맞춰 주세요. 지금은 6칸입니다.
   ============================================================ */
(() => {
  'use strict';
  const { $, reduceMotion, drawer } = window.EventPage;

  const SEGMENTS = 6;   /* 룰렛 조각 수 — theme-party.css 의 conic-gradient 와 맞춥니다 */

  /* ----- 내용 교체 지점 : 룰렛에서 나올 문구 (임시 초안) ----- */
  const SPINS = [
    { kind: '오늘의 모드', title: '칼바람 나락',
      body: '한 길에서 바로 싸우는 모드예요.\n복잡한 준비 없이 교전부터 해보고 싶을 때 좋아요.' },
    { kind: '오늘의 챌린지', title: '한 판은 끝까지',
      body: '불리해도 한 판만 끝까지 가보기.\n후반에만 보이는 장면이 분명히 있어요.' },
    { kind: '오늘의 챔피언', title: '징크스',
      body: '멀리서 크게 터뜨리는 챔피언이에요.\n한 번 풀리면 분위기를 통째로 바꿉니다.' },
    { kind: '오늘의 챔피언', title: '트위스티드 페이트',
      body: '카드 한 장으로 멀리서 합류하는 챔피언이에요.\n지도 전체를 보는 재미가 있어요.' },
    { kind: '밤의 팁', title: '한 판 하고 쉬기',
      body: '연속으로 지면 판단이 흐려져요.\n한 판 쉬고 돌아오는 쪽이 오히려 빠릅니다.' },
    { kind: '파티 인사', title: '오늘은 가볍게',
      body: '오늘 밤은 이기는 것보다 즐기는 쪽으로.\n천천히 둘러보다 가도 괜찮아요.' }
  ];
  /* ----- 교체 지점 끝 ----- */

  const area = $('[data-draw]');
  const wheel = $('[data-wheel]');
  const openBtn = $('[data-draw-open]');
  if (!area || !wheel) return;

  let turns = 0;

  const pick = drawer(SPINS.slice(0, SEGMENTS), index => {
    area.classList.add('is-open');
    const label = $('.draw-label');
    if (label) label.textContent = '다시 누르면 새로 돌아가요';
    if (openBtn) openBtn.textContent = '다시 돌리기';

    /* 뽑힌 칸의 가운데가 위쪽 화살표에 오도록 회전시킵니다.
       conic-gradient 는 위(12시)가 0도이고 시계 방향으로 커집니다. */
    if (reduceMotion) return;
    turns += 3;
    const center = index * (360 / SEGMENTS) + (360 / SEGMENTS) / 2;
    wheel.style.transform = `rotate(${turns * 360 - center}deg)`;
  });

  [area, openBtn].forEach(el => el && el.addEventListener('click', pick));
})();
