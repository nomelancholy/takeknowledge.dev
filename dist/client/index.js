const careerItems = [
  {
    date: "2026",
    title: "기아렌터카 관리 시스템 운영 프로젝트",
    description: "대고객, 판매, 관리 시스템 연동 운영",
  },
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
    category: "app",
    appPlatform: "toss",
    title: "수박감별사",
    description:
      "수박을 톡톡 두드려 소리를 들려주세요. 수박감별사가 두드림 소리와 겉모습을 바탕으로 잘 익은 수박인지 쉽고 재미있게 확인해 드려요. 감별 결과를 기록하고, 당도와 식감까지 별점으로 남겨 나만의 맛있는 수박 고르는 감각을 키워보세요!",
    linkHref: "https://minion.toss.im/JSy41Vzj",
    thumbnailUrl: "assets/watermelon-inspector-app-icon.png",
    qrCodeUrl: "assets/watermelon-inspector-qr.png",
  },
  {
    category: "app",
    appPlatform: "toss",
    title: "BIG5 성격검사",
    description:
      "50개의 문항에 5단계로 답하면 개방성, 성실성, 외향성, 우호성, 정서 민감도 점수를 확인할 수 있어요. 검사를 모두 마친 뒤 OCEAN 그래프와 성향별 상세 해석이 공개돼요. 점수의 높고 낮음이 일상에서 어떤 의미인지 확인할 수 있고, 강점 조합과 균형 포인트, 생활 속 힌트도 함께 제공해요.",
    linkHref: "https://minion.toss.im/tPE2QyIy",
    thumbnailUrl: "assets/ocean-app-logo-600.png",
    qrCodeUrl: "assets/big5-ocean-qr.png",
  },
  {
    category: "web",
    title: "D.O.T.",
    description:
      "도자기 공방 D.O.T.의 브랜드와 작품, 클래스 소식을 소개하는 홈페이지입니다.",
    linkHref: "https://dayoff.today/",
    thumbnailUrl: "assets/dot-homepage.png",
  },
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
    node.dataset.category = item.category;
    node.querySelector(".portfolio-category").textContent = categoryLabels[item.category] || item.category;
    node.querySelector(".portfolio-sequence").textContent = String(index + 1).padStart(2, "0");
    node.querySelector("p").textContent = item.description;

    const titleLink = node.querySelector("h3 a");
    const imageLink = node.querySelector(".portfolio-image");
    const link = node.querySelector(".portfolio-link");
    link.childNodes[0].textContent = item.category === "app" ? "OPEN IN TOSS " : "OPEN PROJECT ";
    titleLink.textContent = item.title;
    [titleLink, imageLink, link].forEach((anchor) => {
      anchor.setAttribute("href", item.linkHref);
      if (item.category === "app" && item.qrCodeUrl) {
        anchor.addEventListener("click", (event) => {
          if (isMobileDevice()) return;
          event.preventDefault();
          openTossQrDialog(item);
        });
      }
    });

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

}

function isMobileDevice() {
  const mobileUserAgent = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const touchMac = navigator.userAgent.includes("Mac") && navigator.maxTouchPoints > 1;
  return mobileUserAgent || touchMac;
}

function openTossQrDialog(item) {
  const dialog = document.getElementById("toss-qr-dialog");
  if (!dialog) return;

  dialog.querySelector("#toss-qr-title").textContent = item.title;
  const image = dialog.querySelector("#toss-qr-image");
  image.src = item.qrCodeUrl;
  image.alt = `${item.title} 토스 미니앱 QR 코드`;

  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "");
}

function setupTossQrDialog() {
  const dialog = document.getElementById("toss-qr-dialog");
  if (!dialog) return;
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
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
  renderCareer();
  renderSkills();
  renderPortfolio();
  setupPortfolioFilters();
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
