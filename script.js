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
/* Micro-interactions — Phase 6 */
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const progressBar = document.querySelector(".scroll-progress");
  let scrollTicking = false;

  const updateScrollEffects = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = Math.min(Math.max(scrollTop / scrollable, 0), 1);
    document.documentElement.style.setProperty("--scroll-progress", progress.toFixed(4));

    if (!reduceMotion.matches && finePointer.matches && window.innerWidth >= 900) {
      document.querySelectorAll(".parallax-media").forEach((media) => {
        const rect = media.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const centerOffset = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
        media.style.setProperty("--parallax-y", `${centerOffset * -16}px`);
      });
    }
    scrollTicking = false;
  };

  const requestScrollUpdate = () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(updateScrollEffects);
  };

  if (progressBar) {
    window.addEventListener("scroll", requestScrollUpdate, { passive: true });
    window.addEventListener("resize", requestScrollUpdate, { passive: true });
    requestScrollUpdate();
  }

  const imageContainers = new Set();
  document.querySelectorAll(".project-media img").forEach((image) => {
    const container = image.closest(".project-media");
    if (!container) return;
    imageContainers.add(container);
    container.classList.add("image-shell", "parallax-media");

    const markLoaded = () => {
      image.dataset.loaded = "true";
      const images = [...container.querySelectorAll("img")];
      if (images.every((item) => item.dataset.loaded === "true" || item.dataset.error === "true")) {
        container.classList.add("image-loaded");
      }
    };
    const markError = () => {
      image.dataset.error = "true";
      container.classList.add("image-error");
      markLoaded();
    };

    if (image.complete) {
      image.naturalWidth ? markLoaded() : markError();
    } else {
      image.addEventListener("load", markLoaded, { once: true });
      image.addEventListener("error", markError, { once: true });
    }
  });

  const depthTargets = document.querySelectorAll(
    ".project-card, .skill-card, .about-step, .contact-option, .insight-mini-card"
  );

  const resetDepth = (element) => {
    element.style.transform = "";
    element.classList.remove("depth-active");
  };

  depthTargets.forEach((element) => {
    element.addEventListener("pointermove", (event) => {
      if (reduceMotion.matches || !finePointer.matches || window.innerWidth < 900) return;
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      element.classList.add("depth-active");
      element.style.transform = `perspective(900px) rotateX(${y * -2.4}deg) rotateY(${x * 2.8}deg) translateY(-3px)`;
    });
    element.addEventListener("pointerleave", () => resetDepth(element));
    element.addEventListener("blur", () => resetDepth(element), true);
  });

  document.querySelectorAll('a[href]').forEach((link) => {
    link.addEventListener("click", (event) => {
      if (event.defaultPrevented || reduceMotion.matches) return;
      if (link.target === "_blank" || link.hasAttribute("download")) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const rawHref = link.getAttribute("href");
      if (!rawHref || rawHref.startsWith("#") || rawHref.startsWith("mailto:") || rawHref.startsWith("tel:")) return;

      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin) return;
      if (destination.pathname === window.location.pathname && destination.hash) return;

      event.preventDefault();
      document.body.classList.add("page-leaving");
      window.setTimeout(() => { window.location.href = destination.href; }, 180);
    });
  });

  requestAnimationFrame(() => document.body.classList.add("page-ready"));
  window.addEventListener("pageshow", () => {
    document.body.classList.remove("page-leaving");
    document.body.classList.add("page-ready");
    requestScrollUpdate();
  });
})();
