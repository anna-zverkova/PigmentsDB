// tina/config.ts
import { defineConfig, LocalAuthProvider } from "tinacms";

// content/brands.json
var brands_default = {
  title: "Watercolors by Brand",
  intro: "TintMap brings together pigment codes, performance notes, and brand libraries so you can compare watercolors in one place. Browse paints by pigment code or by brand, then dive into swatches and technical details.",
  items: [
    {
      id: "art-spectrum",
      name: "Art Spectrum",
      logo: "AS",
      description: "",
      website: "#"
    },
    {
      id: "blick",
      name: "Blick Own Brand",
      logo: "B",
      description: "",
      website: "#"
    },
    {
      id: "blockx",
      name: "Blockx",
      logo: "Bx",
      description: "",
      website: "#"
    },
    {
      id: "cass-art",
      name: "Cass Arts Own Brand",
      logo: "CA",
      description: "",
      website: "#"
    },
    {
      id: "da-vinci",
      name: "Da Vinci Paints",
      logo: "DV",
      description: "",
      website: "#"
    },
    {
      id: "daler-rowney-prof",
      name: "Daler Rowney Professional",
      logo: "DRP",
      description: "",
      website: "#"
    },
    {
      id: "daler-rowney-aqua",
      name: "Daler Rowney Aquafine",
      logo: "DRA",
      description: "Daler Rowney Aquafine is the student\u2011grade watercolor line from the UK brand, designed for learning and everyday practice.",
      website: "#",
      status: "Student"
    },
    {
      id: "ds",
      name: "Daniel Smith",
      logo: "DS",
      description: "",
      website: "#",
      status: "Professional"
    },
    {
      id: "grumbacher-finest",
      name: "Grumbacher Finest",
      logo: "GF",
      description: "",
      website: "#"
    },
    {
      id: "grumbacher-academy",
      name: "Grumbacher Academy",
      logo: "GA",
      description: "",
      website: "#"
    },
    {
      id: "holbein",
      name: "Holbein",
      logo: "H",
      description: "",
      website: "#",
      status: "Professional"
    },
    {
      id: "isaro",
      name: "Isaro",
      logo: "I",
      description: "",
      website: "#"
    },
    {
      id: "jacksons",
      name: "Jackson's Own Brand",
      logo: "J",
      description: "",
      website: "#"
    },
    {
      id: "ken-bromley",
      name: "Ken Bromley Own Brand",
      logo: "KB",
      description: "",
      website: "#"
    },
    {
      id: "kusakabe",
      name: "Kusakabe",
      logo: "K",
      description: "",
      website: "#"
    },
    {
      id: "lukas",
      name: "Lukas Aquarell",
      logo: "L",
      description: "",
      website: "#"
    },
    {
      id: "lutea",
      name: "Lutea",
      logo: "Lu",
      description: "",
      website: "#"
    },
    {
      id: "m-graham",
      name: "M. Graham",
      logo: "MG",
      description: "",
      website: "#"
    },
    {
      id: "maimeriblu",
      name: "MaimeriBlu",
      logo: "M",
      description: "MaimeriBlu is an Italian professional watercolor line known for strong pigments and a traditional European palette.",
      website: "#",
      status: "Professional"
    },
    {
      id: "mijello",
      name: "Mijello Mission Gold",
      logo: "MMG",
      description: "Mijello Mission Gold is a professional Korean watercolor line known for vibrant, clean pigments and smooth handling.",
      website: "#",
      status: "Professional"
    },
    {
      id: "old-holland",
      name: "Old Holland",
      logo: "OH",
      description: "",
      website: "#"
    },
    {
      id: "qor",
      name: "QoR",
      logo: "Q",
      description: "",
      website: "#"
    },
    {
      id: "rembrandt",
      name: "Rembrandt",
      logo: "R",
      description: "",
      website: "#"
    },
    {
      id: "renesans-pans",
      name: "Renesans (Pans)",
      logo: "RP",
      description: "",
      website: "#"
    },
    {
      id: "renesans-tubes",
      name: "Renesans (Tubes)",
      logo: "RT",
      description: "",
      website: "#"
    },
    {
      id: "roman-szmal",
      name: "Roman Szmal",
      logo: "RS",
      description: "Roman Szmal is a Polish professional watercolor brand recognized for its rich granulating and landscape\u2011focused colors.",
      website: "#",
      status: "Professional"
    },
    {
      id: "schmincke",
      name: "Schmincke",
      logo: "S",
      description: "",
      website: "#",
      status: "Professional"
    },
    {
      id: "sennelier",
      name: "Sennelier",
      logo: "Se",
      description: "",
      website: "#"
    },
    {
      id: "shinhan-pro",
      name: "ShinHan Pro (Students)",
      logo: "SP",
      description: "ShinHan Pro is a student\u2011grade watercolor range from South Korea, offering a broad palette at an accessible price point for learners and everyday practice.",
      website: "#",
      status: "Student"
    },
    {
      id: "shinhan-pwc",
      name: "ShinHan PWC (Artist's)",
      logo: "PWC",
      description: "ShinHan PWC (Professional Water Colour) is the artist\u2011grade line from South Korea, known for strong pigment strength and a wide, traditional palette.",
      website: "#",
      status: "Professional"
    },
    {
      id: "turner",
      name: "Turner",
      logo: "T",
      description: "",
      website: "#"
    },
    {
      id: "utrecht",
      name: "Utrecht",
      logo: "U",
      description: "",
      website: "#"
    },
    {
      id: "van-gogh",
      name: "Van Gogh",
      logo: "VG",
      description: "Van Gogh is a student\u2011grade line by Royal Talens, offering reliable, affordable watercolors for learning and practice.",
      website: "#",
      status: "Student"
    },
    {
      id: "white-nights",
      name: "White Nights",
      logo: "WN",
      description: "",
      website: "#",
      status: "Professional"
    },
    {
      id: "wn-cotman",
      name: "Winsor & Newton Cotman",
      logo: "WNC",
      description: "",
      website: "#",
      status: "Student"
    },
    {
      id: "wn",
      name: "Winsor & Newton Professional",
      logo: "WNP",
      description: "",
      website: "#",
      status: "Professional"
    },
    {
      id: "prima",
      name: "Prima Marketing",
      logo: "PM",
      description: "",
      website: "#"
    },
    {
      id: "della-magna-watercolors",
      name: "Della Magna Watercolors",
      logo: "DMW",
      website: "https://en.dellamagna.com",
      status: "Professional"
    }
  ]
};

// tina/config.ts
var brandNameById = new Map(
  brands_default.items.map(
    (b) => [b.id, b.name]
  )
);
var config_default = defineConfig({
  // Route CMS GraphQL through the Vite dev server so the admin can reach it
  // even when direct access to port 4001 is blocked.
  contentApiUrlOverride: "/api/tina/gql",
  // Local-only auth to avoid Tina Cloud client ID requirement in dev.
  authProvider: new LocalAuthProvider(),
  client: { skip: true },
  branch: process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || "main",
  clientId: process.env.TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",
  build: {
    publicFolder: "public",
    outputFolder: "admin"
  },
  media: {
    tina: {
      publicFolder: "public",
      mediaRoot: "uploads"
    }
  },
  schema: {
    collections: [
      {
        name: "home",
        label: "Home",
        path: "content",
        format: "json",
        match: {
          include: "home"
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
                label: "Badge"
              },
              {
                type: "string",
                name: "titleLead",
                label: "Title Lead"
              },
              {
                type: "string",
                name: "titleAccent",
                label: "Title Accent"
              },
              {
                type: "string",
                name: "subtitle",
                label: "Subtitle",
                ui: {
                  component: "textarea"
                }
              }
            ]
          },
          {
            type: "object",
            name: "cta",
            label: "CTA",
            fields: [
              {
                type: "string",
                name: "primaryText",
                label: "Primary Text"
              },
              {
                type: "string",
                name: "primaryHref",
                label: "Primary Link"
              },
              {
                type: "string",
                name: "secondaryText",
                label: "Secondary Text"
              },
              {
                type: "string",
                name: "secondaryHref",
                label: "Secondary Link"
              }
            ]
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
                label: "Title"
              },
              {
                type: "string",
                name: "description",
                label: "Description",
                ui: {
                  component: "textarea"
                }
              },
              {
                type: "string",
                name: "ctaText",
                label: "CTA Text"
              },
              {
                type: "string",
                name: "href",
                label: "Link"
              }
            ]
          },
          {
            type: "object",
            name: "featured",
            label: "Featured Section",
            fields: [
              {
                type: "string",
                name: "title",
                label: "Title"
              },
              {
                type: "string",
                name: "subtitle",
                label: "Subtitle",
                ui: {
                  component: "textarea"
                }
              }
            ]
          }
        ]
      },
      {
        name: "brands",
        label: "Brands",
        path: "content",
        format: "json",
        match: {
          include: "brands"
        },
        ui: {
          allowedActions: {
            create: false,
            delete: false
          }
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title"
          },
          {
            type: "string",
            name: "intro",
            label: "Intro",
            ui: {
              component: "textarea"
            }
          },
          {
            type: "object",
            name: "items",
            label: "Brands",
            list: true,
            ui: {
              itemProps: (item) => ({
                label: item?.name || "Brand Item"
              })
            },
            fields: [
              {
                type: "string",
                name: "id",
                label: "ID"
              },
              {
                type: "string",
                name: "name",
                label: "Name"
              },
              {
                type: "string",
                name: "logo",
                label: "Logo"
              },
              {
                type: "string",
                name: "description",
                label: "Description"
              },
              {
                type: "string",
                name: "website",
                label: "Website"
              },
              {
                type: "string",
                name: "country",
                label: "Country"
              },
              {
                type: "string",
                name: "status",
                label: "Status",
                options: ["Professional", "Student"]
              }
            ]
          }
        ]
      },
      {
        name: "pigments",
        label: "Pigments",
        path: "content",
        format: "json",
        match: {
          include: "pigments"
        },
        ui: {
          allowedActions: {
            create: false,
            delete: false
          }
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title"
          },
          {
            type: "string",
            name: "intro",
            label: "Intro",
            ui: {
              component: "textarea"
            }
          },
          {
            type: "object",
            name: "items",
            label: "Pigments",
            list: true,
            ui: {
              itemProps: (item) => ({
                label: item?.code || "Pigment Item"
              })
            },
            fields: [
              {
                type: "string",
                name: "code",
                label: "Code"
              },
              {
                type: "string",
                name: "name",
                label: "Name"
              },
              {
                type: "string",
                name: "family",
                label: "Family"
              },
              {
                type: "string",
                name: "description",
                label: "Description"
              },
              {
                type: "string",
                name: "toxicity",
                label: "Toxicity"
              }
            ]
          }
        ]
      },
      {
        name: "paints",
        label: "Paints",
        path: "content",
        format: "json",
        match: {
          include: "paints"
        },
        ui: {
          allowedActions: {
            create: false,
            delete: false
          }
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title"
          },
          {
            type: "string",
            name: "intro",
            label: "Intro",
            ui: {
              component: "textarea"
            }
          },
          {
            type: "object",
            name: "items",
            label: "Paints",
            list: true,
            ui: {
              itemProps: (item) => {
                const brandName = item?.brandId ? brandNameById.get(item.brandId) || item.brandId : "Unknown Brand";
                const number = item?.paintNumber ? ` #${item.paintNumber}` : "";
                const name = item?.name ? ` \u2014 ${item.name}` : "";
                return {
                  label: `${brandName}${name}${number}`.trim()
                };
              }
            },
            fields: [
              {
                type: "string",
                name: "id",
                label: "ID"
              },
              {
                type: "string",
                name: "brandId",
                label: "Brand ID"
              },
              {
                type: "string",
                name: "name",
                label: "Name"
              },
              {
                type: "string",
                name: "pigmentCodes",
                label: "Pigment Codes",
                list: true
              },
              {
                type: "string",
                name: "hue",
                label: "Hue"
              },
              {
                type: "string",
                name: "hex",
                label: "Hex"
              },
              {
                type: "string",
                name: "transparency",
                label: "Transparency"
              },
              {
                type: "string",
                name: "staining",
                label: "Staining"
              },
              {
                type: "string",
                name: "granulation",
                label: "Granulation"
              },
              {
                type: "string",
                name: "lightfastness",
                label: "Lightfastness"
              },
              {
                type: "boolean",
                name: "isVegan",
                label: "Vegan"
              },
              {
                type: "boolean",
                name: "isDiscontinued",
                label: "Discontinued"
              },
              {
                type: "string",
                name: "series",
                label: "Series"
              },
              {
                type: "string",
                name: "paintNumber",
                label: "Paint Number"
              },
              {
                type: "string",
                name: "swatchImage",
                label: "Swatch Image"
              },
              {
                type: "string",
                name: "stainingVsLifting",
                label: "Staining vs Lifting"
              },
              {
                type: "string",
                name: "flow",
                label: "Flow"
              },
              {
                type: "string",
                name: "tintingStrength",
                label: "Tinting Strength"
              },
              {
                type: "string",
                name: "performance",
                label: "Performance"
              },
              {
                type: "string",
                name: "toxicity",
                label: "Toxicity"
              },
              {
                type: "string",
                name: "collection",
                label: "Collection"
              }
            ]
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
