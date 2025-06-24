import * as crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

// console.log(process.env.IDRX_API_KEY);

function atob(str: string) {
  return Buffer.from(str, "base64").toString("binary");
}

// fungsi customku
export function generateSignature(
  txHash: string,
  networkChainId: string,
  amountTransfer: string,
  bankAccount: string,
  bankCode: string,
  bankName: string,
  bankAccountName: string,
  walletAddress: string
) {
  const METHOD = "POST";
  const URL_ENDPOINT = "/api/transaction/redeem-request";

  const body = {
    txHash,
    // payrollId,
    // company,
    networkChainId,
    amountTransfer,
    bankAccount,
    bankCode,
    bankName,
    bankAccountName,
    walletAddress,
  };
  const timestamp = Date.now().toString(); // current time in ms
  const SECRET_KEY = process.env.IDRX_SECRET_KEY!;
  if (!SECRET_KEY) throw new Error("Missing secret key");

  const signature = createSignature(
    METHOD,
    URL_ENDPOINT,
    body,
    timestamp,
    SECRET_KEY
  );
  return { signature, METHOD, URL_ENDPOINT, timestamp, body };
}

// bawaan IDRX
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
