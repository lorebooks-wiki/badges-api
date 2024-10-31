import { Bool, OpenAPIRoute } from "chanfana";
import { Context } from "hono";
import { z } from "zod";

export class ping extends OpenAPIRoute {
  override schema = {
    description: "Pings the server if still up.",
    tags: ["meta"],
    responses: {
      "200": {
        description: "Everything seems to be up",
        content: {
          "application/json": {
            schema: z.object({
              ok: Bool({ default: true }).default(true),
            }),
          },
        },
      },
    },
  };

  override handle(c: Context) {
    return c.json({
      ok: true,
      result: "Everything is up",
    });
  }
}
