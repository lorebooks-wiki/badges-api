import { config } from "./config.ts";

export const kv = async (kvUrl?: string) => {
  console.log(`loading KV from ${config.kvUrl || "local backend"}`);
  if (kvUrl !== undefined) {
    return await Deno.openKv(kvUrl);
  } else {
    return await Deno.openKv();
  }
};

export type BadgeData = {
  redirectUrl: string;
  label?: string | null;
  message: string;
  labelColor?: string | null;
  color?: string | null;
  logo?: string | null;
  links?: Array<string> | null;
  style: "plastic" | "flat" | "flat-square" | "for-the-badge" | "social";
};

export type BadgeMakerParams = BadgeData & {
  logoBase64?: string | null;
};
export type DbResult = {
  ok: boolean;
  result: {
    type: "redirect" | "badge";
    data: BadgeData;
  } | null;
  versionStamp: string | null;
  error?: string | object;
};

export async function getBadgeData(
  project: string,
  badgeName: string
): Promise<DbResult> {
  const kvApi = await kv(config.kvUrl);
  try {
    const { value, versionstamp } = await kvApi.get([
      `staticBadges`,
      project,
      badgeName,
    ]);

    return {
      ok: true,
      result: value,
      versionStamp: versionstamp,
    };
  } catch (error) {
    return {
      ok: false,
      result: null,
      versionStamp: null,
      error,
    };
  }
}

export async function setBadgeData(
  project: string,
  badgeName: string,
  type: "redirect" | "badge",
  data: BadgeData
) {
  const kvApi = await kv(config.kvUrl);
  try {
    const key = [`staticBadges`, project, badgeName];
    const kvResult = await kvApi.set(key, { type, data });
    return {
      ok: kvResult.ok,
      versionStamp: kvResult.versionstamp,
    };
  } catch (error) {
    return {
      ok: false,
      versionStamp: null,
      error,
    };
  }
}

export async function resolveBadgeIcon(icon: string) {
  const kvApi = await kv(config.kvUrl);
  if (icon == null) {
    return null;
  }
  try {
    const result = await kvApi.get<string | null>(["badgeIcons", icon]);
    if (result.value == null && result.versionstamp == null) {
      return null;
    }
    return result.value;
  } catch (error) {
    throw Error(error);
  }
}
