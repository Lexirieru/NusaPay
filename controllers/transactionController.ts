import { Request, Response } from "express";
import { PayrollModel, PayrollDetailModel } from "../models/payrollModel"; // Pastikan path-nya benar
import mongoose from "mongoose";
export async function addPayrollData(req: Request, res: Response) {
  const {
    companyAccount,
    companyWalletAddress,
    status,
    totalAmount,
    totalRecipients,
  } = req.body;

  try {
    const newPayroll = new PayrollModel({
      companyAccount,
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
  const { companyAccount } = req.body;
  try {
    // Ambil 5 data terbaru berdasarkan timestamp (atau bisa juga pakai _id)
    const latestPayrolls = await PayrollModel.find({ companyAccount })
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
    companyAccount,
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
      companyAccount,
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
  const { id } = req.body;

  try {
    const ObjectId = new mongoose.Types.ObjectId(id); // konversi ke ObjectId
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
