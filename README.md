# Community Lorebooks Badges API

[![Built during Arcade 2024](https://badges.api.lorebooks.wiki/badges/hackclub/arcade?style=flat-square)](https://hackclub.com/arcade)
[![Donate to RecapTime.dev](https://badges.api.lorebooks.wiki/hcb/donate?org=recaptime-dev&style=flat-square)](https://hcb.hackclub.com/donations/start/recaptime-dev)

It's like our own instance of `img.shields.io`, but hosted in Deno Deploy with:

- `hono` and `chanfana` for API docs, validation and routing
- Deno KV for storing badge metadata, lessening the URL parameter spaghetti
- `badges-maker` npm library for generating badges on the fly
- Edge caching with the Web Cache API (enabled as a Hono middleware)

You can see the API docs at <https://badges.api.lorebooks.wiki/docs> or
[explore our docs here](./docs/)

## Want to use Hack Club badge(s) in your README?

See [`docs/hackclub-badges.md`](./docs/hackclub-badges.md) for more details! We'll be adding
more YSWS badges alongside HCB and Hack Club community badges in the future, but you can
request one today.

## Running locally

> **:warning: Warning**: You need to either reset the `.env*` files and provide your own
> secrets or ask @ajhalili2006 for the contents of `.env.keys` to decrypt them via
> `dotenvx` in order to locally run the server.

```bash
dotenvx run -f .env -- deno task dev
```

It will listen on `localhost:8080` by default unless overriden by `PORT`
environment variable.

[See the docs](./docs/self-hosting.md) for a more detailed instructions on self-hosting
and more.

## License

AGPL
