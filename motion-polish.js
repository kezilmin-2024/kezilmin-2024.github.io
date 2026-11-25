function enablePointerFeedback() {
  document.documentElement.classList.add("pointer-active");
}

function disablePointerFeedback() {
  document.documentElement.classList.remove("pointer-active");
}

document.addEventListener("pointerdown", enablePointerFeedback, { passive: true });
document.addEventListener("pointerup", disablePointerFeedback, { passive: true });
document.addEventListener("pointercancel", disablePointerFeedback, { passive: true });
window.addEventListener("blur", disablePointerFeedback, { passive: true });

function enableHomepageIntro() {
  const root = document.querySelector("#app");
  if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let played = false;
  let observer;
  const observeHome = () => {
    const home = root.querySelector(".home");
    if (!home || played) return;

    const shell = home.closest(".site-shell");
    if (!shell) return;
    played = true;
    observer.disconnect();
    shell.classList.add("editorial-intro");

    const finalElement = shell.querySelector(".education-card");
    const clearIntro = () => shell.classList.remove("editorial-intro");
    if (finalElement) finalElement.addEventListener("animationend", clearIntro, { once: true });
    window.setTimeout(clearIntro, 1500);
  };

  observer = new MutationObserver(observeHome);
  observer.observe(root, { childList: true, subtree: true });
  observeHome();
}

enableHomepageIntro();

function enhanceHomepageMediaAndMotion() {
  const root = document.querySelector("#app");
  if (!root) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const motionObserver = reducedMotion ? null : new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle("is-motion-visible", entry.isIntersecting));
  }, { rootMargin: "80px 0px" });

  const prepare = scope => {
    scope.querySelectorAll?.(".hero-actions .button, .contact-link").forEach(element => {
      if (!element.dataset.motionReady && motionObserver) {
        element.dataset.motionReady = "true";
        motionObserver.observe(element);
      }
    });

    scope.querySelectorAll?.("img").forEach(image => {
      if (image.dataset.mediaReady) return;
      image.dataset.mediaReady = "true";
      image.decoding = "async";
      if (image.closest(".identity-board")) {
        image.loading = "eager";
        image.fetchPriority = "high";
      } else {
        image.loading = "lazy";
      }
    });
  };

  document.addEventListener("error", event => {
    const image = event.target;
    if (!(image instanceof HTMLImageElement) || image.dataset.retryAttempted) return;
    image.dataset.retryAttempted = "true";
    const retryUrl = new URL(image.currentSrc || image.src, window.location.href);
    retryUrl.searchParams.set("retry", String(Date.now()));
    window.setTimeout(() => { image.src = retryUrl.href; }, 450);
  }, true);

  new MutationObserver(entries => {
    entries.forEach(entry => entry.addedNodes.forEach(node => {
      if (node instanceof Element) prepare(node);
    }));
  }).observe(root, { childList: true, subtree: true });

  prepare(root);
}

enhanceHomepageMediaAndMotion();
