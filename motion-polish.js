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
        // Rotate circular ribbons inside a fixed projection: the ellipse never tumbles.
        const ribbon = (radius, width, start, sweep) => {
          const points = (sign) => Array.from({ length: 49 }, (_, i) => {
            const t = i / 48;
            const angle = (start + sweep * t) * Math.PI / 180;
            const r = radius + sign * width * Math.pow(Math.sin(Math.PI * t), 1.2) / 2;
            return [(160 + r * Math.cos(angle)).toFixed(2), (160 + r * Math.sin(angle)).toFixed(2)].join(',');
          });
          return 'M' + points(1).join(' L') + ' L' + points(-1).reverse().join(' L') + ' Z';
        };
        const bands = [
          [145, 17, 8, 108, 'main'], [145, 14, 190, 78, 'main'],
          [132, 7, 98, 66, 'secondary'], [155, 4, 292, 36, 'accent']
        ];
        const orbitSvg = side => {
          const id = 'project-saturn-' + side;
          const front = side === 'front';
          return `<svg class="cta-orbits cta-orbits-${side}" viewBox="0 0 320 320" fill="none" aria-hidden="true" focusable="false">
            <defs>
              <linearGradient id="${id}-paint" x1="0" y1="0" x2="1" y2="1">
                <stop stop-color="#FFB347"/><stop offset=".48" stop-color="#FF7A18"/><stop offset="1" stop-color="#E95413"/>
              </linearGradient>
              <clipPath id="${id}-half"><rect x="-20" y="${front ? 160 : -20}" width="360" height="180"/></clipPath>
            </defs>
            <g transform="translate(160 160) rotate(-20) scale(1 .72) translate(-160 -160)">
              <g clip-path="url(#${id}-half)">
                ${bands.map(([r, w, a, length, speed]) => `<g class="saturn-flow saturn-flow-${speed}"><path d="${ribbon(r, w, a, length)}" fill="url(#${id}-paint) #FF7A18" stroke="none"/></g>`).join('')}
              </g>
            </g>
          </svg>`;
        };
        stage.insertAdjacentHTML('beforeend', orbitSvg('back') + orbitSvg('front'));
      }
    });

    const heroName = scope.querySelector?.(".hero-name");
    if (heroName && !heroName.querySelector(".hero-triangle")) {
      heroName.insertAdjacentHTML("beforeend", `<svg class="hero-triangle" viewBox="0 0 100 88" aria-hidden="true" focusable="false"><g><polygon points="50,2 98,86 2,86" /></g></svg>`);
    }

    const contactRail = scope.querySelector?.(".contact-rail");
    if (contactRail && !contactRail.querySelector(".contact-stripe-art")) {
      contactRail.insertAdjacentHTML("afterbegin", `
        <svg class="contact-stripe-art" viewBox="0 0 760 240" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <g>
            <line class="stripe stripe-hairline" x1="-48" y1="-6" x2="92" y2="134" />
            <line class="stripe stripe-fine" x1="-22" y1="-16" x2="132" y2="138" />
            <line class="stripe stripe-anchor" x1="18" y1="-20" x2="184" y2="146" />
            <line class="stripe stripe-quiet" x1="244" y1="-14" x2="340" y2="82" />
            <line class="stripe stripe-anchor stripe-anchor-mid" x1="356" y1="-28" x2="526" y2="142" />
            <line class="stripe stripe-hairline" x1="474" y1="-6" x2="586" y2="106" />
            <line class="stripe stripe-medium" x1="584" y1="-22" x2="742" y2="136" />
            <line class="stripe stripe-fine" x1="634" y1="-24" x2="786" y2="128" />
            <line class="stripe stripe-quiet" x1="694" y1="-10" x2="806" y2="102" />
          </g>
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
