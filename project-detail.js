import "./site.js";
import { portfolioItems, categoryLabels, appPlatformLabels, siteConfig, readPortfolioSearchState, portfolioSearchParams } from "./portfolio-data.js";
import { isMobileDevice, openTossQrDialog, setupTossQrDialog } from "./toss-qr.js";

const id = new URLSearchParams(window.location.search).get("id");
const project = portfolioItems.find((item) => item.id === id);
const detail = document.getElementById("project-detail");
const params = portfolioSearchParams(readPortfolioSearchState(window.location.search));
const portfolioHref = `portfolio.html${params.size ? `?${params}` : ""}`;
document.querySelectorAll("[data-portfolio-link]").forEach((anchor) => { anchor.href = portfolioHref; });

if (!project) {
  document.getElementById("project-not-found").hidden = false;
  document.title = "작업을 찾을 수 없어요 | Take Knowledge";
} else {
  detail.hidden = false;
  detail.dataset.category = project.category;
  document.title = `${project.title} | Take Knowledge`;
  document.querySelector('meta[name="description"]').content = project.description;
  document.getElementById("project-title").textContent = project.title;
  document.getElementById("project-description").textContent = project.description;
  document.getElementById("project-category").textContent = [categoryLabels[project.category], project.appCategory].filter(Boolean).join(" · ");
  const platform = document.getElementById("project-platform");
  if (project.appPlatform) {
    platform.textContent = appPlatformLabels[project.appPlatform];
    platform.hidden = false;
  }
  const image = document.getElementById("project-icon");
  image.src = project.thumbnailUrl;
  image.alt = `${project.title} ${project.category === "app" ? "아이콘" : "미리보기"}`;
  const tags = document.getElementById("project-tags");
  tags.replaceChildren(...(project.tags || []).map((tag) => {
    const span = document.createElement("span");
    span.textContent = `#${tag}`;
    return span;
  }));
  const features = document.getElementById("project-features");
  features.replaceChildren(...(project.features || []).map((feature, index) => {
    const li = document.createElement("li");
    const number = document.createElement("span");
    number.textContent = String(index + 1).padStart(2, "0");
    number.setAttribute("aria-hidden", "true");
    li.append(number, document.createTextNode(feature));
    return li;
  }));
  document.getElementById("project-feature-title").textContent = project.category === "lecture" ? "이런 내용을 배울 수 있어요." : project.category === "game" ? "이렇게 즐겨보세요." : "이렇게 활용해 보세요.";

  const isToss = project.appPlatform === "toss" && Boolean(project.qrCodeUrl);
  detail.classList.toggle("has-qr", isToss);
  const launch = document.getElementById("project-launch");
  launch.href = project.linkHref;
  document.getElementById("project-launch-label").textContent = isToss ? "토스에서 열기" : project.category === "lecture" ? "강의 열기" : project.category === "game" ? "게임 플레이" : "서비스 열기";
  document.getElementById("project-launch-note").textContent = isToss
    ? "휴대폰에서는 토스 앱으로 연결되고, PC에서는 QR 코드를 안내해요."
    : project.category === "lecture" ? "새 창에서 강의 페이지로 연결됩니다." : project.category === "game" ? "새 창에서 게임이 열립니다. 게임 화면의 조작 안내를 확인해 주세요." : "새 창에서 웹 서비스로 연결됩니다.";
  if (isToss) {
    const qr = document.getElementById("project-qr");
    qr.src = project.qrCodeUrl;
    qr.alt = `${project.title} 토스 미니앱 QR 코드`;
    document.getElementById("project-open-guide").hidden = false;
    launch.addEventListener("click", (event) => {
      if (isMobileDevice()) return;
      event.preventDefault();
      openTossQrDialog(project);
    });
    setupTossQrDialog();
  }

  // Web services, apps and lectures share the same optional donation integration.
  const donationHref = project.donationHref ?? siteConfig.donationHref;
  if (isHttpsUrl(donationHref)) {
    const donation = document.getElementById("kakao-donation");
    donation.href = donationHref;
    donation.target = "_blank";
    donation.rel = "noopener noreferrer";
    donation.removeAttribute("aria-disabled");
    donation.removeAttribute("aria-describedby");
    document.getElementById("donation-note").hidden = true;
  }
}

function isHttpsUrl(value) {
  if (!value) return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}
