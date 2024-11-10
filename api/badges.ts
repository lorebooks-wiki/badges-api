import { Bool, OpenAPIRoute, Str } from "chanfana";
import { Context } from "hono";
import { z } from "zod";
import { BadgeData, getBadgeData, resolveBadgeIcon } from "../lib/db.ts";
import { Format, makeBadge } from "badge-maker";
import { getOrgData } from "../lib/hcb.ts";
import { validateBadgeStyle } from "../lib/utils.ts";

/**
 * Get a HCB balance badge
 */
export class hcbBalanceOps extends OpenAPIRoute {
  override schema = {
    tags: ["hcb"],
    summary: "Generate a SVG badge of a HCB organization's balances",
    description: `\
By default without the \`org\` query parameter, it will uses data from [Hack Club HQ](https://hcb.hackclub.com/api/v3/organizations/hq), \
but it will change to either \`recaptime-dev\` or \`lorebooks-wiki\` in the future.

The generated badge includes your organization's balance after dividing \`balances.balance_cents\` from API to 100 to show up the cents \
in USD, so please expect any inaccuraries from the division.
`,
    request: {
      query: z.object({
        org: Str({
          description: "Organization slug or ID",
          required: false,
          default: "hq",
        }),
        style: Str({
          description: "Badge style as supported by `badge-maker` npm library.",
          required: false,
          default: "flat",
        }),
      }),
    },
    response: {
      "200": {
        description: "Generate a HCB badge with your organization balances",
        content: {
          "image/svg+xml": {
            schema: {
              type: "string",
            },
          },
        },
      },
    },
  };

  override async handle(c: Context) {
    const apiReqData = await this.getValidatedData<typeof this.schema>();
    const { org, style } = apiReqData?.query || {};
    const { result, code } = await getOrgData(org || "hq");
    console.log(`API result: ${JSON.stringify(result)} | code is ${code}`);

    if (code == 200) {
      const bal = result.balances.balance_cents / 100;
      const badge: Format = {
        label: `HCB balance for ${result.name}`,
        labelColor: "EC3750",
        message: `USD ${bal}`,
        logoBase64: await resolveBadgeIcon("hcb-dark"),
        style: validateBadgeStyle(style),
      };
      console.log(badge);
      const badgeSvg = makeBadge(badge);
      return c.newResponse(badgeSvg, 200, {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "max-age=300",
      });
    } else if (code == 404) {
      const badgeSvg = makeBadge({
        label: `HCB balance for unknown organization`,
        labelColor: "EC3750",
        message: `USD 0`,
        logoBase64: await resolveBadgeIcon("hcb-dark"),
        style: validateBadgeStyle(style)
      });
      return c.newResponse(badgeSvg, 404, {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "max-age=300",
      });
    }
  }
}

export class hcbTotalRasied extends OpenAPIRoute {
  override schema = {
    tags: ["hcb"],
    summary: "Generate a SVG badge of a HCB organization's total raised amount",
    description: `\
By default without the \`org\` query parameter, it will uses data from [Hack Club HQ](https://hcb.hackclub.com/api/v3/organizations/hq), \
but it will change to either \`recaptime-dev\` or \`lorebooks-wiki\` in the future.

The generated badge includes your organization's total raised amount after dividing \`balances.total_raised\` from API to
100 to show up the cents in USD, so please expect any inaccuraries from the division.
`,
    request: {
      query: z.object({
        org: Str({
          description: "Organization slug or ID",
          required: false,
          default: "hq",
        }),
        style: Str({
          description: "Badge style as supported by `badge-maker` npm library.",
          required: false,
          default: "flat",
        }),
      }),
    },
    response: {
      "200": {
        description: "Generate a HCB badge with your organization balances",
        content: {
          "image/svg+xml": {
            schema: {
              type: "string",
            },
          },
        },
      },
    },
  };

  override async handle(c: Context) {
    const apiReqData = await this.getValidatedData<typeof this.schema>();
    const { org, style } = apiReqData?.query || {};
    const { result, code } = await getOrgData(org || "hq");
    console.log(`API result: ${JSON.stringify(result)} | code is ${code}`);

    if (code == 200) {
      const bal = result.balances.total_raised / 100;
      const badge: Format = {
        label: `Total raised on HCB for ${result.name}`,
        labelColor: "EC3750",
        message: `USD ${bal}`,
        logoBase64: await resolveBadgeIcon("hcb-dark"),
        style: validateBadgeStyle(style),
      };
      console.log(badge);
      const badgeSvg = makeBadge(badge);
      return c.newResponse(badgeSvg, 200, {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "max-age=300",
      });
    } else if (code == 404) {
      const badgeSvg = makeBadge({
        label: `HCB balance for unknown organization`,
        labelColor: "EC3750",
        message: `USD 0`,
        logoBase64: await resolveBadgeIcon("hcb-dark"),
        style: validateBadgeStyle(style)
      });
      return c.newResponse(badgeSvg, 404, {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "max-age=300",
      });
    }
  }
}

export class hcbDonateButton extends OpenAPIRoute {
  override schema = {
    tags: ["hcb"],
    summary: "Generate a SVG badge for HCB donate badges.",
    description: `\
By default without the \`org\` query parameter, it will uses data from [Hack Club HQ](https://hcb.hackclub.com/api/v3/organizations/hq),
but it will change to either \`recaptime-dev\` or \`lorebooks-wiki\` in the future.

The generated badge includes your organization name and embeds the donation page URL and your organization URL (if transparency mode is enabled)
so it is easily clickable when added as a SVG object.

`,
    request: {
      query: z.object({
        org: Str({
          description: "Organization slug or ID",
          required: false,
          default: "hq",
        }),
        style: Str({
          description: "Badge style as supported by `badge-maker` npm library.",
          required: false,
          default: "flat",
        }),
      }),
    },
    response: {
      "200": {
        content: {
          "image/svg+xml": {
            schema: {
              type: "string",
            },
          },
        },
      },
    },
  };

  override async handle(c: Context) {
    const apiReqData = await this.getValidatedData<typeof this.schema>();
    const { org, style } = apiReqData.query;
    const dbData = (await getBadgeData("hcb", "donate")).result?.data;
    const { result, code } = await getOrgData(org || "hq");
    if (code == 200) {
      const badgeData: Format = {
        label: "Donate on HCB",
        labelColor: "EC3750",
        logoBase64: await resolveBadgeIcon("hcb-dark"),
        message: `@${org || "hq"}`,
        links: [
          `https://hcb.hackclub.com/donations/start/${org || "hq"}`,
          `https://hcb.hackclub.com/${org || "hq"}`,
        ],
        style: validateBadgeStyle(style),
      };
      console.log(badgeData);
      const badge = makeBadge(badgeData);
      return c.newResponse(badge, 200, {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "max-age=300",
      });
    } else if (code == 404) {
      return c.notFound();
    }
  }
}

export class generateSvg extends OpenAPIRoute {
  override schema = {
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

  override async handle(c: Context) {
    const apiReqData = await this.getValidatedData<typeof this.schema>();
    const reqUrl = new URL(c.req.url);
    const { origin } = reqUrl;
    const { color, links, style } = apiReqData.query;

    try {
      const acceptCT = c.req.header("Accept");
      const dbData = await getBadgeData(
        apiReqData.params.project,
        apiReqData.params.badgeName,
      );
      console.log(dbData);

      if (
        apiReqData.query.json == true && acceptCT?.includes("application/json")
      ) {
        if (dbData.result == null && dbData.versionStamp == null) {
          return c.json(
            {
              ok: false,
              result: null,
              versionStamp: null,
              error: "project and badge name combination not found",
            },
            404,
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
          "Cache-Control": "max-age=900",
        });
      }

      const {
        type,
        data,
      }: {
        type: "redirect" | "badge" | null;
        data: BadgeData | null;
      } = dbData.result;

      if (type == "redirect") {
        if (typeof data?.redirectUrl == "string") {
          let baseString = data.redirectUrl;
          if (baseString.startsWith("/badges/")) {
            baseString = `${origin}${data.redirectUrl}`;
          }
          const urlParamsOps = new URL(baseString);
          for (const param in apiReqData.query) {
            if (param == "style" && apiReqData.query.style == undefined) {
              urlParamsOps.searchParams.append("style", "flat");
            } else {
              urlParamsOps.searchParams.append(param, apiReqData.query[param]);
            }
          }
          return c.redirect(urlParamsOps.toString());
        }
        return c.redirect(
          "https://badges.api.lorebooks.wiki/badges/notfound/notfound",
        );
      } else if (type == "badge") {
        console.log(`logo name: ${data?.logo || null}`);
        const logoData = await resolveBadgeIcon(data?.logo);
        console.log(`logo data - ${logoData}`);
        let badgeData: Format = {
          message: data.message,
          color: color || data?.color || "gray",
          style: validateBadgeStyle(style || data?.color),
        };
        if (typeof data?.label == "string") {
          Object.assign(badgeData, {
            label: data?.label,
            labelColor: data?.labelColor,
          });
        }
        if (
          logoData != null &&
          (style == "social" || data?.style == "social") &&
          data?.logo?.endsWith("-light")
        ) {
          Object.assign(badgeData, {
            logoBase64: await resolveBadgeIcon(
              data.logo.replace(/-light/gm, "-dark"),
            ),
          });
        } else {
          Object.assign(badgeData, {
            logoBase64: logoData,
          });
        }
        if (Array.isArray(data?.links)) {
          Object.assign(badgeData, {
            links: data.links,
          });
        }
        const badge = makeBadge(badgeData);
        return c.newResponse(badge, 200, {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "max-age=900",
        });
      }
    } catch (error) {
      console.error(error);
      const resultSvgError = makeBadge({
        label: "error",
        message: "something went wrong",
        color: "red",
        style: validateBadgeStyle(style),
      });
      return c.newResponse(resultSvgError, 500, {
        "Content-Type": "image/svg+xml",
      });
    }
  }
}
