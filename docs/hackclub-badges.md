# (Unofficial) Hack Club Badges

These badges are maintained by @ajhalili2006 for the benefit of Hack Club Slack
community, especially those who participated during Arcade 2024 and open-source
projects fiscally-hosted under HCB.

## Hack Clubber?

If you're from Hack Club HQ and you need to:

- manage badges and under `hackclub` badge namespace via
  [`utils:badges`](../utils/badges-admin.ts) utility (or via API soon)
- add more [Hack Club related logos](./logos.md#adding-a-logo)

Just ping @ajhalili2006 in
[`#recaptime-dev` in Hack Club Slack](https://hackclub.slack.com/archives/C07H1R2PW9W)
or file a ticket here.

## Plain Hack Club badge

Use the Hack Club badge to represent Hack Club while linking it into its
website for community projects and hackathons affliated with Hack Club.

**Default**:
[![Hack Club Badge](https://badges.api.lorebooks.wiki/badges/hackclub/hackclub)](https://hackclub.com)

**Other styles**:
[![Hack Club Badge](https://badges.api.lorebooks.wiki/badges/hackclub/hackclub?style=flat-square)](https://hackclub.com)
[![Hack Club Badge](https://badges.api.lorebooks.wiki/badges/hackclub/hackclub?style=for-the-badge)](https://hackclub.com)
[![Hack Club Badge](https://badges.api.lorebooks.wiki/badges/hackclub/hackclub?style=plastic)](https://hackclub.com)
[![Hack Club Badge](https://badges.api.lorebooks.wiki/badges/hackclub/hackclub?style=social)](https://hackclub.com)

### Usage

**Markdown**:

```md
<!-- flat -->

[![Hack Club flat/default Badge](https://badges.api.lorebooks.wiki/badges/hackclub/hackclub)](https://hackclub.com)

<!-- flat-square  -->

[![Hack Club flat-square Badge](https://badges.api.lorebooks.wiki/badges/hackclub/hackclub?style=flat-square)](https://hackclub.com)

<!-- for-the-badge -->

[![Hack Club for-the-badge Badge](https://badges.api.lorebooks.wiki/badges/hackclub/hackclub?style=for-the-badge)](https://hackclub.com)

<!-- plastic -->

[![Hack Club plastic Badge](https://badges.api.lorebooks.wiki/badges/hackclub/hackclub?style=plastic)](https://hackclub.com)

<!-- social -->

[![Hack Club social button adge](https://badges.api.lorebooks.wiki/badges/hackclub/hackclub?style=social)](https://hackclub.com)
```

## Built during Arcade 2024

Built a project during [Arcade 2024](https://hackclub.com/arcade), including
[Power Hour: Arcade](https://hackclub.com/arcade/power-hour)? Use this badge,
alongside adding `hackclub-arcade` tag to your repository for discoverability.

**Default**:
[![Built during Arcade 2024](https://badges.api.lorebooks.wiki/badges/hackclub/arcade)](https://hackclub.com/arcade)

**Other styles**:
[![Built during Arcade 2024](https://badges.api.lorebooks.wiki/badges/hackclub/arcade?style=flat-square)](https://hackclub.com/arcade)
[![Built during Arcade 2024](https://badges.api.lorebooks.wiki/badges/hackclub/arcade?style=for-the-badge)](https://hackclub.com/arcade)
[![Built during Arcade 2024](https://badges.api.lorebooks.wiki/badges/hackclub/arcade?style=plastic)](https://hackclub.com/arcade)
[![Built during Arcade 2024](https://badges.api.lorebooks.wiki/badges/hackclub/arcade?style=social)](https://hackclub.com/arcade)

### Usage

**With Markdown**:

```md
<!-- default -->

[![Built during Arcade 2024](https://badges.api.lorebooks.wiki/badges/hackclub/arcade)](https://hackclub.com/arcade)

<!-- other styles-->

[![Built during Arcade 2024](https://badges.api.lorebooks.wiki/badges/hackclub/arcade?style=flat-square)](https://hackclub.com/arcade)
[![Built during Arcade 2024](https://badges.api.lorebooks.wiki/badges/hackclub/arcade?style=for-the-badge)](https://hackclub.com/arcade)
[![Built during Arcade 2024](https://badges.api.lorebooks.wiki/badges/hackclub/arcade?style=plastic)](https://hackclub.com/arcade)
[![Built during Arcade 2024](https://badges.api.lorebooks.wiki/badges/hackclub/arcade?style=social)](https://hackclub.com/arcade)
```

**With HTML**:

```html
<!-- default -->
<a href="https://hackclub.com/arcade"
  ><img
    alt="Built during Arcade 2024"
    src="https://badges.api.lorebooks.wiki/badges/hackclub/arcade"
/></a>

<!-- other styles -->
<a href="https://hackclub.com/arcade"
  ><img
    alt="Built during Arcade 2024"
    src="https://badges.api.lorebooks.wiki/badges/hackclub/arcade?style=flat-square"
/></a>
<a href="https://hackclub.com/arcade"
  ><img
    alt="Built during Arcade 2024"
    src="https://badges.api.lorebooks.wiki/badges/hackclub/arcade?style=for-the-badge"
/></a>
<a href="https://hackclub.com/arcade"
  ><img
    alt="Built during Arcade 2024"
    src="https://badges.api.lorebooks.wiki/badges/hackclub/arcade?style=plastic"
/></a>
<a href="https://hackclub.com/arcade"
  ><img
    alt="Built during Arcade 2024"
    src="https://badges.api.lorebooks.wiki/badges/hackclub/arcade?style=social"
/></a>
```

## Donate on HCB

For organizations fiscally-hosted through HCB, you can use the Donate on HCB to
add a donation link for your org or event. Just override the org slug by adding
`org` query parameter pointing to your org.

**Default**:
[![Donate to HQ](https://badges.api.lorebooks.wiki/hcb/donate)](https://hcb.hackclub.com/donations/start/hq)

## HCB Balances

For organizations fiscally-hosted through HCB, you can also show your balances
as a badge while linking to your organization's public ledger on the platform.
Just override the org slug by adding `org` query parameter pointing to your org.

**Default**:
[![HCB Balance for HQ](https://badges.api.lorebooks.wiki/hcb/balance)](https://hcb.hackclub.com/hq)
