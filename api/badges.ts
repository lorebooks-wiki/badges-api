import { Bool, OpenAPIRoute, Str } from "chanfana";
import { Context } from "hono";
import { z } from "zod";
import { getBadgeData, resolveBadgeIcon } from "../lib/db.ts";
import { Format } from "../utils/types.ts";
import { makeBadge } from "badge-maker";

export class generateSvg extends OpenAPIRoute {
  schema = {
    tags: ["badges"],
    summary: "Generate a SVG badge based on stored badge data on Deno KV.",
    description: `\
By default without any query parameters, the server will fetch the data from Deno KV, builds a JSON object that that matches the \
JSON parameters for \`makeBadge\` function of the \`badge-maker\` npm library alongside getting the base64-encoded string of the
logo if defined, and returns a SVG badge.

This API endpoint supports a subset of [query parameters for shields.io Static Badges](https://shields.io/badges/static-badge), \
including \`logo\` (not \`logoBase64\` for abuse prevention) and \`style\`.
    `,
    request: {
      params: z.object({
        project: Str({ required: true, description: "project name" }),
        badgeName: Str({ required: true, description: "badge name" }),
      }),
      query: z.object({
        json: Bool({
          required: false,
          description: "Whether to force pull JSON data from KV or not",
        }),
        style: Str({
          description: "Badge style as supported by `badge-maker` npm library.",
          required: false,
          default: "flat",
        }),
      }),
    },
    responses: {
      200: {
        description:
          "Either returns a JSON API response, JSON data or a HTTP redirect.",
        content: {
          "application/json": {
            schema: z.object({
              ok: Bool(),
              type: Str(),
              versionStamp: Str(),
            }),
          },
          "image/svg+xml": {
            schema: {
              type: "string",
            },
          },
        },
      },
    },
  };

  async handle(c: Context) {
    const apiReqData = await this.getValidatedData<typeof this.schema>();
    const acceptCT = c.req.header("Accept");
    const dbData = await getBadgeData(
      apiReqData.params.project,
      apiReqData.params.badgeName
    );
    console.log(dbData);

    if (
      apiReqData.query.json == true ||
      acceptCT?.includes("application/json")
    ) {
      if (dbData.result == null && dbData.versionStamp == null) {
        return c.json(
          {
            ok: false,
            result: null,
            versionStamp: null,
            error: "project and badge name combination not found",
          },
          404
        );
      }
      return c.json(dbData);
    }

    if (dbData.result == null && dbData.versionStamp == null) {
      const Badge404 = makeBadge({
        label: "404",
        message: "not found",
        color: "red",
      });
      return c.newResponse(Badge404, 404, {
        "Content-Type": "image/svg+xml",
      });
    }

    const { type, data } = dbData.result;

    if (type == "redirect") {
      return c.redirect(data.redirectUrl);
    } else if (type == "badge") {
      const logoBase64 =
        data.logo != null ? await resolveBadgeIcon(data.logo) : null;
      const badgeData: Format = {
        style: apiReqData.query.style || data.style,
        message: data.message,
        color: data.color,
      };
      if (logoBase64 != null) Object.assign(badgeData, { logoBase64 });
      if (data.label != null)
        Object.assign(badgeData, {
          label: data.label,
          labelColor: data.labelColor,
        });

      try {
        const resultSvg = makeBadge(badgeData);
        return c.newResponse(resultSvg, 200, {
          "Content-Type": "image/svg+xml",
        });
      } catch (_error) {
        Error(_error);
        const resultSvgError = makeBadge({
          label: "error",
          message: "something went wrong",
          color: "red",
        });
        return c.newResponse(resultSvgError, 500, {
          "Content-Type": "image/svg+xml",
        });
      }
    }
  }
}
