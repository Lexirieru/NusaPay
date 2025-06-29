// models/TransactionRecordModel.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ITransactionRecord extends Document {
  txId: string;
  userId: string;
  txHash: string;
  amount: number; // dalam USDC
  recipient: string;
  status: "PENDING" | "SUCCESS" | "FAILED";
  createdAt: Date;
}

const TransactionRecordSchema = new Schema<ITransactionRecord>({
  txId: { type: String, required: true, unique: true },
  txHash: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  recipient: { type: String, required: true },
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
