// Existing bookmarks and open tabs use the unified portfolio and detail pages.
const previousPage = window.location.pathname.split("/").pop();
const destination = previousPage === "app.html" ? "project.html" : "portfolio.html";
window.location.replace(`${destination}${window.location.search}${window.location.hash}`);
