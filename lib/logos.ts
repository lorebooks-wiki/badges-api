import { Octokit } from "@octokit/rest";
import { config } from "./config.ts";
import { Buffer } from "node:buffer";
import { kv } from "./db.ts";

/**
 * Resolve a simple-icons name into a base64-encoded Data URL for `npm:badge-maker`'s `makeBadge`.
 * @param iconName The icon name from the simple-icons repository
 * @returns A base64-encoded Data URL
 */
export async function resolveSimpleIcon(iconName: string) {
  const octokit = new Octokit({
    auth: config.github.authServiceToken,
    userAgent: `@lorebooks-wiki/badges-api (${config.homepage})`
  });

  try {
    const response = await octokit.repos.getContent({
      owner: "simple-icons",
      repo: "simple-icons",
      path: `icons/${iconName}.svg`,
    });

    if (response.status !== 200 || Array.isArray(response.data)) {
      throw new Error(`Icon ${iconName} not found.`);
    }

    if (!("content" in response.data) || !response.data.content) {
      throw new Error(`No content available for icon ${iconName}.`);
    }

    const svgContentEncoded = Buffer.from(response.data.content, "base64").toString("utf-8");
    const result = `data:image/svg+xml;base64,${svgContentEncoded}`;
    return result
  } catch (error) {
    throw new Error(`Failed to fetch icon ${iconName}: ${error.message}`);
  }
}

export async function simpleIconLookup(iconName: string, cacheBuster: boolean) {
  try {
    const kvApi = await kv(config.kvUrl);
    if (!iconName.startsWith("si:")) {
      throw new Error("not a simple-icon icon name")
    }
    // check on our KV cache first
    const cacheKv = await kvApi.get<string>(["badgeIcons", iconName])

    // if not cached OR the cache busting is enabled, run the resolver
    if (cacheKv.value === null || cacheBuster === true) {
      const upstreamData = await resolveSimpleIcon(iconName)

      // store resolved data to KV for caching
      await kvApi.set(["badgeIcons", iconName], upstreamData)

      return upstreamData
    }
    return cacheKv.value
  } catch (error) {
    throw new Error(error)
  }
}