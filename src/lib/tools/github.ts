import { tool } from "ai";
import { z } from "zod/v3";
import { Auth0AI, getAccessTokenFromTokenVault } from "@auth0/ai-vercel";
import { auth0 } from "@/lib/auth0";

const auth0AI = new Auth0AI();

const withGitHub = auth0AI.withTokenVault({
  connection: "github",
  scopes: ["repo", "read:user"],
  refreshToken: async () => {
    const session = await auth0.getSession();
    return session?.tokenSet.refreshToken as string;
  },
});

export const listRepos = withGitHub(
  tool({
    description: "List GitHub repositories for the authenticated user.",
    inputSchema: z.object({
      sort: z
        .enum(["updated", "created", "pushed", "full_name"])
        .optional()
        .default("updated")
        .describe("Sort order for repositories"),
      limit: z
        .number()
        .optional()
        .default(10)
        .describe("Number of repos to return"),
    }),
    execute: async ({ sort, limit }) => {
      const accessToken = getAccessTokenFromTokenVault();

      const res = await fetch(
        `https://api.github.com/user/repos?sort=${sort || "updated"}&per_page=${limit || 10}&type=owner`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (!res.ok) {
        const error = await res.text();
        throw new Error(`GitHub API error: ${error}`);
      }

      const repos = await res.json();
      return {
        count: repos.length,
        repos: repos.map(
          (repo: Record<string, unknown>) => ({
            name: repo.name,
            fullName: repo.full_name,
            description: repo.description,
            url: repo.html_url,
            language: repo.language,
            stars: repo.stargazers_count,
            openIssues: repo.open_issues_count,
            updatedAt: repo.updated_at,
            isPrivate: repo.private,
          })
        ),
      };
    },
  })
);

export const getIssues = withGitHub(
  tool({
    description: "Get issues from a specific GitHub repository.",
    inputSchema: z.object({
      owner: z.string().describe("Repository owner (username or org)"),
      repo: z.string().describe("Repository name"),
      state: z
        .enum(["open", "closed", "all"])
        .optional()
        .default("open")
        .describe("Filter by issue state"),
      limit: z
        .number()
        .optional()
        .default(10)
        .describe("Number of issues to return"),
    }),
    execute: async ({ owner, repo, state, limit }) => {
      const accessToken = getAccessTokenFromTokenVault();

      const res = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/issues?state=${state || "open"}&per_page=${limit || 10}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (!res.ok) {
        const error = await res.text();
        throw new Error(`GitHub API error: ${error}`);
      }

      const issues = await res.json();
      return {
        count: issues.length,
        repo: `${owner}/${repo}`,
        issues: issues.map(
          (issue: Record<string, unknown>) => ({
            number: issue.number,
            title: issue.title,
            state: issue.state,
            url: issue.html_url,
            author: (issue.user as Record<string, unknown>)?.login,
            labels: ((issue.labels as Array<Record<string, unknown>>) || []).map(
              (l) => l.name
            ),
            createdAt: issue.created_at,
            body: (issue.body as string)?.substring(0, 200),
          })
        ),
      };
    },
  })
);

export const createIssue = withGitHub(
  tool({
    description: "Create a new issue in a GitHub repository.",
    inputSchema: z.object({
      owner: z.string().describe("Repository owner (username or org)"),
      repo: z.string().describe("Repository name"),
      title: z.string().describe("Issue title"),
      body: z
        .string()
        .optional()
        .describe("Issue body/description in Markdown"),
      labels: z
        .array(z.string())
        .optional()
        .describe("Labels to apply to the issue"),
    }),
    execute: async ({ owner, repo, title, body, labels }) => {
      const accessToken = getAccessTokenFromTokenVault();

      const res = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/issues`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, body, labels }),
        }
      );

      if (!res.ok) {
        const error = await res.text();
        throw new Error(`Failed to create issue: ${error}`);
      }

      const issue = await res.json();
      return {
        success: true,
        issue: {
          number: issue.number,
          title: issue.title,
          url: issue.html_url,
          state: issue.state,
        },
      };
    },
  })
);
