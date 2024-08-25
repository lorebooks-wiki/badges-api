const loggerPrefix = "@lorebooks-wiki/badges-api-utils"
import { getColor, bold } from "./colors.ts";

const levels = {
  error: 0,
  errorv: 0,
  errorvp: 0,
  errorvpb: 0,
  errornocolor: 0,
  warn: 1,
  warnv: 1,
  warnvp: 1,
  warnvpb: 1,
  success: 2,
  successv: 2,
  successvp: 2,
  successvpb: 2,
  info: 2,
  help: 2,
  help2: 2,
  blank: 2,
  verbose: 4,
  debug: 5,
  silly: 6,
};

const error = (m: string) => bold(getColor("red")(m));
const warn = getColor("orangered");
const success = getColor("green");
const successv = getColor("olive"); // yellow-ish tint that 'looks' like dotenv
const help = getColor("blue");
const help2 = getColor("gray");
const verbose = getColor("plum");
const debug = getColor("plum");

let currentLevel = levels.info; // default log level

function log(level: string, message: string) {
  //@ts-expect-error
  if (levels[level] === undefined) {
    throw new Error(`MISSING_LOG_LEVEL: '${level}'. implement in logger.`);
  }

  //@ts-expect-error
  if (levels[level] <= currentLevel) {
    const formattedMessage = formatMessage(level, message);
    console.log(formattedMessage);
  }
}

export function formatMessage(level: string, message: string) {
  const formattedMessage =
    typeof message === "object" ? JSON.stringify(message) : message;

  switch (level.toLowerCase()) {
    // errors
    case "error":
      return error(formattedMessage);
    case "errorv":
      return error(`[${loggerPrefix}] ${formattedMessage}`);
    case "errorvp":
      return error(`[${loggerPrefix}][precommit] ${formattedMessage}`);
    case "errorvpb":
      return error(`[${loggerPrefix}][prebuild] ${formattedMessage}`);
    case "errornocolor":
      return formattedMessage;
    // warns
    case "warn":
      return warn(formattedMessage);
    case "warnv":
      return warn(`[${loggerPrefix}] ${formattedMessage}`);
    case "warnvp":
      return warn(`[${loggerPrefix}][precommit] ${formattedMessage}`);
    case "warnvpb":
      return warn(`[${loggerPrefix}][prebuild] ${formattedMessage}`);
    // successes
    case "success":
      return success(formattedMessage);
    case "successv": // success with 'version'
      return successv(`[${loggerPrefix}] ${formattedMessage}`);
    case "successvp": // success with 'version' and precommit
      return success(`[${loggerPrefix}][precommit] ${formattedMessage}`);
    case "successvpb": // success with 'version' and precommit
      return success(`[${loggerPrefix}][prebuild] ${formattedMessage}`);
    // info
    case "info":
      return formattedMessage;
    // help
    case "help":
      return help(formattedMessage);
    case "help2":
      return help2(formattedMessage);
    // verbose
    case "verbose":
      return verbose(formattedMessage);
    // debug
    case "debug":
      return debug(formattedMessage);
    // blank
    case "blank": // custom
      return formattedMessage;
  }
}

export const logger = {
  // track level
  level: "info",

  // errors
  error: (msg: string) => log("error", msg),
  errorv: (msg: string) => log("errorv", msg),
  errorvp: (msg: string) => log("errorvp", msg),
  errorvpb: (msg: string) => log("errorvpb", msg),
  errornocolor: (msg: string) => log("errornocolor", msg),
  // warns
  warn: (msg: string) => log("warn", msg),
  warnv: (msg: string) => log("warnv", msg),
  warnvp: (msg: string) => log("warnvp", msg),
  warnvpb: (msg: string) => log("warnvpb", msg),
  // success
  success: (msg: string) => log("success", msg),
  successv: (msg: string) => log("successv", msg),
  successvp: (msg: string) => log("successvp", msg),
  successvpb: (msg: string) => log("successvpb", msg),
  // info
  info: (msg: string) => log("info", msg),
  // help
  help: (msg: string) => log("help", msg),
  help2: (msg: string) => log("help2", msg),
  // verbose
  verbose: (msg: string) => log("verbose", msg),
  // debug
  debug: (msg: string) => log("debug", msg),
  // blank
  blank: (msg: string) => log("blank", msg),
  //@ts-expect-error: used by setLogLevel and friends
  setLevel: (level) => {
    //@ts-expect-error: see above
    if (levels[level] !== undefined) {
      //@ts-expect-error: we need to fetch from levels object
      currentLevel = levels[level];
      logger.level = level;
    }
  },
};

// @ts-expect-error: needed by global logs
export function setLogLevel(options) {
  const logLevel = options.debug
    ? "debug"
    : options.verbose
    ? "verbose"
    : options.quiet
    ? "error"
    : options.logLevel;

  if (!logLevel) return;
  logger.setLevel(logLevel);
  // Only log which level it's setting if it's not set to quiet mode
  if (!options.quiet || (options.quiet && logLevel !== "error")) {
    logger.debug(`Setting log level to ${logLevel}`);
  }
}
