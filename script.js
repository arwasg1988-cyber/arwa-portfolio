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

const cursorDot = document.querySelector(".cursor-dot");
const cursorOutline = document.querySelector(".cursor-outline");

let mouseX = 0;
let mouseY = 0;
let outlineX = 0;
let outlineY = 0;

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

const hoverTargets = document.querySelectorAll("a, button, .project-card, .skill-card, .metric");

hoverTargets.forEach((target) => {
  target.addEventListener("mouseenter", () => {
    cursorOutline?.classList.add("active");
  });

  target.addEventListener("mouseleave", () => {
    cursorOutline?.classList.remove("active");
  });
});

const heroCopy = document.querySelector(".hero-copy");
const heroPanel = document.querySelector(".hero-panel");

window.addEventListener("mousemove", (e) => {
  if (window.innerWidth < 900 || !heroCopy || !heroPanel) return;

  const x = (e.clientX / window.innerWidth - 0.5) * 16;
  const y = (e.clientY / window.innerHeight - 0.5) * 16;

  heroCopy.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
  heroPanel.style.transform = `translate(${x * -0.45}px, ${y * -0.45}px)`;
});
