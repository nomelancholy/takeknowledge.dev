// Shared navigation keeps labels, destinations and the active page consistent.
const navigation = [
  { label: "Main", href: "index.html" },
  { label: "Portfolio", href: "portfolio.html" },
  { label: "Career", href: "career.html" },
  { label: "Contact", href: "contact.html" },
];

const header = document.querySelector("header");
if (header) {
  const logo = document.createElement("a");
  logo.className = "logo debossed-text logo-link";
  logo.href = "index.html";
  logo.textContent = "Take Knowledge";
  const nav = document.createElement("nav");
  nav.setAttribute("aria-label", "주요 메뉴");
  const pathname = window.location.pathname.split("/").pop() || "index.html";
  const isDetail = pathname === "project.html";
  const activePage = isDetail ? "portfolio.html" : pathname;
  navigation.forEach(({ label, href }) => {
    const link = document.createElement("a");
    link.href = href;
    link.textContent = label;
    if (href === activePage) link.setAttribute("aria-current", isDetail ? "location" : "page");
    nav.appendChild(link);
  });
  header.replaceChildren(logo, nav);
}
