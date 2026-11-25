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
