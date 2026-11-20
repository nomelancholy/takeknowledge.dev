import "./site.js";
import { portfolioItems, categoryLabels, appPlatformLabels, getProjectDetailHref } from "./portfolio-data.js";

const services = document.getElementById("banner-services");
const list = services.querySelector("ul");
const template = document.getElementById("banner-service-template");
const inquiry = new URL(document.getElementById("banner-inquiry-email").href);
const [serviceField, ...messageFields] = inquiry.searchParams.get("body").split("\r\n");

// Show services with a known placement first, keeping the portfolio order within each group.
const items = [
  ...portfolioItems.filter((item) => item.bannerAd),
  ...portfolioItems.filter((item) => !item.bannerAd),
];

list.replaceChildren(...items.map((item) => {
  const row = template.content.firstElementChild.cloneNode(true);
  const ad = item.bannerAd;
  row.querySelector("img").src = item.thumbnailUrl;
  row.querySelector("summary strong").textContent = item.title;
  row.querySelector(".banner-service-category").textContent =
    appPlatformLabels[item.appPlatform] ?? categoryLabels[item.category];
  row.querySelector(".banner-service-status").textContent =
    ad?.size ?? (ad ? "이미지 규격 문의" : "게재 가능 여부 문의");
  row.querySelector(".banner-service-placement").textContent =
    ad?.placement ?? "희망하는 화면이나 위치를 메일로 알려주세요.";
  row.querySelector(".banner-service-material").textContent = ad?.size
    ? [ad.size, ad.formats].filter(Boolean).join(" · ")
    : "이미지 크기와 파일 형식은 문의 시 확인해 주세요.";

  if (ad?.preparation) {
    const preparation = row.querySelector(".banner-service-preparation");
    preparation.textContent = ad.preparation;
    preparation.hidden = false;
  }
  if (ad?.guideHref) {
    const guide = row.querySelector(".banner-service-guide");
    guide.href = ad.guideHref;
    guide.hidden = false;
  }

  const mail = row.querySelector(".banner-service-mail");
  const subject = encodeURIComponent(`[${item.title}] 배너 광고 문의`);
  const body = encodeURIComponent([`${serviceField}${item.title}`, ...messageFields, "희망 게재 위치와 기간: "].join("\r\n"));
  mail.href = `mailto:${inquiry.pathname}?subject=${subject}&body=${body}`;
  mail.setAttribute("aria-label", `${item.title} 광고 문의 이메일 작성`);
  row.querySelector(".banner-service-portfolio").href = getProjectDetailHref(item);
  return row;
}));

services.hidden = false;
document.querySelector('a[href="#banner-services"]').hidden = false;
