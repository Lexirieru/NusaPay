import * as crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

// console.log(process.env.IDRX_API_KEY);

function atob(str: string) {
  return Buffer.from(str, "base64").toString("binary");
}

export function createSignature(
  method: string,
  url: string,
  body: any,
  timestamp: string,
  secretKey: string
) {
  // payload body yang isinya data transaksi setiap pengguna pada saat redeem request (artinya setiap transaksi harus buat signature, shitt)
  const bodyBuffer = Buffer.from(JSON.stringify(body));

  const secret = atob(secretKey);
  // ngeenkripsiin secret keynya dalam bentuk hmac
  const hmac = crypto.createHmac("sha256", secret);
  // nambahin timestamp method dan url ke hmac
  hmac.update(timestamp);
  hmac.update(method);
  hmac.update(url);

  if (bodyBuffer != null) {
    // nambahin body dalam bentuk buffer ke hmac
    hmac.update(bodyBuffer);
  }
  // ngehashing si hmacnya itu
  const hash = hmac.digest();
  // hash to string untuk bentuk signaturenya itu
  const signature = hash.toString("base64url");

  return signature;
}

const body = {
  txHash: "string",
  networkChainId: "string",
  walletAddress: "string",
  amountTransfer: "20000",
  bankAccount: "0375017674",
  bankCode: "014",
  bankName: "BANK CENTRAL ASIA",
  bankAccountName: "DIEN MUHAMMAD SCIENTIVAN KURNIAPRAMONO",
};

const timestamp = Date.now().toString(); // current time in ms
const SECRET_KEY = process.env.IDRX_SECRET_KEY!;
createSignature(
  "POST",
  "/api/transaction/redeem-request",
  body,
  timestamp,
  SECRET_KEY
);
