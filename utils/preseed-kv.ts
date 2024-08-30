import preseedData from "../lib/cli/kv-seed.json" with { type: "json"}
import { logger } from "../lib/cli/logger.ts";
import { config } from "../lib/config.ts";
import * as db from "../lib/db.ts";
logger.info(`kvUrl - ${config.kvUrl} | env - ${Deno.env.get("DENO_KV_URL")}`)
const kvApi = await db.kv(config.kvUrl)

const iconNames = Object.keys(preseedData.icons)
const badgeNamespaces = Object.keys(preseedData.staticBadges)

iconNames.forEach(async (key: string) => {
  logger.info(`icon data - ${JSON.stringify(preseedData.icons[key])}`)
  try {
    logger.info(`uploading encoded data for logo ${key}`)
    const result = await kvApi.set(["badgeIcons", key], preseedData.icons[key])
    logger.info(JSON.stringify(result))
  } catch (err) {
    logger.error(`Something went wrong while preseeding KV backend`)
    logger.warn(err)
    Deno.exit(1)
  }
})

badgeNamespaces.forEach(async(key: string, index: number) => {
  logger.info(`loading data for namespace ${key}`)
  const namespacedBadges = Object.keys(preseedData.staticBadges[key])
  logger.info(`namespaced badges for ${key}: ${namespacedBadges}`)
  const namespaceData = preseedData.staticBadges[key]
  logger.info(JSON.stringify(namespaceData))
  await namespacedBadges.forEach(async (badge, badgeIndex) => {
    logger.info(`trying to load ${key}/${badge} to KV`)
    try {
      const data = namespaceData[badge]
      logger.info(`badge data - ${JSON.stringify(data)}`)
      const result = await kvApi.set(["staticBadges", key, badge], data)
      logger.info(JSON.stringify(result))
    } catch (err) {
      logger.error(`Something went wrong while preseeding KV backend`)
      logger.warn(err)
      Deno.exit(1)
    }
  })
})