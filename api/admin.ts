import { Bool, OpenAPIRoute, Str } from "chanfana";
import { Context } from "hono";
import { z } from "zod";
import { handleGitHubAuth, hashToken } from "../lib/githubAuth.ts";
import { kv } from "../lib/db.ts";
import { config } from "../lib/config.ts";

export class testGitHubAuth extends OpenAPIRoute {
  override schema = {
    tags: ["admin"],
    summary: "Check if you are authenticated or not",
    description: "To avoid wasting GitHub API requests, we'll cache the API results on KV for 5 minutes. You can also use this endpoint to clear the cache by add `?force=1` URL parameter.",
    security: [
      {
        BearerAuth: [],
      },
    ],
  }

  override async handle(c: Context) {
    const authHeader = c.req.header("Authorization")
    const parsedAuthHeader = authHeader?.split(" ") || ["bearer", "null"];
    const tokHash = await hashToken(parsedAuthHeader[1]);
    const key = ["cachedGitHubTokenHash", tokHash];

    if (parsedAuthHeader[1] == "null") {
      return c.json({
        ok: false,
        error: "missing auth key"
      }, 418)
    }

    const result = await handleGitHubAuth(parsedAuthHeader[1], true)

    const dbMeta = await (await kv(config.kvUrl)).get(key)
    return c.json({
      ok: result,
      result: dbMeta
    })
  }
}