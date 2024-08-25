import { config } from "./config.ts";

const kv = config.kvUrl !== undefined ? await Deno.openKv(config.kvUrl) : await Deno.openKv()

export async function getBadgeData(project: string, badgeName: string) {
    const data = await kv.get([`badge:${project}/${badgeName}`])

    if (data.value == null) {
        return {
            ok: false,
            type: null,
            data: null,
            versionStamp: null
        }
    }
    const JsonData = JSON.parse(data.value)
    return {
      ok: true,
      type: JsonData.type,
      data: JsonData.data,
      versionStamp: data.versionstamp
    };
}

type BadgeData = {
    redirectUrl?: string
    label?: string,
    message: string,
    labelColor?: string,
    color?: string,
    logoBase64?: string,
    links: Array<string>,
    style: 'plastic' | 'flat' | 'flat-square' | 'for-the-badge' | 'social'
}

export async function setBadgeData(project: string, badgeName: string, type: "redirect" | "badge-maker-params", data: BadgeData) {
    const data = await kv.set([`badge:${project}/${badgeName}`, {
        
    }])
}