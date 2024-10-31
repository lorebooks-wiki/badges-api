/**
 * @module
 * @description Configuration
 */
export const config = {
  port: Number(Deno.env.get("PORT")) || 8080,
  homepage: Deno.env.get("BADGES_API_HOMEPAGE") ||
    "https://github.com/lorebooks-wiki/badges-api",
  kvUrl: Deno.env.get("DENO_KV_URL"),
  github: {
    authServiceToken: Deno.env.get("GITHUB_TOKEN"),
    org: Deno.env.get("GITHUB_ORG") || "lorebooks-wiki",
    team_slug: Deno.env.get("GITHUB_TEAM_ADMINS") || "api-admins",
  },
  cacheNamespace: Deno.env.get("DENO_CACHE_NAMESPACE") ||
    "badges.api.lorebooks.wiki/prod",
  flags: {
    edgeCache: Deno.env.get("FF_DENO_EDGE_CACHE") || "false",
  },
};
