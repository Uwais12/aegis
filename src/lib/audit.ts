import { connectDB } from "./mongodb";
import { AuditEntry } from "./models/audit";

export async function logAudit(entry: {
  userId: string;
  toolName: string;
  tier: "read" | "write" | "sensitive";
  connection: string;
  status: "success" | "error" | "pending" | "denied";
  details?: string;
  args?: Record<string, unknown>;
}) {
  try {
    await connectDB();
    await AuditEntry.create({
      ...entry,
      timestamp: new Date(),
    });
  } catch (err) {
    console.error("Failed to log audit entry:", err);
  }
}

export async function getAuditLog(userId: string, limit = 50) {
  await connectDB();
  return AuditEntry.find({ userId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .lean();
}
