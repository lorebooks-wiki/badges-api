export const config = {
  port: Number(Deno.env.get("PORT")) || 8080,
  homepage: Deno.env.get("BADGES_API_HOMEPAGE") || "https://github.com/lorebooks-wiki/badges-api",
  kvUrl: Deno.env.get("DENO_KV_URL")
};