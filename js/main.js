// picks a line from a list without saying the same one twice. it goes through a shuffled copy of the whole list before any line comes back
window.nextLine = function (list) {
  if (!list.bag || !list.bag.length) {
    list.bag = list.slice().sort(function () { return Math.random() - 0.5; });
    if (list.bag.length > 1 && list.bag[list.bag.length - 1] === list.last) list.bag.reverse();
  }
  return (list.last = list.bag.pop());
};
(function () {
	// seeded so the tilts and colours are the same every load
	var s = 5; function R() { s = s * 16807 % 2147483647; return s / 2147483647;}
	var C = ["var(--hot)", "var(--sun)", "var(--pink)", "var(--blue)", "var(--mint)"], I = "#30251F", P = "#F2E8D6";function K() { return C[Math.floor(R() * 5)]; }
	["n1", "n2"].forEach(function (id, j) {
		var e = document.getElementById(id);
        e.dataset.t.split("").forEach(function (ch, i) {
            var l = document.createElement("span");
            l.className = "lt";
            l.textContent = ch;
            l.style.cssText = "font-family:'" + ["Fraunces", "Caveat", "Special Elite", "Instrument Serif"][(i + j * 2) % 4] + "',serif;background:" + C[(i * 2 + j * 3) % 5] + ";--r:" + ((R() * 8 - 4).toFixed(1)) + "deg;--d:" + ((i + j * 4) * .09).toFixed(2) + "s";
            e.appendChild(l);
        });
    });
    var T = "FPGA / HDL,Embedded C,PyTorch,Qiskit,PCB Design,CUDA,Rust,Quantum Circuits,Signal Processing,RF Electronics".split(",");
    T.forEach(function (t, i) {
        var e = document.createElement("span");
        e.textContent = t;
        e.style.cssText = "background:" + C[i % 5] + ";--r:" + ((R() * 6 - 3).toFixed(1)) + "deg";
        document.getElementById("tg").appendChild(e);
	});
	var A = [
		function () {
			var o = "";
			for (var y = 0; y < 8; y++)
				for (var x = 0; x < 8; x++)
					o += '<rect x="' + x * 25 + '" y="' + y * 25 + '" width="25" height="25" fill="' + ((x + y) % 2 ? I : P) + '"/>';
			for (var i = 0; i < 3; i++)
				o += '<circle cx="' + (40 + R() * 120) + '" cy="' + (40 + R() * 120) + '" r="' + (30 + R() * 30) + '" fill="' + K() + '" opacity=".75" style="mix-blend-mode:multiply"/>';
			return o;
		}, function () {
			var o = '<rect width="200" height="200" fill="' + P + '"/>';
			for (var y = 0; y < 8; y++)
				for (var x = 0; x < 8; x++)
					if (R() > .45)
						o += '<rect x="' + (12 + x * 22) + '" y="' + (12 + y * 22) + '" width="18" height="18" fill="' + K() + '"/>';
			return o;
		},
		function () {
			var o = '<rect width="200" height="200" fill="' + I + '"/>';
			for (var k = 0; k < 9; k++) {
				var d = "M0 " + (20 + k * 20);
				for (var x = 0; x <= 200; x += 5)
          d += "L" + x + " " + (20 + k * 20 + Math.sin(x / (14 + k * 3) + k) * (6 + k * 1.5));
        o += '<path d="' + d + '" fill="none" stroke="' + C[k % 5] + '" stroke-width="3"/>';
      }
      return o;
    },
    function () {
      var o = '<rect width="200" height="200" fill="' + P + '"/>';
      for (var i = 0; i < 14; i++)
        o += '<rect x="' + (Math.floor(R() * 9) * 20 + 10) + '" y="' + (Math.floor(R() * 9) * 20 + 10) + '" width="20" height="20" fill="' + (i % 2 ? I : "var(--pink)") + '"/>';
      var x = 10, y = 190, p = "10,190";
      while (x < 190 || y > 10) {
        if (R() > .5 && x < 190)
          x += 20;
        else if (y > 10)
          y -= 20;
        else
          x += 20;
        p += " " + x + "," + y;
      }
      return o + '<polyline points="' + p + '" fill="none" stroke="var(--hot)" stroke-width="5"/>';
    },
    function () {
      var o = '<rect width="200" height="200" fill="var(--sun)"/>';
      (function t(x, y, w, d) {
        if (d > 4)
          return;
        for (var q = -1; q < 2; q += 2) {
          var nx = x + q * w, ny = y + 36;
          o += '<line x1="' + x + '" y1="' + y + '" x2="' + nx + '" y2="' + ny + '" stroke="' + I + '" stroke-width="2.5"/>';
          t(nx, ny, w / 2, d + 1);
        }
        o += '<circle cx="' + x + '" cy="' + y + '" r="' + (7 - d) + '" fill="' + (d % 2 ? "var(--hot)" : I) + '"/>';
      })(100, 20, 56, 0);
      return o;
    }, function () {
			var o = '<rect width="200" height="200" fill="' + P + '"/>', i;
			for (i = 0; i < 3; i++)
				o += '<path d="M' + (14 + i * 62) + ' 120v66h50v-66" fill="none" stroke="' + I + '" stroke-width="5"/>';
			for (i = 0; i < 22; i++) {
				var b = Math.floor(R() * 3);
				o += '<circle cx="' + (39 + b * 62 + (R() - .5) * 30) + '" cy="' + (20 + R() * 150) + '" r="8" fill="' + C[b] + '"/>';
			}
			return o;
		}
	];
	document.querySelectorAll(".fr svg").forEach(function (v, i) {
		v.innerHTML = A[i]();
	});
	document.querySelectorAll(".pol svg").forEach(function (v) {
		v.innerHTML = A[v.dataset.a]();
	});
	function $(i) {
		return document.getElementById(i);
	}
	function gen(n) {
		var h = [[200, 60], [20, 140], [330, 40]][n % 3];
		return "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"><defs><linearGradient id="g" x2="0" y2="1"><stop offset="0" stop-color="hsl(' + h[0] + ',70%,60%)"/><stop offset="1" stop-color="hsl(' + h[1] + ',80%,75%)"/></linearGradient></defs><rect width="300" height="200" fill="url(#g)"/><circle cx="' + (70 + n * 45) + '" cy="60" r="26" fill="#fff6c9"/><path d="M0 150Q70 100 140 140T300 120V200H0Z" fill="#2c4a3e"/><path d="M0 175Q90 140 180 170T300 160V200H0Z" fill="#17262a"/></svg>');
	}
	// first one is real, rest are placeholders
	var PHOTOS = [0, 1, 2, 3, 4, 5].map(function (n) {
		return { s: n === 0 ? "images/photo-1.jpg" : gen(n), c: ["prototype italian grip, 3D printed. the real foil is there for scale", "this frame will have something good (hopefully)", "imagine a very messy desk here", "photo pending, my camera roll is a disaster", "a leaf will probably end up here", "nothing yet, give it time"][n] };
	}), dv = $("dv"), pTrig = null;
	PHOTOS.forEach(function (p, i) {
		var b = document.createElement("button");
		b.className = "fm";
		b.setAttribute("aria-label", "Develop photo " + (i + 1));
		b.innerHTML = '<img alt="" src="' + p.s + '"><i>' + (i + 1) + 'A</i>';
		b.onclick = function () {
			pTrig = b;
			dv.innerHTML = '<div class="cam"><svg viewBox="0 0 340 190" aria-hidden="true"><rect x="2" y="8" width="336" height="178" rx="20" fill="#ebe8de" stroke="#30251F" stroke-width="4"/><rect x="12" y="18" width="316" height="36" rx="12" fill="#30251F"/><rect x="26" y="26" width="52" height="20" rx="3" fill="#3a3f45"/><rect x="262" y="26" width="52" height="20" rx="3" fill="#fff6c9"/><rect class="fl" x="262" y="26" width="52" height="20" rx="3"/><rect x="4" y="68" width="332" height="5" fill="#A94F36"/><rect x="4" y="73" width="332" height="5" fill="#C58A42"/><rect x="4" y="78" width="332" height="5" fill="#8E9468"/><rect x="4" y="83" width="332" height="5" fill="#70545A"/><circle cx="170" cy="100" r="54" fill="#30251F"/><circle cx="170" cy="100" r="42" fill="#2a3b4d"/><circle cx="170" cy="100" r="28" fill="#0e151c"/><circle cx="158" cy="88" r="9" fill="#fff" opacity=".45"/><circle cx="296" cy="78" r="13" fill="#A94F36" stroke="#30251F" stroke-width="3"/><rect x="80" y="170" width="180" height="9" rx="4" fill="#30251F"/></svg><div class="px"><div class="ph"><img alt="' + p.c + '" src="' + p.s + '"></div><p>' + p.c + '</p></div></div><button class="bt x" type="button">Close</button>';
			dv.hidden = false;
			dv.querySelector(".x").focus();
		};
		$("film").appendChild(b);
	});
  function closeThing() {
    if (dv.hidden)
      return;
    dv.hidden = true;
    if (pTrig && pTrig.isConnected)
      pTrig.focus();
    pTrig = null;
  }
  dv.onclick = function (e) {
    if (e.target === dv || e.target.classList.contains("x"))
      closeThing();
  };
  dv.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      e.preventDefault();
      closeThing();
      return;
    }
    if (e.key === "Tab") {
      var f = [].slice.call(dv.querySelectorAll("button")).filter(function (x) {
        return !x.disabled;
      });
      if (!f.length) {
        e.preventDefault();
        return;
      }
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
      else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
  function lis() {
    var d = "";
    for (var t = 0; t <= 6.29; t += .02)
      d += (t ? "L" : "M") + (100 + 80 * Math.sin(5 * t + 1.57)).toFixed(1) + " " + (100 + 80 * Math.sin(4 * t)).toFixed(1);
    return [d];
  }
  function spi() {
    var d = "";
    for (var t = 0; t < 62; t += .06)
      d += (t ? "L" : "M") + (100 + Math.cos(t) * t * 1.45).toFixed(1) + " " + (100 + Math.sin(t) * t * 1.45).toFixed(1);
    return [d];
  }
  function rid() {
    var a = [];
    for (var k = 0; k < 22; k++) {
			var y = 34 + k * 6, d = ""; for (var x = 20; x <= 180; x += 2) {
				var h = Math.exp(-Math.pow((x - 100) / 28, 2)) * (14 + 10 * Math.sin(x * .5 + k)) * (Math.sin(k * 1.7 + x * .21) * .5 + .7);
				d += (x > 20 ? "L" : "M") + x + " " + (y - h).toFixed(1);}
			a.push(d);}
		return a; }
	// unused, plot() replaced it
	function plotOLD(f, h) { var pen = f.querySelector(".pen"), ps = [].slice.call(f.querySelectorAll(".ink path")), L = ps.map(function (p) { var l = p.getTotalLength();
			p.style.strokeDasharray = l + " " + l;
			p.style.strokeDashoffset = l; return l; }), T = L.reduce(function (a, b) { return a + b; }, 0), sp = T / 14000, t0 = null;
		cancelAnimationFrame(f._r);pen.style.display = "none"; if (h)
			return;if (matchMedia("(prefers-reduced-motion:reduce)").matches) { ps.forEach(function (p) { p.style.strokeDashoffset = 0;});
            return;
        }
        pen.style.display = "";
        (function fr(t) {
            if (t0 === null)
                t0 = t;
            var d = (t - t0) * sp, i = 0, pt;
            for (; i < ps.length; i++) {
                if (d >= L[i]) {
                    ps[i].style.strokeDashoffset = 0;
                    d -= L[i];
                }
                else {
                    ps[i].style.strokeDashoffset = L[i] - d;
                    pt = ps[i].getPointAtLength(d);
                    break;
                }
            }
            if (pt)
                pen.setAttribute("transform", "translate(" + pt.x + " " + pt.y + ")");
            if (i < ps.length)
                f._r = requestAnimationFrame(fr);
            else
                pen.style.display = "none";
        })(performance.now());
    }
    function RM() {
        return matchMedia("(prefers-reduced-motion:reduce)").matches;
    }
    function draw(f, p) {
        if (f._rv)
            f._rv(p);
		var d = f._d, t = p * d.T, i = 0, pt;
		for (; i < d.ps.length; i++) {
			if (t >= d.L[i]) {
				d.ps[i].style.strokeDashoffset = 0;
				t -= d.L[i];
			}
			else {
				d.ps[i].style.strokeDashoffset = d.L[i] - t;
				pt = d.ps[i].getPointAtLength(t);
				for (var j = i + 1; j < d.ps.length; j++)
					d.ps[j].style.strokeDashoffset = d.L[j];
				break;
            }
        }
        if (pt && p > 0 && p < 1) {d.pen.style.display = ""; d.pen.setAttribute("transform", "translate(" + pt.x + " " + pt.y + ")"); }
        else
            d.pen.style.display = "none"; }
    function plot(f, h) {var d = f._d;
        if (!d) { var ps = [].slice.call(f.querySelectorAll(".ink path")), L = ps.map(function (p) {
                var l = p.getTotalLength();
                p.style.strokeDasharray = l + " " + l; return l;}); f._d = { ps: ps, L: L, T: L.reduce(function (a, b) {return a + b; }, 0), pen: f.querySelector(".pen") };}
        cancelAnimationFrame(f._r);
        f._b = 0;
        f._p = -1; if (h) {
            draw(f, 0); return; }
        if (RM()) {
            draw(f, 1); return;
		}
		f._b = 1; var t0 = null;(function fr(t) {
			if (t0 === null)
				t0 = t; var p = Math.min(1, (t - t0) / 12000); draw(f, p); if (p < 1)
				f._r = requestAnimationFrame(fr);
			else
				f._b = 0;
		})(performance.now());}
	function sc() { var vh = innerHeight;
		[].forEach.call(document.querySelectorAll(".sheet"), function (f) {
			if (f._b || !f._d)
				return; var r = f.getBoundingClientRect(), p = RM() ? 1 : Math.max(0, Math.min(1, (vh * .9 - r.top) / (vh * .55))); if (f._p !== p) { f._p = p;
				draw(f, p); }
		});}
	var io = new IntersectionObserver(function (es) { es.forEach(function (e) {var f = e.target;if (e.intersectionRatio >= .5) {
        if (!f._on) {f._on = 1;plot(f); }
      }
      else if (e.intersectionRatio === 0 && f._on) {f._on = 0; plot(f, 1); }
    }); }, { threshold: [0, .5] });
  var DR = [{ t: "Lissajous 5:4", p: lis() }, { t: "Spiral", p: spi() }, { t: "Ridgelines", p: rid() }, { t: "Leaf venation", p: window.LEAF_SVG }];
  DR.forEach(function (d, i) { var f = document.createElement("figure"); f.className = "sheet";
    f.style.setProperty("--r", (i % 2 ? 1.2 : -1.4) + "deg");
    f.innerHTML = '<svg viewBox="' + (d.vb || "0 0 200 200") + '" role="img" aria-label="' + d.t + '">' + (d.tpl ? '<clipPath id="lc"><rect id="lcr" x="-100" y="800" width="900" height="0"/></clipPath><g clip-path="url(#lc)">' + d.tpl + '</g><g class="ink"></g>' : '<g class="ink">' + d.p.map(function (x) {
      var q = x.split("|");return q.length > 1 ? '<path style="stroke-width:' + q[0] + '" d="' + q[1] + '"/>' : '<path d="' + x + '"/>';
    }).join("") + '</g>') + '<g class="pen"><line x1="-200" x2="200"/><line y1="-200" y2="200"/><circle r="3.2"/></g></svg><figcaption><span>' + d.t + '</span><button type="button">Plot again</button></figcaption>';
    if (d.tpl)
      f._rv = function (p) {
        var r = f.querySelector("#lcr"); r.setAttribute("y", 800 - 800 * p);
        r.setAttribute("height", 800 * p); };$("dr").appendChild(f);
    plot(f, 1); f.querySelector("button").onclick = function () { plot(f);
    }; io.observe(f);
  });
  // no audio attached yet
  var TR = [1, 2, 3, 4].map(function (n) {
    return { t: ["humming to myself", "tape hiss, take 1", "three chords and a loop", "not finished yet"][n - 1], a: "Jack Amias", d: 150 + n * 17 };
  }), ti = 0, cu = 0, pl = 0, el = 0, vw = "l", tl = $("tl"), np = $("np"), bt = $("bt"), au = new Audio(), wh = $("wh"), la = null, ac = 0;au.preload = "metadata";
  function fmt(s) { s = Math.floor(Math.max(0, Number(s) || 0));return Math.floor(s / 60) + ":" + ("0" + s % 60).slice(-2);
  }
  function sPlay() { var result = au.play(); if (result && typeof result.catch === "function")
      result.catch(function () {
        pl = 0; au.pause();
        sv(vw);
      }); }
  function rl() {
    tl.innerHTML = TR.map(function (x, i) {
      return '<li class="' + (i === cu ? "on" : "") + '"><span>' + x.t + '</span><span>▸</span></li>'; }).join(""); }
  function rn() {var x = TR[ti], duration = TR[ti].src ? (Number.isFinite(au.duration) ? au.duration : x.d) : x.d;
    np.innerHTML = '<div class="art" style="background:linear-gradient(135deg,var(--hot),var(--sun))"></div><b>' + x.t + '</b><span>' + x.a + '</span><div class="pg"><i style="width:' + Math.min(100, duration ? el / duration * 100 : 0) + '%"></i></div><div class="tm"><span>' + fmt(el) + '</span><span>-' + fmt(Math.max(0, duration - el)) + '</span></div>';
  }
  function sv(v) {vw = v;
    tl.hidden = v !== "l"; np.hidden = v !== "n";bt.textContent = pl ? "▶" : "❚❚"; if (v === "n")
      rn();else
      rl();
  }
  function pj(n) {
    ti = cu = (n + TR.length) % TR.length;
    el = 0;
    au.pause();
    au.removeAttribute("src");
    au.load();
    if (TR[ti].src) {
      au.src = TR[ti].src;
      if (pl)
        sPlay();
    }
    sv(vw);
  }
  function pp() {
    pl = pl ? 0 : 1;
    if (TR[ti].src) {
      if (pl)
        sPlay();
      else
        au.pause();
    }
    sv(vw);
  }
  au.addEventListener("timeupdate", function () {
    if (!TR[ti].src)
      return;
    el = au.currentTime;
    if (vw === "n")
      rn();
  });
    au.addEventListener("ended", function () {
        if (TR[ti].src)
            pj(ti + 1);
    }); au.addEventListener("error", function () { if (TR[ti].src) {
            pl = 0;sv(vw); }
    }); setInterval(function () {if (!pl || TR[ti].src)
            return;el += .5;
        if (el >= TR[ti].d) {
            pj(ti + 1);
		}
		else if (vw === "n")
			rn(); }, 500);
	function ang(e) { var r = wh.getBoundingClientRect();
		return Math.atan2(e.clientY - r.top - r.height / 2, e.clientX - r.left - r.width / 2); }
	wh.onpointerdown = function (e) {
		if (e.target.closest("button"))
			return;
		la = ang(e);
		ac = 0; wh.setPointerCapture(e.pointerId); }; wh.onpointermove = function (e) { if (la === null)
			return; var a = ang(e), d = a - la;if (d > Math.PI)
			d -= 6.283;if (d < -Math.PI)
			d += 6.283; la = a;ac += d;
		if (Math.abs(ac) > .5) { cu = (cu + (ac > 0 ? 1 : -1) + TR.length) % TR.length;
			ac = 0; if (vw === "l")
				rl(); }
	}; wh.onpointerup = wh.onpointercancel = wh.onlostpointercapture = function () { la = null;};
	wh.onkeydown = function (e) { if (e.key === "ArrowDown" || e.key === "ArrowUp") {cu = (cu + (e.key === "ArrowDown" ? 1 : -1) + TR.length) % TR.length; if (vw === "l")
        rl();
      e.preventDefault();
    }
  };
  wh.querySelector(".mn").onclick = function () {
    sv("l");
  };
  wh.querySelector(".pv").onclick = function () {
    pj(ti - 1);
  };
  wh.querySelector(".nx").onclick = function () {
    pj(ti + 1);
  };
  wh.querySelector(".pp").onclick = pp;
  wh.querySelector(".ct").onclick = function () {
    if (vw === "l") {
      pj(cu);
      pl = 1;
      if (TR[ti].src)
        sPlay();
      sv("n");
    }
    else
      pp();
  };
  sv("l");
  function mv(n) {
    cu = (cu + n + TR.length) % TR.length;
    if (vw === "l")
      rl();
    }
    var ip = document.querySelector(".ipod"), sa = 0, sy = null, sd = 0, sr = ip.querySelector(".scr");
    var b = document.getElementById("eb"), a = document.getElementById("ea");
    b.addEventListener("click", function () { var o = a.hidden;
        a.hidden = !o;b.setAttribute("aria-expanded", o); b.textContent = o ? "✉ hide it again" : "✉ ok fine, here’s my email"; document.getElementById("shy").hidden = !o; });
})();
(function () { var RM = matchMedia("(prefers-reduced-motion:reduce)").matches, $ = function (i) { return document.getElementById(i);};
    $("dt").textContent = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }).toUpperCase();
    document.querySelectorAll(".lt").forEach(function (l) {l.addEventListener("animationend", function () {l.style.animation = "none";
        });});
    (function () { var f = $("fall"); if (RM || !f)
            return;
        var C = ["var(--hot)", "var(--sun)", "var(--pink)", "var(--mint)", "var(--blue)"], n = innerWidth < 700 ? 6 : 10; function h() {
            f.style.setProperty("--h", (f.offsetHeight + 90) + "px"); }
        h(); addEventListener("resize", h); for (var i = 0; i < n; i++) {
            var d = document.createElement("div"), w = 24 + Math.random() * 26, t = 15 + Math.random() * 12;d.className = "lf";
            d.style.cssText = "left:" + ((i + Math.random() * .8) / n * 100).toFixed(1) + "%;width:" + w.toFixed(0) + "px;--dx:" + ((Math.random() * 160 - 80) | 0) + "px;animation-duration:" + t.toFixed(1) + "s;animation-delay:-" + (Math.random() * t).toFixed(1) + "s";
            d.innerHTML = '<svg viewBox="0 0 40 60" style="animation-duration:' + (3 + Math.random() * 3).toFixed(1) + 's;animation-delay:-' + (Math.random() * 4).toFixed(1) + 's"><path d="M20 58C6 46 2 28 20 3C38 28 34 46 20 58Z" fill="' + C[i % 5] + '" stroke="rgba(48,37,31,.6)" stroke-width="1.5" stroke-linejoin="round"/><path d="M20 58V10M20 44L9 34M20 44L31 34M20 32L11 22M20 32L29 22" fill="none" stroke="rgba(48,37,31,.55)" stroke-width="1.2" stroke-linecap="round"/></svg>';
            f.appendChild(d); }
    })(); (function () { if (RM)
            return;
        var T = [document.title, "whoah, so vibey ✦", "cool projects 🍂", "come say hi ✺", "wires, qubits & leaves", "♪ humming to myself", "built by Jack"], i = 0, n = 0, d = 1;
        function tick() {
            if (window.tabMood) return setTimeout(tick, 500); // paused while the tab is saying something needy
            var s = Array.from(T[i]), hid = document.hidden, st = hid ? 3 : 1;
            n += d * st;
            if (n >= s.length) {
                n = s.length;
                d = -1;
                document.title = s.join("");
                return setTimeout(tick, hid ? 3000 : 1800);
            }
            if (n <= 0) {
                n = 0;
                d = 1;
                i = (i + 1) % T.length;
                document.title = "✦";
                return setTimeout(tick, hid ? 1000 : 350);
            }
            document.title = s.slice(0, n).join("") + (hid ? "" : "▍");
            setTimeout(tick, hid ? 1000 : 90 + Math.random() * 70);
        }
        tick();
    })();
    (function () {
        var r = document.documentElement, b = $('lamp'), mq = matchMedia('(prefers-color-scheme:dark)');
        function dk() {
            var t = r.getAttribute('data-theme');
            return t ? t === 'dark' : mq.matches;
        }
        function sy() {
            var d = dk();
            b.setAttribute('aria-pressed', d);
            d ? r.setAttribute('data-lit', '') : r.removeAttribute('data-lit');
        }
        try {
            var sv = localStorage.getItem('jt');
            if (sv)
                r.setAttribute('data-theme', sv);
        }
        catch (e) { }
        sy();
        b.onclick = function () {
      var n = dk() ? 'light' : 'dark'; r.setAttribute('data-theme', n); try {localStorage.setItem('jt', n);}
      catch (e) { }
      sy();
    };
  })(); (function () {
    var h = new Date().getHours(), g = h < 5 ? 'up late? me too.' : h < 12 ? 'good morning, pull up a chair.' : h < 17 ? 'good afternoon, mind the clutter.' : h < 21 ? 'good evening, sorry in advance, i’m terrible at small talk.' : 'burning the midnight oil?', e = document.querySelector('.hello');
    if (e) {
      var s = document.createElement('span'); s.style.cssText = 'display:block;font-size:.8em;color:var(--blue)'; s.textContent = g; e.appendChild(s); }
    $('tint').style.background = h < 5 || h >= 21 ? 'rgba(60,50,110,.16)' : h < 9 ? 'rgba(170,200,225,.14)' : h < 17 ? 'transparent' : 'rgba(235,140,60,.16)'; })();
  (function () {var v = $('vine'); if (!v)
      return;var NS = 'http://www.w3.org/2000/svg', P, L = [], C = ['#8E9468', '#C58A42', '#A94F36', '#BD8170']; function el(n, a) {var x = document.createElementNS(NS, n);
      for (var k in a)
        x.setAttribute(k, a[k]); return x;
    }
    function up() { var m = document.documentElement.scrollHeight - innerHeight, p = RM ? 1 : (m > 0 ? scrollY / m : 0); P.style.strokeDashoffset = 1 - p;
      L.forEach(function (a) { a[1].style.opacity = p >= a[0] ? 1 : 0; }); }
    function mk() { var H = innerHeight, d = 'M23 0'; v.setAttribute('viewBox', '0 0 46 ' + H); v.innerHTML = '';for (var y = 0; y <= H; y += 20)
        d += 'L' + (23 + Math.sin(y / 55) * 10).toFixed(1) + ' ' + y;
      P = el('path', { d: d, pathLength: 1, fill: 'none', stroke: '#7B805D', 'stroke-width': 2.5, 'stroke-linecap': 'round' }); P.style.strokeDasharray = 1; v.appendChild(P);
      L = [];for (var i = 1; i <= 12; i++) {
        var t = i / 13, yy = t * H, x = 23 + Math.sin(yy / 55) * 10, s = i % 2 ? 1 : -1, g = el('path', { d: 'M0 0C-7-6-7-16 0-24C7-16 7-6 0 0Z', fill: C[i % 4], stroke: '#30251F', 'stroke-width': .8, transform: 'translate(' + x.toFixed(1) + ' ' + yy.toFixed(1) + ') rotate(' + s * 55 + ')' });
        g.style.transition = 'opacity .5s'; v.appendChild(g); L.push([t, g]);
      }
      up();}
    mk(); addEventListener('scroll', up, { passive: true });addEventListener('resize', mk); })();
  // email box is exempt
  ['copy', 'cut', 'dragstart'].forEach(function (t) {
    document.addEventListener(t, function (e) { var a = e.target;var q = getSelection(), n = q && q.anchorNode && (q.anchorNode.parentElement || q.anchorNode);
      if (a && a.closest && a.closest('input,textarea') || n && n.closest && n.closest('#ea'))
        return;e.preventDefault();
    });
    });
    ['yrs', 'yb'].forEach(function (i) {
        var e = $(i);
        if (e)
            e.textContent = new Date().getFullYear() - 2016;
    });
    var M = ["following interesting ideas", "wiring something up", "reading about qubits", "drawing with a plotter", "forgetting where the multimeter is", "one more turn (civ)", "rehearsing a normal conversation", "ignoring a message to work on a project",
        "debugging with a rubber duck", "losing a fight with a breadboard", "plotting leaves", "tuning a guitar that is already in tune", "practising lunges in the hallway", "reading a datasheet (again)",
        "avoiding the laundry", "writing a song in my head", "soldering something. carefully", "naming a variable. it’s taking hours", "building a thing to avoid building a thing", "tidying the desk (moving the mess)",
        "watching a compiler think", "waiting for a 3D print", "drawing on a tablet (not a pen)", "losing the plot (and a screwdriver)", "one more game (caving in)", "sharpening pencils i won’t use"], k = 0;
    M = [M[0]].concat(M.slice(1).sort(function () { return Math.random() - .5; }));   // new order every visit, first one stays
    if (!RM)
        setInterval(function () {
            k = (k + 1) % M.length;
            $("stt").textContent = M[k];
        }, 5000);
    var cat = { "Quantum": "filed under: quantum", "Classical Circuits": "filed under: logic gates", "Neural Network": "filed under: neural nets" };
    document.querySelectorAll(".lb small").forEach(function (e) {
        var c = e.textContent.split(" · ")[0], m = document.createElement("span");
        m.className = "mgn";
        m.textContent = cat[c] || "";
        e.parentNode.appendChild(m);
    });
    $("hb").onclick = function () {
        var h = $("hm"), o = h.hidden;
        h.hidden = !o;
        this.setAttribute("aria-expanded", o);
    };
    if (!RM && matchMedia("(pointer:fine)").matches) {
        var lt = 0;
        document.addEventListener("pointermove", function (e) {
            var n = Date.now();
            if (n - lt < 90)
                return;
            lt = n;
            var s = document.createElement("span");
            s.className = "st";
            s.textContent = "✦";
            s.style.left = e.clientX + (Math.random() * 14 - 7) + "px";
            s.style.top = e.clientY + "px";
            document.body.appendChild(s);
            setTimeout(function () {
        s.remove();
      }, 900);
    });
  }
  setInterval(function () {
    var b = $("bt"), n = $("nook"), c = document.querySelector("#tl li.on span");
    if (n && b)
      n.classList.toggle("play", b.textContent === "▶");
    if (c)
      $("cl").textContent = c.textContent;
  }, 400);
})();
(function () {
  var $ = function (i) {
    return document.getElementById(i);
  }, RM = matchMedia("(prefers-reduced-motion:reduce)").matches;
  var lg = $("lg"), ls = document.querySelectorAll(".fx-l"), lr = $("lr"), fb = $("fxb"), tm;
  var OUT = [[1, 0, 0, "touch! red scores."], [0, 0, 1, "touch! green scores."], [1, 0, 1, "double touch. nobody is happy."], [0, 1, 0, "off target. white light, no point."]];
  lg.onclick = function () {
    clearTimeout(tm);
    ls.forEach(function (l) {
      l.classList.remove("on");
    });
    lr.textContent = "…";
    fb.classList.remove("go");
    void fb.getBoundingClientRect();
    if (!RM)
      fb.classList.add("go");
    tm = setTimeout(function () {
      var o = OUT[Math.random() < .3 ? 0 : Math.random() < .45 ? 1 : Math.random() < .5 ? 2 : 3];
      ls[0].classList.toggle("on", !!o[0]);ls[1].classList.toggle("on", !!o[1]);ls[2].classList.toggle("on", !!o[2]); lr.textContent = o[3]; tm = setTimeout(function () {
        ls.forEach(function (l) {l.classList.remove("on");}); }, 1800);}, RM ? 0 : 420);}; function J() {return (Math.random() - .5) * 3.6;
  }
  function P(p, c) { var d = "", i, j, a, b, n; for (i = 0; i < p.length - (c ? 0 : 1); i++) {a = p[i];
      b = p[(i + 1) % p.length];
      for (j = 0; j < 4; j++) { n = j / 4;
        d += (d ? "L" : "M") + (a[0] + (b[0] - a[0]) * n + J()).toFixed(1) + " " + (a[1] + (b[1] - a[1]) * n + J()).toFixed(1);
            }
        }
        return d + (c ? "Z" : ""); }
    function C(x, y, r) { var p = [], i; for (i = 0; i < 14; i++)
            p.push([x + Math.cos(i / 14 * 6.283) * r, y + Math.sin(i / 14 * 6.283) * r]); return P(p, 1);
    }
    function S(d, f, o) { return '<path d="' + d + '" fill="' + (f || "none") + '" ' + (o || "") + '/>';
    }
    function F(d, col, t) {
        return S(d, col, 'transform="translate(' + t + ')" opacity=".65" stroke="none"');
    }
    function W(s) { return '<g stroke="#30251F" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">' + s + '</g>';
    }
    var wl = [[34, 78], [34, 128], [112, 128], [112, 78]], rf = [[26, 80], [73, 38], [120, 80]];
    $("d1").innerHTML = F(P(wl, 1), "#C58A42", "-4 5") + F(P(rf, 1), "#A94F36", "6 -3") + W(S(P(wl, 1)) + S(P(rf, 1)) + S(P([[62, 128], [62, 102], [82, 102], [82, 128]])) + S(P([[44, 92], [44, 108], [56, 108], [56, 92]], 1)));
    $("d2").innerHTML = F(C(75, 84, 40), "#C58A42", "5 4") + W(S(C(75, 84, 40)) + S(P([[42, 62], [44, 28], [64, 48]])) + S(P([[108, 62], [106, 28], [86, 48]])) + S(C(62, 78, 2.5), "#30251F") + S(C(88, 78, 2.5), "#30251F") + S(P([[66, 94], [75, 101], [84, 94]])) + S(P([[30, 86], [52, 90]])) + S(P([[120, 86], [98, 90]])));
    $("d3").innerHTML = F(C(75, 34, 16), "#BD8170", "4 3") + W(S(C(75, 34, 16)) + S(P([[75, 50], [75, 102]])) + S(P([[75, 64], [42, 86]])) + S(P([[75, 64], [108, 52]])) + S(C(118, 46, 17)) + S(P([[75, 102], [56, 138]])) + S(P([[75, 102], [98, 130]])) + S(P([[68, 38], [75, 42], [82, 38]])));
    $("d4").innerHTML = F(C(75, 75, 24), "#f2bf12", "4 4") + W(S(C(75, 75, 24)) + [0, 1, 2, 3, 4, 5, 6, 7].map(function (i) { var a = i / 8 * 6.283;
        return S(P([[75 + Math.cos(a) * 32, 75 + Math.sin(a) * 32], [75 + Math.cos(a) * 50, 75 + Math.sin(a) * 50]]));
    }).join("") + S(C(67, 72, 2), "#30251F") + S(C(83, 72, 2), "#30251F") + S(P([[62, 64], [71, 68]])) + S(P([[88, 64], [79, 68]])) + S(P([[68, 88], [75, 84], [82, 88]])));
  // retro counter, not real
  var n = String(Math.floor(1000 + Math.random() * 98000)); while (n.length < 6)
    n = "0" + n;
  $("rct").textContent = n;
  $("rlu").textContent = new Date().toLocaleDateString("en-GB");
})(); (function () {
  var c = document.getElementById("wclk"); if (!c) return; var days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"], hold = 0, cur = null, to,
    PUFF = ["*puff*", "*pfff*", "*huff*", "*whoosh*", "*phew*", "*hhhhh*"],
    BLOW = ["blew on it. just in case", "tradition. it never works", "dust: handled", "for luck", "just clearing the dust", "it works. (it doesn’t)", "blowing. old habits", "can’t hurt, can it"];
  function tick() {
    if (hold) return;
    var d = new Date(), h = d.getHours(), m = d.getMinutes(); c.children[0].textContent = (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m;
    c.children[1].textContent = days[d.getDay()] + " " + d.getDate() + "/" + (d.getMonth() + 1);
  }
  // pull a cart out of the foam. click again to put it back (and blow on it first)
  function put(x, why) { x.classList.remove("out"); x.parentNode.classList.remove("up"); x.setAttribute("aria-pressed", "false"); if (cur === x) cur = null; hold = 0; clearTimeout(to); if (why) { hold = 1; c.children[0].textContent = nextLine(PUFF); c.children[1].textContent = nextLine(BLOW); to = setTimeout(function () { hold = 0; tick(); }, 2200); } else tick(); }
  var all = document.querySelectorAll(".wii .wch.full");
  for (var i = 0; i < all.length; i++) (function (x) {
    var nm = x.querySelector("b"), pf = x.querySelector("small"); x.tabIndex = 0; x.setAttribute("role", "button"); x.setAttribute("aria-pressed", "false"); x.setAttribute("aria-label", "Pull out " + (nm ? nm.textContent : "game"));
    function go() {
      if (x.classList.contains("out")) return put(x, 1);
      if (cur) put(cur); cur = x; x.classList.add("out"); x.parentNode.classList.add("up"); x.setAttribute("aria-pressed", "true");
      hold = 1; clearTimeout(to); c.children[0].textContent = (nm ? nm.textContent : "???").toUpperCase(); c.children[1].textContent = pf ? pf.textContent : "loaded. press start";
    }
    x.addEventListener("click", go); x.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
  })(all[i]);
  tick(); setInterval(tick, 15000);
})();
(function () {
  var b = document.getElementById("sb"), n = 0, t, locked = 0;
  var P = ["touché.", "ok, lucky.", "rude.", "i was not ready.", "hm. fair.", "oh come on.", "ow. nice one.", "i blinked.", "that was my good side.", "is that even legal.", "right, i'm paying attention now.", "you've done this before.", "i'm rattled. (i'm fine.)", "sneaky."], o = [];
  var F = ["that's the match. i'm going to go break another sword.", "that's the match. i demand a rematch. (i don't.)", "that's the match. i'll be in the corner.", "that's the match. my pride is in pieces. so is my sword."];
  if (!b) return;
  function deal() { o = P.slice().sort(function () { return Math.random() - 0.5; }); }
  deal();
  function reset() { n = 0; locked = 0; deal(); b.className = "bt b"; b.textContent = "en garde?"; }
  b.addEventListener("click", function () {
    if (locked) return;
    clearTimeout(t);
    n++;
    b.className = "bt b"; void b.offsetWidth; b.className = "bt b hit";
    b.textContent = n < 5 ? o[n - 1] + " " + n + "–0" : "5–0. " + nextLine(F);
    if (n >= 5) locked = 1;
    t = setTimeout(reset, n >= 5 ? 4000 : 6000);
  });
})();

// ---- extra bits: needy tab, konami sword, name pokes, lamp bubble, scroll counter, cookie banner, guestbook ----
(function () {
  var RM = matchMedia("(prefers-reduced-motion:reduce)").matches;
  function $(i) { return document.getElementById(i); }

  // needy tab title (the typing animation checks window.tabMood and waits)
  var needy = ["come back 🥺", "ow, my tab", "hello?? anyone?", "i’m just sitting here", "did you forget me", "it’s very quiet in here", "i saved your seat", "psst. tab. psst.", "the lamp misses you", "just checking you’re ok", "i can hear you not looking", "…is it me?", "i’ll just stay here, then", "come baaack"], nk = 0, nt;
  var back = ["oh hi", "you’re back!", "oh. it’s you.", "there you are", "…hi", "i wasn’t waiting", "welcome back. i’m fine."];
  function whine() { document.title = needy[nk++ % needy.length]; }
  document.addEventListener("visibilitychange", function () {
    clearInterval(nt);
    window.tabMood = 1;
    if (document.hidden) { nk = 0; needy.sort(function () { return Math.random() - .5; }); whine(); nt = setInterval(whine, 2500); }
    else { document.title = nextLine(back); setTimeout(function () { window.tabMood = 0; }, 2200); }
  });

  // the email button gets nervous the first time you go near it
  var eb = $("eb"), nervous = 0;
  function jitter() {
    if (nervous) return;
    nervous = 1;
    eb.classList.add("nerv");
    eb.addEventListener("animationend", function () { eb.classList.remove("nerv"); }, { once: true });
  }
  eb.addEventListener("mouseenter", jitter);
  eb.addEventListener("focus", jitter);

  // poke the letters of the name
  var fx = ["spin", "fall", "squeak", "jump", "flip", "shake", "squeak", "grow", "fall"], ac;
  function squeak(hi) {
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      var o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime;
      o.type = "triangle";
      o.frequency.setValueAtTime(hi ? 900 : 600, t);
      o.frequency.exponentialRampToValueAtTime(hi ? 1500 : 1000, t + .12);
      g.gain.setValueAtTime(.0001, t);
      g.gain.exponentialRampToValueAtTime(.15, t + .02);
      g.gain.exponentialRampToValueAtTime(.0001, t + .18);
      o.connect(g); g.connect(ac.destination);
      o.start(t); o.stop(t + .2);
    } catch (e) { }
  }
  var letters = [].slice.call(document.querySelectorAll("h1 .lt"));
  letters.forEach(function (el, i) {
    el.addEventListener("click", function () {
      var f = fx[i % fx.length];
      if (f === "squeak") squeak(i > 4);
      if (RM) return;
      el.style.animation = "fx-" + f + " .8s ease";
      el.addEventListener("animationend", function () { el.style.animation = "none"; }, { once: true });
    });
  });

  // lamp talks back
  var lamp = $("lamp"), bub = $("bub"), bt;
  var DARKS = ["i can’t see my soldering", "ok that’s better. wait, where did my screwdriver go", "ahh. that’s better. dim and cosy.", "much better. now i can’t see anything, but better.", "finally. i was squinting so hard.", "dark mode. my natural habitat.", "thank you. my eyes were filing a complaint.", "oh good. i work better when it’s dim. (i don’t.)", "ok. now i can’t find my multimeter. but still."];
  var LIGHTS = ["ow, my eyes", "i can’t stand lights", "too bright. too bright. too bright.", "this is what the sun feels like, isn’t it", "i’m a lamp. i shouldn’t mind. i mind.", "my retinas. my poor retinas.", "who turned the light on. oh. it was you.", "i’m melting. a bit.", "can you tell me when it’s over?"];
  lamp.addEventListener("click", function () {
    var dark = document.documentElement.hasAttribute("data-lit");
    var msgs = dark ? DARKS : LIGHTS;
    bub.textContent = nextLine(msgs);
    bub.hidden = false;
    clearTimeout(bt);
    bt = setTimeout(function () { bub.hidden = true; }, 3000);
  });

  // konami code snaps a sword (and counts it)
  var code = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"], pos = 0;
  var blade = '<svg viewBox="0 0 320 40" width="320" height="40" aria-hidden="true"><path d="M70 14L316 19V21L70 26Z" fill="#d7dade" stroke="#30251F" stroke-width="2.5" stroke-linejoin="round"/><rect x="58" y="4" width="12" height="32" rx="3" fill="#C58A42" stroke="#30251F" stroke-width="2.5"/><rect x="14" y="16" width="44" height="8" rx="3" fill="#A94F36" stroke="#30251F" stroke-width="2.5"/><circle cx="12" cy="20" r="7" fill="#C58A42" stroke="#30251F" stroke-width="2.5"/></svg>';
  function snap() {
    var n = $("swb"), c = n ? parseInt(n.textContent, 10) + 1 : 0;
    if (n && !isNaN(c)) n.textContent = c;
    var d = document.createElement("div");
    d.className = "sw";
    d.setAttribute("role", "status");
    d.innerHTML = '<div class="box"><div class="hf h1">' + blade + '</div><div class="hf h2">' + blade + '</div></div><p>snap. swords broken: ' + (n ? n.textContent : "too many") + '</p>';
    document.body.appendChild(d);
    setTimeout(function () { d.remove(); }, 3400);
  }
  document.addEventListener("keydown", function (e) {
    if (e.target.matches && e.target.matches("input,textarea")) return;
    var k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (k === code[pos]) { pos++; if (pos === code.length) { pos = 0; snap(); } }
    else pos = (k === code[0]) ? 1 : 0;
  });

  // how much of me have you scrolled through
  var scp = $("scp"), tick = 0;
  // one wording per bracket, chosen once per visit so it doesn't flicker while you scroll
  function one(l) { return l[Math.floor(Math.random() * l.length)]; }
  var s0 = one(["you’re 0% through my personality. hi. i’m shy", "you’re 0% through my personality. (it’s a short walk)", "you’re 0% through my personality. take your time", "you’re 0% through my personality. hello. don’t panic"]);
  var s25 = one([" (it gets weirder)", " (it does get weirder)", " (the weird bit’s coming)", " (still normal. ish)"]);
  var s60 = one([" (still here? brave)", " (you’re committed. i respect that)", " (the good bits are further down. maybe)", " (still here? hi)"]);
  var s90 = one([" (almost done. i’m getting nervous)", " (nearly the end. don’t look at me)", " (almost done. brace yourself)", " (nearly there. i’m sweating)"]);
  var s100 = one(["that’s all of me. please don’t make me talk about it", "that’s all of me. i need a minute", "that’s all of me. i’m going to lie down", "that’s all of me. thanks for reading. i’m blushing"]);
  function upd() {
    tick = 0;
    var max = document.documentElement.scrollHeight - innerHeight;
    var p = max > 0 ? Math.round(Math.min(1, Math.max(0, scrollY / max)) * 100) : 0;
    var t = "you’re " + p + "% through my personality";
    if (p >= 100) t = s100;
    else if (p >= 90) t += s90;
    else if (p >= 60) t += s60;
    else if (p >= 25) t += s25;
    else if (p < 3) t = s0;
    scp.textContent = t;
  }
  addEventListener("scroll", function () { if (!tick) { tick = 1; requestAnimationFrame(upd); } }, { passive: true });
  addEventListener("resize", upd);
  upd();

  // fake cookie banner (the site really does use no cookies)
  var ckb = $("ckb");
  setTimeout(function () { ckb.hidden = false; document.body.classList.add("hasck"); }, 1200);
  $("ckx").addEventListener("click", function () { ckb.hidden = true; document.body.classList.remove("hasck"); });

  // fake guestbook (nothing is sent anywhere)
  var gb = $("guestbook"), gf = $("gbf");
  $("gbl").addEventListener("click", function (e) {
    e.preventDefault();
    gb.hidden = !gb.hidden;
    if (!gb.hidden) gb.scrollIntoView({ behavior: RM ? "auto" : "smooth", block: "center" });
  });
  gf.addEventListener("submit", function (e) { e.preventDefault(); gf.hidden = true; $("gbt").hidden = false; });
})();

// ---- even more extra bits: typed words, lamp overload, lunge counter, cassette, cat, idle and a few clicky things ----
(function () {
  var RM = matchMedia("(prefers-reduced-motion:reduce)").matches, bub = document.getElementById("bub"), bt2;
  function $(i) { return document.getElementById(i); }
  // same bubble the lamp uses, just with its own timer
  function say(t, ms) {
    bub.textContent = t; bub.hidden = false;
    clearTimeout(bt2);
    bt2 = setTimeout(function () { bub.hidden = true; }, ms || 3600);
  }

  // type a word anywhere (not in the guestbook)
  var buf = "", lampEl = $("lamp");
  var W = {
    sudo: function () { say(nextLine(["jack is not in the sudoers file. this incident will be reported.", "permission denied. nice try.", "sudo: i'm a website. i have no root. i have vibes.", "this incident will be reported. (to nobody. i'm on my own here.)"])); },
    hello: function () { say(nextLine(["hi!! i'm shy. but hi.", "oh. hello. i wasn't ready.", "hello! don't mind the mess.", "hi. you typed that into a website. i love that."])); },
    "42": function () { say(nextLine(["the answer. i've forgotten the question.", "6 × 9. it's always 6 × 9.", "42. but what was the question? i've lost it.", "a towel would be useful right now."])); },
    qubit: function () {
      if (RM) return say("both light and dark until you look.");
      lampEl.click();
      setTimeout(function () { lampEl.click(); }, 450);
      setTimeout(function () { say(nextLine(["observed. it collapsed back to normal.", "measured. it was both. now it's neither. physics.", "looked at it. ruined it. classic."]), 4200); }, 1000);
    },
    leaf: function () {
      say(nextLine(["autumn mode. i apologise to the hoover.", "it's raining leaves. i didn't plan this.", "leaves!! somebody get a rake."]));
      if (RM) return;
      var f = document.createElement("div"), C = ["var(--hot)", "var(--sun)", "var(--pink)", "var(--mint)", "var(--blue)"];
      f.className = "lfx";
      for (var i = 0; i < 28; i++) {
        var d = document.createElement("div"), w = 24 + Math.random() * 26;
        d.className = "lf";
        d.style.cssText = "left:" + (Math.random() * 100).toFixed(1) + "%;width:" + w.toFixed(0) + "px;--dx:" + ((Math.random() * 200 - 100) | 0) + "px;--h:" + (innerHeight + 90) + "px;animation-duration:" + (4 + Math.random() * 4).toFixed(1) + "s;animation-delay:" + (Math.random() * 2).toFixed(1) + "s;animation-iteration-count:1;animation-fill-mode:both";
        d.innerHTML = '<svg viewBox="0 0 40 60" style="animation-duration:' + (3 + Math.random() * 3).toFixed(1) + 's"><path d="M20 58C6 46 2 28 20 3C38 28 34 46 20 58Z" fill="' + C[i % 5] + '" stroke="rgba(48,37,31,.6)" stroke-width="1.5" stroke-linejoin="round"/><path d="M20 58V10M20 44L9 34M20 44L31 34M20 32L11 22M20 32L29 22" fill="none" stroke="rgba(48,37,31,.55)" stroke-width="1.2" stroke-linecap="round"/></svg>';
        f.appendChild(d);
      }
      document.body.appendChild(f);
      setTimeout(function () { f.remove(); }, 11000);
    }
  };
  document.addEventListener("keydown", function (e) {
    if (e.target.matches && e.target.matches("input,textarea")) return;
    if (!e.key || e.key.length !== 1) return;
    buf = (buf + e.key.toLowerCase()).slice(-8);
    for (var w in W) if (buf.slice(-w.length) === w) { buf = ""; W[w](); break; }
  });

  // too many lamp clicks
  var lc = [];
  lampEl.addEventListener("click", function () {
    var n = Date.now();
    lc = lc.filter(function (t) { return n - t < 3500; });
    lc.push(n);
    if (lc.length >= 7) {
      lc = [];
      say(nextLine(["ok you've broken it. i only had the one lamp.", "ok that's enough clicking. it's a lamp, not a doorbell.", "please. be gentle. i'm old. (i'm new. i'm a lamp.)"]), 4200);
      if (!RM) lampEl.animate([{ transform: "rotate(0)" }, { transform: "rotate(-14deg)" }, { transform: "rotate(11deg)" }, { transform: "rotate(-6deg)" }, { transform: "rotate(0)" }], { duration: 500 });
    }
  });

  // ten lunges and something gives (uses the konami code, so it counts as a broken sword)
  var ln = 0, lt2;
  $("lg").addEventListener("click", function () {
    ln++; clearTimeout(lt2);
    lt2 = setTimeout(function () { ln = 0; }, 6000);
    if (ln >= 10) {
      ln = 0;
      "ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,b,a".split(",").forEach(function (k) {
        document.dispatchEvent(new KeyboardEvent("keydown", { key: k }));
      });
    }
  });

  // flip the cassette in the header
  var cas = document.querySelector(".cas"), cs = 0;
  if (cas) cas.addEventListener("click", function () {
    cs = !cs;
    var t = cas.querySelector("text");
    if (t) t.textContent = cs ? "side B" : "side A";
    if (!RM) cas.animate([{ transform: "rotate(7deg) rotateY(0)" }, { transform: "rotate(7deg) rotateY(360deg)" }], { duration: 600 });
    say(nextLine(cs ? ["flipped. side B is mostly hiss.", "side B. the experimental one. (it's hiss.)", "side B: unlabelled demos and a lot of tape noise."] : ["back to side A. the good one.", "side A. the safe one.", "back to normal. as normal as it gets."]));
  });

  // the doodles have opinions
  var Q = { d1: ["the door works. i checked twice.", "it has a chimney. it's fancy.", "it's a house. i'm very proud of the window."], d3: ["i tried to fix the hand. it got worse.", "the hand has a mind of its own.", "i drew that person in under a minute. you can tell."], d4: ["it's fine. everything's fine.", "the sun's worried. so am i.", "it has a lot on its mind. so do i."] }, ac2;
  Object.keys(Q).forEach(function (id) {
    var e = $(id);
    if (e) e.addEventListener("click", function () { say(nextLine(Q[id])); });
  });
  var cat = $("d2");
  if (cat) cat.addEventListener("click", function () {
    try {
      ac2 = ac2 || new (window.AudioContext || window.webkitAudioContext)();
      var o = ac2.createOscillator(), g = ac2.createGain(), t = ac2.currentTime;
      o.type = "triangle";
      o.frequency.setValueAtTime(520, t);
      o.frequency.linearRampToValueAtTime(900, t + .15);
      o.frequency.linearRampToValueAtTime(420, t + .5);
      g.gain.setValueAtTime(.0001, t);
      g.gain.exponentialRampToValueAtTime(.12, t + .05);
      g.gain.exponentialRampToValueAtTime(.0001, t + .55);
      o.connect(g); g.connect(ac2.destination);
      o.start(t); o.stop(t + .6);
    } catch (e) { }
    say(nextLine(["meow. (allegedly)", "mrrp.", "that's not what cats sound like. but ok.", "it's definitely a cat. i drew the ears."]));
  });

  // the struck-out word
  var oo = document.querySelector(".oops"), on = 0;
  if (oo) oo.addEventListener("click", function () {
    on++;
    say(nextLine(["i said sleeping. i meant it.", "ok fine, a bit of both.", "productivity: struck through.", "i was working. briefly.", "it's a lifestyle choice.", "working is a strong word."]));
  });

  // the fake visitor counter
  var rc = $("rct"), rn = 0, ro = rc ? rc.textContent : "";
  if (rc) rc.addEventListener("click", function () {
    rn++;
    if (rn === 3) { rc.textContent = "1000000"; say("you are visitor number 1,000,000!!! you win nothing. well done."); }
    else if (rn === 6) { rc.textContent = "000001"; say("you were the only visitor all along. hi."); }
    else if (rn === 9) { rc.textContent = ro; rn = 0; say("counter reset. it was never real."); }
  });

  // right click, once
  var rcd = 0;
  document.addEventListener("contextmenu", function () {
    if (rcd) return;
    rcd = 1;
    say("right-click all you like. it's all view-source anyway. messy, i know.", 4500);
  });

})();
