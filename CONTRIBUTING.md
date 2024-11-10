# Contributing guidelines

Thanks for your interest in contributing into the project! If you want to contribute, here
are the documentation you need to get you set up.

## Pre-flight

- [ ] Agree to [the Community Code of Conduct](https://policies.recaptime.dev/code-of-conduct)
      and [Developer Certificate of Origin](https://developercertificate.org/)
- [ ] Install Deno 2 and Node.js LTS 22.x on your machine (or use Dev Containers / Codespaces instead)
  - [ ] You might also need to install dotenvx via npm: `npm i -g @dotenvx/dotenvx`

## Commit message style

Our commit message style uses Conventional Commits with the scopes being defined under the
`conventionalCommits.scopes` VS Code workspace configuration. We'll be working on setting up
Commitlint + Commitizen CLI integration soon.

## Sending patches

Since we automatically deploy the main branch to production via Deno Deploy, we use GitHub to
accept merge requests although we can also accept on its GitLab mirror and via sourcehut lists.

### Via sourcehut lists

> **New to sending email patches?** Visit <https://git-send-email.io/> for a guided tutorial.

For the subject prefix, please set `format.subjectPrefix` local Git config to `PATCH badges-api` if you are sending
it to dedicated dev mailing list for Community Lorebooks. Otherwise, set it to `PATCH lorebooks-wiki/bdges-api`
for the main dev mailing list at Recap Time Squad.

Before sending over email, set `sendemail.to` to either `~recaptime-dev/lorebooks.wiki-devel@lists.sr.ht`
or `~recaptime-dev/devel@lists.sr.ht` and enable `--annotate` by default with setting `sendemail.annotate`
to `yes` globally.

```bash
git config sendemail.to ~recaptime-dev/lorebooks.wiki-devel@lists.sr.ht
git config format.subjectPrefix "PATH badges-api"
git config format.signOff yes # don't forget to sign-off your commits
```
