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
  // dialogue goes through nextLine (main.js): shuffled, never the same line twice in a row
  var nextLine = window.nextLine || pick;

  var lamp = byId("lamp");
  var bubble = byId("bub");
  var pointer = { x: -999, y: -999 };
  var bubbleTimer;
  var lastSayAt = 0;

  window.addEventListener("pointermove", function (e) { pointer.x = e.clientX; pointer.y = e.clientY; }, { passive: true });


  // ---------- speech bubble that follows the lamp ----------

  function say(text, ms) {
    lastSayAt = Date.now();
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
  // it has moods (face, bulb, speed), it hops instead of gliding, it gets curious about things on the
  // page, it comments on each section, it can be picked up, and it falls asleep if you leave it alone.

  var SHY_LINES = [
    "oh no, a person.",
    "i’m busy. (i’m not busy.)",
    "please don’t look at me.",
    "hi. no. sorry. bye.",
    "i panic. it’s a lamp thing.",
    "oh. hi. you’re close.",
    "personal space. it’s a lamp thing.",
    "eek.",
    "i didn’t see you there. (i did.)",
    "can we pretend this didn’t happen?",
    "i’m just going to be over here.",
    "nope. nope. nope.",
    "i have a cord, you know. that’s a boundary.",
    "i’m not hiding. i’m relocating."
  ];
  // the third dodge in a row
  var CALM_LINES = [
    "...fine. you can press me. gently.",
    "ok. i’ll stay. be nice.",
    "right. i’m too tired to run. one press.",
    "you’re persistent. i respect that. go on.",
    "fine. fine. do it. i’m ready. (i’m not.)"
  ];

  var lampSize = { w: 64, h: 74 };
  var lampPos = { x: 0, y: 0 };
  var heading = { x: -0.8, y: 0.6 };      // unit vector, which way it's facing
  var roaming = false;
  var hovered = false;
  var focused = false;
  var frozenUntil = 0;                      // stays put until this time (ms)
  var boostUntil = 0;                       // panicking until this time
  var calmUntil = 0;                        // stops dodging until this time
  var dodges = 0;
  var lastCornerLine = 0;
  var cornerHits = 0;
  var screensaver = false;                  // set further down
  // keeping up with the page: the lamp is stuck to the page while it scrolls, then hops back to where it was standing
  var SCROLL_STAMINA = 6500;                // px of scrolling that tires it out completely
  var TIRED_AT = 0.6;                       // how tired it has to be, when you stop scrolling, to slump and sweat
  var lastScrollY = window.scrollY;
  var lastScrollAt = 0;
  var chaseY = null;                        // where (on screen) it wants to be again. null = not chasing
  var fatigue = 0;                          // 0 to 1.2, goes up with scrolling and drains slowly
  var tiredUntil = 0;
  var wasTired = false;
  var lastChaseLine = 0;
  function maxX() { return Math.max(0, innerWidth - lampSize.w); }
  function maxY() { return Math.max(0, innerHeight - lampSize.h); }

  function moveLamp() {
    lampPos.x = clamp(lampPos.x, 0, maxX());
    lampPos.y = chaseY !== null ? clamp(lampPos.y, -lampSize.h * 0.55, maxY() + lampSize.h * 0.55) : clamp(lampPos.y, 0, maxY());   // while the page is dragging it it can hang half off the edge
    lamp.style.left = lampPos.x + "px";
    lamp.style.top = lampPos.y + "px";
    var glow = byId("glow");
    if (glow) {
      glow.style.setProperty("--gx", (lampPos.x + lampSize.w * 0.8) + "px");
      glow.style.setProperty("--gy", (lampPos.y + 20) + "px");
    }
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

  // ----- moods: what the face, the bulb and the speed do -----
  // brows rotate (positive = inner ends down = cross), by lifts them, lid closes the eyes from the top

  var MOODS = {
    neutral:   { lid: 0,   bl: -3,  br: 3,   by: 0,    pup: 1.6, blush: 0,   speed: 1 },
    happy:     { lid: 0,   bl: -6,  br: 6,   by: -1.6, pup: 1.9, blush: 0.55, speed: 1.35 },
    curious:   { lid: 0,   bl: -5,  br: 5,   by: -1.2, pup: 2.0, blush: 0,   speed: 1 },
    shy:       { lid: 0.08, bl: -12, br: 12, by: 0,    pup: 1.5, blush: 0.95, speed: 0.85 },
    grumpy:    { lid: 0.4, bl: 14,  br: -14, by: 0.8,  pup: 1.5, blush: 0,   speed: 0.8 },
    sleepy:    { lid: 0.72, bl: -6, br: 6,   by: 1.2,  pup: 1.4, blush: 0,   speed: 0.35 },
    surprised: { lid: 0,   bl: -4,  br: 4,   by: -3,   pup: 1.0, blush: 0,   speed: 1.2 },
    relieved:  { lid: 0.3, bl: -8,  br: 8,   by: 0.4,  pup: 1.5, blush: 0.3, speed: 0.9 },
    squint:    { lid: 0.55, bl: 10, br: -10, by: 1,    pup: 1.3, blush: 0,   speed: 0.8 },
    dizzy:     { lid: 0.15, bl: -8, br: 8,   by: 0,    pup: 1.2, blush: 0.3, speed: 0.5 },
    tired:     { lid: 0.5,  bl: -10, br: 10, by: 1.6,  pup: 1.3, blush: 0.15, speed: 0.4 }
  };
  var mood = "neutral";
  var moodForced = "";
  var moodUntil = 0;
  var blinking = false;
  var pupils = lamp.querySelectorAll(".pupil");

  function setMood(name, ms) { moodForced = name; moodUntil = Date.now() + (ms || 3000); }

  function idleSeconds() { return typeof lastInput === "number" ? (Date.now() - lastInput) / 1000 : 0; }

  function chooseMood(now) {
    if (carrying) return "surprised";
    if (now < moodUntil) return moodForced;
    if (now < tiredUntil) return "tired";
    if (screensaver) return "happy";
    var idle = idleSeconds();
    if (idle >= 110) return "sleepy";
    if (idle >= 50) return "grumpy";
    if (finePointer && !hovered && pointer.x > -900) {
      var near = Math.hypot(lampPos.x + lampSize.w / 2 - pointer.x, lampPos.y + lampSize.h / 2 - pointer.y);
      if (near < 220) return "curious";
    }
    // it can't stand bright light either: squints all the time in light mode, calm in the dark
    return document.documentElement.hasAttribute("data-lit") ? "neutral" : "squint";
  }

  function applyMood(name) {
    var m = MOODS[name] || MOODS.neutral;
    mood = name;
    lamp.setAttribute("data-mood", name);
    lamp.style.setProperty("--lid", blinking ? 1 : m.lid);
    lamp.style.setProperty("--bl", m.bl + "deg");
    lamp.style.setProperty("--br", m.br + "deg");
    lamp.style.setProperty("--by", m.by + "px");
    lamp.style.setProperty("--blush", m.blush);
    for (var i = 0; i < pupils.length; i++) pupils[i].setAttribute("r", m.pup);
  }

  function blink() {
    blinking = true;
    lamp.style.setProperty("--lid", 1);
    setTimeout(function () {
      blinking = false;
      lamp.style.setProperty("--lid", (MOODS[mood] || MOODS.neutral).lid);
    }, 130);
  }
  function blinkLater() {
    setTimeout(function () {
      if (!document.hidden && (MOODS[mood] || MOODS.neutral).lid < 0.6) {
        blink();
        if (Math.random() < 0.18) setTimeout(blink, 260);   // the odd double blink
      }
      blinkLater();
    }, 2200 + Math.random() * 3800);
  }
  if (!reduceMotion) blinkLater();

  // ----- where it's looking -----
  var lookTarget = null;      // an element's centre it's staring at
  var wanderUntil = 0;
  var wander = { x: 0, y: 0 };

  function updateGaze(now) {
    var r = lamp.getBoundingClientRect();
    var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    var gx = 0, gy = 0;
    var target = lookTarget || (pointer.x > -900 && Math.hypot(pointer.x - cx, pointer.y - cy) < 520 ? pointer : null);
    if (mood === "dizzy" && !reduceMotion) {
      gx = Math.sin(now / 110) * 1.3; gy = Math.cos(now / 110) * 1.3;
    } else if (target) {
      var dx = target.x - cx, dy = target.y - cy, len = Math.hypot(dx, dy) || 1;
      gx = dx / len * 1.3; gy = dy / len * 1.3;
      if (mood === "shy" && !lookTarget && len < 260) { gx = -gx; gy = -gy; }   // looks away
    } else if (!reduceMotion) {
      if (now > wanderUntil) {
        wanderUntil = now + 1500 + Math.random() * 3000;
        wander = { x: (Math.random() * 2 - 1) * 1.2, y: (Math.random() * 2 - 1) * 0.8 };
      }
      gx = wander.x; gy = wander.y;
    }
    if (mood === "sleepy") { gx *= 0.3; gy = 1; }
    var shift = "translate(" + gx.toFixed(2) + "px," + gy.toFixed(2) + "px)";
    for (var i = 0; i < pupils.length; i++) pupils[i].style.transform = shift;
  }

  // ----- the body: hop, tilt and squash-and-stretch -----
  var body = { hop: 0, tilt: 0, s: 0, sv: 0 };

  function applyBody() {
    lamp.style.setProperty("--hop", body.hop.toFixed(1) + "px");
    lamp.style.setProperty("--tilt", body.tilt.toFixed(1) + "deg");
    lamp.style.setProperty("--sx", (1 + body.s * 0.6).toFixed(3));
    lamp.style.setProperty("--sy", (1 - body.s).toFixed(3));
    lamp.style.setProperty("--shw", (1 - Math.min(0.5, -body.hop / 60)).toFixed(2));
  }
  function springBody(dt) {
    body.sv += (-220 * body.s - 16 * body.sv) * dt;
    body.s += body.sv * dt;
  }

  // ----- moving about: crouch, jump, land, rest -----
  var state = "rest";                 // rest | crouch | air | land | fall
  var st = 0, restDur = 0.8, crouchDur = 0.13, airDur = 0.45, landDur = 0.18;
  var hopFrom = { x: 0, y: 0 }, hopTo = { x: 0, y: 0 }, hopH = 22;
  var celebrate = 0;                  // happy hops on the spot
  var fallVy = 0, fallVx = 0;

  var goal = null;                    // a thing on the page it wants to go and look at
  var nextVisitAt = Date.now() + 14000;

  var VISITS = [
    { sel: "#lg", lines: ["that’s the lunge button. i want to press it.", "i’m not allowed near the swords.", "if i press it, it lunges. i can’t watch.", "i’m a lamp. i don’t have the arms for fencing."] },
    { sel: ".cas", lines: ["side A is the good one.", "i don’t trust side B.", "it’s only a mixtape if you make it with feelings.", "it flips. that’s all i’ll say."] },
    { sel: ".sk", lines: ["the stickers are mostly true.", "1/10 at small talk. generous, honestly.", "“lots” of just-one-more-games. conservative estimate.", "the curiosity one worries me a bit."] },
    { sel: "#eb", lines: ["that’s my email. i’m nervous about it.", "i’m not saying i’ve been avoiding it.", "people do email me. it’s fine. it’s fine.", "it’s a very good email button. i get shy near it."] },
    { sel: ".pg2", lines: ["my notes. unfinished, obviously.", "i’ll get to that one. eventually.", "that’s just a small piece of the pile.", "half of these are a to-do list in disguise."] },
    { sel: ".fm", lines: ["that’s a photo. i took it.", "i like this one.", "the real ones are on my camera roll. which is a disaster.", "photos: developing. like me."] },
    { sel: ".dc", lines: ["yes, it’s meant to look like that.", "i did try.", "the plotter’s better at this than i am.", "i can’t draw with a pen. i checked."] },
    { sel: ".bi", lines: ["i know what’s in there. i packed it.", "that’s a lot of stuff for one bag.", "that’s been in there since the start of term.", "it’s organised chaos. mostly chaos."] },
    { sel: ".bgb", lines: ["that’s my bag. don’t look inside. actually, do.", "it’s corduroy. it’s very soft.", "it unzips. you’re allowed."] },
    { sel: ".note", lines: ["i wrote that in a hurry.", "that’s my handwriting. it’s a lot.", "i wrote that at 2am. it shows.", "that’s a note to self. (to you, now.)"] },
    { sel: ".bt", lines: ["that button’s very pressable.", "go on. press it.", "i can feel you wanting to press it.", "it only has one job. be pressed."] },
    { sel: ".stampd", lines: ["very official.", "that’s a stamp. i have a stamp. it’s great.", "it says it’s official. i believe it."] },
    { sel: ".tape", lines: ["that list keeps growing. it’s a problem.", "five things. it was three. it’s a problem.", "i keep adding to that list. i can’t stop."] },
    { sel: ".status", lines: ["that changes about every hour. i get distracted.", "that’s what i’m up to. currently. roughly.", "i update it when i remember. i rarely remember.", "that status is a mood, not a promise."] },
    { sel: "h2", lines: ["i like this heading.", "good heading. i helped. (i didn’t.)", "that’s a tilted heading. it’s on purpose.", "i tilt my headings. it’s a personality."] },
    { sel: ".pj", lines: ["i built that one at 2am. it shows.", "that one works. mostly. it says so.", "i’m proud of that one. don’t tell the others.", "the little stickers on those are the honest part."] },
    { sel: ".pol", lines: ["those polaroids are mostly placeholders. i’m working on it.", "i like polaroids. i’ve never owned one.", "look at that. i stuck it on straight. almost."] },
    { sel: ".ipod", lines: ["that ipod is real in spirit.", "press the wheel. it plays. (sort of.)", "i like this ipod. it’s my favourite fake thing."] },
    { sel: ".wch.full", lines: ["one of my carts. it’s a good one.", "i’ve played that one too much. i’m not sorry.", "i’ll be right back. (i’m not.) one more turn."] },
    { sel: ".tg", lines: ["that’s all the things i can do. or pretend to.", "every one of those is a rabbit hole.", "i can do those. mostly. in a pinch."] }
  ];

  function isVisible(el) {
    if (el.closest("#lamp,#bub,.garden,.ckb,.scp")) return false;
    var r = el.getBoundingClientRect();
    return r.width > 20 && r.height > 10 && r.top > 70 && r.bottom < innerHeight - 40 && r.left >= 0 && r.right <= innerWidth;
  }

  function startVisit(now) {
    var order = VISITS.slice().sort(function () { return Math.random() - 0.5; });
    for (var i = 0; i < order.length; i++) {
      var els = [].filter.call(document.querySelectorAll(order[i].sel), isVisible);
      if (els.length) {
        goal = { el: pick(els), visit: order[i], started: now, arrived: false, d: 0 };
        setMood("curious", 4000);
        return;
      }
    }
    nextVisitAt = now + 8000;
  }

  function goalReach() {
    var r = goal.el.getBoundingClientRect();
    var cx = lampPos.x + lampSize.w / 2, cy = lampPos.y + lampSize.h / 2;
    var px = clamp(cx, r.left, r.right), py = clamp(cy, r.top, r.bottom);
    var d = Math.hypot(px - cx, py - cy);
    return { d: d, dx: px - cx, dy: py - cy, mx: r.left + r.width / 2, my: r.top + r.height / 2 };
  }

  function arriveAtGoal(now, g) {
    goal.arrived = true;
    frozenUntil = now + 3800;
    lookTarget = { x: g.mx, y: g.my };
    say(nextLine(goal.visit.lines), 3500);
    setTimeout(function () {
      lookTarget = null;
      goal = null;
      nextVisitAt = Date.now() + 18000 + Math.random() * 20000;
    }, 3800);
  }

  function nextHop(now) {
    var m = MOODS[mood].speed;
    var panic = now < boostUntil;
    hopFrom = { x: lampPos.x, y: lampPos.y };
    landDur = 0.18;

    if (celebrate > 0) {
      celebrate--;
      hopTo = { x: hopFrom.x, y: hopFrom.y };
      hopH = 34; airDur = 0.42; crouchDur = 0.1;
    } else if (chaseY !== null && !panic) {
      // the page scrolled out from under it, so it hops back to where it was standing.
      // the more tired it is the shorter and slower the hops get (so it falls behind)
      var gap = chaseY - hopFrom.y, tire = Math.min(1, fatigue);
      if (Math.abs(gap) < 16) { state = "rest"; st = 0; restDur = 0.12; return; }
      heading.y = gap > 0 ? 0.9 : -0.9;
      heading.x = Math.random() < 0.5 ? -0.3 : 0.3;
      hopTo = { x: clamp(hopFrom.x + heading.x * 16, 0, maxX()), y: hopFrom.y + (gap > 0 ? 1 : -1) * Math.min(Math.abs(gap), 150 * (1 - tire * 0.4)) };
      hopH = 13 - tire * 5; airDur = 0.24 + tire * 0.12; crouchDur = 0.05 + tire * 0.04; landDur = 0.1 + tire * 0.1;
    } else {
      var reach = null;
      if (goal && !goal.arrived) {
        if (now - goal.started > 18000) { goal = null; nextVisitAt = now + 15000; }
        else {
          reach = goalReach();
          if (reach.d <= 70) { arriveAtGoal(now, reach); state = "rest"; st = 0; restDur = 0.1; return; }
          var l = Math.hypot(reach.dx, reach.dy) || 1;
          heading.x = reach.dx / l; heading.y = reach.dy / l;
        }
      }
      if (!reach && !panic) {          // meander a little instead of going dead straight
        var a = Math.atan2(heading.y, heading.x) + (Math.random() - 0.5) * 1.1;
        heading.x = Math.cos(a); heading.y = Math.sin(a);
      }
      var dist = panic ? 110 : (30 + Math.random() * 34) * Math.max(0.5, m);
      if (reach) dist = Math.min(dist + 12, Math.max(12, reach.d - 50));
      var tx = hopFrom.x + heading.x * dist, ty = hopFrom.y + heading.y * dist;
      if (tx < 0 || tx > maxX()) { heading.x *= -1; tx = clamp(tx, 0, maxX()); }
      if (ty < 0 || ty > maxY()) { heading.y *= -1; ty = clamp(ty, 0, maxY()); }
      hopTo = { x: tx, y: ty };
      hopH = panic ? 14 : 16 + Math.random() * 10;
      airDur = panic ? 0.24 : 0.4 + Math.random() * 0.12;
      crouchDur = panic ? 0.04 : 0.13;
    }
    state = "crouch"; st = 0;
  }

  function stepHop(dt, now) {
    st += dt;
    if (state === "rest") {
      springBody(dt);
      if (st >= restDur) nextHop(now);
    } else if (state === "crouch") {
      body.s = 0.22 * Math.min(1, st / crouchDur);
      body.sv = 0;
      if (st >= crouchDur) { state = "air"; st = 0; body.s = -0.14; }
    } else if (state === "air") {
      springBody(dt);
      var t = Math.min(1, st / airDur);
      var e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      lampPos.x = hopFrom.x + (hopTo.x - hopFrom.x) * e;
      lampPos.y = hopFrom.y + (hopTo.y - hopFrom.y) * e;
      body.hop = -4 * hopH * t * (1 - t);
      body.tilt = heading.x * 9 * Math.sin(Math.PI * t);
      moveLamp();
      if (t >= 1) { state = "land"; st = 0; body.hop = 0; body.tilt = 0; body.s = 0.2; body.sv = 0; }
    } else if (state === "land") {
      springBody(dt);
      if (st >= landDur) {
        state = "rest"; st = 0;
        var m = Math.max(0.4, MOODS[mood].speed);
        var panic = now < boostUntil;
        restDur = panic ? 0.02 : chaseY !== null ? 0.03 + Math.min(1, fatigue) * 0.3 : goal && !goal.arrived ? 0.12 : (Math.random() < 0.12 ? 2 + Math.random() * 2.5 : 0.25 + Math.random() * 0.9) / m;
      }
    }
  }

  function glide(dt, now) {
    // screensaver: bounces around like a dvd logo, but joyfully
    state = "rest"; st = 0; restDur = 0.3;
    if (Math.abs(heading.x) < 0.3) heading.x = heading.x < 0 ? -0.5 : 0.5;
    var l = Math.hypot(heading.x, heading.y) || 1;
    heading.x /= l; heading.y /= l;
    lampPos.x += heading.x * 150 * dt;
    lampPos.y += heading.y * 150 * dt;
    var hitX = false, hitY = false;
    if (lampPos.x < 0) { heading.x = Math.abs(heading.x); hitX = true; }
    if (lampPos.x > maxX()) { heading.x = -Math.abs(heading.x); hitX = true; }
    if (lampPos.y < 0) { heading.y = Math.abs(heading.y); hitY = true; }
    if (lampPos.y > maxY()) { heading.y = -Math.abs(heading.y); hitY = true; }
    if (hitX && hitY) atCorner();
    body.hop = -Math.abs(Math.sin(now / 180)) * 6;
    body.tilt = Math.sin(now / 260) * 7;
    springBody(dt);
    moveLamp();
  }

  function atCorner() {
    cornerHits++;
    var counter = byId("idlec");
    if (counter) counter.textContent = "corner hits: " + cornerHits;
    if (Date.now() - lastCornerLine > 25000) {
      lastCornerLine = Date.now();
      say(nextLine(screensaver ? ["corner. nailed it.", "corner! again!", "ooh, that was a clean one.", "that one was basically perfect.", "the corner and i have an understanding."] : ["corner. cosy.", "this corner’s nice. quiet.", "i like it in here. it’s snug."]), 2500);
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
    goal = null;
    if (state === "rest") restDur = 0;
    dodges++;
    if (dodges >= 3) {
      dodges = 0;
      calmUntil = frozenUntil = now + 9000;
      setMood("shy", 4500);
      say(nextLine(CALM_LINES), 4500);
    } else {
      setMood("shy", 1800);
      say(nextLine(SHY_LINES), 2200);
    }
  }

  // ----- picking it up -----
  var drag = null, carrying = false, justDragged = false, pickups = 0;
  // the first few pickups go in order (it's a little story), after that it's a pool
  var GRAB_LINES = ["put me down!!", "oh no oh no oh no", "wheeee", "i’m not a toy. (carry on)"];
  var DROP_LINES = ["ow.", "...again?", "ok that was fun. don’t tell anyone.", "i’m going to be sick. (lamps can’t be sick.)"];
  var GRAB_MORE = ["put me down!!", "again?! really?", "not the face!", "mind the cord!! the cord!!", "i can see my house from here", "ok ok ok. one more go.", "this is undignified.", "i’m being held. i’m being held."];
  var DROP_MORE = ["ow. rude.", "i meant to do that.", "my bulb’s ringing.", "the floor is hard. noted.", "i’m fine. i’m fine. i’m fine.", "that’s going in my notes.", "...and again. sure."];

  function startCarry() {
    carrying = true;
    goal = null; lookTarget = null; chaseY = null;
    lamp.classList.add("carrying");
    lamp.style.setProperty("--org", "50% 8%");
    state = "rest"; st = 0;
    body.hop = 0; body.s = 0;
    say(pickups < GRAB_LINES.length ? GRAB_LINES[pickups] : nextLine(GRAB_MORE), 2600);
    pickups++;
    discover("pickup");
  }

  function endCarry() {
    carrying = false;
    lamp.classList.remove("carrying");
    lamp.style.setProperty("--org", "50% 100%");
    state = "fall";
    fallVy = 0;
    fallVx = clamp(drag.vx * 0.4, -500, 500);
    body.tilt = 0;
    setMood("dizzy", 3200);
    say(pickups <= DROP_LINES.length ? DROP_LINES[pickups - 1] : nextLine(DROP_MORE), 3000);
  }

  function carryStep(dt) {
    drag.vx *= 0.9;
    var target = clamp(drag.vx / 40, -30, 30);
    body.tilt += (target - body.tilt) * Math.min(1, dt * 8);
    body.hop = 0;
    springBody(dt);
  }

  function fallStep(dt) {
    fallVy += 1900 * dt;
    lampPos.y += fallVy * dt;
    lampPos.x += fallVx * dt;
    fallVx *= Math.pow(0.4, dt);
    if (lampPos.x < 0 || lampPos.x > maxX()) { fallVx *= -0.5; lampPos.x = clamp(lampPos.x, 0, maxX()); }
    if (lampPos.y >= maxY()) {
      lampPos.y = maxY();
      if (fallVy > 260) { fallVy = -fallVy * 0.4; body.s = 0.22; body.sv = 0; }
      else { fallVy = 0; state = "rest"; st = 0; restDur = 1; }
    }
    springBody(dt);
    moveLamp();
  }

  lamp.addEventListener("pointerdown", function (e) {
    if (reduceMotion || e.button) return;
    drag = { id: e.pointerId, sx: e.clientX, sy: e.clientY, ox: e.clientX - lampPos.x, oy: e.clientY - lampPos.y, moved: false, vx: 0, lx: e.clientX, lt: performance.now() };
  });
  window.addEventListener("pointermove", function (e) {
    if (!drag || e.pointerId !== drag.id) return;
    if (!drag.moved) {
      if (Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) < 7) return;
      drag.moved = true;
      try { lamp.setPointerCapture(e.pointerId); } catch (err) { }
      startCarry();
    }
    var t = performance.now();
    var dtm = Math.max(1, t - drag.lt);
    drag.vx = drag.vx * 0.6 + ((e.clientX - drag.lx) / dtm * 1000) * 0.4;
    drag.lx = e.clientX; drag.lt = t;
    lampPos.x = e.clientX - drag.ox;
    lampPos.y = e.clientY - drag.oy;
    moveLamp();
  }, { passive: true });
  function releaseDrag(e) {
    if (!drag || e.pointerId !== drag.id) return;
    if (drag.moved) {
      endCarry();
      justDragged = true;
      setTimeout(function () { justDragged = false; }, 80);
    }
    drag = null;
  }
  window.addEventListener("pointerup", releaseDrag);
  window.addEventListener("pointercancel", releaseDrag);
  // a drag shouldn't count as a click on the lamp (that toggles the lights)
  window.addEventListener("click", function (e) {
    if (justDragged) { e.stopImmediatePropagation(); e.preventDefault(); justDragged = false; }
  }, true);

  // ----- the frame loop -----
  function updateLamp(dt, now) {
    if (reduceMotion || !roaming) return;
    if (carrying) { carryStep(dt); applyBody(); return; }
    if (state === "fall") { fallStep(dt); applyBody(); return; }
    if (focused) {
      // keyboard users get the lamp back in its corner so it's easy to find
      var home = homePosition();
      lampPos.x += (home.x - lampPos.x) * Math.min(1, dt * 4);
      lampPos.y += (home.y - lampPos.y) * Math.min(1, dt * 4);
      springBody(dt); moveLamp(); applyBody();
      return;
    }
    if (screensaver) { glide(dt, now); applyBody(); return; }

    // tired out by keeping up with the scrolling
    fatigue = Math.max(0, fatigue - dt * (now < tiredUntil ? 0.05 : chaseY !== null ? 0.01 : 0.035));
    if (chaseY !== null && now - lastScrollAt > 450 && state === "rest" && Math.abs(chaseY - lampPos.y) < 18) endChase(now);
    var tired = now < tiredUntil;
    if (wasTired && !tired) {
      wasTired = false;
      setMood("relieved", 2500);
      if (canSpeak()) say(nextLine(RECOVER_LINES), 3200);
    }
    if (!tired && state === "rest") body.tilt += (0 - body.tilt) * Math.min(1, dt * 5);

    // a chase beats being hovered or frozen, otherwise it would just stand there while the page leaves
    var holding = chaseY === null && (hovered || now < frozenUntil);
    if (holding && state === "rest") {
      springBody(dt);
      if (tired) {          // slumped and panting
        body.tilt += (-6 - body.tilt) * Math.min(1, dt * 4);
        body.s = 0.025 + Math.min(1, fatigue) * 0.03 + Math.sin(now / 230) * (0.03 + Math.min(1, fatigue) * 0.03);
        body.sv = 0;
      }
      applyBody();
      return;
    }
    if (!holding) dodgeThePointer(now);
    if (!goal && now >= nextVisitAt && canVisit(now)) startVisit(now);
    stepHop(dt, now);
    applyBody();
  }

  function canVisit() {
    return roaming && !screensaver && !carrying && !hovered && !focused && !document.hidden &&
      bubble.hidden && idleSeconds() < 50 && state === "rest" && chaseY === null && Date.now() >= tiredUntil;
  }

  var lastFrame = performance.now();
  var gazeTick = 0;
  function frame(now) {
    var dt = Math.min(0.05, (now - lastFrame) / 1000);
    lastFrame = now;
    var clock = Date.now();            // one clock for every timer (frame time and Date.now() don't mix)
    if (!document.hidden) {
      updateLamp(dt, clock);
      if (clock - gazeTick > 60) {
        gazeTick = clock;
        var wanted = chooseMood(clock);
        if (wanted !== mood) applyMood(wanted);
        updateGaze(clock);
        lamp.style.setProperty("--sweat", (clock < tiredUntil ? 1 : clamp((fatigue - 0.3) / 0.4, 0, 1)).toFixed(2));
      }
    }
    requestAnimationFrame(frame);
  }

  lamp.addEventListener("pointerenter", function () {
    hovered = true;
    if (!carrying) setMood(dodges > 0 ? "shy" : "curious", 1600);
  });
  lamp.addEventListener("pointerleave", function () { hovered = false; frozenUntil = Date.now() + 600; });
  lamp.addEventListener("focus", function () { focused = true; chaseY = null; });
  lamp.addEventListener("blur", function () { focused = false; frozenUntil = Date.now() + 2500; });
  lamp.addEventListener("touchstart", function () { frozenUntil = Date.now() + 5000; }, { passive: true });
  lamp.addEventListener("click", function () { frozenUntil = Date.now() + 3000; });
  window.addEventListener("resize", function () { moveLamp(); });

  // the lights going on and off: it can't stand bright light (just like me), so it's relieved in the dark and cross in the light
  new MutationObserver(function () {
    if (document.documentElement.hasAttribute("data-lit")) setMood("relieved", 3200);
    else setMood("grumpy", 3200);
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-lit"] });

  // ----- it has things to say about each part of the page -----
  var SECTION_LINES = {
    about: [["hi. that’s about me. i’ll stand here and look casual.", "that’s the bit about me. i’ll try not to hover.", "hi. this is where i explain myself."], "neutral"],
    projects: [["all of these are mine. i’m weirdly proud.", "these are the things i actually finished. i’m weirdly proud.", "projects. tilted, taped and mostly working."], "happy"],
    proof: [["proof. i like proof. it means i’m not making it up.", "proof, so you don’t have to take my word for it.", "evidence! i love evidence."], "curious"],
    bench: [["this is the messy bit. on purpose. mostly.", "welcome to the mess. it’s organised, i promise.", "this is where things are half-built."], "neutral"],
    notes: [["unfinished things. i have a lot of those.", "scribbles. i never finish the page.", "ideas i haven’t lost yet."], "neutral"],
    misread: [["this one matters to me. ...read it properly?", "this bit’s important to me. please go slow.", "i’m a bit nervous about this one."], "shy"],
    bag: [["this is what i carry. all of it. every day.", "yes, there’s a sword grip in there. no, i won’t explain.", "i’d unzip it for you but i’m a lamp."], "curious"],
    fencing: ["i can walk again!! i’m so happy!! and i’m back to fencing!!", "happy"],
    tournaments: [["nothing booked yet. i’m not sulking. (i’m sulking.)", "empty list. i’m fine. really.", "nothing booked. my sword’s resting. (it’s broken.)"], "grumpy"],
    playing: [["yes, i know. one more game.", "my cart case. don’t ask how many hours.", "one more game. always one more game."], "neutral"],
    photos: [["pick a frame. they develop. it’s weirdly satisfying.", "click a frame. it develops. it’s very satisfying.", "photos. i took them. i promise."], "curious"],
    drawings: [["the plotter did these. i just supervised.", "plotter art. i just press go.", "i supervise. the plotter does the work."], "neutral"],
    doodles: [["these ones are mine. please be kind.", "these are mine. don’t laugh. (laugh a bit.)", "my drawing skills, as a lamp sees them."], "shy"],
    music: [["i play. i’m shy about it. press the wheel anyway.", "the music bit. i get shy. press the wheel.", "i play. quietly. press the wheel."], "shy"],
    contact: [["go on. say hi. i’ll hide.", "say hi. i’ll hide behind the stamp.", "go on. write. i’ll look away."], "shy"]
  };
  var sectionSaid = {};
  var pendingSection = "";

  if ("IntersectionObserver" in window) {
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && SECTION_LINES[entry.target.id] && !sectionSaid[entry.target.id]) pendingSection = entry.target.id;
      });
    }, { threshold: 0.4 });
    [].forEach.call(document.querySelectorAll("section.rm[id]"), function (s) { seen.observe(s); });
  }

  function canSpeak() {
    return bubble.hidden && Date.now() - lastSayAt > 4500 && !screensaver && !carrying && !(goal && goal.arrived) && !document.hidden;
  }

  setInterval(function () {
    if (!pendingSection || !canSpeak() || Date.now() < 9000 + pageStart) return;
    var id = pendingSection;
    pendingSection = "";
    sectionSaid[id] = true;
    var entry = SECTION_LINES[id];
    say(typeof entry[0] === "string" ? entry[0] : nextLine(entry[0]), 4200);   // a string, or a list to pick from
    setMood(entry[1], 4200);
    if (id === "fencing" && !reduceMotion) celebrate = 2;
  }, 700);
  var pageStart = Date.now();

  // nobody told you it can be picked up
  setTimeout(function () {
    if (!pickups && canSpeak() && !reduceMotion) { say("psst. you can pick me up, you know. gently.", 4500); setMood("curious", 4500); }
  }, 50000);


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
    cartridge: "pulled out a cartridge",
    pickup: "picked me up",
    bag: "unzipped the bag"
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
    if (t.closest("#bgb")) discover("bag");
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
    { after: 25, lines: ["no rush. i’m just here.", "take your time. i’ll be here.", "no pressure. just vibing."] },
    { after: 50, lines: ["still reading? or did you leave me on read.", "are you still there? blink twice.", "you’ve gone quiet. is that a good quiet?"] },
    { after: 80, lines: ["i can see the tab is still open, you know.", "i know you’re there. the tab’s open.", "the tab’s open. i can hear it breathing."] },
    { after: 110, lines: ["cool. cool cool cool.", "ok. ok. cool. totally cool.", "that’s fine. i’m fine. cool."] }
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
    "i’m not saying i’ve been waiting. i’m just saying i’m still here.",
    "i’m learning to juggle corners.",
    "you could scroll. or move the mouse. just saying.",
    "i’ve started naming the dust.",
    "if you come back i’ll act like nothing happened.",
    "i’ve been practising looking busy.",
    "somebody has to keep the bulb warm.",
    "nobody’s watching so i’m going to dance. (this is me dancing.)",
    "i counted the floorboards. there aren’t any."
  ];
  var BACK_LINES = [
    "oh. you’re back. i wasn’t waiting or anything.",
    "oh! hi. i was just... bouncing. normally.",
    "you’re back. i definitely didn’t miss you.",
    "i wasn’t waiting. i was doing laps.",
    "oh hello. where were you? (i’m not asking.)",
    "hi. i’ve been very normal while you were gone."
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
    goal = null; lookTarget = null;
  }

  function stopScreensaver() {
    screensaver = false;
    if (idleOverlay) { idleOverlay.remove(); idleOverlay = null; }
    setMood("surprised", 1400);
    say(nextLine(BACK_LINES), 4500);
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
      say(nextLine(IDLE_STEPS[idleStep].lines), 5000);
      idleStep++;
    }
    if (!screensaver && idleSeconds >= SCREENSAVER_AFTER) startScreensaver();
    if (screensaver && Date.now() >= nextNagAt) {
      say(nextLine(NAGS), 6000);
      nextNagAt = Date.now() + 20000;
    }
  }, 1000);


  // ---------- keeping up with the scrolling ----------
  // scrolling drags the lamp along with the page (it's stuck to it), and then it hops back to where it was standing.
  // scroll a lot and it runs out of puff: when you stop it slumps, pants and sweats, then it slowly recovers.

  var CHASE_LINES = [
    "wait for me!",
    "hang on hang on hang on",
    "too fast!!",
    "i’m coming, i’m coming",
    "not so fast!",
    "slow down, i have very short legs. (i have none.)",
    "i’m keeping up! (i’m not keeping up.)"
  ];
  var TIRED_LINES = [
    "phew. that was a lot of page.",
    "i’m not built for cardio. i’m a lamp.",
    "...give me a second. or ten.",
    "who scrolls that much. (you do.)",
    "my cord is sweating. is that possible?",
    "i’m not unfit. the page is just very long.",
    "i need a sit down. i’m already sitting.",
    "so... many... pixels...",
    "next time i’m taking the stairs. (i can’t. i’m a lamp.)"
  ];
  var RECOVER_LINES = [
    "ok. i’m fine. i’m fine.",
    "right. recovered. mostly.",
    "i’m back. don’t scroll again. (scroll again.)",
    "breathing normally. ish."
  ];

  function endChase(now) {
    chaseY = null;
    if (fatigue >= TIRED_AT) {
      tiredUntil = now + 5000 + Math.min(1, fatigue) * 11000;
      frozenUntil = Math.max(frozenUntil, tiredUntil);
      moodUntil = 0;
      lookTarget = null;
      wasTired = true;
      say(nextLine(TIRED_LINES), 4500);
    }
  }

  window.addEventListener("scroll", function () {
    var dy = window.scrollY - lastScrollY;
    lastScrollY = window.scrollY;
    if (!dy || reduceMotion || !roaming || carrying || focused || screensaver || state === "fall" || document.hidden) return;
    var now = Date.now();
    if (chaseY === null) chaseY = clamp(lampPos.y, 0, maxY());    // the spot it wants to get back to
    lastScrollAt = now;
    var low = -lampSize.h * 0.55, high = maxY() + lampSize.h * 0.55;
    lampPos.y = clamp(lampPos.y - dy, low, high);                 // dragged along with the page
    hopFrom.y = clamp(hopFrom.y - dy, low, high);                 // (and the hop it's in the middle of)
    hopTo.y = clamp(hopTo.y - dy, low, high);
    fatigue = Math.min(1.2, fatigue + Math.abs(dy) / SCROLL_STAMINA);
    goal = null; lookTarget = null;
    nextVisitAt = Math.max(nextVisitAt, now + 7000);
    if (state === "rest") restDur = 0;
    if (fatigue > 0.15 && now - lastChaseLine > 9000 && now >= tiredUntil) {
      lastChaseLine = now;
      say(nextLine(CHASE_LINES), 2500);
    }
    moveLamp();
  }, { passive: true });


  // ---------- go ----------
  applyMood("neutral");
  applyBody();
  startLamp();
  requestAnimationFrame(frame);
})();
