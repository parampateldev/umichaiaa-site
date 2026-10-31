// Loads site content. Uses Sanity when sanity.config.json (or env vars) is present, and
// falls back per-field to src/_data/seed.json, so the site always builds.
const fs = require("fs");
const path = require("path");
const seed = require("../_data/seed.json");

let cache;

function sanityConfig() {
  const file = path.join(__dirname, "../../sanity.config.json");
  let cfg = {};
  if (fs.existsSync(file)) cfg = JSON.parse(fs.readFileSync(file, "utf8"));
  return {
    projectId: process.env.SANITY_PROJECT_ID || cfg.projectId,
    dataset: process.env.SANITY_DATASET || cfg.dataset || "production",
  };
}

const isEmpty = (v) => v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0);
function merge(base, over) {
  if (isEmpty(over)) return base;
  if (Array.isArray(over)) return over;
  if (typeof over === "object" && typeof base === "object" && !Array.isArray(base)) {
    const out = { ...base };
    for (const k of Object.keys(over)) out[k] = merge(base[k], over[k]);
    return out;
  }
  return over;
}

module.exports = async function load() {
  if (cache) return cache;
  const data = JSON.parse(JSON.stringify(seed));
  const { projectId, dataset } = sanityConfig();
  if (projectId) {
    try {
      const { createClient } = require("@sanity/client");
      const imageUrlBuilder = require("@sanity/image-url");
      const { toHTML } = require("@portabletext/to-html");
      const client = createClient({ projectId, dataset, apiVersion: "2024-01-01", useCdn: false });
      const builder = imageUrlBuilder({ projectId, dataset });
      const img = (i, w = 1600) => (i && i.asset ? builder.image(i).width(w).auto("format").url() : undefined);
      const blocks = (b, tag) =>
        b && b.length
          ? toHTML(b, { components: { block: { normal: ({ children }) => `<${tag}>${children}</${tag}>` } } })
          : undefined;
      const lines = (t) => (t ? String(t).split(/\n+/).map((s) => s.trim()).filter(Boolean) : undefined);
      const q = async (type) => client.fetch(`*[_type == $t][0]`, { t: type });
      const [site, home, about, contact, events] = await Promise.all(
        ["siteSettings", "homePage", "aboutPage", "contactPage", "eventsPage"].map(q)
      );
      const over = {
        site: site && {
          email: site.email, facebookUrl: site.facebookUrl, xUrl: site.xUrl, instagramUrl: site.instagramUrl,
          footerName: site.footerName, footerLegal: site.footerLegal, joinLink: site.joinLink,
        },
        home: home && {
          heroImage: img(home.heroImage, 2400), heroTagline: home.heroTagline, joinLabel: home.joinLabel,
          aboutHeading: home.aboutHeading, aboutIntroHtml: blocks(home.aboutIntro, "p"),
          memberHeading: home.memberHeading, memberIntro: home.memberIntro,
          memberCards: (home.memberCards || []).map((c) => ({
            image: img(c.image, 1200), imageAlt: c.imageAlt || c.title, title: c.title, subtitle: c.subtitle, body: c.body,
          })),
          joinHeading: home.joinHeading, joinSubheading: home.joinSubheading, joinTextHtml: blocks(home.joinText, "span"),
          followHeading: home.followHeading, followText: home.followText,
        },
        about: about && {
          heroImage: img(about.heroImage, 2400), introHtml: blocks(about.intro, "h4"), officersHeading: about.officersHeading,
          officers: (about.officers || []).map((o) => ({ photo: img(o.photo, 600), name: o.name, role: o.role, bio: o.bio })),
          spotlightHeading: about.spotlightHeading, spotlightName: about.spotlightName, spotlightDate: about.spotlightDate,
          spotlightText: lines(about.spotlightText), spotlightImage: img(about.spotlightImage, 800),
        },
        contact: contact && { heroImage: img(contact.heroImage, 2400), heading: contact.heading, bodyHtml: blocks(contact.body, "p") },
        events: events && {
          heroImage: img(events.heroImage, 2400), socialHeading: events.socialHeading, calendarHeading: events.calendarHeading,
          calendarEmail: events.calendarEmail, sheetUrl: events.sheetUrl,
        },
      };
      for (const k of Object.keys(over)) if (over[k]) data[k] = merge(data[k], JSON.parse(JSON.stringify(over[k])));
      console.log("[content] loaded from Sanity project", projectId);
    } catch (e) {
      console.warn("[content] Sanity unavailable, using seed content:", e.message);
    }
  } else {
    console.log("[content] no Sanity project configured, using seed content");
  }
  data.build = { stamp: Date.now().toString(36), year: new Date().getFullYear() };
  cache = data;
  return data;
};
