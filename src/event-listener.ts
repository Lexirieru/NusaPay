import { ethers } from "ethers";
import payrollAbi from "../abi/payrollABI.json";
import dotenv from "dotenv";
import {
  generateSignatureForSwap,
  generateSignatureForRedeem,
} from "./generate_signature";
import { burnIdrx, checkGasFeeEstimation, checkIDRXBalance } from "./burnIdrx";
import axios from "axios";

import BigNumber from "bignumber.js";

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

  // listen to PayrollApproved event
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
    
      const amountFiat = "21000"; // "20000"
      
      const baseBigNumber = new BigNumber(amountFiat);
      const multiplier = new BigNumber(10).pow(18);
      const amountBigNumber = baseBigNumber.multipliedBy(multiplier).toFixed(0);
      
      console.log({
        // payrollId,
        // company,
        networkChainId: networkChainId.toString(),
        amountFiat, // Pastikan string
        amountBigNumber,
        bankAccount,
        bankCode,
        bankName,
        bankAccountName,
        walletAddress,
      });
      await checkGasFeeEstimation(amountFiat,bankName,bankAccount);
    
      // listen to payrollApproved, generate signature (swap ke idrx), hit api swap rate usdc -> idrx, burn idrx, generate signature (redeem), post redeem,

      // // generate signature (swap ke idrx)
      // const { s_signature, s_METHOD, s_URL_ENDPOINT, s_timestamp } =
      //   generateSignatureForSwap();

      // // panggil API swap rate USDC -> IDRX disini
      // try {
      //   const response = await axios.get(`https://idrx.co${s_URL_ENDPOINT}`, {
      //     headers: {
      //       "Content-Type": "application/json",
      //       "idrx-api-key": API_KEY,
      //       "idrx-api-sig": s_signature,
      //       "idrx-api-ts": s_timestamp,
      //     },
      //   });

      //   console.log("[API Response]", response.data);
      // } catch (err) {
      //   console.error("[Failed to call redeem-request]", err);
      // }

      // BURN idrx disini
      // const txHash = await burnIdrx(amountFiat, bankName, bankAccount);
      // console.log(txHash)
      
      // // generate signature untuk redeem disini
      const { r_signature, r_METHOD, r_URL_ENDPOINT, r_timestamp, r_body } =
        generateSignatureForRedeem(
          "0x37934d7778111fc74a50c351c48d553196185e5ad349b56638b31060ccf0a76e",
          networkChainId,
          amountFiat,
          bankAccount,
          bankCode,
          bankName,
          bankAccountName,
          walletAddress
        );

      // // // panggil API REDEEM_REQUEST IDRX disini
      const API_KEY = process.env.IDRX_API_KEY!;
      try {
        console.log("Request payload ke IDRX:", JSON.stringify({
          chainId: r_body.networkChainId.toString(),
          txHash: r_body.txHash,
          signature: r_signature,
          timestamp : r_timestamp
        }));

        const response = await axios.post(
          "https://idrx.co/api/transaction/redeem-request",
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
