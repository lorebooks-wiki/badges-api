# Badges API for lorebooks.wiki

[![Built during Arcade 2024](https://badges.api.lorebooks.wiki/badges/hackclub/arcade?style=flat-square)](https://hackclub.com/arcade)

It's like our own instance of `img.shields.io`, but hosted in Deno Deploy with:

* `hono` and `chanfana` for API docs, validation and routing
* Deno KV for storing badge metadata
* `badges-maker` npm library for generating badges on the fly

You can see the API docs at <https://badges.api.lorebooks.wiki/docs> or
[explore our docs here](./docs/)

## Want to use Hack Club Arcade 2024 badge(s) in your README?

See [`docs/hackclub-badges.md`](./docs/hackclub-badges.md) for more details!

## Running locally

```bash
deno task dev
```

It will listen on `localhost:8080` by default unless overriden by `PORT`
environment variable.

## License

AGPL
