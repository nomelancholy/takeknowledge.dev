import "./site.js";
import { portfolioItems, categoryLabels, appPlatformLabels, getProjectDetailHref } from "./portfolio-data.js";
import { getBannerAdUnavailableReason, renderBannerAdInfo } from "./banner-ad-info.js";

const id = new URLSearchParams(window.location.search).get("id");
const item = portfolioItems.find((project) => project.id === id);

if (!item) {
  document.title = "광고 문의 페이지를 찾을 수 없어요 | Take Knowledge";
  document.getElementById("banner-ad-not-found").hidden = false;
} else {
  const detail = document.getElementById("banner-ad-detail");
  const unavailableReason = getBannerAdUnavailableReason(item);
  const title = `${item.title} 광고 문의`;
  document.title = `${title} | Take Knowledge`;
  detail.dataset.category = item.category;
  document.getElementById("banner-ad-title").textContent = title;
  document.getElementById("banner-ad-description").textContent = item.description;
  document.getElementById("banner-ad-category").textContent =
    appPlatformLabels[item.appPlatform] ?? categoryLabels[item.category];
  document.getElementById("banner-ad-image").src = item.thumbnailUrl;
  document.getElementById("banner-ad-portfolio").href = getProjectDetailHref(item);
  renderBannerAdInfo(detail, item.bannerAd, unavailableReason);

  if (unavailableReason) {
    document.getElementById("banner-ad-spec-title").textContent = "직접 게재 불가";
  } else {
    const email = document.getElementById("banner-ad-email").textContent;
    const subject = encodeURIComponent(`[${item.title}] 배너 광고 문의`);
    const body = encodeURIComponent([
      `광고를 게재할 서비스: ${item.title}`,
      "광고 내용: ",
      "광고 클릭 시 연결할 주소(있는 경우): ",
      "희망 게재 위치와 기간: ",
    ].join("\r\n"));
    document.getElementById("banner-ad-mail").href = `mailto:${email}?subject=${subject}&body=${body}`;
    document.getElementById("banner-ad-inquiry").hidden = false;
  }
  detail.hidden = false;
}
