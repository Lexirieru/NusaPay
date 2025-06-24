import mongoose, { Schema } from "mongoose";

const EmployeeDataSchema = new Schema(
  {
    // Company mana yang punya employee ini
    companyAccount: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    bankCode: {
      type: Number,
      required: true,
    },
    bankAccount: {
      type: Number,
      required: true,
    },
    bankAccountName: {
      type: String,
      required: true,
    },
    walletAddress: {
      type: String,
      required: true,
    },
    networkChainId: {
      type: Number,
      required: true,
    },
    amountTransfer: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

export const EmployeeModel = mongoose.model("EmployeeData", EmployeeDataSchema);

const GroupOfEmployeeSchema = new Schema(
  {
    // Company mana yang punya group of employee ini
    companyAccount: {
      type: String,
      required: true,
    },
    nameOfGroup: {
      type: String,
      required: true,
    },
    employees: [
      {
        id: {
          type: Schema.Types.ObjectId,
          ref: "EmployeeData",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
      },
    ],
    totalRecipients: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

export const GroupOfEmployeeData = mongoose.model(
  "GroupOfEmployeeData",
  GroupOfEmployeeSchema
);
