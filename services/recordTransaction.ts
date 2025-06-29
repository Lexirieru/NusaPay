import { TransactionRecordModel } from "../model/transactionRecordModel";

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