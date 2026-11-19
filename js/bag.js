
// ---- in my bag: the drawn backpack unzips, then everything tips out ----
(function () {
  var bg = document.getElementById("bg"), btn = document.getElementById("bgb"), hint = document.getElementById("bgh"), note = document.getElementById("bgn");
  if (!bg || !btn) return;
  var items = [].slice.call(bg.querySelectorAll(".bi"));
  var svg = document.getElementById("bgz");
  var still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var open = false, p = 0, timer = 0, raf = 0;

  // ---- the zip: an arch across the top of the bag, sampled so we can slide the pulls along it ----
  var arch = document.getElementById("bgarch"), pts = [];
  (function () {
    var len = arch.getTotalLength();
    for (var i = 0; i <= 120; i++) { var q = arch.getPointAtLength(len * i / 120); pts.push([q.x, q.y]); }
  })();
  var X0 = pts[0][0], X1 = pts[pts.length - 1][0], MID = 200;
  function yAt(x) {
    if (x <= pts[0][0]) return pts[0][1];
    for (var i = 1; i < pts.length; i++) {
      if (pts[i][0] >= x) { var a = pts[i - 1], b = pts[i], t = (x - a[0]) / ((b[0] - a[0]) || 1); return a[1] + (b[1] - a[1]) * t; }
    }
    return pts[pts.length - 1][1];
  }
  function line(x0, x1, dy, step) {
    var d = "", n = Math.max(2, Math.ceil(Math.abs(x1 - x0) / (step || 4)));
    for (var i = 0; i <= n; i++) { var x = x0 + (x1 - x0) * i / n; d += (i ? "L" : "M") + x.toFixed(1) + " " + (yAt(x) + dy(x)).toFixed(1); }
    return d;
  }
  function setBoth(id, d) { document.getElementById(id + "T").setAttribute("d", d); document.getElementById(id + "K").setAttribute("d", d); }
  function angleAt(x) { var a = yAt(x - 3), b = yAt(x + 3); return Math.atan2(b - a, 6) * 180 / Math.PI; }

  function render(t) {
    var e = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;      // ease in and out
    var xl = MID - (MID - X0) * e - 4 * (1 - e), xr = MID + (X1 - MID) * e + 4 * (1 - e);
    var half = (xr - xl) / 2, G = 50 * Math.pow(e, 0.8);
    var gap = function (x) { var u = (x - MID) / (half || 1); return G * Math.pow(Math.max(0, 1 - u * u), 0.85); };
    setBoth("zl", line(X0, xl, function () { return 0; }));
    setBoth("zr", line(xr, X1, function () { return 0; }));
    if (e < 0.02) { setBoth("zu", ""); setBoth("zd", ""); document.getElementById("bgm").setAttribute("d", ""); }
    else {
      var up = line(xl, xr, function () { return -1; }, 5);
      var dn = line(xl, xr, function (x) { return gap(x); }, 5);
      setBoth("zu", up); setBoth("zd", dn);
      var back = dn.split("L").reverse(); back[back.length - 1] = back[back.length - 1].replace("M", "");
      document.getElementById("bgm").setAttribute("d", up + "L" + back.join("L") + "Z");
    }
    var l = document.getElementById("bgp1"), r = document.getElementById("bgp2");
    l.setAttribute("transform", "translate(" + xl.toFixed(1) + " " + yAt(xl).toFixed(1) + ") rotate(" + (angleAt(xl) * 0.7).toFixed(1) + ")");
    r.setAttribute("transform", "translate(" + xr.toFixed(1) + " " + yAt(xr).toFixed(1) + ") rotate(" + (angleAt(xr) * 0.7).toFixed(1) + ")");
  }
  function zipTo(target, ms, done) {
    cancelAnimationFrame(raf);
    if (still) { p = target; render(p); if (done) done(); return; }
    var from = p, start = performance.now();
    (function step(now) {
      var k = Math.min(1, (now - start) / ms);
      p = from + (target - from) * k; render(p);
      if (k < 1) raf = requestAnimationFrame(step); else if (done) done();
    })(start);
  }
  render(0);

  // where the things start from when they tip out: the mouth of the bag
  function flyFrom() {
    var b = svg.getBoundingClientRect(), s = b.width / 400;
    var cx = b.left + 200 * s, cy = b.top + 140 * s;
    items.forEach(function (el) {
      var r = el.getBoundingClientRect();
      el.style.setProperty("--tx", (cx - (r.left + r.width / 2)) + "px");
      el.style.setProperty("--ty", (cy - (r.top + r.height / 2)) + "px");
    });
  }

  function wobble() { bg.classList.remove("wob"); void bg.offsetWidth; if (!still) bg.classList.add("wob"); }

  function setOpen(on) {
    open = on;
    clearTimeout(timer);
    hint.textContent = on ? "zip me up" : "unzip me";
    btn.setAttribute("aria-expanded", on ? "true" : "false");
    btn.setAttribute("aria-label", on ? "The bag. Press to zip it back up" : "The bag. Press to unzip it and tip everything out");
    wobble();
    if (on) {
      zipTo(1, 900);
      timer = setTimeout(function () { bg.classList.remove("packed"); }, still ? 0 : 520);   // things tumble out as the mouth opens
    } else {
      flyFrom(); bg.classList.add("packed");                                                   // everything goes back in...
      timer = setTimeout(function () { zipTo(0, 800); }, still ? 0 : 550);                    // ...then the zip closes
    }
  }

  // with scripting on, start zipped up; without it everything just sits out on the desk
  flyFrom();
  bg.classList.add("packed");
  btn.setAttribute("aria-expanded", "false");
  window.addEventListener("resize", function () { if (!open) flyFrom(); });
  if ("IntersectionObserver" in window) {
    var nudged = false;   // the first time it scrolls into view, a tiny wiggle so people know it's pressable
    new IntersectionObserver(function (es) {
      if (es[0].isIntersecting && !nudged && !open) { nudged = true; wobble(); }
    }, { threshold: 0.5 }).observe(btn);
  }

  btn.addEventListener("click", function () {
    setOpen(!open);
    if (open) { note.querySelector("small").textContent = "tap something"; note.querySelector("p").textContent = "everything in here has a reason. mostly a bad one."; }
  });

  items.forEach(function (el) {
    el.addEventListener("click", function () {
      items.forEach(function (o) { o.setAttribute("aria-pressed", o === el ? "true" : "false"); });
      note.querySelector("small").textContent = el.querySelector(".bil").textContent;
      note.querySelector("p").textContent = el.getAttribute("data-n");
    });
  });
})();
