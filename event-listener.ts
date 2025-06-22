import { ethers } from "ethers";
import payrollAbi from "./abi/payrollABI.json";
import dotenv from "dotenv";

dotenv.config();

const main = async () => {
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
    (
      payrollId,
      company,
      employee,
      amount,
      bankAccount,
      bankName,
      walletAddress,
      event
    ) => {
      console.log(`[EVENT RECEIVED]`);
      console.log({
        payrollId,
        company,
        employee,
        amount,
        bankAccount,
        bankName,
        walletAddress,
      });
    }
  );

  console.log("Listening for PayrollApproved...");
};

main();
