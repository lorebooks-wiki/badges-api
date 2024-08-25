import * as depth from "./colorDepth.ts";

const colors16 = new Map([
  ["blue", 34],
  ["gray", 37],
  ["green", 32],
  ["olive", 33],
  ["orangered", 31], // mapped to red
  ["plum", 35], // mapped to magenta
  ["red", 31],
]);

const colors256 = new Map([
  ["blue", 21],
  ["gray", 244],
  ["green", 34],
  ["olive", 142],
  ["orangered", 202],
  ["plum", 182],
  ["red", 196],
]);

export function getColor(color: string) {
  const colorDepth = depth.getColorDepth();
  if (!colors256.has(color)) {
    throw new Error(`Invalid color ${color}`);
  }
  if (colorDepth >= 8) {
    const code = colors256.get(color);
    return (message: string) => `\x1b[38;5;${code}m${message}\x1b[39m`;
  }
  if (colorDepth >= 4) {
    const code = colors16.get(color);
    return (message: string) => `\x1b[${code}m${message}\x1b[39m`;
  }
  return (message: string) => message;
}

export function bold(message: string) {
  if (depth.getColorDepth() >= 4) {
    return `\x1b[1m${message}\x1b[22m`;
  }

  return message;
}
