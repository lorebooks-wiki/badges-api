import { Context, Hono, Next } from "hono";
import { cors } from "hono/cors";
import { fromHono } from "chanfana";
import { config } from "./lib/config.ts";
import { contact, description, servers, tags } from "./lib/metadata.ts";
import { generateSvg, hcbBalanceOps, hcbDonateButton } from "./api/badges.ts";
import { ping } from "./api/meta.ts";
import { cache } from "hono/cache";
import { testGitHubAuth } from "./api/admin.ts";
import { bearerAuth } from 'hono/bearer-auth';
import { handleGitHubAuth } from "./lib/githubAuth.ts";

const app = new Hono();
app.use(cors({
  origin: "*",
  allowMethods: [
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "OPTIONS"
  ],
  credentials: true,
  exposeHeaders: ["Content-Type", "Cache-Control"],
  allowHeaders: ["ETag", "Authorization", "X-GitHub-PAT"]
}));

if (
  Deno.env.get("DENO_DEPLOYMENT_ID") && Deno.env.get("DENO_REGION") ||
  config.flags.edgeCache == "true"
) {
  console.log("enabling edge cache");
  app.get(
    "/hcb/*",
    cache({
      cacheName: config.cacheNamespace,
      cacheControl: "max-age=300",
      wait: true,
    }),
  );
  app.get(
    "/badges/*",
    cache({
      cacheName: config.cacheNamespace,
      cacheControl: "max-age=300",
      wait: true,
    }),
  );
}

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
      description: "More docuemntation available in GitHub repository",
    },
  },
  docs_url: "/docs",
});

openapi.get("/hcb/balance", hcbBalanceOps);
openapi.get("/hcb/donate", hcbDonateButton);
openapi.get("/badges/:project/:badgeName", generateSvg);
openapi.get("/ping", ping);

// setup auth for admin api
openapi.registry.registerComponent(
  'securitySchemes',
  'BearerAuth',
  {
    type: "http",
    scheme: "bearer",
  },
)
openapi.get("/admin/auth-test", testGitHubAuth)

app.use("/admin/*", bearerAuth({
  verifyToken: async (token: string, c: Context) => {
    if (c.req.path == "/admin/auth-test") {
      return true
    } else {
      return await handleGitHubAuth(token, true)
    }
  }
}))

app.get("/", (c: Context) => {
  return c.redirect(config.homepage);
});

app.get("/hcb/balances", (c: Context) => {
  const baseOps = new URL(c.req.url)

  return c.redirect(`/hcb/balance${baseOps.search ?? ''}`)
})

Deno.serve({ port: config.port }, app.fetch);
