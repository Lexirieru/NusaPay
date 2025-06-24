import { ethers } from "ethers";
import payrollAbi from "../abi/payrollABI.json";
import dotenv from "dotenv";
import { generateSignature } from "./generate_signature";
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

  contract.on(
    "PayrollApproved",
    async (
      payrollId,
      company,
      employee,
      networkChainId,
      walletAddress,
      amount,
      bankAccount,
      bankCode,
      bankName,
      bankAccountName,
      event
    ) => {
      console.log(`[EVENT RECEIVED]`);

      console.log({
        // payrollId,
        // company,
        networkChainId: networkChainId.toString(),
        amountTransfer: amount.toString(), // Pastikan string
        bankAccount,
        bankCode,
        bankName,
        bankAccountName,
        walletAddress,
      });

      // BURN disini
      const txHash = await burnIdrx(amount, bankAccount);

      // Generate Signature disini
      const { signature, METHOD, URL_ENDPOINT, timestamp, body } =
        generateSignature(
          txHash,
          networkChainId.toString(),
          amount.toString(),
          bankAccount,
          bankCode,
          bankName,
          bankAccountName,
          walletAddress
        );

      // panggil API REDEEM_REQUEST IDRX disini
      const API_KEY = process.env.IDRX_API_KEY!;
      try {
        const response = await axios.post(
          `https://idrx.co${URL_ENDPOINT}`,
          body,
          {
            headers: {
              "Content-Type": "application/json",
              "idrx-api-key": API_KEY,
              "idrx-api-sig": signature,
              "idrx-api-ts": timestamp,
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
