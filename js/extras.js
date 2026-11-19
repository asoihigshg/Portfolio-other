// extras.js
// the lamp character, the little garden, what happens when you leave me alone,
// (the proof section is empty on purpose, it's for demos uploaded by hand).
// it loads after main.js, so everything it hooks into already exists.

(function () {
  var reduceMotion = matchMedia("(prefers-reduced-motion:reduce)").matches;
  var finePointer = matchMedia("(pointer:fine)").matches;

  function byId(id) { return document.getElementById(id); }
  function clamp(n, low, high) { return Math.max(low, Math.min(high, n)); }
  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }

  var lamp = byId("lamp");
  var bubble = byId("bub");
  var pointer = { x: -999, y: -999 };
  var bubbleTimer;

  window.addEventListener("pointermove", function (e) { pointer.x = e.clientX; pointer.y = e.clientY; }, { passive: true });


  // ---------- speech bubble that follows the lamp ----------

  function say(text, ms) {
    bubble.textContent = text;
    bubble.hidden = false;
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(function () { bubble.hidden = true; }, ms || 3800);
  }

  function placeBubble() {
    if (bubble.hidden) return;
    var l = lamp.getBoundingClientRect();
    var b = bubble.getBoundingClientRect();
    var lampMiddle = l.left + l.width / 2;
    var fitsBelow = l.bottom + 12 + b.height < innerHeight - 8;
    var left = clamp(lampMiddle - b.width / 2, 8, innerWidth - b.width - 8);
    bubble.classList.toggle("up", !fitsBelow);
    bubble.style.left = left + "px";
    bubble.style.top = (fitsBelow ? l.bottom + 10 : l.top - b.height - 12) + "px";
    bubble.style.right = "auto";
    bubble.style.setProperty("--tail", clamp(lampMiddle - left - 6, 14, b.width - 26) + "px");
  }

  // main.js shows the bubble too, so watch it instead of calling placeBubble from there
  new MutationObserver(placeBubble).observe(bubble, {
    attributes: true, attributeFilter: ["hidden"], childList: true, characterData: true, subtree: true
  });


  // ---------- the lamp is a character now ----------

  var SHY_LINES = [
    "oh no, a person.",
    "i’m busy. (i’m not busy.)",
    "please don’t look at me.",
    "hi. no. sorry. bye.",
    "i panic. it’s a lamp thing."
  ];

  var lampSize = { w: 64, h: 74 };
  var lampPos = { x: 0, y: 0 };
  var heading = { x: -0.8, y: 0.6 };      // unit vector, which way it's drifting
  var roaming = false;
  var hovered = false;
  var focused = false;
  var frozenUntil = 0;                      // stays put until this time (ms)
  var boostUntil = 0;                       // running away until this time
  var calmUntil = 0;                        // stops dodging until this time
  var dodges = 0;
  var lastCornerLine = 0;
  var cornerHits = 0;
  var screensaver = false;                  // set further down, used for speed

  function moveLamp() {
    lampPos.x = clamp(lampPos.x, 0, Math.max(0, innerWidth - lampSize.w));
    lampPos.y = clamp(lampPos.y, 0, Math.max(0, innerHeight - lampSize.h));
    lamp.style.left = lampPos.x + "px";
    lamp.style.top = lampPos.y + "px";
    var g = byId("glow");
    if (g) { g.style.setProperty("--gx", (lampPos.x + lampSize.w * 0.8) + "px"); g.style.setProperty("--gy", (lampPos.y + 20) + "px"); }
    placeBubble();
  }

  function homePosition() { return { x: innerWidth - lampSize.w - 14, y: 12 }; }

  function startLamp() {
    var r = lamp.getBoundingClientRect();
    lampSize.w = r.width;
    lampSize.h = r.height;
    lampPos.x = r.left;
    lampPos.y = r.top;
    lamp.style.right = "auto";
    moveLamp();
    if (!reduceMotion) setTimeout(function () { roaming = true; }, 6000);
  }

  function atCorner() {
    cornerHits++;
    var counter = byId("idlec");
    if (counter) counter.textContent = "corner hits: " + cornerHits;
    if (Date.now() - lastCornerLine > 25000) {
      lastCornerLine = Date.now();
      say(screensaver ? "corner. nailed it." : "corner. cosy.", 2500);
    }
  }

  function dodgeThePointer(now) {
    if (!finePointer || now < calmUntil || now < boostUntil) return;
    var dx = lampPos.x + lampSize.w / 2 - pointer.x;
    var dy = lampPos.y + lampSize.h / 2 - pointer.y;
    var distance = Math.hypot(dx, dy) || 1;
    if (distance > 120) return;
    heading.x = dx / distance;
    heading.y = dy / distance;
    boostUntil = now + 700;
    dodges++;
    if (dodges >= 3) {
      dodges = 0;
      calmUntil = frozenUntil = now + 9000;
      say("...fine. you can press me. gently.", 4500);
    } else {
      say(pick(SHY_LINES), 2200);
    }
  }

  function updateLamp(dt, now) {
    if (reduceMotion || !roaming) return;
    if (focused) {
      // keyboard users get the lamp back in its corner so it's easy to find
      var home = homePosition();
      lampPos.x += (home.x - lampPos.x) * Math.min(1, dt * 4);
      lampPos.y += (home.y - lampPos.y) * Math.min(1, dt * 4);
      moveLamp();
      return;
    }
    if (hovered || now < frozenUntil) return;

    dodgeThePointer(now);
    var speed = (screensaver ? 150 : 45) * (now < boostUntil ? 5 : 1);
    lampPos.x += heading.x * speed * dt;
    lampPos.y += heading.y * speed * dt;

    var maxX = innerWidth - lampSize.w;
    var maxY = innerHeight - lampSize.h;
    var hitX = false, hitY = false;
    if (lampPos.x < 0) { heading.x = Math.abs(heading.x); hitX = true; }
    if (lampPos.x > maxX) { heading.x = -Math.abs(heading.x); hitX = true; }
    if (lampPos.y < 0) { heading.y = Math.abs(heading.y); hitY = true; }
    if (lampPos.y > maxY) { heading.y = -Math.abs(heading.y); hitY = true; }
    if (hitX && hitY) atCorner();
    moveLamp();
  }

  var lastFrame = performance.now();
  function frame(now) {
    var dt = Math.min(0.05, (now - lastFrame) / 1000);
    lastFrame = now;
    if (!document.hidden) updateLamp(dt, now);
    requestAnimationFrame(frame);
  }

  lamp.addEventListener("pointerenter", function () { hovered = true; });
  lamp.addEventListener("pointerleave", function () { hovered = false; frozenUntil = Date.now() + 600; });
  lamp.addEventListener("focus", function () { focused = true; });
  lamp.addEventListener("blur", function () { focused = false; frozenUntil = Date.now() + 2500; });
  lamp.addEventListener("touchstart", function () { frozenUntil = Date.now() + 5000; }, { passive: true });
  lamp.addEventListener("click", function () { frozenUntil = Date.now() + 3000; });
  window.addEventListener("resize", function () { moveLamp(); });

  // eyes follow the cursor, and it blinks and hops now and then
  var eyes = lamp.querySelector(".eyes");
  var pupils = lamp.querySelectorAll(".pupil");
  if (!reduceMotion && eyes) {
    window.addEventListener("pointermove", function () {
      var r = lamp.getBoundingClientRect();
      var dx = pointer.x - (r.left + r.width / 2);
      var dy = pointer.y - (r.top + r.height / 2);
      var length = Math.hypot(dx, dy) || 1;
      var shift = "translate(" + (dx / length * 1.3).toFixed(2) + " " + (dy / length * 1.3).toFixed(2) + ")";
      for (var i = 0; i < pupils.length; i++) pupils[i].setAttribute("transform", shift);
    }, { passive: true });
    setInterval(function () {
      eyes.animate([{ transform: "scaleY(1)" }, { transform: "scaleY(.1)" }, { transform: "scaleY(1)" }], { duration: 180 });
    }, 4200);
    setInterval(function () {
      if (!roaming || hovered || focused || document.hidden) return;
      lamp.querySelector("svg").animate([
        { transform: "translateY(0) scale(1,1)" },
        { transform: "translateY(-10px) scale(.92,1.1)" },
        { transform: "translateY(0) scale(1.08,.92)" },
        { transform: "translateY(0) scale(1,1)" }
      ], { duration: 650 });
    }, 7000);
  }


  // ---------- the little garden ----------
  // grows a leaf for every thing someone finds. nothing is saved, so it starts again each visit.

  var DISCOVERIES = {
    name: "poked my name",
    lamp: "pressed the lamp",
    email: "found my email",
    lunge: "lunged",
    cookie: "dealt with the cookie banner",
    guestbook: "opened the guestbook",
    sword: "broke a sword",
    secret: "found the little star",
    tab: "left and came back",
    bottom: "reached the bottom",
    idle: "left me alone",
    music: "pressed play",
    photo: "developed a photo",
    cartridge: "pulled out a cartridge"
  };
  var discoveryIds = Object.keys(DISCOVERIES);
  var found = {};
  var foundCount = 0;

  var SVG_NS = "http://www.w3.org/2000/svg";
  function svgEl(name, attrs) {
    var el = document.createElementNS(SVG_NS, name);
    for (var key in attrs) el.setAttribute(key, attrs[key]);
    return el;
  }

  var garden = document.createElement("div");
  garden.className = "garden";
  garden.setAttribute("role", "img");
  garden.innerHTML = '<svg viewBox="0 0 100 130" aria-hidden="true"></svg><span class="gcount"></span>';
  document.body.appendChild(garden);
  var gardenSvg = garden.querySelector("svg");
  var gardenCount = garden.querySelector(".gcount");

  // pot, soil and a wobbly stem
  gardenSvg.appendChild(svgEl("path", { d: "M26 102h48l-6 26H32Z", fill: "#A94F36", stroke: "#30251F", "stroke-width": 3, "stroke-linejoin": "round" }));
  gardenSvg.appendChild(svgEl("rect", { x: 22, y: 97, width: 56, height: 8, rx: 3, fill: "#BD8170", stroke: "#30251F", "stroke-width": 3 }));
  function stemX(y) { return 50 + Math.sin(y / 9) * 3; }
  var stem = "M" + stemX(98) + " 98";
  for (var y = 96; y >= 38; y -= 2) stem += "L" + stemX(y).toFixed(1) + " " + y;
  gardenSvg.appendChild(svgEl("path", { d: stem, fill: "none", stroke: "#7B805D", "stroke-width": 3, "stroke-linecap": "round" }));

  var LEAF_COLOURS = ["#8E9468", "#C58A42", "#A94F36", "#BD8170"];
  var leaves = discoveryIds.map(function (id, i) {
    var attachY = 92 - i * (50 / (discoveryIds.length - 1));
    var side = i % 2 ? 1 : -1;
    var angle = side === 1 ? -25 - (i % 3) * 8 : 205 + (i % 3) * 8;
    var group = svgEl("g", {});
    group.appendChild(svgEl("path", {
      d: "M0 0C6 -8 17 -8 25 0C17 8 6 8 0 0Z",
      fill: LEAF_COLOURS[i % 4], stroke: "#30251F", "stroke-width": 1.6, "stroke-linejoin": "round"
    }));
    gardenSvg.appendChild(group);
    var leaf = { group: group, x: stemX(attachY), y: attachY, angle: angle };
    setLeafScale(leaf, 0);
    return leaf;
  });

  function setLeafScale(leaf, scale) {
    leaf.group.setAttribute("transform", "translate(" + leaf.x.toFixed(1) + " " + leaf.y.toFixed(1) + ") rotate(" + leaf.angle + ") scale(" + scale + ")");
  }

  function easeOutBack(t) {
    var c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }

  function grow(leaf, done) {
    if (reduceMotion) { setLeafScale(leaf, 1); if (done) done(); return; }
    var start = performance.now();
    (function step(now) {
      var t = clamp((now - start) / 700, 0, 1);
      setLeafScale(leaf, easeOutBack(t));
      if (t < 1) requestAnimationFrame(step); else if (done) done();
    })(start);
  }

  function bloom() {
    var flower = svgEl("g", {});
    for (var p = 0; p < 6; p++) {
      var a = p / 6 * Math.PI * 2;
      flower.appendChild(svgEl("circle", {
        cx: (Math.cos(a) * 7).toFixed(1), cy: (Math.sin(a) * 7).toFixed(1), r: 5,
        fill: p % 2 ? "#BD8170" : "#C58A42", stroke: "#30251F", "stroke-width": 1.4
      }));
    }
    flower.appendChild(svgEl("circle", { cx: 0, cy: 0, r: 4.5, fill: "#A94F36", stroke: "#30251F", "stroke-width": 1.4 }));
    gardenSvg.appendChild(flower);
    var top = { group: flower, x: stemX(36), y: 34, angle: 0 };
    setLeafScale(top, 0);
    grow(top);
  }

  function updateGardenLabel() {
    gardenCount.textContent = foundCount + "/" + discoveryIds.length;
    garden.setAttribute("aria-label", "a little garden that grows as you find things on this page. " + foundCount + " of " + discoveryIds.length + " found.");
  }
  updateGardenLabel();

  function discover(id) {
    if (!DISCOVERIES[id] || found[id]) return;
    found[id] = true;
    foundCount++;
    grow(leaves[foundCount - 1]);
    updateGardenLabel();
    if (foundCount === 1) say("a leaf! there’s a little garden by the corner. it grows when you find things.", 5200);
    else if (foundCount === Math.ceil(discoveryIds.length / 2)) say("half the garden’s grown. you’re thorough.", 3800);
    else if (foundCount === discoveryIds.length) {
      bloom();
      say("that’s everything. the garden’s in flower. i’m a bit overwhelmed.", 6000);
    }
  }

  document.addEventListener("click", function (e) {
    var t = e.target;
    if (!t.closest) return;
    if (t.closest(".lt")) discover("name");
    if (t.closest("#lamp")) discover("lamp");
    if (t.closest("#eb")) discover("email");
    if (t.closest("#lg")) discover("lunge");
    if (t.closest("#ckx")) discover("cookie");
    if (t.closest("#gbl")) discover("guestbook");
    if (t.closest("#hb")) discover("secret");
    if (t.closest(".ipod .ct")) discover("music");
    if (t.closest(".fm")) discover("photo");
    if (t.closest(".wii .wch.full")) discover("cartridge");
  });

  // the sword snap adds a .sw element to the page
  new MutationObserver(function (changes) {
    changes.forEach(function (change) {
      for (var i = 0; i < change.addedNodes.length; i++) {
        var node = change.addedNodes[i];
        if (node.classList && node.classList.contains("sw")) discover("sword");
      }
    });
  }).observe(document.body, { childList: true });

  var wasHidden = false;
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) wasHidden = true;
    else if (wasHidden) discover("tab");
  });

  window.addEventListener("scroll", function () {
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 40) discover("bottom");
  }, { passive: true });


  // ---------- what happens if you leave me alone ----------

  var IDLE_STEPS = [
    { after: 25, line: "no rush. i’m just here." },
    { after: 50, line: "still reading? or did you leave me on read." },
    { after: 80, line: "i can see the tab is still open, you know." },
    { after: 110, line: "cool. cool cool cool." }
  ];
  var SCREENSAVER_AFTER = 140;
  var NAGS = [
    "no, it’s fine. i’ll just bounce about.",
    "i’ve been counting the corners. it’s four. it’s always four.",
    "you’ve been looking at the same bit for ages. it’s a good bit, i suppose.",
    "i reorganised my thoughts while you were away. twice.",
    "the cursor hasn’t moved in so long i’m a bit worried about it.",
    "i could tell you something interesting but you’re not here.",
    "this is fine. i’m fine. the lamp is fine.",
    "i’m not saying i’ve been waiting. i’m just saying i’m still here."
  ];

  var lastInput = Date.now();
  var idleStep = 0;
  var nagIndex = 0;
  var nextNagAt = 0;
  var idleOverlay = null;

  function startScreensaver() {
    screensaver = true;
    cornerHits = 0;
    nextNagAt = Date.now() + 8000;
    discover("idle");
    idleOverlay = document.createElement("div");
    idleOverlay.className = "idle";
    idleOverlay.setAttribute("aria-hidden", "true");
    idleOverlay.innerHTML = reduceMotion
      ? "<p>screensaver<br>(a very still one)</p>"
      : '<p>screensaver<br><span id="idlec">corner hits: 0</span></p>';
    document.body.appendChild(idleOverlay);
    roaming = !reduceMotion;
    frozenUntil = 0;
  }

  function stopScreensaver() {
    screensaver = false;
    if (idleOverlay) { idleOverlay.remove(); idleOverlay = null; }
    say("oh. you’re back. i wasn’t waiting or anything.", 4500);
  }

  function noteInput() {
    lastInput = Date.now();
    idleStep = 0;
    if (screensaver) stopScreensaver();
  }
  ["pointermove", "pointerdown", "keydown", "scroll", "touchstart", "wheel"].forEach(function (name) {
    window.addEventListener(name, noteInput, { passive: true });
  });

  setInterval(function () {
    if (document.hidden) { lastInput = Date.now(); return; }
    var idleSeconds = (Date.now() - lastInput) / 1000;
    if (idleStep < IDLE_STEPS.length && idleSeconds >= IDLE_STEPS[idleStep].after) {
      say(IDLE_STEPS[idleStep].line, 5000);
      idleStep++;
    }
    if (!screensaver && idleSeconds >= SCREENSAVER_AFTER) startScreensaver();
    if (screensaver && Date.now() >= nextNagAt) {
      say(NAGS[nagIndex++ % NAGS.length], 6000);
      nextNagAt = Date.now() + 20000;
    }
  }, 1000);


  // ---------- go ----------
  startLamp();
  requestAnimationFrame(frame);
})();
