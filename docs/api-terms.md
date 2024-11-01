# API terms of service for `badges.api.lorebooks.wiki`

**Last updated**: November 1, 2024 (PH Standard Time)

By using the Community Lorebooks Badges API, you agree to and understand the following:

- You follow and abide by the [Community Code of Conduct] and
  [lorebooks.wiki ToS].
- You do not spam API requests to `/badges/<project>/<badge-name>` and `/hcb/*` endpoint(s)
  for more than 5 requests per minute and respect the cache headers.
- The API itself is currently under development and things will break. By using
  it, you acknowledge that we may implement breaking changes or even deprecate
  this service.

We may change the API terms as we implement more features and stablize things at
any point in the future and you also agree to any revisions we may make in the
future. You can opt to watch the GitHub repository for updates.

[Community Code of Conduct]: https://policies.recaptime.dev/code-of-conduct
[lorebooks.wiki ToS]: https://lorebooks.wiki/legal/tos

## Privacy Policy

Currently we do not collect IP addresses from each HTTP request. If we do in the
future, we only use it for debugging and security purposes only. We'll try to
our ability to limit IP address usage and storage as much as possible.

For API authentication, we use GitHub as our authentication service by passing your personal
access token as an `Authorization` bearer token. We do not store raw tokens in our KV store,
instead they are one-way hashed to SHA512 for purposes of caching GitHub API
requests and to check user permissions with less latency.
Please ensure you use tokens with minimal required scopes, mainly read-only access to your public profile data.

## Addeumn: Unofficial Hack Club badges

While we host and maintain unofficial badges for the Hack Club community, including HCB badges, the
[Hack Club Code of Conduct] may apply to the usage of these badges. Although they are community-maintained,
you agree to only use them in connection with your personal projects or hackathons and events affliated
with Hack Club HQ.

For HCB badges, you agree to use them in accordance with your fiscal hosting agreement with Hack Club
and only if you have enabled Transparency Mode for your HCB organization.

[Hack Club Code of Conduct]: https://hackclub.com/conduct

## Have questions?

We're all ears on this legal document. Just shoot us at
`squad@crew.recaptime.dev` or file a new issue here.

If you spotted any abusive usage of this service, please submit abuse reports at `abuse@lorebooks.wiki`.
