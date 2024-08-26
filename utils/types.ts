/*
 * Copied from badge-maker's makeBadge types 
 */
export interface Format {
  label?: string;
  message: string;
  labelColor?: string;
  color?: string;
  style?: "plastic" | "flat" | "flat-square" | "for-the-badge" | "social";
  logoBase64?: string;
  links?: Array<string>;
}