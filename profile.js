import "./site.js";
import { careerItems, skillTags } from "./profile-data.js";

const career = document.getElementById("career-list");
if (career) {
  career.replaceChildren(...careerItems.map((item) => {
    const article = document.createElement("article");
    article.className = "career-item";
    const date = document.createElement("p");
    date.className = "career-date";
    date.textContent = item.date;
    const title = document.createElement("h3");
    title.className = "career-title";
    title.textContent = item.title;
    const description = document.createElement("p");
    description.textContent = item.description;
    article.append(date, title, description);
    return article;
  }));
}

const skills = document.getElementById("skill-list");
if (skills) {
  skills.replaceChildren(...skillTags.map((tag) => {
    const span = document.createElement("span");
    span.className = "skill-tag";
    span.textContent = tag;
    return span;
  }));
}
