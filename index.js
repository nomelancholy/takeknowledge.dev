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
    title: "Beacon Port",
    description:
      "금융 데이터의 시각화와 복잡한 트랜잭션 흐름을 직관적인 UX로 풀어낸 차세대 뱅킹 솔루션입니다.",
    linkLabel: "VIEW PROJECT →",
    linkHref: "https://www.beaconport.online/",
    thumbnailUrl: "assets/beacon-port.png",
  },

];

let currentIndex = 0;
let slider = null;
let totalCards = 0;
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
  const container = document.getElementById("slider");
  if (!container) return;
  container.innerHTML = "";

  portfolioItems.forEach((item) => {
    const node = cloneTemplate("portfolio-card-template");
    if (!node) return;
    node.querySelector("h3").textContent = item.title;
    node.querySelector("p").textContent = item.description;

    const link = node.querySelector(".portfolio-link");
    link.textContent = item.linkLabel;
    link.setAttribute("href", item.linkHref);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noreferrer");

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

function updateSliderMetrics() {
  slider = document.getElementById("slider");
  totalCards = slider ? slider.children.length : 0;
  if (currentIndex >= totalCards) currentIndex = 0;
}

function moveSlider(direction) {
  if (!slider) updateSliderMetrics();
  if (!slider || totalCards === 0) return;

  currentIndex += direction;

  if (currentIndex < 0) {
    currentIndex = totalCards - 1;
  } else if (currentIndex >= totalCards) {
    currentIndex = 0;
  }

  const offset = currentIndex * -100;
  slider.style.transform = `translateX(${offset}%)`;
}

function setupSliderControls() {
  document.querySelectorAll(".nav-btn[data-direction]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const direction = Number(btn.dataset.direction || "0");
      moveSlider(direction);
    });
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
  updateSliderMetrics();
  updatePortfolioImages();
  setupSliderControls();

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
