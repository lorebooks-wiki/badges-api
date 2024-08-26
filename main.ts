import { Hono } from "hono"
import { cors } from "hono/cors";
import {fromHono} from "chanfana"
import { makeBadge, ValidationError } from "badge-maker";
import { config } from "./lib/config.ts";
import { servers, tags, description, contact } from "./lib/metadata.ts";
import { generateSvg } from "./api/badges.ts";
import { ping } from "./api/meta.ts";

const app = new Hono()
app.use(cors());
const openapi = fromHono(app, {
  schema: {
    info: {
      version: "0.1.0",
      title: "Badges API for lorebooks.wiki",
      description,
      termsOfService:
        "https://github.com/lorebooks-wiki/badges-api/blob/main/docs/api-terms.md",
      license: {
        name: "AGPL-3.0",
        url: "https://github.com/lorebooks-wiki/badges-api/blob/main/LICENSE",
      },
      contact,
    },
    servers,
    tags,
    externalDocs: {
      url: "https://github.com/lorebooks-wiki/badges-api/tree/main/docs",
      description: "More docuemntation available in GitHub repository"
    },
  },
  docs_url: "/docs",
});
openapi.get("/badges/:project/:badgeName", generateSvg)
openapi.get("/ping", ping)

app.get('/', (c) => {
  return c.redirect(config.homepage)
})

Deno.serve({ port: config.port }, app.fetch)
