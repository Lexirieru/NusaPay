import mongoose, { Schema, Document } from "mongoose";

// TypeScript interface untuk satu penerima
export interface IInvoiceRecipient {
  employeeId: string;
  amount: number;
}

// Interface untuk dokumen transaksi
export interface ITransactionRecord extends Document {
  txId: string;
  companyId: string;
  templateName: string;
  txHash: string;
  amount: string;
  recipients: IInvoiceRecipient[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionRecordSchema = new Schema<ITransactionRecord>(
  {
    txId: {
      type: String,
      required: true,
      unique: true,
    },
    companyId: {
      type: String,
      required: true,
    },
    templateName: {
      type: String,
      required: true,
    },
    txHash: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    recipients: [
      {
        employeeId: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      default: "PENDING",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const TransactionRecordModel = mongoose.model<ITransactionRecord>(
  "TransactionRecord",
  TransactionRecordSchema
);
