import { program } from "commander"
import { Octokit } from "@octokit/rest";
import { logger, setLogLevel } from "../lib/cli/logger.ts";

const ghApi = new Octokit({
    auth: Deno.env.get("GITHUB_TOKEN"),
    userAgent: "badges.api.lorebooks.wiki"
})

program
  .description("manage who can access to the APIs using GitHub as auth backend")
  .usage("[global opts] command")
  .option("-l, --log-level <level>", "set log level", "info")
  .option("-q, --quiet", "sets log level to error")
  .option("-v, --verbose", "sets log level to verbose")
  .option("-d, --debug", "sets log level to debug")
  .hook("preAction", (thisCommand, _actionCommand) => {
    const options = thisCommand.opts();
    setLogLevel(options);
  });

program
    .command("admins:add")
    .description("grant an GitHub user admin permissions by adding to @lorebooks-wiki/api-admins team")
    .argument("<username>", "GitHub username")
    .alias("add-admin")
    .action(async(username) => {
        try {
            const {data, headers} = await ghApi.teams.addOrUpdateMembershipForUserInOrg({
                org: "lorebooks-wiki",
                team_slug: "api-admins",
                username,
            })
            logger.debug(`response headers: ${JSON.stringify(headers)}`);
            logger.debug(`response data: ${JSON.stringify(data)}`);
            logger.success(`Successfully added @${username} to @lorebooks-wiki/api-admins team.`)
            if (data.state == "pending") {
                logger.help(
                  `Ask them to go to https://github.com/orgs/lorebooks-wiki/invitation to complete onboarding.`
                );
            }
        } catch(err) {
            logger.debug(
              `response headers: ${JSON.stringify(err.response.headers)}`
            );
            logger.error("Something gone wrong while calling the GitHub API (maybe check GITHUB_TOKEN?)")
            logger.info(`response data: ${JSON.stringify(err.response.data)}`);
            Deno.exit(1)
        }
    })

program
  .command("admins:rm")
  .aliases(["remove-admin", "admins:del", "delete-admin"])
  .description(
    "remove an GitHub user admin permissions by removing from @lorebooks-wiki/api-admins team"
  )
  .argument("<username>", "GitHub username")
  .option("-o, --remove-from-org", "also remove the user from the org")
  .action(async(username, options) => {
    try {
        const rmFromTeam = await ghApi.teams.removeMembershipForUserInOrg({
            org: "lorebooks-wiki",
            team_slug: "api-admins",
            username
        })
        logger.debug(`response headers: ${JSON.stringify(rmFromTeam.headers)}`);
        logger.debug(`response data: ${JSON.stringify(rmFromTeam.data)}`);
        if (options.removeFromOrg == true) {
            const rmFromOrg = await ghApi.orgs.removeMembershipForUser({
                org: "lorebooks-wiki",
                username
            })
            logger.debug(
              `response headers: ${JSON.stringify(rmFromOrg.headers)}`
            );
            logger.debug(`response data: ${JSON.stringify(rmFromOrg.data)}`);
            logger.success(`Successfully removed @${username} from @lorebooks-wiki/api-admin team and lorebooks-wiki org`)
        } else {
            logger.success(`Successfully removed @${username} from @lorebooks-wiki/api-admins team.`)
        }
    } catch (err) {
        logger.debug(
            `response headers: ${JSON.stringify(err.response.headers)}`
        );
        logger.error(
            "Something gone wrong while calling the GitHub API (maybe check GITHUB_TOKEN?)"
        );
        logger.info(
            `response data: ${JSON.stringify(err.response.data)}`
        );
        Deno.exit(1);
    }
  })

program
  .command("admins:ls")
  .aliases(["list-admins", "admins:list"])
  .description("Show list of API admins")
  .action(async() => {
    let member = ``
    const {data,headers} = await ghApi.teams.listMembersInOrg({
        org: "lorebooks-wiki",
        team_slug: "api-admins",
        per_page: 500
    })
    data.forEach((user) => member += `${user.login}\n`)
    logger.debug(`response headers: ${JSON.stringify(headers)}`);
    logger.info(member)
  })

program.parse()