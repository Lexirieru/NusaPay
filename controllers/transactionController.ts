import { Request, Response, response } from "express";
import { PayrollModel, PayrollDetailModel } from "../models/payrollModel"; // Pastikan path-nya benar
import { TransactionRecordModel } from "../models/transactionRecordModel";
import mongoose from "mongoose";
import axios from "axios";

export async function recordTransactionToDB({
  txId,
  userId,
  txHash,
  recipient,
  amount,
}: {
  txId: string;
  userId: string;
  txHash: string;
  recipient: string;
  amount: number;
}) {
  const newTx = new TransactionRecordModel({
    txId,
    userId,
    txHash,
    recipient,
    amount,
    status: "PENDING",
  });

  await newTx.save();
  console.log(`✅ Transaction recorded to DB: ${txHash}`);
}

export async function addInvoiceData(req: Request, res: Response) {}

export async function loadInvoiceData(req: Request, res: Response) {}
// buat controller untuk ngasih akses ke FE biar bisa akses status berdasarkan txIdnya
export async function loadTransactionStatusData(req: Request, res: Response) {
  const { txHash } = req.body;

  try {
    // Ambil 5 data terbaru berdasarkan timestamp (atau bisa juga pakai _id)
    const latestPayrolls = await TransactionRecordModel.findOne({ txHash });

    try {
      const response = await axios.get(
        `https://idrx.co/api/transaction/user-transaction-history?transactionType=DEPOSIT_REDEEM&txHash=${txHash}&page=1&take=1`
      );
      if (!response.data) {
        res.status(400).json({
          status: response.data.records[0].status,
        });
      } else {
        console.log(response);
        console.log("[API Response]", response.data);
        res.status(201).json({
          status: response.data.records[0].status,
        });
      }
    } catch (err: any) {
      console.error("[Failed to call redeem-request]", err);
      res.status(500).json({
        message: "Error fetching transaction status from IDRX",
        err: err.message,
      });
    }

    res.status(200).json({
      message: "Successfully fetched latest payrolls",
      data: latestPayrolls,
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Error fetching data",
      error: err.message,
    });
  }
}

export async function addPayrollData(req: Request, res: Response) {
  const {
    companyId,
    companyName,
    companyWalletAddress,
    status,
    totalAmount,
    totalRecipients,
  } = req.body;

  try {
    const newPayroll = new PayrollModel({
      companyId,
      companyName,
      companyWalletAddress,
      status,
      totalAmount,
      totalRecipients,
    });

    const saved = await newPayroll.save();
    res.status(201).json({
      message: "Payroll data successfully added",
      payroll: saved,
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Error adding payroll data",
      error: err.message,
    });
  }
}

export async function loadPayrollData(req: Request, res: Response) {
  const { companyId } = req.body;
  try {
    // Ambil 5 data terbaru berdasarkan timestamp (atau bisa juga pakai _id)
    const latestPayrolls = await PayrollModel.find({ companyId })
      .sort({ timestamp: -1 }) // descending (terbaru di atas)
      .limit(5)
      .lean(); // supaya hasilnya plain JS object dan lebih cepat

    res.status(200).json({
      message: "Successfully fetched latest payrolls",
      data: latestPayrolls,
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Error fetching data",
      error: err.message,
    });
  }
}

export async function addPayrollDetailsData(req: Request, res: Response) {
  const {
    companyId,
    companyName,
    // payrollId ambil dari _id nya PayrollData
    payrollId,
    walletAddress,
    networkChainId,
    txHash,
    amount,
    bankAccountName,
    bankAccountNumberHash,
    bankName,
    bankCode,
    status,
  } = req.body;

  try {
    const newPayrollDetail = new PayrollDetailModel({
      companyId,
      companyName,
      payrollId,
      walletAddress,
      networkChainId,
      txHash,
      amount,
      bankAccountName,
      bankAccountNumberHash,
      bankName,
      bankCode,
      status,
    });

    const saved = await newPayrollDetail.save();
    res.status(201).json({
      message: `Payroll details data for ${bankAccountName} has successfully added`,
      payroll: saved,
    });
  } catch (err: any) {
    res.status(500).json({
      message: `Error adding payroll details data for ${bankAccountName}`,
      error: err.message,
    });
  }
}

export async function loadPayrollDetailsData(req: Request, res: Response) {
  // Loadnya berdasarkan id unique yang di generate sama mongodb
  const { _id } = req.body;

  try {
    const ObjectId = new mongoose.Types.ObjectId(_id); // konversi ke ObjectId
    // Ambil 5 data terbaru berdasarkan timestamp (atau bisa juga pakai _id)
    const latestPayrolls = await PayrollDetailModel.find({
      payrollId: ObjectId,
    })
      .sort({ timestamp: -1 }) // descending (terbaru di atas)
      .lean(); // supaya hasilnya plain JS object dan lebih cepat

    res.status(200).json({
      message: "Successfully fetched payrolls details data",
      data: latestPayrolls,
    });
  } catch (err: any) {
    res.status(500).json({
      message: "Error fetching data",
      error: err.message,
    });
  }
}
