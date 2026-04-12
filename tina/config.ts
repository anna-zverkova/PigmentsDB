import { defineConfig, LocalAuthProvider } from "tinacms";
import brandsContent from "../content/brands.json";
import paintsContent from "../content/paints.json";

const brandNameById = new Map(
  (brandsContent as { items: { id: string; name: string }[] }).items.map(
    (b) => [b.id, b.name]
  )
);
const paintNameById = new Map(
  (paintsContent as { items: { id: string; name: string }[] }).items.map(
    (p) => [p.id, p.name]
  )
);

export default defineConfig({
  // Route CMS GraphQL through the Vite dev server so the admin can reach it
  // even when direct access to port 4001 is blocked.
  contentApiUrlOverride: "/api/tina/gql",
  // Local-only auth to avoid Tina Cloud client ID requirement in dev.
  authProvider: new LocalAuthProvider(),
  client: { skip: true },
  branch:
    process.env.GITHUB_BRANCH ||
    process.env.VERCEL_GIT_COMMIT_REF ||
    process.env.HEAD ||
    "main",
  clientId: process.env.TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",
  build: {
    publicFolder: "public",
    outputFolder: "admin",
  },
  media: {
    tina: {
      publicFolder: "public",
      mediaRoot: "uploads",
    },
  },
  schema: {
    collections: [
      {
        name: "home",
        label: "Home",
        path: "content",
        format: "json",
        match: {
          include: "home",
        },
        fields: [
          {
            type: "object",
            name: "hero",
            label: "Hero",
            fields: [
              {
                type: "string",
                name: "badge",
                label: "Badge",
              },
              {
                type: "string",
                name: "titleLead",
                label: "Title Lead",
              },
              {
                type: "string",
                name: "titleAccent",
                label: "Title Accent",
              },
              {
                type: "string",
                name: "subtitle",
                label: "Subtitle",
                ui: {
                  component: "textarea",
                },
              },
            ],
          },
          {
            type: "object",
            name: "cta",
            label: "CTA",
            fields: [
              {
                type: "string",
                name: "primaryText",
                label: "Primary Text",
              },
              {
                type: "string",
                name: "primaryHref",
                label: "Primary Link",
              },
              {
                type: "string",
                name: "secondaryText",
                label: "Secondary Text",
              },
              {
                type: "string",
                name: "secondaryHref",
                label: "Secondary Link",
              },
            ],
          },
          {
            type: "object",
            name: "features",
            label: "Features",
            list: true,
            fields: [
              {
                type: "string",
                name: "title",
                label: "Title",
              },
              {
                type: "string",
                name: "description",
                label: "Description",
                ui: {
                  component: "textarea",
                },
              },
              {
                type: "string",
                name: "ctaText",
                label: "CTA Text",
              },
              {
                type: "string",
                name: "href",
                label: "Link",
              },
            ],
          },
          {
            type: "object",
            name: "featured",
            label: "Featured Section",
            fields: [
              {
                type: "string",
                name: "title",
                label: "Title",
              },
              {
                type: "string",
                name: "subtitle",
                label: "Subtitle",
                ui: {
                  component: "textarea",
                },
              },
              {
                type: "object",
                name: "items",
                label: "Featured Paints",
                list: true,
                ui: {
                  itemProps: (item) => {
                    const paintId = item?.paintId as string | undefined;
                    const paintName = paintId ? paintNameById.get(paintId) : null;
                    return {
                      label: paintName ? `${paintName} (${paintId})` : paintId || "Featured Paint",
                    };
                  },
                },
                fields: [
                  {
                    type: "string",
                    name: "paintId",
                    label: "Paint ID",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "info",
        label: "Info Pages",
        path: "content",
        format: "json",
        match: {
          include: "info",
        },
        fields: [
          {
            type: "object",
            name: "about",
            label: "About Page",
            fields: [
              {
                type: "string",
                name: "title",
                label: "Title",
              },
              {
                type: "rich-text",
                name: "bodyRich",
                label: "Body (Rich Text)",
              },
              {
                type: "string",
                name: "bodyMarkdown",
                label: "Body (Markdown Backup)",
                ui: {
                  component: "textarea",
                },
              },
            ],
          },
          {
            type: "object",
            name: "data",
            label: "Data Page",
            fields: [
              {
                type: "string",
                name: "title",
                label: "Title",
              },
              {
                type: "rich-text",
                name: "bodyRich",
                label: "Body (Rich Text)",
              },
              {
                type: "string",
                name: "bodyMarkdown",
                label: "Body (Markdown Backup)",
                ui: {
                  component: "textarea",
                },
              },
            ],
          },
          {
            type: "object",
            name: "contact",
            label: "Contact Page",
            fields: [
              {
                type: "string",
                name: "title",
                label: "Title",
              },
              {
                type: "rich-text",
                name: "bodyRich",
                label: "Body (Rich Text)",
              },
              {
                type: "string",
                name: "bodyMarkdown",
                label: "Body (Markdown Backup)",
                ui: {
                  component: "textarea",
                },
              },
            ],
          },
        ],
      },
      {
        name: "brands",
        label: "Brands",
        path: "content",
        format: "json",
        match: {
          include: "brands",
        },
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
          },
          {
            type: "string",
            name: "intro",
            label: "Intro",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "object",
            name: "items",
            label: "Brands",
            list: true,
            ui: {
              itemProps: (item) => ({
                label: item?.name || "Brand Item",
              }),
            },
            fields: [
              {
                type: "string",
                name: "id",
                label: "ID",
              },
              {
                type: "string",
                name: "name",
                label: "Name",
              },
              {
                type: "string",
                name: "logo",
                label: "Logo",
              },
              {
                type: "string",
                name: "description",
                label: "Description",
              },
              {
                type: "string",
                name: "website",
                label: "Website",
              },
              {
                type: "string",
                name: "country",
                label: "Country",
              },
              {
                type: "string",
                name: "status",
                label: "Status",
                options: ["Professional", "Student"],
              },
            ],
          },
        ],
      },
      {
        name: "pigments",
        label: "Pigments",
        path: "content",
        format: "json",
        match: {
          include: "pigments",
        },
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
          },
          {
            type: "string",
            name: "intro",
            label: "Intro",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "object",
            name: "items",
            label: "Pigments",
            list: true,
            ui: {
              itemProps: (item) => ({
                label: item?.code || "Pigment Item",
              }),
            },
            fields: [
              {
                type: "string",
                name: "code",
                label: "Code",
              },
              {
                type: "string",
                name: "name",
                label: "Name",
              },
              {
                type: "string",
                name: "family",
                label: "Family",
              },
              {
                type: "string",
                name: "description",
                label: "Description",
              },
              {
                type: "string",
                name: "toxicity",
                label: "Toxicity",
              },
            ],
          },
        ],
      },
      {
        name: "paints",
        label: "Paints",
        path: "content",
        format: "json",
        match: {
          include: "paints",
        },
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
          },
          {
            type: "string",
            name: "intro",
            label: "Intro",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "object",
            name: "items",
            label: "Paints",
            list: true,
            ui: {
              itemProps: (item) => {
                const brandName = item?.brandId
                  ? brandNameById.get(item.brandId) || item.brandId
                  : "Unknown Brand";
                const number = item?.paintNumber ? ` #${item.paintNumber}` : "";
                const name = item?.name ? ` — ${item.name}` : "";
                return {
                  label: `${brandName}${name}${number}`.trim(),
                };
              },
            },
            fields: [
              {
                type: "string",
                name: "id",
                label: "ID",
              },
              {
                type: "string",
                name: "brandId",
                label: "Brand ID",
              },
              {
                type: "string",
                name: "name",
                label: "Name",
              },
              {
                type: "string",
                name: "pigmentCodes",
                label: "Pigment Codes",
                list: true,
              },
              {
                type: "boolean",
                name: "isFeatured",
                label: "Featured on Home",
              },
              {
                type: "string",
                name: "hue",
                label: "Hue",
              },
              {
                type: "string",
                name: "hex",
                label: "Hex",
              },
              {
                type: "string",
                name: "transparency",
                label: "Transparency",
              },
              {
                type: "string",
                name: "staining",
                label: "Staining",
              },
              {
                type: "string",
                name: "granulation",
                label: "Granulation",
              },
              {
                type: "string",
                name: "lightfastness",
                label: "Lightfastness",
              },
              {
                type: "boolean",
                name: "isVegan",
                label: "Vegan",
              },
              {
                type: "boolean",
                name: "isDiscontinued",
                label: "Discontinued",
              },
              {
                type: "string",
                name: "series",
                label: "Series",
              },
              {
                type: "string",
                name: "paintNumber",
                label: "Paint Number",
              },
              {
                type: "string",
                name: "swatchImage",
                label: "Swatch Image",
              },
              {
                type: "string",
                name: "stainingVsLifting",
                label: "Staining vs Lifting",
              },
              {
                type: "string",
                name: "flow",
                label: "Flow",
              },
              {
                type: "string",
                name: "tintingStrength",
                label: "Tinting Strength",
              },
              {
                type: "string",
                name: "performance",
                label: "Performance",
              },
              {
                type: "string",
                name: "toxicity",
                label: "Toxicity",
              },
              {
                type: "string",
                name: "collection",
                label: "Collection",
              },
            ],
          },
        ],
      },
    ],
  },
});
