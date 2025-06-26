import { ethers } from "ethers";
import payrollAbi from "../abi/payrollABI.json";
import dotenv from "dotenv";
import {
  generateSignatureForSwap,
  generateSignatureForRedeem,
} from "./generate_signature";
import { burnIdrx } from "./burnIdrx";
import axios from "axios"; // ✅ Tambahkan ini

dotenv.config();

const main = async () => {
  if (
    !process.env.LISK_SEPOLIA ||
    !process.env.CONTRACT_ADDRESS ||
    !process.env.IDRX_API_KEY ||
    !process.env.IDRX_SECRET_KEY
  ) {
    throw new Error("Missing environment variables. Cek kembali file .env");
  }

  const provider = new ethers.providers.JsonRpcProvider(
    process.env.LISK_SEPOLIA!
  );
  const contract = new ethers.Contract(
    process.env.CONTRACT_ADDRESS!,
    payrollAbi,
    provider
  );
  const API_KEY = process.env.IDRX_API_KEY!;

  // listen to PayrollApproved event
  contract.on(
    "PayrollApproved",
    async (
      payrollId,
      company,
      employee,
      networkChainId,
      walletAddress,
      amountBN,
      bankAccount,
      bankCode,
      bankName,
      bankAccountName,
      event
    ) => {
      console.log(`[EVENT RECEIVED]`);
      const amountString = ethers.utils.formatUnits(amountBN, 18);

      console.log({
        // payrollId,
        // company,
        networkChainId: networkChainId.toString(),
        amountTransfer: amountString, // Pastikan string
        bankAccount,
        bankCode,
        bankName,
        bankAccountName,
        walletAddress,
      });
      // listen to payrollApproved, generate signature (swap ke idrx), hit api swap rate usdc -> idrx, burn idrx, generate signature (redeem), post redeem,

      // generate signature (swap ke idrx)
      const { s_signature, s_METHOD, s_URL_ENDPOINT, s_timestamp } =
        generateSignatureForSwap();

      // panggil API swap rate USDC -> IDRX disini
      try {
        const response = await axios.get(`https://idrx.co${s_URL_ENDPOINT}`, {
          headers: {
            "Content-Type": "application/json",
            "idrx-api-key": API_KEY,
            "idrx-api-sig": s_signature,
            "idrx-api-ts": s_timestamp,
          },
        });

        console.log("[API Response]", response.data);
      } catch (err) {
        console.error("[Failed to call redeem-request]", err);
      }

      // BURN idrx disini
      const txHash = await burnIdrx(amountString, bankAccount);

      // generate signature untuk redeem disini
      const { r_signature, r_METHOD, r_URL_ENDPOINT, r_timestamp, r_body } =
        generateSignatureForRedeem(
          txHash,
          networkChainId.toString(),
          amountString,
          bankAccount,
          bankCode,
          bankName,
          bankAccountName,
          walletAddress
        );

      // panggil API REDEEM_REQUEST IDRX disini
      try {
        const response = await axios.post(
          `https://idrx.co${r_URL_ENDPOINT}`,
          r_body,
          {
            headers: {
              "Content-Type": "application/json",
              "idrx-api-key": API_KEY,
              "idrx-api-sig": r_signature,
              "idrx-api-ts": r_timestamp,
            },
          }
        );

        console.log("[API Response]", response.data);
      } catch (err) {
        console.error("[Failed to call redeem-request]", err);
      }
    }
  );

  console.log("Listening for PayrollApproved...");
};

main();
