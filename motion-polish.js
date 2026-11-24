const app = document.querySelector("#app");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const observed = new WeakSet();

const selectors = [
  [".identity-mark", "clip"],
  [".hero-copy > *", "rise"],
  [".hero-system", "clip"],
  [".education-card", "clip"],
  [".quick-entry-link", "rise"],
  [".metric-rail > *", "rise"],
  [".section-head > *", "rise"],
  [".project-card", "clip"],
  [".two-col > .panel", "clip"],
  [".detail-hero > *", "rise"],
  [".page-title > *", "rise"],
  [".block", "rise"],
  [".sidebar > *", "rise"]
];

const observer = "IntersectionObserver" in window
  ? new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" })
  : null;

function reveal(element) {
  element.classList.add("is-visible");
}

function prepareMotion(root = document) {
  if (!root.querySelectorAll) return;

  for (const [selector, style] of selectors) {
    const elements = root.matches?.(selector)
      ? [root, ...root.querySelectorAll(selector)]
      : [...root.querySelectorAll(selector)];

    elements.forEach((element, index) => {
      if (observed.has(element)) return;
      observed.add(element);
      element.dataset.motion = style;
      element.style.setProperty("--motion-delay", `${Math.min(index, 5) * 54}ms`);

      if (reduceMotion.matches || !observer) reveal(element);
      else observer.observe(element);
    });
  }
}

function revealEverything() {
  document.querySelectorAll("[data-motion]").forEach(reveal);
}

document.documentElement.classList.add("motion-enabled");
prepareMotion(document);

if (app) {
  new MutationObserver((records) => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) prepareMotion(node);
      }
    }
  }).observe(app, { childList: true, subtree: true });
}

document.addEventListener("pointerdown", () => {
  document.documentElement.classList.add("pointer-active");
}, { passive: true });

for (const eventName of ["pointerup", "pointercancel"]) {
  document.addEventListener(eventName, () => {
    document.documentElement.classList.remove("pointer-active");
  }, { passive: true });
}

reduceMotion.addEventListener?.("change", () => {
  if (reduceMotion.matches) revealEverything();
});

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) revealEverything();
});

window.setTimeout(() => {
  document.querySelectorAll("[data-motion]:not(.is-visible)").forEach((element) => {
    if (element.getBoundingClientRect().top < window.innerHeight * 1.1) reveal(element);
  });
}, 1800);
