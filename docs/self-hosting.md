# Self-hosting Badges API

The Badges API itself is a Typescript-based server in Deno runtime, and can be
self-hosted even outside of Deno Deploy.

## Environment variables

- `GITHUB_TOKEN` - Used for fetching user IDs and team membership to your org's `GITHUB_TEAM_ADMINS`
- `GITHUB_ORG` - GitHub organization for admin API access gating
- `GITHUB_TEAM_ADMINS` - GitHub team slug for admin API access gating
- `DENO_KV_URL` - Path to KV store or URL to [KV Connect-compatible API]. Use
  your Deno Deploy project's KV Connect URL alongside your PAT (via
  `DENO_KV_ACCESS_TOKEN`) if you doing presistence on the cloud.
- `DENO_KV_ACCESS_TOKEN` - Used to authenicate against a KV Connect-compatible API,
  including KV Connect URLs on Deno Deploy.
- `PORT` - Used internally for reverse proxies and local dev instances. If blank, uses port `8080` on startup.

## Deployment

1. Cache/install deps: `deno task deps:cache`
2. Install [`dotenvx`](https://dotenvx.com/docs/install), blank out `.env`
   (for local dev) and `.env.prod` (for deployments) and set secrets via `dotenvx set`
   command.
3. Pre-seed the KV backend from our manually-crafted production export: `deno task utils:preseed-kv`
4. To use the admin APIs with your GitHub PAT, create `api-admins` team on your organization.
   (or reuse a existing team) and use the team slug as value for `GITHUB_ORG_TEAM_ADMINS`.
