/* ============================================================
   WINTER BLUE — 포로의 선물 상자
   공통 동작(눈·스크롤 등장·내비게이션)은 js/event.js 에 있습니다.
   ============================================================ */
(() => {
  'use strict';
  const { $, drawer } = window.EventPage;

  /* ----- 내용 교체 지점 : 선물 상자에서 나올 문구 ----- */
  const GIFTS = [
    { kind: '오늘의 챔피언', title: '애니비아',
      body: '얼음 벽으로 길을 끊는 챔피언이에요.\n벽 하나로 싸움의 모양이 바뀌는 재미를 느껴 보세요.' },
    { kind: '오늘의 챔피언', title: '누누와 윌럼프',
      body: '눈덩이를 굴려 상대에게 덮치는 챔피언이에요.\n오래 굴릴수록 더 세게 부딪힙니다.' },
    { kind: '오늘의 챔피언', title: '세주아니',
      body: '얼음 멧돼지를 타고 먼저 들어가는 챔피언이에요.\n팀이 따라 들어올 길을 열어 줍니다.' },
    { kind: '전적 읽는 법', title: '승률만 보지 마세요',
      body: '20게임 60%와 200게임 60%는 의미가 달라요.\n게임 수를 함께 보면 그 숫자가 얼마나 단단한지 알 수 있어요.' },
    { kind: '전적 읽는 법', title: 'KDA는 비율이에요',
      body: '(킬 + 어시스트) ÷ 데스로 계산해요.\n죽지 않는 것만으로도 숫자가 올라간다는 뜻이에요.' },
    { kind: '첫 판 팁', title: '한 챔피언만 해보세요',
      body: '여러 챔피언을 번갈아 하기보다\n하나를 열 판 해보는 쪽이 훨씬 빨리 익숙해져요.' },
    { kind: '첫 판 팁', title: '죽는 이유를 한 가지만 찾기',
      body: '게임이 끝나면 "왜 죽었지?"를 한 번만 떠올려 보세요.\n그것만으로도 다음 판이 달라집니다.' },
    { kind: '겨울 인사', title: '포로가 인사를 건넸어요',
      body: '눈 내리는 칼바람 나락에서 포로가 손을 흔들어요.\n천천히 둘러보다 가도 괜찮아요.' }
  ];
  /* ----- 교체 지점 끝 ----- */

  const gift = $('[data-gift]');
  const openBtn = $('[data-draw-open]');
  if (!gift) return;

  const pick = drawer(GIFTS, () => {
    gift.classList.add('is-open');
    $('.draw-label', gift).textContent = '다시 누르면 새로 열려요';
    if (openBtn) openBtn.textContent = '다시 열기';
  });

  [gift, openBtn].forEach(el => el && el.addEventListener('click', pick));
})();
