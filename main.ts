import { Context, Hono, Next } from "hono";
import { cors } from "hono/cors";
import { fromHono } from "chanfana";
import { config } from "./lib/config.ts";
import { contact, description, servers, tags } from "./lib/metadata.ts";
import { generateSvg, hcbBalanceOps, hcbDonateButton, hcbTotalRasied } from "./api/badges.ts";
import { ping } from "./api/meta.ts";
import { cache } from "hono/cache";
import { grantAdminAccess, testGitHubAuth } from "./api/admin.ts";
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

function edgeCache(cacheName: string, cacheControl: string) {
  return cache({
    cacheName,
    cacheControl,
    wait: true,
  });
}

// Usage in main.ts  
if (Deno.env.get("DENO_DEPLOYMENT_ID") && Deno.env.get("DENO_REGION") || config.flags.edgeCache == true) {
  console.log("enabling edge cache");
  app.get("/hcb/*", edgeCache(config.cacheNamespace, "max-age=300"));
  app.get("/badges/*", edgeCache(config.cacheNamespace, "max-age=300"));
}

const openapi = fromHono(app, {
  schema: {
    info: {
      version: "0.1.0",
      title: "Community Lorebooks Badges API",
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
openapi.get("/hcb/total-raised", hcbTotalRasied)
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
openapi.put("/admin/users", grantAdminAccess)

app.use("/admin/*", bearerAuth({
  verifyToken: async (token: string, c: Context) => {
    const forceCheckPerms = Boolean(c.req.query("force")) || false
    if (c.req.path == "/admin/auth-test") {
      return true // skip validating the token on auth-test endpoint
    } else {
      return await handleGitHubAuth(token, true, forceCheckPerms)
    }
  }
}))

app.on(['POST', 'PUT', 'PATCH', 'DELETE'], "/badges/*", bearerAuth({
  verifyToken: async (token: string, c: Context) => {
    const forceCheckPerms = Boolean(c.req.query("force")) || false
    if (c.req.path == "/admin/auth-test") {
      return true
    } else {
      return await handleGitHubAuth(token, false, forceCheckPerms)
    }
  },

}))

app.get("/", (c: Context) => {
  return c.redirect(config.homepage);
});

app.get("/hcb/balances", (c: Context) => {
  const baseOps = new URL(c.req.url)

  return c.redirect(`/hcb/balance${baseOps.search ?? ''}`)
})

Deno.serve({ port: config.port }, app.fetch);
