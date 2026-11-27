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
    scope.querySelectorAll?.(".hero-actions .button").forEach(button => {
      if (button.closest(".cta-stage")) return;

      const stage = document.createElement("span");
      const isResume = button.classList.contains("alt");
      stage.className = `cta-stage ${isResume ? "cta-stage-resume" : "cta-stage-projects"}`;
      button.before(stage);
      stage.append(button);

      if (isResume) {
        stage.insertAdjacentHTML("beforeend", `
          <svg class="cta-goo" viewBox="0 0 260 260" aria-hidden="true" focusable="false">
            <defs>
              <filter id="cta-goo-filter" x="-45%" y="-45%" width="190%" height="190%" color-interpolation-filters="sRGB">
                <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10" result="goo" />
                <feComposite in="SourceGraphic" in2="goo" operator="atop" />
              </filter>
            </defs>
            <g class="goo-field" filter="url(#cta-goo-filter)">
              <circle class="goo-reservoir" cx="130" cy="130" r="107" />
              <circle class="goo-drop goo-drop-1" cx="130" cy="22" r="12" />
              <circle class="goo-drop goo-drop-2" cx="226" cy="83" r="9" />
              <circle class="goo-drop goo-drop-3" cx="225" cy="181" r="15" />
              <circle class="goo-drop goo-drop-4" cx="137" cy="238" r="10" />
              <circle class="goo-drop goo-drop-5" cx="39" cy="191" r="13" />
              <circle class="goo-drop goo-drop-6" cx="30" cy="88" r="8" />
            </g>
          </svg>`);
      } else {
        stage.insertAdjacentHTML("beforeend", `
          <svg class="cta-orbits" viewBox="0 0 260 260" aria-hidden="true" focusable="false">
            <defs>
              <linearGradient id="orbit-warm-a" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#FFBF85"/><stop offset=".48" stop-color="#FF8737"/><stop offset="1" stop-color="#E95E16"/></linearGradient>
              <linearGradient id="orbit-warm-b" x1="1" y1="0" x2="0" y2="1"><stop stop-color="#E95E16"/><stop offset=".54" stop-color="#FF8737"/><stop offset="1" stop-color="#FFBF85"/></linearGradient>
            </defs>
            <g class="orbit-layer orbit-layer-1"><circle cx="130" cy="130" r="117" pathLength="100" /></g>
            <g class="orbit-layer orbit-layer-2"><circle cx="130" cy="130" r="109" pathLength="100" /></g>
            <g class="orbit-layer orbit-layer-3"><circle cx="130" cy="130" r="101" pathLength="100" /></g>
            <g class="orbit-layer orbit-layer-4"><circle cx="130" cy="130" r="94" pathLength="100" /></g>
          </svg>`);
      }
    });

    const heroName = scope.querySelector?.(".hero-name");
    if (heroName && !heroName.querySelector(".hero-triangle")) {
      heroName.insertAdjacentHTML("beforeend", `<svg class="hero-triangle" viewBox="0 0 100 88" aria-hidden="true" focusable="false"><g><polygon points="50,2 98,86 2,86" /></g></svg>`);
    }

    const xmuCard = scope.querySelector?.(".mark-xmu");
    if (xmuCard && !xmuCard.querySelector(".xmu-flow-lines")) {
      xmuCard.insertAdjacentHTML("beforeend", `
        <svg class="xmu-flow-lines" viewBox="0 0 520 180" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <defs><linearGradient id="xmu-flow-gradient" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#164AAB"/><stop offset=".52" stop-color="#2563EB"/><stop offset="1" stop-color="#93C5FD" stop-opacity=".25"/></linearGradient></defs>
          <path class="xmu-flow-wide" d="M-35 146 C 68 92, 135 190, 248 137 S 410 82, 566 128" />
          <path class="xmu-flow-mid" d="M-28 159 C 83 117, 150 195, 268 145 S 438 101, 554 142" />
          <path class="xmu-flow-thin xmu-flow-thin-a" d="M-15 118 C 101 82, 163 171, 287 119 S 439 72, 548 104" />
          <path class="xmu-flow-thin xmu-flow-thin-b" d="M328 -18 C 378 24, 407 34, 524 18" />
          <path class="xmu-flow-thin xmu-flow-thin-c" d="M350 -12 C 404 38, 444 43, 536 35" />
        </svg>`);
    }

    scope.querySelectorAll?.(".hero-actions .button, .contact-link, .cta-stage, .hero-name").forEach(element => {
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
