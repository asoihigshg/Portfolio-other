// log.js
// the failure log: filters, a running tally, and a garden leaf for reading a post-mortem.
// loads after lab.js. the entries themselves live in index.html, search:  id="failures"

(function () {
  var list = document.getElementById("fll"), tally = document.getElementById("flt");
  if (!list) return;
  var entries = [].slice.call(list.querySelectorAll(".fl-e"));
  var chips = [].slice.call(document.querySelectorAll(".fl-f button"));

  function count(kind) { return entries.filter(function (e) { return e.dataset.k === kind; }).length; }
  tally.textContent = entries.length + " entries · " + count("failed") + " failed · " + count("abandoned") + " abandoned · " + count("questionable") + " questionable · 0 lessons applied";

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.setAttribute("aria-pressed", c === chip ? "true" : "false"); });
      entries.forEach(function (e) { e.hidden = chip.dataset.f !== "all" && e.dataset.k !== chip.dataset.f; });
    });
  });

  // opening a post-mortem counts as finding something
  list.addEventListener("toggle", function (e) {
    if (!e.target.open) return;
    document.dispatchEvent(new CustomEvent("gardenfind", { detail: "log" }));
    document.dispatchEvent(new CustomEvent("lab", { detail: "log" }));
  }, true);
})();
