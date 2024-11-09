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
    description: "To avoid wasting GitHub API requests, we'll cache the API results on KV for 5 minutes. You can also use this endpoint to clear the cache by add `?force=true` URL parameter.",
    security: [
      {
        BearerAuth: [],
      },
    ],
    request: {
      query: z.object({
        force: Bool({
          description: "Force checking permissions for authenticated user even if cached.",
          default: false,
          required: false
        })
      })
    }
  }

  override async handle(c: Context) {
    const { query } = await this.getValidatedData<typeof this.schema>();
    const authHeader = c.req.header("Authorization")
    const parsedAuthHeader = authHeader?.split(" ") || ["bearer", "null"];
    const tokHash = await hashToken(parsedAuthHeader[1]);
    const key = ["cachedGitHubTokenHash", tokHash];


    if (parsedAuthHeader[1] == "null") {
      return c.json({
        ok: false,
        error: {
          code: "MISSING_AUTH",
          message: "Authorization header is required"
        }
      }, 401)
    }

    const result = await handleGitHubAuth(parsedAuthHeader[1], true, query?.force ?? false)

    try {
      const dbMeta = await (await kv(config.kvUrl)).get(key)
      return c.json({
        ok: result,
        result: dbMeta ?? null
      })
    } catch (error) {
      console.error('KV store error:', error);
      return c.json({
        ok: result,
        result: null,
        error: {
          code: "KV_ERROR",
          message: "Failed to retrieve cached data"
        }
      }, 500)
    }
  }
}

export class grantAdminAccess extends OpenAPIRoute {
  override schema = {
    tags: ["admin"],
    summary: "Add a GitHub user to the API admins team",
    description: `\
Grant a GitHub user access to Badges API admin endpoints by adding them into [the API admins team](https://github.com/orgs/${config.github.org}/teams/${config.github.team_slug}).

If they are not yet in the \`${config.github.org}\` GitHub organization, they'll be needed to accept the organization invite first.`,
    request: {
      query: z.object({
        username: Str({
          description: "The GitHub user to grant admin permissions",
          required: true
        })
      })
    }
  }
}