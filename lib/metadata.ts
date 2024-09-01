import { config } from "./config.ts";

export const tags = [
  {
    name: "badges",
    description: "The Badges API endpoint itself",
  },
  {
    name: "hcb",
    description:
      "HCB badges for use by organizations and communties fiscally sponsored by Hack Club through HCB",
  },
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
    description: "Development instance",
  },
];

export const description = `\
**lorebooks.wiki Badges API** is the badge hosting service by [Andrei Jiroh](https://andreijiroh.xyz) of [Recap Time Squad](https://recaptime.dev) during \
[Arcade 2024](https://hackclub.com/arcade). It's still experimental, but the Deno KV storage backend and \`/badges/{project}/{badgeName}\` endpoint works.

If you want to add a new logo or even a static badge for you or your project without the long \`img.shields.io\` URLs, please file a issue through the \
contact link below.
`;
