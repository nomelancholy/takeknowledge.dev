import "./site.js";
import "./profile.js";
import { portfolioItems, categoryLabels, appPlatformLabels, portfolioLinkLabels, getProjectDetailHref } from "./portfolio-data.js";
import { isMobileDevice, openTossQrDialog, setupTossQrDialog } from "./toss-qr.js";

let activeCategory = "all";
let activePortfolioPage = 1;
let portfolioPageSize = getPortfolioPageSize();
let portfolioItemCount = 0;
let requestedPortfolioPage = null;
let portfolioScrollTimer;
let randomizedPortfolioItems = shufflePortfolioItems(portfolioItems);

function shufflePortfolioItems(items) {
  const shuffledItems = [...items];

  for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledItems[index], shuffledItems[randomIndex]] = [shuffledItems[randomIndex], shuffledItems[index]];
  }

  const orderDidNotChange = shuffledItems.every((item, index) => item === items[index]);
  if (orderDidNotChange && shuffledItems.length > 1) {
    shuffledItems.push(shuffledItems.shift());
  }

  return shuffledItems;
}

function getPortfolioPageSize() {
  return window.matchMedia("(max-width: 768px)").matches ? 1 : 2;
}

function cloneTemplate(templateId) {
  const template = document.getElementById(templateId);
  if (!template || !(template instanceof HTMLTemplateElement)) return null;
  return template.content.firstElementChild?.cloneNode(true) || null;
}

function renderPortfolio() {
  const container = document.getElementById("portfolio-grid");
  const emptyState = document.getElementById("portfolio-empty");
  if (!container) return;
  container.innerHTML = "";

  const visibleItems = activeCategory === "all"
    ? randomizedPortfolioItems
    : portfolioItems.filter((item) => item.category === activeCategory);
  if (emptyState) emptyState.hidden = visibleItems.length > 0;

  portfolioItemCount = visibleItems.length;
  activePortfolioPage = 1;
  requestedPortfolioPage = null;
  clearTimeout(portfolioScrollTimer);

  visibleItems.forEach((item, index) => {
    const node = cloneTemplate("portfolio-card-template");
    if (!node) return;
    node.dataset.category = item.category;
    node.querySelector(".portfolio-category").textContent = categoryLabels[item.category] || item.category;
    node.querySelector(".portfolio-sequence").textContent = String(index + 1).padStart(2, "0");
    node.querySelector("p").textContent = item.description;

    const titleLink = node.querySelector("h3 a");
    const imageLink = node.querySelector(".portfolio-image");
    const link = node.querySelector(".portfolio-link");
    const detailLink = node.querySelector(".portfolio-detail-link");
    link.childNodes[0].textContent = portfolioLinkLabels[item.category] || "OPEN PROJECT ";
    titleLink.textContent = item.title;
    [titleLink, imageLink].forEach((anchor) => {
      anchor.href = getProjectDetailHref(item);
      anchor.removeAttribute("target");
    });
    detailLink.href = getProjectDetailHref(item);
    detailLink.hidden = false;
    link.href = item.linkHref;
    if (item.category === "app" && item.qrCodeUrl) {
      link.addEventListener("click", (event) => {
        if (isMobileDevice()) return;
        event.preventDefault();
        openTossQrDialog(item);
      });
    }

    const platform = node.querySelector(".portfolio-platform");
    if (item.category === "app" && item.appPlatform) {
      platform.textContent = appPlatformLabels[item.appPlatform] || item.appPlatform;
      platform.hidden = false;
    }

    const image = node.querySelector("img");
    if (item.thumbnailUrl) {
      image.src = item.thumbnailUrl;
      image.alt = item.title;
    } else {
      image.remove();
    }

    container.appendChild(node);
  });

  document.getElementById("portfolio-carousel").hidden = visibleItems.length === 0;
  updatePortfolioSlides();
  container.scrollTo({ left: 0, behavior: "instant" });
  updatePortfolioPagination();
}

function updatePortfolioSlides() {
  const grid = document.getElementById("portfolio-grid");
  grid.classList.toggle("has-trailing-space", portfolioItemCount % portfolioPageSize !== 0);
  Array.from(grid.children).forEach((card, index) => {
    card.classList.toggle("is-slide-start", index % portfolioPageSize === 0);
  });
}

function updatePortfolioPagination() {
  const previousButton = document.getElementById("portfolio-prev");
  const nextButton = document.getElementById("portfolio-next");
  const status = document.getElementById("portfolio-page-status");
  if (!previousButton || !nextButton || !status) return;
  const totalPages = Math.max(1, Math.ceil(portfolioItemCount / portfolioPageSize));

  status.hidden = portfolioItemCount === 0;
  previousButton.hidden = nextButton.hidden = totalPages <= 1;
  previousButton.disabled = activePortfolioPage === 1;
  nextButton.disabled = activePortfolioPage === totalPages;
  status.textContent = `${String(activePortfolioPage).padStart(2, "0")} / ${String(totalPages).padStart(2, "0")}`;
}

function movePortfolioPage(direction) {
  const totalPages = Math.max(1, Math.ceil(portfolioItemCount / portfolioPageSize));
  activePortfolioPage = Math.max(1, Math.min(totalPages, (requestedPortfolioPage ?? activePortfolioPage) + direction));
  requestedPortfolioPage = activePortfolioPage;
  scrollToPortfolioPage();
  updatePortfolioPagination();
  schedulePortfolioScrollEnd();
}

function scrollToPortfolioPage(instant = false) {
  const grid = document.getElementById("portfolio-grid");
  const first = grid.firstElementChild;
  const target = grid.children[(activePortfolioPage - 1) * portfolioPageSize];
  if (!first || !target) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  grid.scrollTo({ left: target.offsetLeft - first.offsetLeft, behavior: instant || reduceMotion ? "instant" : "smooth" });
}

function syncPortfolioPage() {
  const grid = document.getElementById("portfolio-grid");
  const cards = grid.children;
  if (cards.length < 2) return;
  const stride = cards[1].offsetLeft - cards[0].offsetLeft;
  if (!stride) return;
  const totalPages = Math.max(1, Math.ceil(portfolioItemCount / portfolioPageSize));
  activePortfolioPage = Math.max(1, Math.min(totalPages, Math.round(grid.scrollLeft / (stride * portfolioPageSize)) + 1));
  updatePortfolioPagination();
}

function schedulePortfolioScrollEnd() {
  clearTimeout(portfolioScrollTimer);
  portfolioScrollTimer = setTimeout(() => {
    requestedPortfolioPage = null;
    syncPortfolioPage();
  }, 150);
}

function setupPortfolioPagination() {
  document.getElementById("portfolio-prev")?.addEventListener("click", () => movePortfolioPage(-1));
  document.getElementById("portfolio-next")?.addEventListener("click", () => movePortfolioPage(1));
  const grid = document.getElementById("portfolio-grid");
  grid.addEventListener("scroll", () => {
    if (requestedPortfolioPage === null) syncPortfolioPage();
    schedulePortfolioScrollEnd();
  }, { passive: true });
  ["pointerdown", "wheel"].forEach((eventName) => {
    grid.addEventListener(eventName, () => { requestedPortfolioPage = null; }, { passive: true });
  });
  grid.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    movePortfolioPage(event.key === "ArrowRight" ? 1 : -1);
  });

  window.addEventListener("resize", () => {
    const nextPageSize = getPortfolioPageSize();
    const firstVisibleIndex = (activePortfolioPage - 1) * portfolioPageSize;
    portfolioPageSize = nextPageSize;
    activePortfolioPage = Math.floor(firstVisibleIndex / portfolioPageSize) + 1;
    requestedPortfolioPage = activePortfolioPage;
    updatePortfolioSlides();
    scrollToPortfolioPage(true);
    updatePortfolioPagination();
    schedulePortfolioScrollEnd();
  });
}

function setupPortfolioFilters() {
  const counts = portfolioItems.reduce((result, item) => {
    result[item.category] = (result[item.category] || 0) + 1;
    return result;
  }, {});

  document.querySelectorAll(".filter-btn[data-category]").forEach((btn) => {
    const category = btn.dataset.category;
    const count = category === "all" ? portfolioItems.length : counts[category] || 0;
    btn.querySelector("span").textContent = String(count).padStart(2, "0");
    btn.addEventListener("click", () => {
      activeCategory = category;
      activePortfolioPage = 1;
      if (category === "all") {
        randomizedPortfolioItems = shufflePortfolioItems(randomizedPortfolioItems);
      }
      document.querySelectorAll(".filter-btn").forEach((filterBtn) => {
        const isActive = filterBtn === btn;
        filterBtn.classList.toggle("is-active", isActive);
        filterBtn.setAttribute("aria-selected", String(isActive));
      });
      renderPortfolio();
    });
  });
}

function setupJourneyToggle() {
  const button = document.getElementById("journey-toggle");
  const copy = document.getElementById("journey-copy");
  if (!button || !copy) return;

  button.addEventListener("click", () => {
    const isExpanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isExpanded));
    copy.classList.toggle("is-collapsed", isExpanded);
    button.childNodes[0].textContent = isExpanded ? "전체 이야기 읽기 " : "이야기 접기 ";
  });
}

// Entry animation and rendering
document.addEventListener("DOMContentLoaded", () => {
  renderPortfolio();
  setupPortfolioFilters();
  setupPortfolioPagination();
  setupJourneyToggle();
  setupTossQrDialog();

  const sections = document.querySelectorAll("section");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = 1;
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.1 }
  );

  sections.forEach((section) => {
    section.style.opacity = 0;
    section.style.transform = "translateY(30px)";
    section.style.transition = "all 0.8s ease-out";
    observer.observe(section);
  });
});
