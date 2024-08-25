import { Bool, OpenAPIRoute, Str } from "chanfana";
import { Context } from "hono";
import { z } from "zod";
import { getBadgeData } from "../lib/db.ts";

export class generateSvg extends OpenAPIRoute {
  schema = {
    tags: ["badges"],
    summary: "Generate a SVG image of a badge.",
    request: {
      params: z.object({
        project: Str({required: true, description: "project name"}),
        badgeName: Str({required: true, description: "badge name"})
      })
    },
    responses: {
      200: {
        description: "Either returns a JSON API response or a SVG/redirect.",
        content: {
          "application/json": {
            schema: z.object({
              ok: Bool(),
              type: Str(),
              versionStamp: Str()
            })
          },
          "image/svg": {
            schema: {
              type: "string"
            }
          }
        }
      }
    }
  };

  async handle(c: Context) {
    const data = await this.getValidatedData<typeof this.schema>();
    const acceptCT = c.req.header("Accept")
    const result = await getBadgeData(data.params.project, data.params.badgeName)

    if (acceptCT?.includes("application/json")) {
      return c.json(result)
    }
  }
}
