// report.js
// every so often the lamp files a short incident report about what happened while you were browsing.
// it works it all out by watching the page from the outside, so nothing else needs to know about it.
// type "report" anywhere to get one straight away.

(function () {
  var reduceMotion = matchMedia("(prefers-reduced-motion:reduce)").matches;

  function byId(id) { return document.getElementById(id); }
  function pick(list) { return window.nextLine ? window.nextLine(list) : list[Math.floor(Math.random() * list.length)]; }
  function fresh() {
    return { fastScrolls: 0, lines: 0, clicks: 0, grabs: 0, garden: 0, swords: 0, alone: 0, tabs: 0,
             cookie: 0, benchFails: 0, boxPokes: 0, drawer: 0, log: 0 };
  }

  var stats = fresh();
  var reportNumber = 23 + Math.floor(Math.random() * 6);
  var showing = false;
  var activeSeconds = 0;
  var nextReportAfter = 100;          // seconds of being watched before the first one, then longer gaps

  var bubble = byId("bub");
  var lamp = byId("lamp");


  // ---------- watching ----------

  // every time the lamp says something new, that's a warning
  var lastLine = "";
  if (bubble) new MutationObserver(function () {
    var text = bubble.textContent;
    if (!bubble.hidden && text && text !== lastLine) { stats.lines++; lastLine = text; }
  }).observe(bubble, { childList: true, characterData: true, subtree: true });

  if (lamp) {
    lamp.addEventListener("click", function () { stats.clicks++; });
    var pressedAt = null, grabbed = false;
    lamp.addEventListener("pointerdown", function (e) { pressedAt = { x: e.clientX, y: e.clientY }; grabbed = false; });
    window.addEventListener("pointermove", function (e) {
      if (pressedAt && !grabbed && Math.hypot(e.clientX - pressedAt.x, e.clientY - pressedAt.y) > 10) { grabbed = true; stats.grabs++; }
    }, { passive: true });
    window.addEventListener("pointerup", function () { pressedAt = null; });
  }

  var gardenCount = document.querySelector(".gcount");
  if (gardenCount) new MutationObserver(function () { stats.garden++; }).observe(gardenCount, { childList: true, characterData: true, subtree: true });

  new MutationObserver(function (changes) {
    changes.forEach(function (c) {
      for (var i = 0; i < c.addedNodes.length; i++) {
        var node = c.addedNodes[i];
        if (!node.classList) continue;
        if (node.classList.contains("sw")) stats.swords++;
        if (node.classList.contains("idle")) stats.alone++;
      }
    });
  }).observe(document.body, { childList: true });

  var wasHidden = false;
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) wasHidden = true;
    else if (wasHidden) { stats.tabs++; wasHidden = false; }
  });

  var lastNavClick = 0;
  document.addEventListener("click", function (e) {
    var t = e.target;
    if (!t.closest) return;
    if (t.closest("#ckx")) stats.cookie++;
    if (t.closest("a[href^='#']")) lastNavClick = Date.now();
  });

  // scrolling too fast (jumping to a section from the nav doesn't count)
  var lastY = scrollY, lastT = performance.now(), lastFastAt = 0;
  window.addEventListener("scroll", function () {
    var now = performance.now();
    var speed = Math.abs(scrollY - lastY) / Math.max(1, now - lastT) * 1000;
    lastY = scrollY; lastT = now;
    if (speed > 3500 && Date.now() - lastNavClick > 1800 && now - lastFastAt > 2000) { lastFastAt = now; stats.fastScrolls++; }
  }, { passive: true });

  // things the drawer, the workshop and the box tell me about
  document.addEventListener("lab", function (e) {
    if (e.detail === "bench-fail") stats.benchFails++;
    if (e.detail === "box-poke") stats.boxPokes++;
    if (e.detail === "drawer") stats.drawer++;
    if (e.detail === "log") stats.log++;
  });


  // ---------- writing the report ----------

  var CLOSERS = [
    "I am not being paid enough for this.",
    "This report will be filed under “later”.",
    "I have no further comments. (I have many.)",
    "Please do not tell the lamp union.",
    "Signed, a lamp.",
    "I am only a lamp. I am doing my best."
  ];
  var QUIET = [
    "No incidents to report.",
    "That is suspicious.",
    "I am watching."
  ];

  function times(n) { return n === 1 ? "once" : n === 2 ? "twice" : n + " times"; }
  function spell(n) { return ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"][n] || n; }

  function buildLines(s) {
    var lines = [];
    if (s.fastScrolls) lines.push("User scrolled too quickly" + (s.fastScrolls > 1 ? " (" + times(s.fastScrolls) + ")" : "") + ".");
    if (s.lines >= 2) lines.push("User ignored " + spell(Math.min(s.lines, 10)) + " warnings.");
    if (s.clicks) lines.push(s.clicks === 1 ? "User clicked me once. Once." : "User clicked me " + s.clicks + " times.");
    if (s.grabs) lines.push("User picked me up" + (s.grabs > 1 ? " " + times(s.grabs) : "") + ". I was not consulted.");
    if (s.swords) lines.push("A sword was broken. Not by me.");
    if (s.alone) lines.push("User left me alone. I handled it badly.");
    if (s.tabs) lines.push("User left the tab. I stayed. I always stay.");
    if (s.cookie) lines.push("User was asked about cookies. Answer: fair.");
    if (s.benchFails) lines.push("User built something that does not work. Typical.");
    if (s.boxPokes) lines.push("User poked the box. I have no comment on the box.");
    if (s.drawer) lines.push("User went through the drawer. I will not be explaining the drawer.");
    if (s.log) lines.push("User read the failure log. We do not talk about the failure log.");
    if (s.garden) lines.push("I witnessed something in the garden.");
    // keep it short: if there's a lot, drop a few at random but keep the order
    while (lines.length > 5) lines.splice(Math.floor(Math.random() * lines.length), 1);
    return lines;
  }

  function showReport(force) {
    if (showing) return;
    var lines = buildLines(stats);
    if (!lines.length) { if (!force) return; lines = [QUIET[0], QUIET[1]]; }
    showing = true;
    reportNumber++;
    stats = fresh();
    activeSeconds = 0;
    nextReportAfter = 170 + Math.floor(Math.random() * 60);
    if (window.lampSay) window.lampSay("hold on. i’m writing this down.", 2600);

    var card = document.createElement("div");
    card.className = "incident";
    card.setAttribute("role", "status");
    var title = "LAMP INCIDENT REPORT #" + ("00" + reportNumber).slice(-3);
    card.innerHTML = "<b>" + title + "</b><ul></ul><p class=\"sig\"></p><button type=\"button\">noted</button><span class=\"filed\" aria-hidden=\"true\">FILED</span>";
    document.body.appendChild(card);

    var list = card.querySelector("ul");
    var all = lines.concat([pick(CLOSERS)]);
    var timers = [];
    all.forEach(function (text, i) {
      var reveal = function () {
        if (i === all.length - 1) { card.querySelector(".sig").textContent = text; card.classList.add("done"); }
        else { var li = document.createElement("li"); li.textContent = text; list.appendChild(li); }
      };
      if (reduceMotion) reveal(); else timers.push(setTimeout(reveal, 500 + i * 700));
    });

    function close() {
      timers.forEach(clearTimeout);
      clearTimeout(autoClose);
      card.remove();
      showing = false;
    }
    var autoClose = setTimeout(close, 18000 + all.length * 700);
    card.querySelector("button").addEventListener("click", close);
  }


  // ---------- when to file one ----------

  setInterval(function () {
    if (document.hidden) return;
    activeSeconds += 5;
    if (activeSeconds < nextReportAfter) return;
    if (document.querySelector(".idle")) return;             // not during the screensaver
    showReport(false);
  }, 5000);

  var typed = "";
  document.addEventListener("keydown", function (e) {
    if (e.target.matches && e.target.matches("input,textarea")) return;
    if (!e.key || e.key.length !== 1) return;
    typed = (typed + e.key.toLowerCase()).slice(-6);
    if (typed === "report") { typed = ""; showReport(true); }
  });
})();
