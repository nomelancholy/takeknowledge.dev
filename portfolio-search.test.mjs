import test from "node:test";
import assert from "node:assert/strict";
import { portfolioItems, searchPortfolio, readPortfolioSearchState, portfolioSearchParams, getProjectDetailHref } from "./portfolio-data.js";

const ids = (query, category) => searchPortfolio(query, category).map(item => item.id);
const gameIds = ["choi-the-salary-thief", "choi-rush-hour", "promotion-war", "ninja-choi-office-escape"];

test("finds tools by needs, synonyms, and Korean expressions instead of their titles", () => {
  const cases = [
    ["포스트잇 출력", "a4-sticky-guide"],
    ["메모지 프린트", "a4-sticky-guide"],
    ["post-it print", "a4-sticky-guide"],
    ["사진 속 큐알 읽기", "qr-pass"],
    ["사진으로 QR을 읽고 싶어요", "qr-pass"],
    ["QR code reader", "qr-pass"],
    ["홈트 리마인더", "fitpocket"],
    ["축구 판정", "see-var"],
    ["케이리그 오심", "see-var"],
    ["K League referee", "see-var"],
    ["코딩 처음 배우고 싶어요", "pumpkin-market-course"],
    ["프로그래밍 초보", "pumpkin-market-course"],
    ["도예 수업", "dot"],
    ["맛있는 수박 고르기", "watermelon-inspector"],
    ["여러 계정 관리", "supa-map"],
    ["사주", "my-energy-blueprint"],
    ["성격 테스트", "big5-ocean"],
  ];
  for (const [query, expected] of cases) assert.deepEqual(ids(query), [expected], query);
});

test("ranks direct names above related terms and lets additional needs narrow results", () => {
  assert.equal(ids("Supabase")[0], "supa-map");
  assert.deepEqual(ids("Supabase 배우기"), ["pumpkin-market-course"]);
  assert.deepEqual(ids("Supabase 관리"), ["supa-map"]);
  assert.deepEqual(ids("D.O.T."), ["dot"]);
  assert.deepEqual(new Set(ids("성향 분석")), new Set(["big5-ocean", "my-energy-blueprint"]));
  assert.deepEqual(new Set(ids("나를 알고 싶어요")), new Set(["big5-ocean", "my-energy-blueprint"]));
});

test("finds the wedding ledger by guest lists, cash gifts, and reception needs", () => {
  for (const query of ["축의금 장부", "축의금 정리", "하객 명단", "결혼식 장부", "축의금 접수", "현금 합계", "계좌이체 명부", "웨딩", "wedding ledger"]) {
    assert.deepEqual(ids(query), ["wedding-money"], query);
  }
  assert.deepEqual(ids("축의금", "game"), []);
  const project = searchPortfolio("하객 명단", "web")[0];
  assert.equal(project.linkHref, "https://wedding-money-chi.vercel.app/");
  assert.equal(getProjectDetailHref(project), "project.html?id=wedding-money");
});

test("includes the pull-up community in need-based search and web projects", () => {
  for (const query of ["턱걸이 한개만", "풀업 초보", "철봉 매달리기", "등 운동", "매달리기 시간", "pull-up", "pull up", "출석 체크"]) {
    assert.deepEqual(ids(query), ["pull-up-one-reps"], query);
  }
  assert.deepEqual(new Set(ids("운동을 꾸준히 하고 싶어요")), new Set(["fitpocket", "pull-up-one-reps"]));
  assert.deepEqual(ids("운동 기록", "web"), ["pull-up-one-reps"]);
  assert.deepEqual(ids("풀업", "app"), []);
  const project = searchPortfolio("턱걸이")[0];
  assert.equal(project.linkHref, "https://pull-up-one-reps.vercel.app/");
  assert.equal(getProjectDetailHref(project), "project.html?id=pull-up-one-reps");
});

test("finds the office survival game by title, genre, and play needs", () => {
  for (const query of ["월급루팡 최과장", "snake"]) {
    assert.deepEqual(ids(query), ["choi-the-salary-thief"], query);
  }
  for (const query of ["킬링타임", "직장인 게임", "피하기 게임", "시간 때우기", "심심할 때", "브라우저 게임", "game"]) {
    assert.deepEqual(new Set(ids(query)), new Set(gameIds), query);
  }
  assert.deepEqual(ids("", "game"), gameIds);
  assert.deepEqual(ids("킬링타임", "web"), []);
  const project = searchPortfolio("최과장")[0];
  assert.equal(project.linkHref, "https://choi-the-salary-thief.vercel.app/");
  assert.equal(getProjectDetailHref(project), "project.html?id=choi-the-salary-thief");
});

test("finds the rush-hour game by timing, signals, and leaving work", () => {
  for (const query of ["퇴근전쟁 최과장", "타이밍 게임", "칼퇴", "신호등 게임", "부장 눈치", "일하는 척", "rush hour"]) {
    assert.deepEqual(ids(query), ["choi-rush-hour"], query);
  }
  assert.deepEqual(new Set(ids("최과장", "game")), new Set(gameIds));
  assert.deepEqual(ids("타이밍 게임", "app"), []);
  const project = searchPortfolio("퇴근전쟁")[0];
  assert.equal(project.linkHref, "https://choi-rush-hour.vercel.app/");
  assert.equal(getProjectDetailHref(project), "project.html?id=choi-rush-hour");
});

test("finds the promotion game by climbing, jumping, and promotion needs", () => {
  for (const query of ["승진전쟁 최과장", "사다리 게임", "플랫폼 게임", "승진", "직급 올리기", "office climber", "platformer"]) {
    assert.deepEqual(ids(query), ["promotion-war"], query);
  }
  assert.deepEqual(ids("사다리", "app"), []);
  const project = searchPortfolio("승진")[0];
  assert.equal(project.linkHref, "https://promotion-war.vercel.app/");
  assert.equal(getProjectDetailHref(project), "project.html?id=promotion-war");
  assert.deepEqual(new Set(ids("점프 게임")), new Set(["promotion-war", "ninja-choi-office-escape"]));
});

test("finds the ninja runner by escaping, sliding, and increasing salary", () => {
  for (const query of ["탈주닌자 최과장", "닌자 게임", "러너 게임", "슬라이드", "연봉 올리기", "이직 게임", "회사 탈출", "ninja", "runner"]) {
    assert.deepEqual(ids(query), ["ninja-choi-office-escape"], query);
  }
  assert.deepEqual(ids("러너", "app"), []);
  const project = searchPortfolio("탈주닌자")[0];
  assert.equal(project.linkHref, "https://ninja-choi-office-escape.vercel.app/");
  assert.equal(getProjectDetailHref(project), "project.html?id=ninja-choi-office-escape");
});

test("normalizes case, full-width letters, punctuation, and spacing", () => {
  assert.deepEqual(ids("  ＱＲ   스캔!  "), ["qr-pass"]);
  assert.deepEqual(ids("포스트잇출력"), ["a4-sticky-guide"]);
  assert.deepEqual(ids("휴먼 디자인"), ["my-energy-blueprint"]);
  assert.deepEqual(ids("supabase"), ids("SUPABASE"));
  assert.deepEqual(ids("운동 운동 습관"), ids("운동 습관"));
});

test("preserves categories and original order when no search is entered", () => {
  assert.deepEqual(searchPortfolio("  "), portfolioItems);
  assert.equal(ids("", "web").length, 6);
  assert.equal(ids("", "app").length, 5);
  assert.equal(ids("", "lecture").length, 1);
  assert.deepEqual(ids("코딩 입문", "app"), []);
  assert.deepEqual(new Set(ids("프린트", "web")), new Set(["a4-sticky-guide", "wedding-money"]));
  assert.equal(ids("프린트", "web")[0], "a4-sticky-guide");
  assert.equal(ids("", "game").length, 4);
});

test("does not recommend unrelated projects for unknown or content-free searches", () => {
  for (const query of ["날씨 예보", "운동 인쇄", "포스트잇 우주선", "추천해주세요", "!!!", "<script>alert(1)</script>"]) {
    assert.deepEqual(ids(query), [], query);
  }
});

test("keeps need-based searches in URLs and detail-page return links", () => {
  const state = { query: "포스트잇 출력", category: "web" };
  const params = portfolioSearchParams(state);
  assert.deepEqual(readPortfolioSearchState(`?${params}`), state);
  const href = getProjectDetailHref(searchPortfolio(state.query)[0], params);
  const url = new URL(href, "https://example.com/");
  assert.equal(url.searchParams.get("q"), state.query);
  assert.equal(url.searchParams.get("category"), "web");
  assert.equal(url.searchParams.get("id"), "a4-sticky-guide");
});
