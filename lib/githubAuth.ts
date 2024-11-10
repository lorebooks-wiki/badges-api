import { config, getValidatedGithubToken } from "./config.ts";
import { kv } from "./db.ts";
import { encodeHex } from "jsr:@std/encoding/hex";
import { Octokit } from "@octokit/rest";

const kvApi = await kv(config.kvUrl);
const msgBuffer = (msg: string) => new TextEncoder().encode(msg);
export const github = (token: string) => new Octokit({
  auth: token,
  userAgent: `@lorebooks-wiki/badges-api $({config.homepage})`
})

export type UserDataOps = {
  id: number | null;
  node_id: string | null;
  teamMembership: {
    status: "pending" | "active" | null;
    role: "member" | "maintainer" | null;
    error?: string | object;
  };
  expires_in: number
}

export async function handleGitHubAuth(
  token: string,
  adminEndpoint?: boolean,
  forceCheck?: boolean
) {
  const tokHash = await hashToken(token);
  const key = ["cachedGitHubTokenHash", tokHash];
  const expireIn = 300000;
  let now = Date.now();
  let ttl = now + (5 * 60 * 1000);
  let fiveMinsAgo = now - (5 * 60 * 1000);
  let authData: UserDataOps = {
    id: null,
    node_id: null,
    teamMembership: {
      status: null,
      role: null,
    },
    expires_in: 0,
  };

  try {
    const cachedAuthData = await kvApi.get<UserDataOps>(key);
    console.log(`[api-auth-debug]: cachedAuthData: ${JSON.stringify(cachedAuthData)}`)

    if (cachedAuthData.value == null || forceCheck == true) {
      const user = await getAuthenticatedUser(token);
      const { status, role } = await checkTeamMembership(user.login || "missing-username")

      if (status === null) {
        return false
      }
      authData = {
        id: user.id,
        node_id: user.node_id,
        teamMembership: {
          status,
          role
        },
        expires_in: ttl
      }

      await kvApi.set(key, authData, { expireIn })

    } else {
      authData = cachedAuthData.value
      if (now >= authData.expires_in || authData.expires_in === undefined) {
        console.log(`[auth-checks] ttl elapsed for ${key.toString()}, updating record (current: ${fiveMinsAgo}, was: ${authData.expires_in})`)
        const user = await getAuthenticatedUser(token);
        const { status, role } = await checkTeamMembership(user.login || "missing-username")

        if (status === null) {
          return false
        }
        authData = {
          id: user.id,
          node_id: user.node_id,
          teamMembership: {
            status,
            role
          },
          expires_in: ttl
        }

        await kvApi.set(key, authData, { expireIn })
      }
      console.log(`[auth-checks] ttl not yet elapsed for ${key.toString()} (current: ${fiveMinsAgo}, was: ${cachedAuthData.value.expires_in})`)
    }
    console.log(JSON.stringify(authData))

    if (adminEndpoint === true && authData.teamMembership.status !== "active") {
      return false
    }
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}

async function getAuthenticatedUser(token: string) {
  try {
    const { data } = await github(token).users.getAuthenticated()
    return {
      login: data.login,
      id: data.id,
      node_id: data.node_id,
    };
  } catch (error) {
    console.error(error)
    return {
      login: null,
      id: null,
      node_id: null
    }
  }
}

async function checkTeamMembership(username: string) {
  const { authServiceToken, org, team_slug } = config.github;
  if (username === "missing-username") {
    return {
      status: null,
      role: null,
    };
  }

  try {
    const { status, data } = await github(authServiceToken).teams.getMembershipForUserInOrg({
      org,
      team_slug,
      username
    })

    if (status === 200) {
      return { status: data.state, role: data.role };
    } else {
      return {
        status: null,
        role: null,
      };
    }
  } catch (err) {
    console.error(err);
    return {
      status: null,
      role: null,
      error: err,
    };
  }
}

/**
 * Hash a GitHub token into SHA-215 encoded text.
 * @param token Any string, but for this case, a GitHub token
 * @returns 
 */
export async function hashToken(token: string) {
  const validatedToken = getValidatedGithubToken(token)
  const msg = msgBuffer(validatedToken);
  const hashBuff = await crypto.subtle.digest("SHA-512", msg);
  return encodeHex(hashBuff);
}
