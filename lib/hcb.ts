/**
 * @module
 * A Fetch API-based API library for HCB API
 *
 * @license MIT
 */

/**
 * Base URL of HCB API, used internally
 * @link https://hcb.hackclub.com/docs/api/v3
 */
const baseUrl = "https://hcb.hackclub.com/api/v3";

type HcbOrgUser = {
  id: string;
  object: string;
  full_name: string;
  admin: boolean;
  photo: string;
};

type HcbCategory =
  | "hackathon"
  | "hack_club"
  | "nonprofit"
  | "event"
  | "high_school_hackathon"
  | "robotics_team"
  | "hardware_grant"
  | "hack_club_hq"
  | "outernet_guild"
  | "grant_recipient"
  | "salary"
  | "ai"
  | "hcb_internals";

type HcbOrg = {
  id: string;
  object: string;
  href: string;
  name: string;
  slug: string;
  website?: string;
  category: HcbCategory;
  transparent: true;
  demo_mode: boolean;
  logo: string;
  donation_header: "string";
  background_image: "string";
  public_message: "string";
  donation_link: "string";
  balances: {
    balance_cents: number;
    fee_balance_cents: number;
    incoming_balance_cents: number;
    total_raised: number;
  };
  created_at: "string";
  users: Array<HcbOrgUser>;
  message?: string;
};

export async function getOrgData(slug: string): Promise<{
  ok: boolean;
  code: number | null;
  headers: Headers | null;
  result: HcbOrg | Record<string, never>;
  error?: any;
}> {
  try {
    const data = await fetch(`${baseUrl}/organizations/${slug}`);
    return {
      ok: data.ok,
      code: data.status,
      headers: data.headers,
      result: await data.json(),
    };
  } catch (err) {
    throw new Error(err);
  }
}
