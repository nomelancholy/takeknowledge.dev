const careerItems = [
  {
    date: "2022 — 2025",
    title: "LG 전자 ThinQ App 개발 프로젝트",
    description:
      "Aqara, Hejhome, Matter, Homey IOT 기기와 ThinQ 앱 연동 및 UI 개발 수행",
  },
  {
    date: "2021 — 2022",
    title: "Fast Five Five Spot 프로젝트",
    description: "Five Spot 고객용 모바일 웹사이트 일부와 관리자용 사이트 프론트엔드 개발 수행",
  },
  {
    date: "2018 — 2020",
    title: "그 외 다수 SI 프로젝트 참여",
    description: "삼성 전자, 현대 자동차, 우리 카드, 기업 은행 등 다수 SI 프로젝트 참여",
  },
];

const skillTags = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Tailwind CSS",
  "Styled Components",
  "Recoil",
  "Redux",
  "PostgreSQL",
  "Supabase",
  "MySQL",

  "Git",
  "Python",
  "Django",
  "Java",
  "Kotlin",
  "Spring Boot",
  "AWS",
  "Azure"
];

const portfolioItems = [
  {
    category: "web",
    title: "SEE VAR",
    description:
      "K League 심판 데이터를 라운드별로 정리해 보여주는 서비스입니다. 라운드 베스트/워스트, 쟁점 순간 등 정보를 한 화면에서 탐색할 수 있습니다.",
    linkHref: "https://seevar.online/",
    thumbnailUrl: "assets/seevar.png",
  },

];

const categoryLabels = {
  web: "Web",
  app: "App",
  game: "Game",
  lecture: "Lecture",
};

const appPlatformLabels = {
  toss: "Toss Mini App",
  appstore: "App Store",
  playstore: "Play Store",
  multiplatform: "App Store · Play Store",
};

let activeCategory = "all";
let portfolioImages = [];

function cloneTemplate(templateId) {
  const template = document.getElementById(templateId);
  if (!template || !(template instanceof HTMLTemplateElement)) return null;
  return template.content.firstElementChild?.cloneNode(true) || null;
}

function renderCareer() {
  const container = document.getElementById("career-list");
  if (!container) return;
  container.innerHTML = "";

  careerItems.forEach((item) => {
    const node = cloneTemplate("career-item-template");
    if (!node) return;
    node.querySelector(".career-date").textContent = item.date;
    node.querySelector(".career-title").textContent = item.title;
    node.querySelector("p").textContent = item.description;
    container.appendChild(node);
  });
}

function renderSkills() {
  const container = document.getElementById("skill-list");
  if (!container) return;
  container.innerHTML = "";

  skillTags.forEach((tag) => {
    const node = cloneTemplate("skill-tag-template");
    if (!node) return;
    node.textContent = tag;
    container.appendChild(node);
  });
}

function renderPortfolio() {
  const container = document.getElementById("portfolio-grid");
  const emptyState = document.getElementById("portfolio-empty");
  if (!container) return;
  container.innerHTML = "";

  const visibleItems = portfolioItems.filter(
    (item) => activeCategory === "all" || item.category === activeCategory,
  );
  if (emptyState) emptyState.hidden = visibleItems.length > 0;

  visibleItems.forEach((item, index) => {
    const node = cloneTemplate("portfolio-card-template");
    if (!node) return;
    node.querySelector(".portfolio-category").textContent = categoryLabels[item.category] || item.category;
    node.querySelector(".portfolio-sequence").textContent = String(index + 1).padStart(2, "0");
    node.querySelector("p").textContent = item.description;

    const titleLink = node.querySelector("h3 a");
    const imageLink = node.querySelector(".portfolio-image");
    const link = node.querySelector(".portfolio-link");
    titleLink.textContent = item.title;
    [titleLink, imageLink, link].forEach((anchor) => anchor.setAttribute("href", item.linkHref));

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

  updatePortfolioImages();
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

function updatePortfolioImages() {
  portfolioImages = Array.from(document.querySelectorAll(".portfolio-image"));
}

// Simple Parallax Effect for "Tactile" feel
window.addEventListener("mousemove", (e) => {
  if (!portfolioImages.length) updatePortfolioImages();
  const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
  const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

  portfolioImages.forEach((img) => {
    img.style.transform = `translate(${moveX}px, ${moveY}px)`;
  });
});

// Entry animation and rendering
document.addEventListener("DOMContentLoaded", () => {
  renderCareer();
  renderSkills();
  renderPortfolio();
  setupPortfolioFilters();
  setupJourneyToggle();

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
