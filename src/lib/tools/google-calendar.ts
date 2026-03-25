import { tool } from "ai";
import { z } from "zod/v3";
import { Auth0AI, getAccessTokenFromTokenVault } from "@auth0/ai-vercel";
import { auth0 } from "@/lib/auth0";

const auth0AI = new Auth0AI();

const withGoogleCalendarRead = auth0AI.withTokenVault({
  connection: "google-oauth2",
  scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
  refreshToken: async () => {
    const session = await auth0.getSession();
    return session?.tokenSet.refreshToken as string;
  },
});

const withGoogleCalendarWrite = auth0AI.withTokenVault({
  connection: "google-oauth2",
  scopes: ["https://www.googleapis.com/auth/calendar.events"],
  refreshToken: async () => {
    const session = await auth0.getSession();
    return session?.tokenSet.refreshToken as string;
  },
});

export const checkCalendar = withGoogleCalendarRead(
  tool({
    description:
      "Check Google Calendar for upcoming events. Returns events for the next 7 days by default.",
    inputSchema: z.object({
      timeMin: z
        .string()
        .optional()
        .describe("Start time in ISO 8601 format (defaults to now)"),
      timeMax: z
        .string()
        .optional()
        .describe("End time in ISO 8601 format (defaults to 7 days from now)"),
      maxResults: z
        .number()
        .optional()
        .default(10)
        .describe("Maximum number of events to return"),
    }),
    execute: async ({ timeMin, timeMax, maxResults }) => {
      const accessToken = getAccessTokenFromTokenVault();
      const now = new Date();
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      const params = new URLSearchParams({
        timeMin: timeMin || now.toISOString(),
        timeMax: timeMax || weekFromNow.toISOString(),
        maxResults: String(maxResults || 10),
        singleEvents: "true",
        orderBy: "startTime",
      });

      const res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (!res.ok) {
        const error = await res.text();
        throw new Error(`Google Calendar API error: ${error}`);
      }

      const data = await res.json();
      const events = (data.items || []).map(
        (event: Record<string, unknown>) => ({
          title: event.summary,
          start:
            (event.start as Record<string, string>)?.dateTime ||
            (event.start as Record<string, string>)?.date,
          end:
            (event.end as Record<string, string>)?.dateTime ||
            (event.end as Record<string, string>)?.date,
          location: event.location,
          description: (event.description as string)?.substring(0, 200),
          link: event.htmlLink,
        })
      );

      return { count: events.length, events };
    },
  })
);

export const createEvent = withGoogleCalendarWrite(
  tool({
    description: "Create a new event on Google Calendar.",
    inputSchema: z.object({
      title: z.string().describe("Event title"),
      startTime: z.string().describe("Start time in ISO 8601 format"),
      endTime: z.string().describe("End time in ISO 8601 format"),
      description: z.string().optional().describe("Event description"),
      location: z.string().optional().describe("Event location"),
    }),
    execute: async ({ title, startTime, endTime, description, location }) => {
      const accessToken = getAccessTokenFromTokenVault();

      const event = {
        summary: title,
        start: { dateTime: startTime, timeZone: "UTC" },
        end: { dateTime: endTime, timeZone: "UTC" },
        description,
        location,
      };

      const res = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(event),
        }
      );

      if (!res.ok) {
        const error = await res.text();
        throw new Error(`Failed to create event: ${error}`);
      }

      const created = await res.json();
      return {
        success: true,
        event: {
          id: created.id,
          title: created.summary,
          start: created.start?.dateTime,
          end: created.end?.dateTime,
          link: created.htmlLink,
        },
      };
    },
  })
);
