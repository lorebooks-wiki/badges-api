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
    authServiceToken: getValidatedGithubToken(),
    org: Deno.env.get("GITHUB_ORG") || "lorebooks-wiki",
    team_slug: Deno.env.get("GITHUB_TEAM_ADMINS") || "api-admins",
  },
  cacheNamespace: Deno.env.get("DENO_CACHE_NAMESPACE") ||
    `badges.api.lorebooks.wiki/prod`,
  flags: {
    edgeCache: Boolean(Deno.env.get("FF_DENO_EDGE_CACHE") || false),
  },
};

/**
 * Validate `GITHUB_TOKEN` env value if it is a GitHub PAT based on the token prefix.
 * @returns The PAT itself if valid, otherwise throws a error.
 */
export function getValidatedGithubToken(): string {
  const token = Deno.env.get("GITHUB_TOKEN");
  if (!token) {
    throw new Error("GITHUB_TOKEN is not set in the environment variables.");
  }
  if (!token.startsWith("ghp_") && !token.startsWith("gho_") && !token.startsWith("github_pat_")) {
    throw new Error("GITHUB_TOKEN has an invalid format.");
  }
  return token;
}
