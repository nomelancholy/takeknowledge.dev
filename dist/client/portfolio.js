import "./site.js";
import { portfolioItems, portfolioCategories, categoryLabels, appPlatformLabels, searchPortfolio, readPortfolioSearchState, portfolioSearchParams, getProjectDetailHref } from "./portfolio-data.js";

let state = readPortfolioSearchState(window.location.search);
const form = document.getElementById("portfolio-search-form");
const input = document.getElementById("portfolio-search-input");
const clear = document.getElementById("search-clear");
const filters = document.getElementById("portfolio-category-filters");
const results = document.getElementById("portfolio-results");
const template = document.getElementById("portfolio-result-template");

portfolioCategories.forEach((category) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "filter-btn";
  button.dataset.category = category;
  const label = category === "all" ? "전체" : categoryLabels[category];
  const count = category === "all" ? portfolioItems.length : portfolioItems.filter(item => item.category === category).length;
  button.append(document.createTextNode(`${label} `));
  const countLabel = document.createElement("span");
  countLabel.textContent = String(count).padStart(2, "0");
  button.appendChild(countLabel);
  button.addEventListener("click", () => {
    state.category = category;
    render();
  });
  filters.appendChild(button);
});

function render(updateUrl = true) {
  input.value = state.query;
  clear.hidden = !state.query;
  const params = portfolioSearchParams(state);
  if (updateUrl) {
    const url = new URL(window.location.href);
    url.search = params.toString();
    window.history.replaceState(null, "", url);
  }
  filters.querySelectorAll("button").forEach((button) => {
    const selected = button.dataset.category === state.category;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  const matches = searchPortfolio(state.query, state.category);
  document.getElementById("portfolio-results-title").textContent = state.query.trim() ? "검색 결과" : state.category === "all" ? "전체 작업" : `${categoryLabels[state.category]} 작업`;
  document.getElementById("portfolio-result-count").textContent = `${state.query.trim() ? `‘${state.query.trim()}’ 검색 결과 · ` : ""}${matches.length}개의 작업`;
  document.getElementById("portfolio-search-empty").hidden = matches.length > 0;
  const comingSoon = !state.query.trim() && state.category !== "all" && !portfolioItems.some(item => item.category === state.category);
  document.getElementById("portfolio-empty-label").textContent = comingSoon ? "COMING NEXT" : "NO RESULTS";
  document.getElementById("portfolio-empty-title").textContent = comingSoon ? "새로운 작업을 준비하고 있어요." : "검색 결과가 없어요.";
  document.getElementById("portfolio-empty-description").textContent = comingSoon ? "다른 분야의 포트폴리오를 먼저 살펴보세요." : "‘인쇄’, ‘운동 알림’처럼 필요한 기능을 짧게 입력하거나 분류를 바꿔보세요.";
  results.replaceChildren(...matches.map((item, index) => {
    const card = template.content.firstElementChild.cloneNode(true);
    card.dataset.category = item.category;
    const href = getProjectDetailHref(item, params);
    card.querySelectorAll("a").forEach((anchor) => {
      anchor.href = href;
    });
    card.querySelector(".portfolio-image").setAttribute("aria-label", `${item.title} 상세 보기`);
    card.querySelector("h3 a").textContent = item.title;
    card.querySelector(".portfolio-category").textContent = categoryLabels[item.category];
    card.querySelector(".portfolio-sequence").textContent = String(index + 1).padStart(2, "0");
    card.querySelector(".portfolio-info > p").textContent = item.description;
    const platform = card.querySelector(".portfolio-platform");
    if (item.appPlatform) {
      platform.textContent = appPlatformLabels[item.appPlatform];
      platform.hidden = false;
    }
    const image = card.querySelector("img");
    image.src = item.thumbnailUrl;
    card.querySelector(".portfolio-action-label").textContent = "상세 보기";
    card.querySelector(".portfolio-action-arrow").textContent = "→";
    return card;
  }));
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  state.query = input.value;
  render();
});
input.addEventListener("input", () => {
  state.query = input.value;
  render();
});
clear.addEventListener("click", () => {
  state.query = "";
  render();
  input.focus();
});
document.querySelectorAll("[data-search-query]").forEach((button) => {
  button.addEventListener("click", () => {
    state = { query: button.dataset.searchQuery, category: "all" };
    render();
    input.focus();
  });
});
document.getElementById("search-reset").addEventListener("click", () => {
  state = { query: "", category: "all" };
  render();
  input.focus();
});
window.addEventListener("popstate", () => {
  state = readPortfolioSearchState(window.location.search);
  render(false);
});
render(false);
