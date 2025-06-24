import mongoose, { Schema } from "mongoose";

// model untuk bentuk data informasi terkait company
const CompanyDataSchema = new Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    walletAddress: {
      type: String,
      required: false,
    },
    networkChainId: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

export const CompanyDataModel = mongoose.model(
  "Companydata",
  CompanyDataSchema
);
