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
    const emailField = document.getElementById("banner-ad-email");
    const email = emailField.value;
    const subject = encodeURIComponent(`[${item.title}] 배너 광고 문의`);
    const body = encodeURIComponent([
      `광고를 게재할 서비스: ${item.title}`,
      "광고 내용: ",
      "광고 클릭 시 연결할 주소(있는 경우): ",
      "희망 게재 위치와 기간: ",
    ].join("\r\n"));
    document.getElementById("banner-ad-mail").href = `mailto:${email}?subject=${subject}&body=${body}`;
    const copyStatus = document.getElementById("banner-ad-copy-status");
    document.getElementById("banner-ad-copy").addEventListener("click", async () => {
      copyStatus.textContent = "";
      try {
        await navigator.clipboard.writeText(email);
        copyStatus.textContent = "이메일 주소를 복사했어요.";
      } catch {
        emailField.focus();
        emailField.select();
        copyStatus.textContent = "선택된 이메일 주소를 직접 복사해 주세요.";
      }
    });
    document.getElementById("banner-ad-inquiry").hidden = false;
  }
  detail.hidden = false;
}
