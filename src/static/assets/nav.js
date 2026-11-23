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
