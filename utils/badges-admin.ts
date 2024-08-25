import { logger, setLogLevel } from "../lib/cli/logger.ts";
import { config } from "../lib/config.ts";
import { program } from "commander";
import * as db from "../lib/db.ts"
import type { RedirectTool, BadgeData} from "../lib/db.ts"
import { OK } from "zod";
const kvApi = await Deno.openKv(config.kvUrl);

program
  .description("manage badge icons and badge data stored over Deno KV")
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
    .command("icons:upload")
    .aliases(["upload-icon","icons:add"])
    .description("add base64-encoded image to KV")
    .argument("<iconName>", "icon name")
    .argument("<base64Data>", "base64-encoded image/SVG data")
    .action(async(iconName: string, base64Data: string) => {
        try {
            await kvApi.set(["badgeIcons", iconName], base64Data)
            logger.success(`Upload succeeded`)
        } catch(error) {
            logger.error(`Something gone wrong while uploading`)
            logger.warn(error)
        }
    })

program
    .command("icons:ls")
    .action(async() => {
        try {
            const data = await kvApi.list<string>({
                prefix: ["badgeIcons"],
            })
            const icons = []
            for await (const result of data) icons.push(result.key[1])
            logger.info(icons.join("\n"))
        } catch (error) {
            logger.error(`Something gone wrong while fetching data from KV`)
            logger.warn(error)
        }
    })

program
  .command("badges:add")
  .argument("<project>", "project slug")
  .argument("<name>", "badge name")
  .requiredOption(
    "-t, --type <badge|redirect>",
    "whether to generate SVG at server-side or do a redirect",
    "badge-data"
  )
  .option("-u, --url <link>", "URL of the badge image to redirect into")
  .option("-m, --message <text>", "message")
  .option("-c, --color", "messgae color", "lightgray")
  .option("-lc, --label-color", "label color", "gray")
  .option("-l, --label <text>", "badge label")
  .option("--links [links...]")
  .option("-s, --style <style>", "badge style", "flat")
  .action(async (project, name, options) => {
    logger.debug(`options ${JSON.stringify(options)}`);
    if (options.type == "redirect") {
      if (options.url == undefined) {
        logger.error(`you forgot to set --url option`);
      }
      const data: RedirectTool = {
        redirectUrl: options.url,
      };
      const result = await db.setBadgeData(project, name, "redirect", data);

      if (result.ok == true) {
        logger.success(
          `added redirect on https://badges.api.lorebooks.wiki/badges/${project}/${name}`
        );
      }
    }

    if (options.type == "badge") {
        const data: BadgeData = {
            label: options.label,
            labelColor: options.labelColor,
            color: options.color,
            message: options.message,
            logo: options.logo,
            style: options.style,
            links: options.links
        }
        logger.debug(JSON.stringify(data))
        const result = await db.setBadgeData(project, name, "badge", data)
        logger.debug(JSON.stringify(result))
        if (result.ok == false) {
            logger.error("Something went wrong while adding a badge.")
            logger.warn(result.error)
            Deno.exit(1)
        } else {
            logger.success(
              `Added/updated badge at https://badges.api.lorebooks.wiki/badges/${project}/${name}`
            );
        }
    }
  });

program.parse()