// lab.js
// the miscellaneous drawer, the workshop simulator and the locked box.
// loads after extras.js. the garden listens for the "gardenfind" events sent from here.

(function () {
  var reduceMotion = matchMedia("(prefers-reduced-motion:reduce)").matches;

  function byId(id) { return document.getElementById(id); }
  function pick(list) { return window.nextLine ? window.nextLine(list) : list[Math.floor(Math.random() * list.length)]; }
  function lampSay(text, ms) { if (window.lampSay) window.lampSay(text, ms); }
  function tell(kind) { document.dispatchEvent(new CustomEvent("lab", { detail: kind })); }
  function gardenFind(id) { document.dispatchEvent(new CustomEvent("gardenfind", { detail: id })); }

  function icon(inner) {
    return '<svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="#30251F" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' + inner + '</svg>';
  }

  // little drawings shared by the drawer and the workshop
  var ICONS = {
    glove: '<path d="M14 40V22l-2-8 4-1 2 7V10l4-1v11l1-12h4v12l1-9 4 1-1 13 3-3 3 2-5 9v8z" fill="#BD8170"/>',
    duck: '<ellipse cx="24" cy="30" rx="15" ry="10" fill="#f2bf12"/><circle cx="33" cy="17" r="7" fill="#f2bf12"/><path d="M39 17l6 2-6 2z" fill="#A94F36"/><circle cx="35" cy="15" r="1.2" fill="#30251F"/>',
    key: '<circle cx="14" cy="24" r="8" fill="#C58A42"/><circle cx="14" cy="24" r="3"/><path d="M22 24h20M36 24v7M42 24v5"/>',
    battery: '<rect x="6" y="15" width="32" height="18" rx="3" fill="#8E9468"/><rect x="38" y="21" width="5" height="6" fill="#C58A42"/><path d="M14 20v8M10 24h8"/>',
    measure: '<circle cx="24" cy="24" r="15" fill="#f2bf12"/><circle cx="24" cy="24" r="6" fill="#fff"/><path d="M39 30h7v6H34"/>',
    screw: '<rect x="14" y="6" width="20" height="8" rx="2" fill="#c9ccd1"/><path d="M19 14v28M29 14v28M19 22h10M19 30h10M19 38h10"/>',
    clip: '<path d="M16 34V14a6 6 0 0 1 12 0v22a9 9 0 0 1-18 0V18"/>',
    coin: '<circle cx="24" cy="24" r="16" fill="#C58A42"/><circle cx="24" cy="24" r="10"/><path d="M24 17v14"/>',
    button: '<circle cx="24" cy="26" r="15" fill="#c9ccd1"/><circle cx="24" cy="22" r="10" fill="#A94F36"/>',
    pen: '<path d="M10 38l4-12 20-20 8 8-20 20z" fill="#7B805D"/><path d="M10 38l8-2"/>',
    fuse: '<rect x="3" y="19" width="6" height="10" fill="#C58A42"/><rect x="39" y="19" width="6" height="10" fill="#C58A42"/><rect x="9" y="17" width="30" height="14" rx="6" fill="#e9f6fd"/><path d="M13 24h22"/>',
    usb: '<rect x="14" y="14" width="20" height="28" rx="3" fill="#2a6f8f"/><rect x="18" y="4" width="12" height="10" fill="#c9ccd1"/>',
    cap: '<circle cx="24" cy="24" r="16" fill="#C58A42" stroke-dasharray="3 2.4"/><circle cx="24" cy="24" r="10"/>',
    note: '<path d="M8 8h32v26l-8 8H8z" fill="#f2bf12"/><path d="M32 42v-8h8M14 18h20M14 25h14"/>',
    led: '<path d="M16 28a8 8 0 1 1 16 0v8H16z" fill="#BD8170"/><path d="M20 36v8M28 36v8"/>',
    light: '<path d="M16 28a8 8 0 1 1 16 0v8H16z" fill="#ffd27a"/><path d="M20 36v8M28 36v8M24 4v4M8 12l3 3M40 12l-3 3M5 26h4M39 26h4"/>',
    resistor: '<rect x="12" y="18" width="24" height="12" rx="6" fill="#C58A42"/><path d="M4 24h8M36 24h8M18 18v12M24 18v12M30 18v12"/>',
    wire: '<path d="M6 34c8-20 12 8 20-8s12 6 16-10" stroke="#A94F36"/>',
    toggle: '<rect x="8" y="28" width="32" height="12" rx="3" fill="#c9ccd1"/><path d="M16 28l14-14"/><circle cx="30" cy="14" r="3" fill="#A94F36"/>',
    capacitor: '<rect x="14" y="8" width="20" height="26" rx="4" fill="#2a6f8f"/><path d="M19 34v10M29 34v10M14 14h20"/>',
    iron: '<path d="M6 42l14-14"/><rect x="20" y="8" width="10" height="26" rx="3" fill="#A94F36" transform="rotate(40 25 21)"/>',
    driver: '<rect x="4" y="30" width="16" height="9" rx="3" fill="#C58A42" transform="rotate(-30 12 34)"/><path d="M18 28l24-14"/>',
    meter: '<rect x="10" y="6" width="28" height="36" rx="4" fill="#f2bf12"/><rect x="15" y="11" width="18" height="10" fill="#e9f6fd"/><circle cx="24" cy="32" r="5"/>',
    tape: '<circle cx="22" cy="24" r="14" fill="#BD8170"/><circle cx="22" cy="24" r="5" fill="#fff"/><path d="M34 32l10 8"/>',
    board: '<rect x="6" y="10" width="36" height="28" rx="3" fill="#f3e9d4"/><path d="M12 18h24M12 24h24M12 30h24" stroke-dasharray="1 4"/>',
    robot: '<rect x="10" y="30" width="28" height="12" rx="2" fill="#c9ccd1"/><path d="M24 30V16l12-8"/><circle cx="36" cy="8" r="4" fill="#A94F36"/>',
    clock: '<circle cx="24" cy="24" r="16" fill="#f3e9d4" stroke-dasharray="4 3"/><path d="M24 14v10l6 4"/>',
    pedal: '<rect x="12" y="6" width="24" height="36" rx="4" fill="#8E9468"/><circle cx="24" cy="16" r="5"/><circle cx="24" cy="32" r="3" fill="#A94F36"/>',
    smoke: '<path d="M12 42c-5-8 6-8 2-16s8-6 6-14M30 42c-5-8 6-8 2-16s8-6 6-14"/>'
  };


  // ---------- 1. the miscellaneous drawer ----------
  // some of these do nothing. some of them do something. i can't remember which.

  var latches = { key: false, sword: false, cart: false, away: false };   // for the locked box further down
  var lockUpdate = function () { };

  var DRAWER = [
    { id: "glove", name: "one glove", icon: "glove",
      story: "i have no idea where the other one went. it isn’t even mine. it’s just here now." },
    { id: "duck", name: "rubber duck", icon: "duck",
      story: "my debugging partner. it has never once found the bug. it has also never been wrong.",
      act: function (n) {
        squeak();
        return n === 5 ? "ok. that’s enough. it’s a duck, not a doorbell." : null;
      } },
    { id: "key", name: "small brass key", icon: "key",
      story: "it opens something. not here. i’ve tried everything in here.",
      act: function () {
        if (!latches.key) { latches.key = true; lockUpdate(); return "you can’t take it. it’s a drawing of a key. but you do remember the exact shape of it."; }
        return null;
      } },
    { id: "battery", name: "AA battery (dead?)", icon: "battery",
      story: "tested on the tongue. results: inconclusive. i keep it in case i’m wrong.",
      act: function (n) { return n % 2 ? "still dead. i’ll keep checking anyway." : "tongue test, again. tingly or imagination?"; } },
    { id: "measure", name: "tape measure", icon: "measure",
      story: "it says a metre. it has never been a metre. it’s 97 cm and i’ve made peace with it." },
    { id: "screw", name: "mystery screw", icon: "screw",
      story: "it came off something. i don’t know what. whatever it was, it’s probably fine now." },
    { id: "clip", name: "bent paperclip", icon: "clip",
      story: "was a paperclip. is now art. it was also, for about four seconds, a lockpick." },
    { id: "coin", name: "coin", icon: "coin",
      story: "always lands on tails. i’ve tested it. (i’ve tested it a lot.)",
      act: function (n) { return n >= 7 ? "heads. nobody believes you." : "tails."; } },
    { id: "button", name: "unlabelled button", icon: "button",
      story: "no idea what it’s connected to. i press it when nobody’s looking.",
      act: function (n) {
        if (n % 3 === 0) { rattle(); return "the whole drawer rattled. i didn’t do that."; }
        return "you pressed it. nothing happened. (somewhere, something did.)";
      } },
    { id: "pen", name: "dried-out pen", icon: "pen",
      story: "writes in ghost. i can’t throw it away. it has feelings, or something." },
    { id: "fuse", name: "fuse", icon: "fuse",
      story: "blown, probably. it’s doing its best." },
    { id: "usb", name: "unlabelled usb stick", icon: "usb",
      story: "i’m too scared to look at what’s on it. it’s been like this for years." },
    { id: "cap", name: "bottle cap", icon: "cap",
      story: "it’s a bottle cap. it has no story. i’m sorry." },
    { id: "note", name: "sticky note", icon: "note",
      story: "it says: key. snap. cart. away. i don’t remember writing it." }
  ];

  var audio;
  function squeak() {
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      var osc = audio.createOscillator(), gain = audio.createGain(), t = audio.currentTime;
      osc.type = "square";
      osc.frequency.setValueAtTime(1500, t);
      osc.frequency.exponentialRampToValueAtTime(900, t + 0.09);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.08, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
      osc.connect(gain); gain.connect(audio.destination);
      osc.start(t); osc.stop(t + 0.14);
    } catch (e) { }
  }

  function rattle() {
    var drawer = byId("dw");
    if (!drawer || reduceMotion) return;
    drawer.classList.remove("rattle");
    void drawer.offsetWidth;
    drawer.classList.add("rattle");
  }

  function setupDrawer() {
    var box = byId("dwi"), noteTitle = byId("dwt"), noteText = byId("dwn");
    if (!box) return;
    var counts = {};
    DRAWER.forEach(function (item, index) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "dw-i";
      b.setAttribute("aria-pressed", "false");
      b.style.setProperty("--r", ((index * 37) % 13 - 6) + "deg");
      b.innerHTML = icon(ICONS[item.icon]) + '<span>' + item.name + '</span>';
      b.addEventListener("click", function () {
        counts[item.id] = (counts[item.id] || 0) + 1;
        [].forEach.call(box.children, function (c) { c.setAttribute("aria-pressed", c === b ? "true" : "false"); });
        var extra = item.act ? item.act(counts[item.id]) : null;
        noteTitle.textContent = item.name;
        noteText.textContent = extra || item.story;
        gardenFind("drawer");
        tell("drawer");
      });
      box.appendChild(b);
    });
  }


  // ---------- 2. the workshop simulator ----------
  // click something to pick it up, then click something else to use it on that.

  var ITEMS = {
    battery: { name: "battery", icon: "battery" },
    led: { name: "LED", icon: "led" },
    resistor: { name: "resistor", icon: "resistor" },
    wire: { name: "wire", icon: "wire" },
    switch: { name: "switch", icon: "toggle" },
    capacitor: { name: "capacitor", icon: "capacitor" },
    board: { name: "breadboard", icon: "board" },
    iron: { name: "soldering iron", icon: "iron", tool: true },
    driver: { name: "screwdriver", icon: "driver", tool: true },
    meter: { name: "multimeter", icon: "meter", tool: true },
    tape: { name: "tape", icon: "tape", tool: true },
    robot: { name: "half-built robot arm", icon: "robot", project: true },
    clock: { name: "unfinished clock", icon: "clock", project: true },
    pedal: { name: "the pedal (80%)", icon: "pedal", project: true },
    // things you can make
    deadled: { name: "dead LED", icon: "smoke" },
    ledr: { name: "LED with a resistor", icon: "led" },
    light: { name: "a working light", icon: "light" },
    swl: { name: "switch with leads", icon: "toggle" },
    pbox: { name: "battery with a switch", icon: "battery" },
    torch: { name: "a torch (sort of)", icon: "light" },
    stuck: { name: "wire, stuck to the table", icon: "wire" },
    meltedboard: { name: "melted breadboard", icon: "smoke" },
    popcap: { name: "popped capacitor", icon: "smoke" },
    rc: { name: "RC circuit", icon: "capacitor" }
  };

  // [text, thing it makes (or null), did it go wrong]
  var COMBOS = {
    "battery+led": ["pop. no resistor. the LED is now a small piece of history.", "deadled", true],
    "led+resistor": ["an LED with a resistor. responsible.", "ledr", false],
    "battery+ledr": ["it lights up! this is the one time it works.", "light", false],
    "switch+wire": ["a switch with leads. progress.", "swl", false],
    "battery+swl": ["a battery with a switch. it does nothing yet, but now it can be turned off.", "pbox", false],
    "ledr+pbox": ["a torch! a really bad one. it only works while you hold the wires. you are the third wire.", "torch", false],
    "iron+wire": ["you soldered the wire to the table.", "stuck", true],
    "iron+led": ["the LED is cooked.", "deadled", true],
    "iron+resistor": ["tinned the leads. looks professional. nobody will see it.", null, false],
    "board+iron": ["you melted the breadboard. it’s modern art now.", "meltedboard", true],
    "battery+capacitor": ["pop. it was the wrong way round. the capacitor has been politely retired.", "popcap", true],
    "capacitor+resistor": ["an RC circuit! it does nothing, slowly.", "rc", false],
    "driver+robot": ["you tightened one screw. a different part fell off. classic.", null, true],
    "iron+robot": ["it’s 2% more finished. it’s also slightly on fire.", null, true],
    "battery+robot": ["the arm twitched once and gave up. i feel that.", null, true],
    "ledr+robot": ["it has an eye now. it looks very judgemental.", null, false],
    "light+robot": ["it has a head torch now. it still isn’t finished.", null, false],
    "robot+tape": ["held together with tape. structurally, an opinion.", null, false],
    "clock+iron": ["it tells the time now. the wrong one.", null, true],
    "battery+clock": ["it ticked. it’s a clock. be proud.", null, false],
    "clock+driver": ["you took the back off to see how it works. it will never be the same.", null, true],
    "battery+pedal": ["it makes a noise. that’s a start. it’s not a good noise.", null, true],
    "pedal+resistor": ["the tone changed. i’m not sure it improved.", null, false],
    "battery+meter": ["1.5 volts. surprisingly honest.", null, false],
    "led+meter": ["the multimeter has nothing to say about LEDs.", null, false],
    "capacitor+meter": ["it says OL. it always says OL.", null, false],
    "board+led": ["plugged it in. looks tidy. means nothing.", null, false],
    "battery+board": ["powered the breadboard. it has no opinion either way.", null, false],
    "board+wire": ["wired it up. i think that’s a short circuit. no it isn’t. yes it is.", null, true],
    "board+tape": ["taped the breadboard to the bench. it’s a start.", null, false]
  };
  var NOPES = [
    "you made a thing. it doesn’t do anything.",
    "nothing happened. suspiciously.",
    "that’s not how any of this works.",
    "it fell apart in the nicest possible way.",
    "that’s a bad idea. you did it anyway. good.",
    "a faint smell of something. no further comment."
  ];
  var TOOL_NOPES = [
    "poked it. it’s fine. (it isn’t.)",
    "tightened it. loosened it. tightened it again.",
    "used it on that. no idea why.",
    "that did nothing, but with confidence."
  ];

  var START_ITEMS = ["battery", "battery", "led", "led", "resistor", "wire", "wire", "switch", "capacitor", "board", "iron", "driver", "meter", "tape", "robot", "clock", "pedal"];

  function setupWorkshop() {
    var bench = byId("wkb");
    if (!bench) return;
    var heldText = byId("wkh"), message = byId("wkm"), counter = byId("wkc");
    var held = null;
    var made = 0, broken = 0, uid = 0, firstTime = true;

    function describe(el) { return ITEMS[el.dataset.kind].name; }

    function showHeld() {
      heldText.textContent = "holding: " + (held ? describe(held) : "nothing");
      counter.textContent = "made: " + made + "   ·   didn’t work: " + broken;
    }

    function putDown() {
      if (held) { held.classList.remove("held"); held.setAttribute("aria-pressed", "false"); }
      held = null;
      showHeld();
    }

    function addItem(kind, fresh) {
      var data = ITEMS[kind];
      var b = document.createElement("button");
      b.type = "button";
      b.className = "wk-i" + (data.project ? " proj" : "") + (data.tool ? " tool" : "") + (fresh && !reduceMotion ? " pop" : "");
      b.dataset.kind = kind;
      b.dataset.uid = ++uid;
      b.setAttribute("aria-pressed", "false");
      b.style.setProperty("--r", ((uid * 29) % 9 - 4) + "deg");
      b.innerHTML = icon(ICONS[data.icon]) + "<span>" + data.name + "</span>";
      b.addEventListener("click", function () { choose(b); });
      bench.appendChild(b);
      return b;
    }

    function recipeFor(a, b) {
      var key = [a, b].sort().join("+");
      if (COMBOS[key]) return COMBOS[key];
      var toolInvolved = ITEMS[a].tool || ITEMS[b].tool || ITEMS[a].project || ITEMS[b].project;
      return [pick(toolInvolved ? TOOL_NOPES : NOPES), null, true];
    }

    function combine(source, target) {
      var recipe = recipeFor(source.dataset.kind, target.dataset.kind);
      var text = recipe[0], make = recipe[1], bad = recipe[2];
      message.textContent = text;
      if (bad) { broken++; tell("bench-fail"); }
      if (make) {
        made++;
        [source, target].forEach(function (el) {
          var d = ITEMS[el.dataset.kind];
          if (!d.tool && !d.project) el.remove();
        });
        addItem(make, true);
      }
      putDown();
      if (firstTime) { firstTime = false; gardenFind("bench"); }
      showHeld();
    }

    function choose(el) {
      if (!held) {
        held = el;
        el.classList.add("held");
        el.setAttribute("aria-pressed", "true");
        message.textContent = "picked up the " + describe(el) + ". now click something to use it on.";
        showHeld();
      } else if (held === el) {
        putDown();
        message.textContent = "put it back.";
      } else {
        combine(held, el);
      }
    }

    function fill() {
      bench.innerHTML = "";
      held = null; made = 0; broken = 0;
      START_ITEMS.forEach(function (kind) { addItem(kind, false); });
      showHeld();
    }

    byId("wkr").addEventListener("click", function () { fill(); message.textContent = "bench cleared. everything’s back where it started. (mostly.)"; });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && held) { putDown(); message.textContent = "put it back."; } });
    fill();
  }


  // ---------- 3. the locked box ----------
  // it turns up somewhere on the page. nobody explains it.

  var BOX_SVG = '<svg viewBox="0 0 96 76" aria-hidden="true" stroke="#30251F" stroke-width="2.6" stroke-linejoin="round">' +
    '<g class="lid"><path d="M10 30Q10 8 48 8T86 30Z" fill="#a8733f"/></g>' +
    '<rect x="10" y="30" width="76" height="38" rx="4" fill="#8a5d34"/>' +
    '<path d="M10 40h76" fill="none"/>' +
    '<rect x="38" y="36" width="20" height="18" rx="3" fill="#C58A42"/>' +
    '<circle cx="48" cy="45" r="2.6" fill="#30251F"/>' +
    '<g class="dots" stroke-width="1.4"><circle cx="22" cy="58" r="3.2"/><circle cx="34" cy="58" r="3.2"/><circle cx="62" cy="58" r="3.2"/><circle cx="74" cy="58" r="3.2"/></g>' +
    '</svg>';
  var LOCKED_LINES = ["locked.", "still locked.", "it’s a box. it’s locked.", "no.", "it rattles. that’s all."];
  var PARTIAL_LINES = ["something inside it clicked. not enough.", "it’s thinking about it.", "closer. but no.", "it hums. a bit."];

  function setupBox() {
    var sections = [].slice.call(document.querySelectorAll("section.rm"));
    if (sections.length < 5) return;
    var spot = sections[2 + Math.floor(Math.random() * (sections.length - 4))];
    var wrap = document.createElement("div");
    wrap.className = "lockbox-wrap";
    wrap.style.textAlign = ["left", "center", "right"][Math.floor(Math.random() * 3)];
    wrap.innerHTML = '<button type="button" class="lockbox" aria-label="A small locked box">' + BOX_SVG + '</button><p class="lb-msg" aria-live="polite"></p>';
    spot.parentNode.insertBefore(wrap, spot);
    var button = wrap.querySelector(".lockbox"), msg = wrap.querySelector(".lb-msg");
    var dots = wrap.querySelectorAll(".dots circle");
    var opened = false;

    function litCount() { return Object.keys(latches).filter(function (k) { return latches[k]; }).length; }

    lockUpdate = function () {
      var keys = Object.keys(latches);
      for (var i = 0; i < dots.length; i++) dots[i].setAttribute("fill", latches[keys[i]] ? "#ffd27a" : "#5a4630");
    };
    lockUpdate();

    button.addEventListener("click", function () {
      if (opened) { msg.textContent = "it’s empty now. it was always going to be."; return; }
      var n = litCount();
      if (n < 4) {
        msg.textContent = n === 0 ? pick(LOCKED_LINES) : pick(PARTIAL_LINES);
        tell("box-poke");
        return;
      }
      opened = true;
      wrap.classList.add("open");
      msg.innerHTML = 'inside: <b class="slip">a receipt for the box. £2.50. no refunds.</b>';
      gardenFind("box");
      lampSay("that’s it?? i’ve been keeping an eye on that all day.", 5000);
    });

    // the four unrelated things that open it
    new MutationObserver(function (changes) {
      changes.forEach(function (c) {
        for (var i = 0; i < c.addedNodes.length; i++) {
          if (c.addedNodes[i].classList && c.addedNodes[i].classList.contains("sw")) { latches.sword = true; lockUpdate(); }
        }
      });
    }).observe(document.body, { childList: true });
    document.addEventListener("click", function (e) {
      if (e.target.closest && e.target.closest(".wii .wch.full")) { latches.cart = true; lockUpdate(); }
    });
    var wasHidden = false;
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) wasHidden = true;
      else if (wasHidden) { latches.away = true; lockUpdate(); }
    });
  }

  setupDrawer();
  setupWorkshop();
  setupBox();
})();
