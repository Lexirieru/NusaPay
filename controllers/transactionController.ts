import { Request, Response, response } from "express";
import { PayrollModel, PayrollDetailModel } from "../models/payrollModel"; // Pastikan path-nya benar
import { TransactionRecordModel } from "../models/transactionRecordModel";
import mongoose from "mongoose";
import axios from "axios";

// dari sc pas nge emitnya harus ada data data ini sehingga
// ntar mbuat invoicenya ga dari fe tapi dari listening eventnya SC
export async function saveInvoiceData({
  txId,
  companyId,
  templateName,
  txHash,
  amount,
  recipient,
}: {
  txId: string;
  companyId: string;
  templateName: string;
  recipient: { employeeId: string; amount: number }[];
  txHash: string;
  amount: number;
}) {
  const newTx = new TransactionRecordModel({
    txId,
    companyId,
    templateName,
    recipient,
    txHash,
    amount,
    status: "PENDING",
  });

  await newTx.save();
  console.log(`✅ Transaction recorded to DB: ${txHash}`);
}

export async function loadInvoiceData(req: Request, res: Response) {
  const { txId } = req.body;

  try {
    // Ambil 5 data terbaru berdasarkan timestamp (atau bisa juga pakai _id)
    const invoice = await TransactionRecordModel.findOne({ txId });
    if (!invoice) {
      res.status(404).json({
        message: "Invoice not found",
      });
    } else {
      const latestStatus = await loadTransactionStatusData(invoice.txHash);
      invoice.status = latestStatus || "PENDING";

      await invoice.save();

      res.status(200).json({
        message: "Successfully fetched latest invoices",
        data: invoice,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      message: "Error fetching data",
      error: err.message,
    });
  }
}
// buat controller untuk ngasih akses ke FE biar bisa akses status berdasarkan txIdnya
export async function loadTransactionStatusData(txHash: string) {
  try {
    const response = await axios.get(
      `https://idrx.co/api/transaction/user-transaction-history?transactionType=DEPOSIT_REDEEM&txHash=${txHash}&page=1&take=1`
    );
    if (!response.data) {
      console.log(response.data);
      return response.data;
    } else {
      console.log(response);
      console.log("[API Response]", response.data);
      console.log(response.data.records[0].status);
      return response.data.records[0].status;
    }
  } catch (err: any) {
    console.error("[Failed to call redeem-request]", err);
    // return err.message;
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
