import { program } from "commander"
import { Octokit } from "@octokit/rest";
import { logger, setLogLevel } from "../lib/cli/logger.ts";
import { config } from "../lib/config.ts";

const {authServiceToken, org, team_slug} = config.github

if (authServiceToken == undefined) {
  logger.warn(`You need a GitHub API token (GITHUB_TOKEN) to use most CLI commands here.`)
  Deno.exit(1)
}

const ghApi = new Octokit({
    auth: authServiceToken,
    userAgent: "badges.api.lorebooks.wiki/admin-cli"
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
                org,
                team_slug,
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
            org,
            team_slug,
            username
        })
        logger.debug(`response headers: ${JSON.stringify(rmFromTeam.headers)}`);
        logger.debug(`response data: ${JSON.stringify(rmFromTeam.data)}`);
        if (options.removeFromOrg == true) {
            const rmFromOrg = await ghApi.orgs.removeMembershipForUser({
                org,
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
      logger.debug(`response headers: ${JSON.stringify(err.response.headers)}`);
      if (err.status == "404") {
        logger.warn(`user ${username} is not in organization`)
      } else {
        logger.error(
          "Something gone wrong while calling the GitHub API (maybe check GITHUB_TOKEN?)"
        );
        logger.info(
          `response data: ${JSON.stringify(err.response.data)}`
        );
        Deno.exit(1);
      }
    }
  })

program
  .command("admins:ls")
  .aliases(["list-admins", "admins:list"])
  .description("Show list of API admins by GitHub usernames")
  .action(async() => {
    let member = ``
    const {data,headers} = await ghApi.teams.listMembersInOrg({
        org,
        team_slug,
        per_page: 500
    })
    data.forEach((user) => member += `${user.login}\n`)
    logger.debug(`response headers: ${JSON.stringify(headers)}`);
    logger.info(member)
  })

program
  .command("admins:info")
  .description("Get a information about an API admin")
  .argument("<username>")
  .action(async(username) => {
    try {
      const user = await ghApi.users.getByUsername({
        username
      })
      logger.info(`user id: ${user.data.id}`);
      logger.info(`graphql node id: ${user.data.node_id}`);

      const teamMembership = await ghApi.teams.getMembershipForUserInOrg({
        org,
        team_slug,
        username
      })
      logger.info(`membership status: ${teamMembership.data.state}`),
      logger.info(`team role: ${teamMembership.data.role}`)
    } catch (err) {
      if (err.status == "404") {
        logger.warn(`membership status: not in team or org`)
        logger.warn(`team role: none`)
      } else {
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
    }
  })

program.parse()