# `deno run` scripts

This list is not meant to be exhaustive and may require the usage of `dotenvx` CLI by prefixing
`deno run` commands with `dotenvx run -f .env[.prod] --`.

## Basics

- `lock` - update dep cache and lockfile
- `start` - Start server
- `dev` - Start server with live reloading enabled
- `seed` - seed KV backend using data exports from upstream
- `deploy:<preview|prod>` - deploy to the Deno Deploy instance

## API access management

> The provisioned `GITHUB_TOKEN` secret via `dotenvx` does not allow
> managing team members for the API admins GitHub team, so you
> need to directly use `deno run` with your own token.

- `utils:users` - Manage API access, including admins
- `admins:ls` - list admins
- `admins:add` - invite/add user to API admins GitHub team
- `admins:rm` - remove user from API admins GitHub team
