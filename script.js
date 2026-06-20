const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(

  (entries) => {

    entries.forEach((entry) => {

      if (entry.isIntersecting) {

        entry.target.classList.add("visible");

      }

    });

  },

  { threshold: 0.14 }

);

revealElements.forEach((el) => observer.observe(el));

/* Custom Cursor */

const cursorDot = document.querySelector(".cursor-dot");

const cursorOutline = document.querySelector(".cursor-outline");

let mouseX = 0;

let mouseY = 0;

let outlineX = 0;

let outlineY = 0;

if (cursorDot && cursorOutline) {

  document.body.classList.add("has-custom-cursor");

}

window.addEventListener("mousemove", (e) => {

  mouseX = e.clientX;

  mouseY = e.clientY;

  document.body.style.setProperty("--mouse-x", `${mouseX}px`);

  document.body.style.setProperty("--mouse-y", `${mouseY}px`);

  if (!cursorDot || !cursorOutline) return;

  cursorDot.style.left = `${mouseX}px`;

  cursorDot.style.top = `${mouseY}px`;

});

function animateCursor() {

  if (!cursorOutline) return;

  outlineX += (mouseX - outlineX) * 0.16;

  outlineY += (mouseY - outlineY) * 0.16;

  cursorOutline.style.left = `${outlineX}px`;

  cursorOutline.style.top = `${outlineY}px`;

  requestAnimationFrame(animateCursor);

}

animateCursor();

const hoverTargets = document.querySelectorAll(

  "a, button, .project-card, .skill-card, .metric, .value-card, .insight-mini-card"

);

hoverTargets.forEach((target) => {

  target.addEventListener("mouseenter", () => {

    cursorOutline?.classList.add("active");

  });

  target.addEventListener("mouseleave", () => {

    cursorOutline?.classList.remove("active");

  });

});

/* Hero Parallax */

const heroCopy = document.querySelector(".hero-copy");

const heroPanel = document.querySelector(".hero-panel");

window.addEventListener("mousemove", (e) => {

  if (window.innerWidth < 900 || !heroCopy || !heroPanel) return;

  const x = (e.clientX / window.innerWidth - 0.5) * 16;

  const y = (e.clientY / window.innerHeight - 0.5) * 16;

  heroCopy.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;

  heroPanel.style.transform = `translate(${x * -0.45}px, ${y * -0.45}px)`;

});

/* Active Nav State */

const sections = document.querySelectorAll("main section[id]");

const navLinks = document.querySelectorAll(".nav-pill a[href^='#']");

const activeObserver = new IntersectionObserver(

  (entries) => {

    entries.forEach((entry) => {

      const id = entry.target.getAttribute("id");

      const activeLink = document.querySelector(`.nav-pill a[href="#${id}"]`);

      if (entry.isIntersecting && activeLink) {

        navLinks.forEach((link) => link.classList.remove("active"));

        activeLink.classList.add("active");

      }

    });

  },

  {

    threshold: 0.35,

    rootMargin: "-20% 0px -50% 0px",

  }

);

sections.forEach((section) => activeObserver.observe(section));

/* Google Analytics Event Tracking */

function trackEvent(eventName, params = {}) {

  if (typeof gtag !== "function") return;

  gtag("event", eventName, params);

}

document.querySelectorAll('a[href$=".pdf"]').forEach((link) => {

  link.addEventListener("click", () => {

    trackEvent("cv_download", {

      event_category: "engagement",

      event_label: "CV Download",

    });

  });

});

document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {

  link.addEventListener("click", () => {

    trackEvent("email_click", {

      event_category: "contact",

      event_label: "Email",

    });

  });

});

document.querySelectorAll('a[href*="linkedin.com"]').forEach((link) => {

  link.addEventListener("click", () => {

    trackEvent("linkedin_click", {

      event_category: "contact",

      event_label: "LinkedIn",

    });

  });

});

document.querySelectorAll(".project-link").forEach((link) => {

  link.addEventListener("click", () => {

    trackEvent("project_click", {

      event_category: "portfolio",

      event_label: link.textContent.trim(),

    });

  });

});

document.querySelectorAll(".insight-mini-card").forEach((card) => {

  card.addEventListener("click", () => {

    trackEvent("insight_open", {

      event_category: "content",

      event_label: card.querySelector("h3")?.textContent.trim() || "Insight",

    });

  });

});

document.querySelectorAll(".header-lang-switch").forEach((switcher) => {

  switcher.addEventListener("click", () => {

    trackEvent("language_switch", {

      event_category: "localization",

      event_label: switcher.textContent.trim(),

    });

  });

});