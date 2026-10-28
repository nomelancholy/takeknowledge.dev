import test from "node:test";
import assert from "node:assert/strict";
import { portfolioItems, searchPortfolio, readPortfolioSearchState, portfolioSearchParams, getProjectDetailHref } from "./portfolio-data.js";

const ids = (query, category) => searchPortfolio(query, category).map(item => item.id);

test("finds tools by needs, synonyms, and Korean expressions instead of their titles", () => {
  const cases = [
    ["포스트잇 출력", "a4-sticky-guide"],
    ["메모지 프린트", "a4-sticky-guide"],
    ["post-it print", "a4-sticky-guide"],
    ["사진 속 큐알 읽기", "qr-pass"],
    ["사진으로 QR을 읽고 싶어요", "qr-pass"],
    ["QR code reader", "qr-pass"],
    ["운동을 꾸준히 하고 싶어요", "fitpocket"],
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

test("normalizes case, full-width letters, punctuation, and spacing", () => {
  assert.deepEqual(ids("  ＱＲ   스캔!  "), ["qr-pass"]);
  assert.deepEqual(ids("포스트잇출력"), ["a4-sticky-guide"]);
  assert.deepEqual(ids("휴먼 디자인"), ["my-energy-blueprint"]);
  assert.deepEqual(ids("supabase"), ids("SUPABASE"));
  assert.deepEqual(ids("운동 운동 습관"), ids("운동 습관"));
});

test("preserves categories and original order when no search is entered", () => {
  assert.deepEqual(searchPortfolio("  "), portfolioItems);
  assert.equal(ids("", "web").length, 4);
  assert.equal(ids("", "app").length, 5);
  assert.equal(ids("", "lecture").length, 1);
  assert.deepEqual(ids("코딩 입문", "app"), []);
  assert.deepEqual(ids("프린트", "web"), ["a4-sticky-guide"]);
  assert.deepEqual(ids("", "game"), []);
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
