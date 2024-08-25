import { Hono } from "hono"
import { cors } from "hono/cors";
import {fromHono} from "chanfana"
import { makeBadge, ValidationError } from "badge-maker";
import { config } from "./lib/config.ts";
import { servers, tags } from "./lib/metadata.ts";
import { generateSvg } from "./api/badges.ts";
import { ping } from "./api/meta.ts";

const app = new Hono()
app.use(cors());
const openapi = fromHono(app, {
  schema: {
    info: {
      version: "0.1.0",
      title: "Badges API for lorebooks.wiki",
      termsOfService:
        "https://github.com/lorebooks-wiki/badges-api/blob/main/docs/api-terms.md",
      license: {
        name: "AGPL-3.0",
        url: "https://github.com/andreijiroh-dev/api-servers/raw/main/LICENSE",
      },
    },
    servers,
    tags,
  },
  docs_url: "/docs",
});
openapi.get("/badges/:project/:badgeName", generateSvg)
openapi.get("/ping", ping)

app.get('/', (c) => {
  return c.redirect(config.homepage)
})

Deno.serve({ port: config.port }, app.fetch)
