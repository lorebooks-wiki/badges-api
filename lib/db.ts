import { config } from "./config.ts";

const kv = config.kvUrl !== undefined ? await Deno.openKv(config.kvUrl) : await Deno.openKv()
export type RedirectTool = {
  redirectUrl?: string;
};

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
  data: BadgeData
};

export async function getStaticBadgeData(project: string, badgeName: string) {
  try {
    const data = await kv.get([`staticBadges`, project, badgeName])
    const result: DbResult = data.value

    if (result == null) {
        return {
            ok: false,
            type: null,
            data: null,
            versionStamp: null
        }
    }
    return {
      ok: true,
      type: result.type,
      data: result.data,
      versionStamp: data.versionstamp
    };
  } catch (error) {
    return {
      ok: false,
      type: null,
      data: null,
      versionStamp: null,
      error
    }
  }
}

export async function setBadgeData(project: string, badgeName: string, type: "redirect" | "badge", data: RedirectTool | BadgeData) {
  try {
    const kvResult = await kv.set([`staticBadges`, project, badgeName], {type, data});
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
