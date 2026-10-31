import { defineType, defineField } from "sanity";

// Simple rich text: paragraphs with bold/italic and links. No headings or lists, to keep the design consistent.
const simpleText = (name, title, description) =>
  defineField({
    name, title, description, type: "array",
    of: [{ type: "block", styles: [{ title: "Normal", value: "normal" }], lists: [],
      marks: { decorators: [{ title: "Bold", value: "strong" }, { title: "Italic", value: "em" }],
        annotations: [{ name: "link", type: "object", title: "Link", fields: [{ name: "href", type: "url", title: "Web address" }] }] } }],
  });

const photo = (name, title, description) =>
  defineField({ name, title, description, type: "image", options: { hotspot: true } });

export const siteSettings = defineType({
  name: "siteSettings", title: "Site-wide settings", type: "document",
  fields: [
    defineField({ name: "email", title: "Club email address", type: "string", description: "Shown in the footer and used for the email link." }),
    defineField({ name: "footerName", title: "Name in the footer", type: "string", description: "Appears after the © year." }),
    defineField({ name: "footerLegal", title: "Footer small print", type: "text", rows: 3 }),
    defineField({ name: "facebookUrl", title: "Facebook link", type: "url" }),
    defineField({ name: "xUrl", title: "X (Twitter) link", type: "url" }),
    defineField({ name: "instagramUrl", title: "Instagram link", type: "url" }),
    defineField({ name: "joinLink", title: "Where the Join button goes", type: "string", description: "A page on this site such as /contact.html, or a full link to a sign-up form." }),
  ],
  preview: { prepare: () => ({ title: "Site-wide settings" }) },
});

export const homePage = defineType({
  name: "homePage", title: "Home page", type: "document",
  fields: [
    photo("heroImage", "Big photo at the top", "Use a wide, landscape photo (at least 2000 pixels across)."),
    defineField({ name: "heroTagline", title: "Text over the photo", type: "string" }),
    defineField({ name: "joinLabel", title: "Join button text", type: "string" }),
    defineField({ name: "aboutHeading", title: "First section heading", type: "string" }),
    simpleText("aboutIntro", "First section text", "Each paragraph you type is a separate paragraph on the page."),
    defineField({ name: "memberHeading", title: "Member section heading", type: "string" }),
    defineField({ name: "memberIntro", title: "Member section intro line", type: "string" }),
    defineField({
      name: "memberCards", title: "Member cards", type: "array", description: "The four boxes with photos. Drag to reorder.",
      of: [{
        type: "object", name: "memberCard", title: "Card",
        fields: [
          photo("image", "Photo"),
          defineField({ name: "imageAlt", title: "Photo description", type: "string", description: "Short description for people who can't see the photo." }),
          defineField({ name: "title", title: "Title", type: "string" }),
          defineField({ name: "subtitle", title: "Subheading", type: "string" }),
          defineField({ name: "body", title: "Description", type: "text", rows: 5 }),
        ],
        preview: { select: { title: "title", subtitle: "subtitle", media: "image" } },
      }],
    }),
    defineField({ name: "joinHeading", title: "'Interested in joining' heading", type: "string" }),
    defineField({ name: "joinSubheading", title: "'Interested in joining' subheading", type: "string" }),
    simpleText("joinText", "'Interested in joining' text"),
    defineField({ name: "followHeading", title: "'Follow us' heading", type: "string" }),
    defineField({ name: "followText", title: "'Follow us' text", type: "text", rows: 4 }),
  ],
  preview: { prepare: () => ({ title: "Home page" }) },
});

export const aboutPage = defineType({
  name: "aboutPage", title: "About Us page", type: "document",
  fields: [
    photo("heroImage", "Photo strip at the top"),
    simpleText("intro", "Intro text", "Each paragraph you type is a separate paragraph on the page."),
    defineField({ name: "officersHeading", title: "Officers heading", type: "string" }),
    defineField({
      name: "officers", title: "Officers", type: "array", description: "Add, remove or drag to reorder officers. Newest board goes here each year.",
      of: [{
        type: "object", name: "officer", title: "Officer",
        fields: [
          photo("photo", "Photo", "A portrait works best (taller than wide)."),
          defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
          defineField({ name: "role", title: "Position", type: "string", description: "For example: President" }),
          defineField({ name: "bio", title: "Short bio", type: "text", rows: 6 }),
        ],
        preview: { select: { title: "name", subtitle: "role", media: "photo" } },
      }],
    }),
    defineField({ name: "spotlightHeading", title: "Member spotlight heading", type: "string" }),
    photo("spotlightImage", "Member spotlight photo"),
    defineField({ name: "spotlightName", title: "Member spotlight name", type: "string" }),
    defineField({ name: "spotlightDate", title: "Member spotlight date", type: "string", description: "For example: January 2027" }),
    defineField({ name: "spotlightText", title: "Member spotlight text", type: "text", rows: 4, description: "Start a new line for a new paragraph." }),
  ],
  preview: { prepare: () => ({ title: "About Us page" }) },
});

export const eventsPage = defineType({
  name: "eventsPage", title: "Events page", type: "document",
  fields: [
    photo("heroImage", "Photo strip at the top"),
    defineField({ name: "socialHeading", title: "Social media heading", type: "string" }),
    defineField({ name: "calendarHeading", title: "Calendar heading", type: "string" }),
    defineField({ name: "calendarEmail", title: "Google Calendar address", type: "string", description: "The Google account that owns the calendar. The calendar must be set to public in Google Calendar." }),
    defineField({ name: "sheetUrl", title: "Events table link (Google Sheet)", type: "url", description: "In Google Sheets: File > Share > Publish to web > Embed, then paste the link here." }),
  ],
  preview: { prepare: () => ({ title: "Events page" }) },
});

export const contactPage = defineType({
  name: "contactPage", title: "Contact Us page", type: "document",
  fields: [
    photo("heroImage", "Photo strip at the top"),
    defineField({ name: "heading", title: "Heading", type: "string" }),
    simpleText("body", "Page text", "Press Enter for a new paragraph, Shift+Enter for a line break (good for addresses)."),
  ],
  preview: { prepare: () => ({ title: "Contact Us page" }) },
});
