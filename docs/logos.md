# Badge logos

## Available logos

Looking for those available on `simple-icons` npm package?

| slug              | description       | source                              | CDN URL[^1]                                                                               |
| ----------------- | ----------------- | ----------------------------------- | ----------------------------------------------------------------------------------------- |
| `hackclub-arcade` | Heidi the Hakkuun | Hack Club Slack                     |
| `hcb`             | HCB logo          | <https://hcb.hackclub.com/branding> | <https://meta.cdn.lorebooks.wiki/branding/thirdparty/hackclub/hcb-icon-icon-original.svg> |
| `hcb-dark`        | HCB dark logo     | <https://hcb.hackclub.com/branding> | <https://meta.cdn.lorebooks.wiki/branding/thirdparty/hackclub/hcb-icon-icon-dark.svg>     |

## Adding a logo

### Using KV seed data

1. Make sure the image or SVG in question is downloaded locally.
2. Run `cat path/to/file | base64 --wrap=0` and copy the encoded string to clipboard.
3. Open the [`lib/cli/kv-seed.json`](../lib/cli/kv-seed.json) file.
4. In `logos` object, add a new entry at the bottom with the following syntax:

```json
"logo-name": "<base64 encoded string here>"
```

5. Save and commit. If you don't have access to the decryption keys at `.env.keys`, an
   admin will run `dotenvx run -f .env.prod -- deno task seed` for you.

### Via [`utils/badges-admins.ts`](../utils/badges-admin.ts) CLI

This is only reserved for admins with access to the backing KV in Deno Deploy via
the private keys on `.env.keys` and using [`dotenvx`](https://github.com/dotenvx/dotenvx).

1. Make sure the image or SVG in question is downloaded locally.
2. Run `cat path/to/file | base64 --wrap=0` and copy the encoded string to clipboard.
3. Run `dotenvx run -f .env.prod -- deno task icons:add <icon-name> <base64EncodedData>` and wait for KV changes to propagate.

[^1]: Note that the CDN URLs point into our Storj DCS bucket `lorebooks-wiki-cdn` at `meta` directory if you need to reproduce the base64 encoding for self-hosting.
