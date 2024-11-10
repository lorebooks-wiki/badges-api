import preseedData from "../lib/cli/kv-seed.json" with { type: "json" };
import { logger } from "../lib/cli/logger.ts";
import { config } from "../lib/config.ts";
import * as db from "../lib/db.ts";
logger.info("Initializing KV connection...");
let kvApi;
try {
  kvApi = await db.kv(config.kvUrl);
  logger.info("KV connection established successfully");
} catch (error) {
  logger.error("Failed to initialize KV connection: " + error);
  Deno.exit(1);
}

const iconNames = Object.keys(preseedData.icons)
const badgeNamespaces = Object.keys(preseedData.staticBadges)

for (const key of iconNames) {
  logger.info(`uploading encoded data for logo ${key}`);
  try {
    const result = await kvApi.set(["badgeIcons", key], preseedData.icons[key]);
    logger.info(`Successfully stored icon: ${key}`);
  } catch (err) {
    logger.error(`Something went wrong while preseeding KV backend`);
    logger.warn(err);
    Deno.exit(1);
  }
}

for (const key of badgeNamespaces) {
  logger.info(`loading data for namespace ${key}`);
  const namespacedBadges = Object.keys(preseedData.staticBadges[key]);
  logger.info(`namespaced badges for ${key}: ${namespacedBadges}`);
  for (const badge of namespacedBadges) {
    logger.info(`trying to load ${key}/${badge} to KV`);
    try {
      const data = preseedData.staticBadges[key][badge];
      logger.info(`badge data - ${JSON.stringify(data)}`);
      const result = await kvApi.set(["staticBadges", key, badge], data);
      logger.info(`Successfully stored badge: ${key}/${badge}`);
    } catch (err) {
      logger.error(`Something went wrong while preseeding KV backend`);
      logger.warn(err);
      Deno.exit(1);
    }
  }
}