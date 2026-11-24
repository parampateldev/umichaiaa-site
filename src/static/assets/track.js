// Privacy-friendly site stats: anonymous daily counters (page views, device type, Join clicks, gallery opens).
// No cookies, no IDs, no IP/user data. Respects Do Not Track. Totals are readable only by signed-in admins at /admin.
(function () {
  try {
    var h = location.hostname;
    if (h === "localhost" || h === "127.0.0.1" || /^\/admin/.test(location.pathname) || navigator.doNotTrack === "1") return;
    var P = "housegames-parampatel", K = "AIzaSyCIYSw-jdZAlp0WSoHeGTnAipcsgTI1dLI";
    var day = new Date().toLocaleDateString("en-CA", { timeZone: "America/Detroit" });
    var doc = "projects/" + P + "/databases/(default)/documents/aiaa_stats/" + day;
    function send(fields) {
      var ft = Object.keys(fields).map(function (f) { return { fieldPath: f, increment: { integerValue: String(fields[f]) } }; });
      fetch("https://firestore.googleapis.com/v1/projects/" + P + "/databases/(default)/documents:commit?key=" + K, {
        method: "POST", keepalive: true, headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ writes: [{ transform: { document: doc, fieldTransforms: ft } }] })
      }).catch(function () {});
    }
    var key = location.pathname.replace(/^\/|\.html$/g, "").replace(/\//g, "_") || "home";
    var seen = sessionStorage.getItem("aiaa_pv_" + key);
    if (!seen) {
      sessionStorage.setItem("aiaa_pv_" + key, "1");
      var f = { visits: 0 }; delete f.visits;
      f["pv_" + key] = 1;
      f[window.matchMedia("(max-width: 736px)").matches ? "dev_mobile" : "dev_desktop"] = 1;
      if (!sessionStorage.getItem("aiaa_visit")) { sessionStorage.setItem("aiaa_visit", "1"); f.visits = 1; }
      send(f);
    }
    document.addEventListener("click", function (e) {
      var t = e.target; if (!t || !t.closest) return;
      if (t.closest(".join-btn")) send({ click_join: 1 });
      else if (t.closest(".g-track img")) send({ click_gallery: 1 });
    });
  } catch (e) {}
})();
