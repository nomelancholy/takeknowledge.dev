import "./site.js";
import { portfolioItems, portfolioCategories, categoryLabels, appPlatformLabels, getProjectDetailHref } from "./portfolio-data.js";
import { getBannerAdUnavailableReason, renderBannerAdInfo } from "./banner-ad-info.js";

const services = document.getElementById("banner-services");
const list = document.getElementById("banner-service-list");
const template = document.getElementById("banner-service-template");
const filters = document.getElementById("banner-category-filters");
const showUnavailable = document.getElementById("banner-show-unavailable");
const count = document.getElementById("banner-service-count");
const empty = document.getElementById("banner-service-empty");
let selectedCategory = "all";

// Show services with a known placement first, keeping the portfolio order within each group.
const items = [
  ...portfolioItems.filter((item) => item.bannerAd),
  ...portfolioItems.filter((item) => !item.bannerAd),
];

const entries = items.map((item) => {
  const row = template.content.firstElementChild.cloneNode(true);
  const ad = item.bannerAd;
  const unavailableReason = getBannerAdUnavailableReason(item);
  row.querySelector("img").src = item.thumbnailUrl;
  row.querySelector("summary strong").textContent = item.title;
  row.querySelector(".banner-service-category").textContent =
    appPlatformLabels[item.appPlatform] ?? categoryLabels[item.category];
  row.querySelector(".banner-service-status").textContent = unavailableReason
    ? "직접 게재 불가"
    : ad?.size ?? (ad ? "이미지 규격 문의" : "게재 가능 여부 문의");
  renderBannerAdInfo(row, ad, unavailableReason);
  row.querySelector(".banner-service-price").hidden = Boolean(unavailableReason);

  const inquiry = row.querySelector(".banner-service-inquiry");
  inquiry.hidden = Boolean(unavailableReason);
  if (!unavailableReason) {
    inquiry.href = `banner-ad.html?id=${encodeURIComponent(item.id)}`;
    inquiry.setAttribute("aria-label", `${item.title} 광고 문의 상세 보기`);
  }
  row.querySelector(".banner-service-portfolio").href = getProjectDetailHref(item);
  return { category: item.category, row, unavailable: Boolean(unavailableReason) };
});

function updateResults() {
  filters.querySelectorAll("button").forEach((button) => {
    const selected = button.dataset.category === selectedCategory;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  let visibleCount = 0;
  let excludedCount = 0;
  for (const { category, row, unavailable } of entries) {
    const matches = selectedCategory === "all" || category === selectedCategory;
    const excluded = unavailable && !showUnavailable.checked;
    row.hidden = !matches || excluded;
    if (matches && excluded) excludedCount++;
    if (!row.hidden) visibleCount++;
  }
  count.textContent = `${visibleCount}개 항목`;
  empty.textContent = excludedCount > 0
    ? "이 카테고리에는 직접 게재를 문의할 수 있는 항목이 없어요. 전체 목록을 보려면 ‘직접 게재 불가 항목도 보기’를 켜 주세요."
    : "이 카테고리에 표시할 항목이 없어요.";
  empty.hidden = visibleCount > 0;
  list.hidden = visibleCount === 0;
}

for (const category of portfolioCategories) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "filter-btn";
  button.dataset.category = category;
  button.setAttribute("aria-controls", list.id);
  button.textContent = category === "all" ? "전체" : categoryLabels[category];
  button.addEventListener("click", () => {
    selectedCategory = category;
    updateResults();
  });
  filters.append(button);
}

list.replaceChildren(...entries.map(({ row }) => row));
showUnavailable.addEventListener("change", updateResults);
updateResults();

services.hidden = false;
document.querySelector('a[href="#banner-services"]').hidden = false;
