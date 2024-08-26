import { logger, setLogLevel } from "../lib/cli/logger.ts";
import { config, } from "../lib/config.ts";
import { program } from "commander";
import * as db from "../lib/db.ts"
import type { RedirectTool, BadgeData} from "../lib/db.ts"
import { makeBadge } from "badge-maker";
import { optional } from "zod";
import { Format } from "./types.ts";
const kvApi = await db.kv(config.kvUrl)

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
    .aliases(["upload-icon","icons:add", "icons:set"])
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
    .aliases(["list-icons", "icons:show", "show-icons"])
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
    .command("icons:get")
    .aliases(["get-icons"])
    .argument("<iconName>", "badge icon name")
    .action(async(iconName) => {
      const data = await kvApi.get(["badgeIcons", iconName]);
      logger.debug(JSON.stringify(data))
      if (data.value != null && data.versionstamp != null) {
        logger.info(data.value)
      } else {
        logger.warn(`badge icon with name ${iconName} may either not found or the KV value is blank`)
      }
    })

program
  .command("badges:add")
  .argument("<project>", "project slug")
  .argument("<name>", "badge name")
  .requiredOption(
    "-t, --type <badge|redirect>",
    "whether to generate SVG at server-side or do a redirect",
    "badge"
  )
  .option("-u, --url <link>", "URL of the badge image to redirect into")
  .option("-m, --message <text>", "message")
  .option("-c, --color <color>", "messgae color", "lightgray")
  .option("-lc, --label-color <color>", "label color", "gray")
  .option("-l, --label <text>", "badge label")
  .option("--links [links...]")
  .option("-i, --logo <logoName>", "logo name")
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
            label: options.label || null,
            labelColor: options.labelColor,
            color: options.color,
            message: options.message,
            logo: options.logo || null,
            style: options.style,
            links: options.links || null
        }

        // try resolving the logo name first before commiting to KV
        if (data.logo != null) {
          const badgeIconData = (await kvApi.get(["badgeIcons", data.logo])).value;
          logger.debug(`resolved icon data: ${badgeIconData}`)
          if (badgeIconData == null) {
            logger.error(`Cannot resolve logo name ${data.logo} from API`)
            Deno.exit(1)
          }
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

program
  .command("resolve")
  .argument("<project>")
  .argument("<badge>")
  .action(async(project, badge) => {
    logger.debug(`namespace: ${project}/${badge}`)
    const data = await kvApi.get(["staticBadges", project, badge]);
    logger.debug(JSON.stringify(data))
    const result = await data.value
    if (result != null) {
      if (result.type == "redirect") {
        logger.info(result.data.redirectUrl)
      } else {
        const logoBase64 = result.data.logo != null ? (await kvApi.get(["badgeIcons", result.data.logo])).value : null
        const badgeData = {
          message: result.data.message,
          style: result.data.style,
          color: result.data.color
        }

        if (logoBase64 != null) Object.assign(badgeData, {logoBase64})
        if (result.data.label != null) Object.assign(badgeData, {
          label: result.data.label,
          labelColor: result.data.labelColor
        })

        logger.debug(JSON.stringify(badgeData))

        const badge = makeBadge(badgeData);
        logger.info(badge)
      }
    } else {
      logger.warn(`badge ${badge} for project ${project} does not exist in KV`)
    }
  })

program.parse()