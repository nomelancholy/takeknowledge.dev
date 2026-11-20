import "./site.js";
import { portfolioItems, portfolioCategories, categoryLabels, appPlatformLabels, getProjectDetailHref, siteConfig } from "./portfolio-data.js";

const services = document.getElementById("banner-services");
const list = document.getElementById("banner-service-list");
const template = document.getElementById("banner-service-template");
const filters = document.getElementById("banner-category-filters");
const showUnavailable = document.getElementById("banner-show-unavailable");
const count = document.getElementById("banner-service-count");
const empty = document.getElementById("banner-service-empty");
const inquiry = new URL(document.getElementById("banner-inquiry-email").href);
const [serviceField, ...messageFields] = inquiry.searchParams.get("body").split("\r\n");
let selectedCategory = "all";

// Show services with a known placement first, keeping the portfolio order within each group.
const items = [
  ...portfolioItems.filter((item) => item.bannerAd),
  ...portfolioItems.filter((item) => !item.bannerAd),
];

const entries = items.map((item) => {
  const row = template.content.firstElementChild.cloneNode(true);
  const ad = item.bannerAd;
  const unavailableReason = item.bannerAdsUnavailable ?? siteConfig.bannerAdsUnavailableByPlatform[item.appPlatform];
  row.querySelector("img").src = item.thumbnailUrl;
  row.querySelector("summary strong").textContent = item.title;
  row.querySelector(".banner-service-category").textContent =
    appPlatformLabels[item.appPlatform] ?? categoryLabels[item.category];
  row.querySelector(".banner-service-status").textContent = unavailableReason
    ? "직접 게재 불가"
    : ad?.size ?? (ad ? "이미지 규격 문의" : "게재 가능 여부 문의");
  row.querySelector(".banner-service-placement").textContent =
    ad?.placement ?? "희망하는 화면이나 위치를 메일로 알려주세요.";
  row.querySelector(".banner-service-material").textContent = ad?.size
    ? [ad.size, ad.formats].filter(Boolean).join(" · ")
    : "이미지 크기와 파일 형식은 문의 시 확인해 주세요.";

  const preparationText = unavailableReason ?? ad?.preparation;
  if (preparationText) {
    const preparation = row.querySelector(".banner-service-preparation");
    preparation.textContent = preparationText;
    preparation.hidden = false;
  }
  if (ad?.guideHref && !unavailableReason) {
    const guide = row.querySelector(".banner-service-guide");
    guide.href = ad.guideHref;
    guide.hidden = false;
  }

  const mail = row.querySelector(".banner-service-mail");
  if (unavailableReason) {
    row.querySelector(".banner-service-detail dl").hidden = true;
    mail.hidden = true;
  } else {
    const subject = encodeURIComponent(`[${item.title}] 배너 광고 문의`);
    const body = encodeURIComponent([`${serviceField}${item.title}`, ...messageFields, "희망 게재 위치와 기간: "].join("\r\n"));
    mail.href = `mailto:${inquiry.pathname}?subject=${subject}&body=${body}`;
    mail.setAttribute("aria-label", `${item.title} 광고 문의 이메일 작성`);
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
