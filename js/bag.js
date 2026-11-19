
// ---- in my bag: unzip the backpack, tap things to hear why they're in there ----
(function () {
  var bg = document.getElementById("bg"), btn = document.getElementById("bgb"), hint = document.getElementById("bgh"), note = document.getElementById("bgn");
  if (!bg || !btn) return;
  var items = [].slice.call(bg.querySelectorAll(".bi"));
  var still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var open = false;

  function flyFrom() {
    // where each thing starts from: the middle of the bag
    var b = btn.getBoundingClientRect();
    var cx = b.left + b.width / 2, cy = b.top + b.height * 0.45;
    items.forEach(function (el) {
      var r = el.getBoundingClientRect();
      el.style.setProperty("--tx", (cx - (r.left + r.width / 2)) + "px");
      el.style.setProperty("--ty", (cy - (r.top + r.height / 2)) + "px");
    });
  }

  function setOpen(on) {
    open = on;
    if (on) bg.classList.remove("packed"); else { flyFrom(); bg.classList.add("packed"); }
    hint.textContent = on ? "zip me up" : "unzip me";
    btn.setAttribute("aria-expanded", on ? "true" : "false");
    btn.setAttribute("aria-label", on ? "The bag. Press to zip it back up" : "The bag. Press to unzip it and tip everything out");
    bg.classList.remove("wob"); void bg.offsetWidth; if (!still) bg.classList.add("wob");
  }

  // with scripting on, start zipped up; without it everything just sits out on the desk
  flyFrom();
  bg.classList.add("packed");
  btn.setAttribute("aria-expanded", "false");
  window.addEventListener("resize", function () { if (!open) flyFrom(); });
  if ("IntersectionObserver" in window) {
    // the first time it scrolls into view, give it a tiny nudge so people know it's pressable
    var nudged = false;
    new IntersectionObserver(function (es) {
      if (es[0].isIntersecting && !nudged && !open) { nudged = true; if (!still) { bg.classList.add("wob"); setTimeout(function () { bg.classList.remove("wob"); }, 600); } }
    }, { threshold: 0.5 }).observe(btn);
  }

  btn.addEventListener("click", function () {
    setOpen(!open);
    if (open) { note.querySelector("small").textContent = "tap something"; note.querySelector("p").textContent = "everything in here has a reason. mostly a bad one."; }
  });

  items.forEach(function (el) {
    el.addEventListener("click", function () {
      items.forEach(function (o) { o.setAttribute("aria-pressed", o === el ? "true" : "false"); });
      note.querySelector("small").textContent = el.querySelector(".bl").textContent;
      note.querySelector("p").textContent = el.getAttribute("data-n");
    });
  });
})();
