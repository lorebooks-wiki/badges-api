# API terms for `badges.api.lorebooks.wiki`

**Last updated**: August 26, 2024 (PH Standard Time)

By using the Badges API, you agree tp and understand the following:

* You follow and abide by the [Community Code of Conduct] and [lorebooks.wiki ToS].
* You do not spam API requests to `/badges/<project>/<badge-name>` endpoint(s) for more than 5 requests per minute and respect the cache headers.
* The API itself is currently under development and things will break. By using it,
you acknowledge that we may implement breaking changes or even deprecate this service.

We may change the API terms as we implement more features and stablize things at any point
in the future and you also agree to any revisions we may make in the future.

[Community Code of Conduct]: https://policies.recaptime.dev/code-of-conduct
[lorebooks.wiki ToS]: https://lorebooks.wiki/legal/tos

## Privacy Policy

Currently we do not collect IP addresses from each HTTP request. If we do in the future, we only use it for debugging and security purposes
only. We'll try to our ability to limit IP address usage and storage as much as possible.

For API authenication to be implemented soon, we use GitHub as our authenication service
by passing your personal access token as an `Authorization` bearer token. We do not store
raw tokens in our KV store, instead they are one-way hashed to SHA512 for purposes of caching
GitHub API requests and to check user permissions with less latency.

## Have questions?

We're all ears on this legal document. Just shoot us at `squad@crew.recaptime.dev` or
file a new issue here.
