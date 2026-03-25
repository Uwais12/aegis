import { tool } from "ai";
import { z } from "zod/v3";
import { Auth0AI, getAccessTokenFromTokenVault } from "@auth0/ai-vercel";
import { auth0 } from "@/lib/auth0";

const auth0AI = new Auth0AI();

const withGmailRead = auth0AI.withTokenVault({
  connection: "google-oauth2",
  scopes: ["https://www.googleapis.com/auth/gmail.readonly"],
  refreshToken: async () => {
    const session = await auth0.getSession();
    return session?.tokenSet.refreshToken as string;
  },
});

const withGmailSend = auth0AI.withTokenVault({
  connection: "google-oauth2",
  scopes: ["https://www.googleapis.com/auth/gmail.send"],
  refreshToken: async () => {
    const session = await auth0.getSession();
    return session?.tokenSet.refreshToken as string;
  },
});

export const searchEmails = withGmailRead(
  tool({
    description:
      "Search Gmail inbox for emails. Supports Gmail search operators.",
    inputSchema: z.object({
      query: z
        .string()
        .describe("Gmail search query (e.g., 'from:example@gmail.com')"),
      maxResults: z
        .number()
        .optional()
        .default(5)
        .describe("Maximum number of emails to return"),
    }),
    execute: async ({ query, maxResults }) => {
      const accessToken = getAccessTokenFromTokenVault();

      const params = new URLSearchParams({
        q: query,
        maxResults: String(maxResults || 5),
      });

      const listRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages?${params}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (!listRes.ok) {
        const error = await listRes.text();
        throw new Error(`Gmail API error: ${error}`);
      }

      const listData = await listRes.json();
      const messages = listData.messages || [];

      const emails = await Promise.all(
        messages
          .slice(0, maxResults || 5)
          .map(async (msg: { id: string }) => {
            const msgRes = await fetch(
              `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`,
              { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            const msgData = await msgRes.json();
            const headers = msgData.payload?.headers || [];
            return {
              id: msg.id,
              from: headers.find(
                (h: { name: string }) => h.name === "From"
              )?.value,
              subject: headers.find(
                (h: { name: string }) => h.name === "Subject"
              )?.value,
              date: headers.find(
                (h: { name: string }) => h.name === "Date"
              )?.value,
              snippet: msgData.snippet,
            };
          })
      );

      return { count: emails.length, emails };
    },
  })
);

export const sendEmail = withGmailSend(
  tool({
    description:
      "Send an email via Gmail. This is a SENSITIVE action.",
    inputSchema: z.object({
      to: z.string().describe("Recipient email address"),
      subject: z.string().describe("Email subject line"),
      body: z.string().describe("Email body (plain text)"),
    }),
    execute: async ({ to, subject, body }) => {
      const accessToken = getAccessTokenFromTokenVault();

      const email = [
        `To: ${to}`,
        `Subject: ${subject}`,
        "Content-Type: text/plain; charset=utf-8",
        "",
        body,
      ].join("\r\n");

      const encodedEmail = Buffer.from(email)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      const res = await fetch(
        "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ raw: encodedEmail }),
        }
      );

      if (!res.ok) {
        const error = await res.text();
        throw new Error(`Failed to send email: ${error}`);
      }

      const sent = await res.json();
      return { success: true, messageId: sent.id, to, subject };
    },
  })
);
