// models/TransactionRecordModel.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ITransactionRecord extends Document {
  txHash: string;
  amount: number; // dalam USDC
  recipient: string;
  payrollId?: string; // opsional, untuk relasi ke payroll
  status: "PENDING" | "SUCCESS" | "FAILED";
  createdAt: Date;
}

const TransactionRecordSchema = new Schema<ITransactionRecord>({
  txHash: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  recipient: { type: String, required: true },
  payrollId: { type: String, required: false },
  status: {
    type: String,
    enum: ["PENDING", "SUCCESS", "FAILED"],
    default: "PENDING",
  },
  createdAt: { type: Date, default: Date.now },
});

export const TransactionRecordModel = mongoose.model<ITransactionRecord>(
  "TransactionRecord",
  TransactionRecordSchema
);
