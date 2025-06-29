import type { Recipient } from "./recipient";

export type InvoiceStatus = "pending" | "processing" | "completed" | "partially_failed" | "failed"
export interface Invoice{
    _id: string
    invoiceNumber: string
    companyId: string
    templateName: string
    recipients: Recipient[]

    totalAmount: number
    networkFee: number
    adminFee: number
    totalCost: number

    status: InvoiceStatus
    createdAt: Date
    updatedAt: Date
    completedAt?: Date

    batchTransactionId?: string
}

