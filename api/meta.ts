import { Bool, OpenAPIRoute } from "chanfana";
import { Context } from "hono";
import { z } from "zod";

export class ping extends OpenAPIRoute {
  schema = {
    description: "Pings the server if still up.",
    responses: {
      "200": {
        description: "Everything seems to be up",
        content: {
          "application/json": {
            schema: z.object({
              ok: Bool({default: true}).default(true),
            }),
          },
        },
      },
    },
  };

  async handle(c: Context) {
    return c.json({
      ok: true,
      result: "Everything is up",
    });
  }
}
