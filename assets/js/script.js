const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const currentPage = document.body.dataset.page;
const allNavLinks = [...document.querySelectorAll(".main-nav a")];
const anchorNavLinks = allNavLinks.filter((link) => link.getAttribute("href")?.startsWith("#"));
const sections = anchorNavLinks
  .map((link) => {
    const selector = link.getAttribute("href");
    return selector ? document.querySelector(selector) : null;
  })
  .filter(Boolean);

if (anchorNavLinks.length && sections.length) {
  const setActiveLink = () => {
    let currentId = "";

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 140 && rect.bottom >= 140) {
        currentId = `#${section.id}`;
      }
    });

    anchorNavLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === currentId);
    });
  };

  setActiveLink();
  window.addEventListener("scroll", setActiveLink, { passive: true });
}

const pageMap = {
  home: "index.html",
  "points-forts": "points-forts.html",
  demarches: "demarches.html",
  solutions: "solutions.html",
  preuves: "preuves.html",
  faq: "faq.html",
  ressources: "ressources.html",
  contact: "contact.html"
};

if (currentPage && pageMap[currentPage]) {
  allNavLinks.forEach((link) => {
    if (link.getAttribute("href") === pageMap[currentPage]) {
      link.classList.add("is-active");
    }
  });
}

allNavLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (mainNav) {
      mainNav.classList.remove("is-open");
    }
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
});

const contactForm = document.querySelector("#contact-form");
const feedback = document.querySelector("#form-feedback");

if (contactForm && feedback) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(contactForm);
    const name = data.get("name")?.toString().trim() || "";
    const city = data.get("city")?.toString().trim() || "";
    const school = data.get("school")?.toString().trim() || "Non précisé";
    const message = data.get("message")?.toString().trim() || "";

    const summary = `Demande préparée pour ${name} (${city}). Orientation ou établissement : ${school}. Situation : ${message}`;

    localStorage.setItem("transport-mdph-draft", summary);
    feedback.textContent =
      "Résumé généré et enregistré localement dans le navigateur. Tu peux maintenant t'en servir pour ton e-mail ou ton dossier.";
  });
}
