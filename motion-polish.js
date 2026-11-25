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
