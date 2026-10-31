import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemaTypes";
import config from "../sanity.config.json" with { type: "json" };

// Each of these is a single page: one document, no "create new" button.
const singletons = [
  { id: "siteSettings", title: "Site-wide settings (footer, social links)" },
  { id: "homePage", title: "Home page" },
  { id: "aboutPage", title: "About Us page (officers)" },
  { id: "eventsPage", title: "Events page" },
  { id: "contactPage", title: "Contact Us page" },
];

export default defineConfig({
  name: "umichaiaa",
  title: "Michigan AIAA website",
  projectId: config.projectId,
  dataset: config.dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Website")
          .items(singletons.map((s) => S.listItem().title(s.title).id(s.id).child(S.document().schemaType(s.id).documentId(s.id)))),
    }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({ schemaType }) => !singletons.some((s) => s.id === schemaType)),
  },
  document: {
    actions: (input, context) =>
      singletons.some((s) => s.id === context.schemaType) ? input.filter(({ action }) => !["unpublish", "delete", "duplicate"].includes(action)) : input,
  },
});
