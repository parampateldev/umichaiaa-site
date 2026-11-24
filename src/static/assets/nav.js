// Site navigation: transparent over the hero, solid on scroll, hover dropdowns, full-screen mobile menu.
(function () {
  var d = document, h = d.getElementById("site-header");
  if (!h) return;
  var root = d.documentElement;
  // slide the bar in only on the first page of a visit (later pages keep it in place)
  try {
    if (!sessionStorage.getItem("sh-seen")) { h.classList.add("sh-intro"); sessionStorage.setItem("sh-seen", "1"); }
  } catch (e) {}
  var top = function () { h.classList.toggle("is-top", (window.scrollY || root.scrollTop) <= 10); };
  top(); window.addEventListener("scroll", top, { passive: true });
  window.addEventListener("load", function () { d.body.classList.remove("is-preload"); });

  var burger = h.querySelector(".sh-burger");
  function setOpen(open) {
    d.body.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  burger.addEventListener("click", function () { setOpen(!d.body.classList.contains("menu-open")); });
  d.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
  d.querySelectorAll(".sh-mobile a").forEach(function (a) { a.addEventListener("click", function () { setOpen(false); }); });
  d.querySelectorAll(".sh-acc-btn").forEach(function (b) {
    b.addEventListener("click", function () {
      var acc = b.parentNode, open = !acc.classList.contains("open");
      d.querySelectorAll(".sh-acc").forEach(function (x) { x.classList.remove("open"); x.firstElementChild.setAttribute("aria-expanded", "false"); });
      if (open) { acc.classList.add("open"); b.setAttribute("aria-expanded", "true"); }
    });
  });
  window.addEventListener("resize", function () { if (window.innerWidth > 980) setOpen(false); });
  window.addEventListener("pageshow", function () { setOpen(false); });
})();

// Photo gallery: arrow buttons scroll the side-scrolling strip by roughly one screen of photos.
(function () {
  var t = document.querySelector(".g-track");
  if (!t) return;
  function go(dir) { t.scrollBy({ left: dir * Math.max(300, t.clientWidth * 0.8), behavior: "smooth" }); }
  document.querySelector(".g-prev").addEventListener("click", function () { go(-1); });
  document.querySelector(".g-next").addEventListener("click", function () { go(1); });

  // Lightbox: click a photo to see it large; X, Esc, or the backdrop closes it; arrows / keys step through.
  var imgs = Array.prototype.slice.call(t.querySelectorAll("img")), cur = 0;
  var lb = document.createElement("div");
  lb.className = "lb"; lb.setAttribute("role", "dialog"); lb.setAttribute("aria-modal", "true"); lb.setAttribute("aria-label", "Photo viewer");
  lb.innerHTML = '<button type="button" class="lb-x" aria-label="Close photo">&times;</button><button type="button" class="lb-prev" aria-label="Previous photo">&#8249;</button><img alt=""><button type="button" class="lb-next" aria-label="Next photo">&#8250;</button>';
  document.body.appendChild(lb);
  var big = lb.querySelector("img");
  function show(i) { cur = (i + imgs.length) % imgs.length; big.src = imgs[cur].src; big.alt = imgs[cur].alt; }
  function open(i) { show(i); lb.classList.add("open"); document.body.style.overflow = "hidden"; lb.querySelector(".lb-x").focus(); }
  function close() { lb.classList.remove("open"); document.body.style.overflow = ""; }
  imgs.forEach(function (im, i) { im.addEventListener("click", function () { open(i); }); });
  lb.querySelector(".lb-x").addEventListener("click", close);
  lb.querySelector(".lb-prev").addEventListener("click", function (e) { e.stopPropagation(); show(cur - 1); });
  lb.querySelector(".lb-next").addEventListener("click", function (e) { e.stopPropagation(); show(cur + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close(); else if (e.key === "ArrowLeft") show(cur - 1); else if (e.key === "ArrowRight") show(cur + 1);
  });
})();
