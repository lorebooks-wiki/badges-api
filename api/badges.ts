import { OpenAPIRoute } from "chanfana";
import { z } from "zod";

export class generateSvg extends OpenAPIRoute {
  schema = {
    tags: ["badges"],
    summary: "Generate a SVG image of a badge.",
    parameters: [
        {
            name: "project",
            in: "path",
            required: true
        },
        {
            name: "badge_name",
            in: "path",
            required: true
        }
    ],
  };
}
