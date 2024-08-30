import { Bool, OpenAPIRoute, Str } from "chanfana";
import { Context } from "hono";
import { z } from "zod";
import { BadgeData, getBadgeData, resolveBadgeIcon } from "../lib/db.ts";
import { Format, makeBadge } from "badge-maker";
import { makeLogo } from "../lib/logos.ts";

export class hcbBalanceOps extends OpenAPIRoute {
  schema = {
    tags: ["badges"],
    summary: "Generate a SVG badge of a HCB organization's balances",
    descritpion: `\
By default without the \`org\` query parameter, it will uses data from [Hack Club HQ](https://hcb.hackclub.com/api/v3/organizations/hq),
but it will change to either \`recaptime-dev\` or \`lorebooks-wiki\` in the future.    
`,
  };
}

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
    try {
      const acceptCT = c.req.header("Accept");
      const dbData = await getBadgeData(
        apiReqData.params.project,
        apiReqData.params.badgeName
      );
      console.log(dbData);
      const {
        type,
        data,
      }: {
        type: "redirect" | "badge" | undefined;
        data: BadgeData | undefined;
      } = dbData.result;

      type overridesData = {
        logoColor?: string;
        logoSize?: string;
        logo?: string;
      };
      const overrides: overridesData = {
        logoColor: apiReqData.params.logoColor || "white",
        logoSize: apiReqData.params.logoSize,
        logo: apiReqData.params.logo || data.logo,
      };

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

      if (type == "redirect") {
        return c.redirect(
          data?.redirectUrl !== undefined
            ? data?.redirectUrl
            : "https://badges.api.lorebooks.wiki/badges/notfound/notfound"
        );
      } else if (type == "badge") {
        console.log(`logo name: ${data.logo}`);
        let logoData: string | null;

        if (data?.logo?.startsWith("data:")) {
          logoData = await resolveBadgeIcon(data.logo);
        } else {
          logoData = makeLogo(data.logo, overrides);
        }
        console.log(`logo data - ${logoData}`);
        let badgeData: Format = {
          message: data.message,
          color: data?.color || "gray",
        };
        if (typeof data?.label == "string") {
          Object.assign(badgeData, {
            label: data?.label,
            labelColor: data?.labelColor,
          });
        }
        if (logoData != null) {
          Object.assign(badgeData, {
            logoBase64: logoData,
          });
        }

        let badge = makeBadge(badgeData);
        return c.newResponse(badge, 200, {
          "Content-Type": "image/svg+xml",
        });
      }
    } catch (error) {
      console.error(error);
      const resultSvgError = makeBadge({
        label: "error",
        message: "something went wrong",
        color: "red",
        style: apiReqData.query.style || "flat",
      });
      return c.newResponse(resultSvgError, 500, {
        "Content-Type": "image/svg+xml",
      });
    }
  }
}
