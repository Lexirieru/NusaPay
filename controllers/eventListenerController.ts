import { ethers } from "ethers";
import payrollABI from "../abi/payrollABI.json";
import { createSignature } from "./generate_signature";
import env from "dotenv";
import { Request, Response } from "express";

env.config();

export const listenToPayrollEvents = async (req: Request, res: Response) => {
  try {
    // console.log(process.env.CONTRACT_ADDRESS);
    // console.log(process.env.LISK_SEPOLIA_WEBSOCKET);
    const provider = new ethers.providers.WebSocketProvider(
      process.env.LISK_SEPOLIA_WEBSOCKET!
    );

    const contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS!, // e.g. hasil dari `forge create`
      payrollABI,
      provider
    );

    // Listen to PayrollApproved
    contract.on(
      "PayrollApproved",
      (company: string, amount: ethers.BigNumber, event) => {
        console.log(
          `[PayrollApproved] Company ${company} approved ${ethers.utils.formatUnits(
            amount,
            6
          )} IDRX`
        );
      }
    );

    // Listen to PayrollStored
    // contract.on(
    //   "PayrollStored",
    //   (
    //     employee: string,
    //     bankName: string,
    //     bankAccount: string,
    //     nominal: ethers.BigNumber,
    //     event
    //   ) => {
    //     console.log(
    //       `[PayrollStored] Payroll stored for ${employee} | Bank: ${bankName}, Account: ${bankAccount}, Amount: ${ethers.utils.formatUnits(
    //         nominal,
    //         6
    //       )}`
    //     );
    //   }
    // );

    // // Listen to PayrollSigned → Trigger redeem
    // contract.on(
    //   "PayrollSigned",
    //   async (
    //     txHash: string,
    //     employee: string,
    //     bankName: string,
    //     bankAccount: string,
    //     nominal: ethers.BigNumber,
    //     event
    //   ) => {
    //     console.log(`[PayrollSigned] Preparing redeem for ${employee}`);

    //     const payload = {
    //       txHash,
    //       networkChainId: "4202", // Lisk Sepolia chain ID (pastikan sesuai)
    //       amountTransfer: nominal.toString(),
    //       bankAccount,
    //       bankCode: "014", // dummy: BCA
    //       bankName,
    //       bankAccountName: "Nama Dari DB atau Mapping", // Ambil dari DB jika real
    //       walletAddress: employee,
    //     };

    //     const timestamp = Date.now().toString();
    //     const method = "POST";
    //     const url = "/api/redeem-request";

    //     const signature = createSignature(
    //       method,
    //       url,
    //       payload,
    //       timestamp,
    //       process.env.IDRX_SECRET_KEY!
    //     );

    //     console.log(`[SIGNATURE GENERATED] ${signature}`);
    //     console.log(`[PAYLOAD]`, payload);

    //     // Kirim ke IDRX redeem API (aktifkan ini jika sudah siap)
    //     /*
    //     const response = await fetch("https://api.idrx.io/api/redeem-request", {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //         "X-Signature": signature,
    //         "X-Timestamp": timestamp,
    //       },
    //       body: JSON.stringify(payload)
    //     });

    //     const result = await response.json();
    //     console.log("REDEEM RESPONSE", result);
    //     */
    //   }
    // );

    res
      .status(200)
      .json({ message: "Successfully listening to Payroll Events." });
    console.log("Successfully listening to Payroll Events.");
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      error: "Failed to listen to payroll events",
      details: err.message,
    });
  }
};
