import { config } from "../lib/config.ts";
import { kv } from "../lib/db.ts";

console.log(`kvUrl - ${config.kvUrl} | env - ${Deno.env.get("DENO_KV_URL")}`);
const kvApi = await kv(config.kvUrl);

const badges = await kvApi.list({ prefix: ["staticBadges"] });
const logos = await kvApi.list({ prefix: ["badgeIcons"] });

for await (const entry of badges) {
  console.log(
    `badge namespace: ${entry.key[1]}, badge name: ${
      entry.key[2]
    }, data: ${JSON.stringify(entry.value)}, stamp: ${entry.versionstamp}`
  );
}

for await (const entry of logos) {
  console.log(`logo: ${entry.key[1]}, stamp: ${entry.versionstamp}`);
}
