import Joi from "joi";
import {
  toSvgColor,
  brightness,
  normalizeColor,
} from "badge-maker/lib/color.js";
import coalesce from "@badges/shields/core/base-service/coalesce.js";
import {
  svg2base64,
  getIconSize,
  resetIconPosition,
} from "@badges/shields/lib/svg-helpers.js";
import loadSimpleIcons from "@badges/shields/lib/load-simple-icons.js";
const simpleIcons = loadSimpleIcons();

// for backwards-compatibility with deleted logos
const logoAliases = {
  azuredevops: "azure-devops",
  eclipse: "eclipse-ide",
  "gitter-white": "gitter",
  scrutinizer: "scrutinizer-ci",
  stackoverflow: "stack-overflow",
  tfs: "azure-devops",
  travis: "travisci",
};
const lightThreshold = 0.4;
const darkThreshold = 0.6;

function prependPrefix(s: string, prefix: string) {
  if (s === undefined) {
    return undefined;
  }

  s = `${s}`;

  if (s.startsWith(prefix)) {
    return s;
  } else {
    return prefix + s;
  }
}

function isDataUrl(s: string) {
  try {
    Joi.assert(s, Joi.string().dataUri());
    return true;
  } catch (e) {
    return false;
  }
}

// +'s are replaced with spaces when used in query params, this returns them
// to +'s, then removes remaining whitespace.
// https://github.com/badges/shields/pull/1546
function decodeDataUrlFromQueryParam(value: string) {
  if (typeof value !== "string") {
    return undefined;
  }
  const maybeDataUrl = prependPrefix(value, "data:")
    .replace(/ /g, "+")
    .replace(/\s/g, "");
  return isDataUrl(maybeDataUrl) ? maybeDataUrl : undefined;
}

function getSimpleIconStyle({ icon, style }: { style: string }) {
  const { hex } = icon;
  if (style !== "social" && brightness(normalizeColor(hex)) <= lightThreshold) {
    return "light";
  }
  if (style === "social" && brightness(normalizeColor(hex)) >= darkThreshold) {
    return "dark";
  }
  return "default";
}

// The `size` parameter is used to determine whether the icon should be resized
// to fit the badge. If `size` is 'auto', the icon will be resized to fit the
// badge. If `size` is not 'auto', the icon will be displayed at its original.
// https://github.com/badges/shields/pull/9191
function getSimpleIcon({ name, color, style, size }) {
  const key = name;

  if (!(key in simpleIcons)) {
    return undefined;
  }

  let iconSvg;

  const svgColor = toSvgColor(color);
  if (svgColor) {
    iconSvg = simpleIcons[key].svg.replace("<svg", `<svg fill="${svgColor}"`);
  } else {
    const iconStyle = getSimpleIconStyle({ icon: simpleIcons[key], style });
    iconSvg = simpleIcons[key].styles[iconStyle];
  }

  if (size === "auto") {
    const { width: iconWidth, height: iconHeight } = getIconSize(key);

    if (iconWidth > iconHeight) {
      const path = resetIconPosition(simpleIcons[key].path);
      iconSvg = iconSvg
        .replace('viewBox="0 0 24 24"', `viewBox="0 0 24 ${iconHeight}"`)
        .replace(/<path d=".*"\/>/, `<path d="${path}"/>`);
    }
  }

  return svg2base64(iconSvg);
}

function prepareNamedLogo({ name, color, style, size }) {
  if (typeof name !== "string") {
    return undefined;
  }

  name = name.toLowerCase();

  if (name in logoAliases) {
    name = logoAliases[name];
  }

  return getSimpleIcon({ name, color, style, size });
}

interface makeLogo {
  defaultNamedLogo: string;
  overrides: {
    logoColor: string;
    style: string;
    logoSize: string;
    logo: string;
  };
}

function makeLogo(
  defaultNamedLogo: makeLogo["defaultNamedLogo"],
  overrides: makeLogo["overrides"]
) {
  const removePrefix = "/si:|simple-icons:|simple-icons/|si//m";
  const maybeDataUrl = decodeDataUrlFromQueryParam(
    overrides.logo.replace(removePrefix, "")
  );
  if (maybeDataUrl) {
    return maybeDataUrl;
  } else {
    return prepareNamedLogo({
      name: coalesce(
        overrides.logo,
        defaultNamedLogo.replace(removePrefix, "")
      ),
      color: overrides.logoColor,
      style: overrides.style,
      size: overrides.logoSize,
    });
  }
}

export {
  prependPrefix,
  isDataUrl,
  decodeDataUrlFromQueryParam,
  prepareNamedLogo,
  getSimpleIcon,
  makeLogo,
};
