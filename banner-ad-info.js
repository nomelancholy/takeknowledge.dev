import { siteConfig } from "./portfolio-data.js";

export function getBannerAdUnavailableReason(item) {
  return item.bannerAdsUnavailable ?? siteConfig.bannerAdsUnavailableByPlatform[item.appPlatform];
}

export function renderBannerAdInfo(container, ad, unavailableReason) {
  container.querySelector("dl").hidden = Boolean(unavailableReason);
  container.querySelector(".banner-service-placement").textContent =
    ad?.placement ?? "희망하는 화면이나 위치를 메일로 알려주세요.";
  container.querySelector(".banner-service-material").textContent = ad?.size
    ? [ad.size, ad.formats].filter(Boolean).join(" · ")
    : "이미지 크기와 파일 형식은 문의 시 확인해 주세요.";

  const preparation = container.querySelector(".banner-service-preparation");
  preparation.textContent = unavailableReason ?? ad?.preparation ?? "";
  preparation.hidden = !preparation.textContent;

  if (ad?.guideHref && !unavailableReason) {
    const guide = container.querySelector(".banner-service-guide");
    guide.href = ad.guideHref;
    guide.hidden = false;
  }
}
