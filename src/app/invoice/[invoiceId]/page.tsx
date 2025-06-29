"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error-message";
import { ArrowLeft } from "lucide-react";
import type { Invoice } from "@/types/invoice";
import { useState, useEffect } from "react";
import { invoiceApi } from "@/lib/invoiceApi";
import { loadInvoiceData } from "@/api";
export default function InvoicePage() {
  const params = useParams();
  const router = useRouter()
  const invoiceId = params.invoiceId as string
  const [invoice, setInvoice] = useState<Invoice|null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string|null>(null)
  const [currentRecipientIndex, setCurrentRecipientIndex] = useState(0)

  useEffect(() => {
    const fetchInvoice = async () =>{
      try{
        setLoading(true)
        setError(null)
        const invoiceData = await loadInvoiceData(invoiceId);
        setInvoice(invoiceData)
      } catch(err){
        setError(err instanceof Error? err.message: "Failed to load invoice")
        console.error("Error fetching invoice: ", err)
      }finally{
        setLoading(false)
      }
    }

    if(invoiceId){
      fetchInvoice()
    }
  }, [invoiceId])

  const handleBackToDashboard = () =>{
    router.push("/")
  }

  const handleRetry = () =>{
    window.location.reload()
  }

  const handlePrevRecipient = () => {
    if(invoice && currentRecipientIndex > 0){
      setCurrentRecipientIndex(currentRecipientIndex - 1)
    }
  }

  const handleNextRecipient = () => {
    if(invoice && currentRecipientIndex < invoice.recipients.length-1){
      setCurrentRecipientIndex(currentRecipientIndex + 1)
    }
  }

  if(loading){
    return(
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-gray-300">Loading invoice...</p>
        </div>
      </div>
    )
  }

  if(error || !invoice){
    return(
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <ErrorMessage message={error || "Invoice not found"} onRetry={handleRetry} className="mb-4" />
          <Button onClick={handleBackToDashboard} variant="outline" className="w-full bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const currentRecipient = invoice.recipients[currentRecipientIndex]
  const description = `Transfer to ${invoice.templateName}`

  return (
  <div className="min-h-screen bg-black px-4 sm:px-6 py-8 sm:py-10 text-white">
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 max-w-6xl mx-auto">
      
      {/* Left Card */}
      <div className="bg-[#1C1C1C] rounded-2xl px-6 sm:px-8 py-7 sm:py-9 w-full lg:w-[40%]">
        <div className="flex justify-between items-center mb-4">
          <Image src="/logonusa2.png" alt="logo" width={120} height={50} />
          <button onClick={handleBackToDashboard} className="bg-[#373737] text-xs sm:text-sm px-4 sm:px-6 py-1 rounded-full">
            Dashboard
          </button>
        </div>
        <h3 className="font-bold text-base sm:text-lg mb-5">Beneficiary</h3>
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-white w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center" >
            <span className="text-white font-bold text-lg">{currentRecipient.name.charAt(0)}</span>
          </div>
          <p className="font-semibold text-sm">
              {currentRecipient.name}
          </p>
          <span className="ml-auto bg-[#373737] text-[10px] sm:text-xs px-6 sm:px-8 py-1.5 rounded-full">
            {currentRecipient.currency}
          </span>
        </div>


        {[
          { label: "Currency", value: currentRecipient.currency },
          { label: "Local Currency", value: currentRecipient.localCurrency },
          { label: "Bank", value: currentRecipient.bankAccountName },
          { label: "Bank Account", value: currentRecipient.bankAccount },
        ].map(({ label, value }) => (
          <div key={label} className="mb-2">
            <label className="text-white text-[10px] sm:text-xs mb-1 block">{label}</label>
            <div className="modal-input bg-[#2a2a2a] text-white text-xs rounded-full px-5 py-1.5 w-full cursor-default">
              {value}
            </div>
          </div>
        ))}

        <div className="mt-10">
          <div className="flex justify-between text-[11px] sm:text-xs bg-white rounded-full px-4 py-1.5">
            <button 
              onClick={handlePrevRecipient} 
              disabled={currentRecipientIndex === 0} 
              className={`text-black rounded-full ${currentRecipientIndex === 0? "opacity-50 cursor-not-allowed" : "hover:opacity-70"}`}
            >
              &larr; Prev
            </button>
            <span className="text-black">({currentRecipientIndex + 1} / {invoice.recipients.length})</span>
            <button 
              onClick={handleNextRecipient}
              disabled={currentRecipientIndex === invoice.recipients.length - 1}
              className={`text-black rounded-full ${currentRecipientIndex === invoice.recipients.length -1? "opacity-50 cursor-not-allowed" : "hover:opacity-70"}`}>Next &rarr;</button>
          </div>
        </div>
      </div>

      {/* Right Card */}
      <div className="bg-[#2A2A2A] rounded-2xl px-4 sm:px-6 py-4 shadow-xl w-full lg:w-[60%]">
        {/* Header */}
        <div className="flex justify-between py-2">
          <Image src="/logonusa2.png" alt="logo" width={100} height={40} />
          <div className="flex gap-6 text-[10px] items-center text-gray-400">
            {[
              { label: "Invoice Number", value: invoiceId },
              { label: "Issued", value: new Date(invoice.createdAt).toLocaleDateString() },
              { label: "Due Date", value: new Date(invoice.completedAt || invoice.createdAt).toLocaleDateString() },
            ].map(({ label, value }) => (
              <p key={label} className="flex flex-col">
                {label}
                <span className="text-white">{value}</span>
              </p>
            ))}
          </div>
        </div>

        {/* From & To */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          {[
            { title: "↑ From", name: "NusaPay", label: "Currency", value: "USD" },
            { title: "↓ To", name: currentRecipient.name, label: "Local Currency", value: currentRecipient.localCurrency },
          ].map(({ title, name, label, value }) => (
            <div key={title} className="w-full sm:w-1/2 bg-[#1C1C1C] rounded-2xl px-4 py-4">
              <p className="text-[10px] sm:text-xs bg-[#2A2A2A] rounded-full px-4 py-1 w-fit text-white">
                {title}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <div className="bg-white w-10 h-10 rounded-full" />
                <div>
                  <p className="font-semibold text-sm">{name}</p>
                  <p className="text-[10px] font-semibold text-[#818181]">Indonesia</p>
                </div>
              </div>
              <div className="mt-2">
                <label className="text-white text-xs mb-1 block">{label}</label>
                <div className="modal-input bg-[#2A2A2A] text-white text-xs rounded-full px-6 py-1.5 w-full cursor-default">
                  {value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* DESCRIPTION SECTION */}
        <div className="bg-[#1C1C1C] rounded-2xl px-4 py-3 space-y-3 mt-5">
          {/* Header */}
          <div className="flex justify-between text-[10px] sm:text-xs text-gray-400 border-b pt-2 border-white/55 pb-1 px-2 sm:px-8">
            <p>Description</p>
            <p>Amount</p>
          </div>

          {/* Description */}
          <div className="flex justify-between mt-2 text-xs font-medium border-b border-white/55 pb-1 px-2 sm:px-8">
            {/* <p className="text-white">• {description}</p> */}
            <p className="text-white">{currentRecipient.amountTransfer.toLocaleString()}</p>
          </div>

          {/* SPLIT PAYMENT INFO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4 items-start text-white">
            {/* LEFT */}
            <div className="flex flex-col space-y-3 sm:space-y-4 md:items-end sm:border-r border-white/55 sm:pr-4">
              <p className="text-[10px] sm:text-sm bg-[#2A2A2A] rounded-full w-fit px-5 py-1 text-white">
                Payable IN
              </p>
              <div className="flex gap-3 flex-row justify-between md:items-end px-4 md:px-0">
                <div className="md:text-right">
                  <p className="text-lg font-bold">Tether</p>
                  <p className="text-[10px] sm:text-xs font-semibold text-gray-400">USDT</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#2A2A2A]" />
              </div>
              <p className="text-[10px] sm:text-[11px] bg-[#2A2A2A] px-3 py-1 rounded-full w-max font-semibold">
                Powered by IDRX
              </p>
            </div>

            {/* RIGHT */}
            <div className="space-y-3 mt-3 sm:mt-0">
              <div>
                <p className="text-[10px] sm:text-xs text-gray-400">Network</p>
                <p className="bg-[#2A2A2A] w-max px-4 py-1 rounded-full text-xs sm:text-sm mt-1">
                  TRON
                </p>
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-400">Wallet Address</p>
                <div className="bg-[#2A2A2A] rounded-full px-4 py-1.5 text-xs sm:text-sm break-all mt-1">
                  {invoice.batchTransactionId}                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
