import { config } from "./config.ts";

export type RedirectTool = {
  redirectUrl?: string;
};

export const kv = async (kvUrl?: string) => {
  if (kvUrl !== undefined) {
    return await Deno.openKv(kvUrl)
  } else {
    return await Deno.openKv()
  }
}

export type BadgeData = {
  label?: string;
  message: string;
  labelColor?: string;
  color?: string;
  logo?: string;
  links?: Array<string>;
  style: "plastic" | "flat" | "flat-square" | "for-the-badge" | "social";
};
export type DbResult = {
  type: "redirect" | "badge";
  data: RedirectTool | BadgeData
};

export async function getBadgeData(project: string, badgeName: string) {
  const kvApi = await kv(config.kvUrl)
  try {
    const {value,versionstamp} = await kvApi.get([`staticBadges`, project, badgeName])

    return {
      ok: true,
      result: value,
      versionStamp: versionstamp
    };
  } catch (error) {
    return {
      ok: false,
      result: null,
      versionStamp: null,
      error
    }
  }
}

export async function setBadgeData(project: string, badgeName: string, type: "redirect" | "badge", data: RedirectTool | BadgeData) {
  const kvApi = await kv(config.kvUrl)
  try {
    const key = [`staticBadges`, project, badgeName]
    const kvResult = await kvApi.set(key, {type, data});
    return {
      ok: kvResult.ok,
      versionStamp: kvResult.versionstamp
    }
  } catch (error) {
    return {
      ok: false,
      versionStamp: null,
      error
    }
  }
}

export async function resolveBadgeIcon(icon: string) {
  const kvApi = await kv(config.kvUrl);
  try {
    const result = await kvApi.get(["badgeIcons", icon])
    if (result.value == null && result.versionstamp == null) {
      return null
    }
    return result.value
  } catch (error) {
    throw Error(error)
  }
}
