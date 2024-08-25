import { config } from "./config.ts";

export const tags = [
    {
        name: "badges",
        description: "The Badges API endpoint itself"
    }
]

export const contact = {
    name: "Recap Time Squad",
    email: "squad@crew.recaptime.dev",
    url: "https://"
}

export const servers = [
  {
    url: "https://badges.api.lorebooks.wiki",
    description: "Production",
  },
  {
    url: "https://lorebooks-badges-api.deno.dev",
    description: "Production (deno.dev alt domain)"
  },
  {
    url: `http://localhost:${config.port}`,
    description: "Development instance",
  },
];