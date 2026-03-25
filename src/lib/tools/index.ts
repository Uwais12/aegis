import { checkCalendar, createEvent } from "./google-calendar";
import { searchEmails, sendEmail } from "./google-gmail";
import { listRepos, getIssues, createIssue } from "./github";

export const agentTools = {
  checkCalendar,
  searchEmails,
  listRepos,
  getIssues,
  createEvent,
  createIssue,
  sendEmail,
};
