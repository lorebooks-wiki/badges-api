# Self-hosting Badges API

The Badges API itself is a Typescript-based server in Deno runtime, and can be
self-hosted even outside of Deno Deploy. Although we do not test running it in
Node via `ts-node` yet, patches are much welcome to fix compatibility issues.

## Environment variables

- `GITHUB_TOKEN` - GitHub Personal Access Token with `read:org` scope, used for fetching
  user IDs and team membership from your org's `GITHUB_TEAM_ADMINS`
- `GITHUB_ORG` - GitHub organization for admin API access gating
- `GITHUB_TEAM_ADMINS` - GitHub team slug for admin API access gating
- `DENO_KV_URL` - Path to KV store or URL to [KV Connect-compatible API]. Use
  your Deno Deploy project's KV Connect URL alongside your PAT (via
  `DENO_KV_ACCESS_TOKEN`) if you're doing persistence on the cloud.
- `DENO_KV_ACCESS_TOKEN` - Used to authenicate against a KV Connect-compatible
  API, including KV Connect URLs on Deno Deploy.
- `PORT` - Used internally for reverse proxies and local dev instances. If
  blank, uses port `8080` on startup.

### Optional

- `FF_DENO_EDGE_CACHE` - Feature flag for caching SVG responses using the Cache API.
- `DENO_CACHE_NAMESPACE` - Used by `hono/cache` for namespacing caches.

[KV Connect-compatible API]: https://github.com/denoland/denokv/blob/main/proto/kv-connect.md

## Deployment

1. Cache/install deps: `deno task deps:cache`
2. Install [`dotenvx`](https://dotenvx.com/docs/install), blank out `.env` (for
   local dev) and `.env.prod` (for deployments) and set secrets via
   `dotenvx set` command (they'll be encrypted at rest, so keep your `.env.keys`
   handy).
3. Pre-seed the KV backend from our manually-crafted production export:
   `deno task utils:preseed-kv`
4. To use the admin APIs with your GitHub PAT, create an `api-admins` team in your
   organization (or reuse an existing team) and use the team slug as the value for
   `GITHUB_TEAM_ADMINS`.
5. If you're using Deno Deploy, set the `BADGES_API_HOMEPAGE` variable to your fork and
   set `GITHUB_TOKEN` to your service account's PAT (fine-grained tokens scoped to your
   organization also work). Don't forget to update `deploy:*` scripts in `deno.json#scripts`
   to point `org` and `project` to your own instance (also the `deploy.project` key).\
6. Otherwise, just run `dotenvx run -f .env.prod -- deno run start` and point your reverse
   proxy to `PORT`.
