import { config } from "./config.ts";

export const tags = [
  {
    name: "badges",
    description: "The Badges API endpoint itself",
  },
  {
    name: "hcb",
    description:
      "HCB badges for use by organizations and communties fiscally sponsored by Hack Club through the HCB platform.",
  },
  {
    name: "admin",
    description: "Admin API endpoints, protected by GitHub PAT authentication. (experimential)"
  },
  {
    name: "meta",
    description: "Service meta endpoints"
  }
];

export const contact = {
  name: "Recap Time Squad",
  url: "https://github.com/lorebooks-wiki/badges-api/issues",
};

export const servers = [
  {
    url: "https://badges.api.lorebooks.wiki",
    description: "Production",
  },
  {
    url: "https://lorebooks-badges-api.deno.dev",
    description: "Production (deno.dev alt domain)",
  },
  {
    url: `http://localhost:${config.port}`,
    description: "Development instance (local host)",
  },
];


export const description = `\
**lorebooks.wiki Badges API** is the badge hosting service for Recap Time Squad's projects and friends by [Andrei Jiroh](https://andreijiroh.xyz) of [Recap Time Squad](https://recaptime.dev), \
built during [Hack Club Arcade 2024](https://hackclub.com/arcade) (and continued in [High Seas](https://highseas.hackclub.com)). It is currently in public beta (excluding the \
admin API, which is under development at the moment), but the Deno KV storage backend and \`/badges/{project}/{badgeName}\` and HCB-related badge endpoint works.

If you want to add a new logo or even a static badge for you or your project without the long \`img.shields.io\` URLs, please file a issue through the \
contact link below.
`;
