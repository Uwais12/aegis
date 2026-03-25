import mongoose, { Schema, Document } from "mongoose";

export interface IAuditEntry extends Document {
  userId: string;
  toolName: string;
  tier: "read" | "write" | "sensitive";
  connection: string;
  status: "success" | "error" | "pending" | "denied";
  timestamp: Date;
  details?: string;
  args?: Record<string, unknown>;
}

const AuditEntrySchema = new Schema<IAuditEntry>({
  userId: { type: String, required: true, index: true },
  toolName: { type: String, required: true },
  tier: {
    type: String,
    required: true,
    enum: ["read", "write", "sensitive"],
  },
  connection: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ["success", "error", "pending", "denied"],
  },
  timestamp: { type: Date, default: Date.now },
  details: { type: String },
  args: { type: Schema.Types.Mixed },
});

export const AuditEntry =
  mongoose.models.AuditEntry ||
  mongoose.model<IAuditEntry>("AuditEntry", AuditEntrySchema);
