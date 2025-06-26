"use client";

import { useParams } from "next/navigation";
import Image from "next/image";

export default function InvoicePage() {
  const { invoiceId } = useParams();
  const description = "employee salaries";

  return (
  <div className="min-h-screen bg-black px-4 sm:px-6 py-8 sm:py-10 text-white">
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 max-w-6xl mx-auto">
      
      {/* Left Card */}
      <div className="bg-[#1C1C1C] rounded-2xl px-6 sm:px-8 py-7 sm:py-9 w-full lg:w-[40%]">
        <div className="flex justify-between items-center mb-4">
          <Image src="/logonusa2.png" alt="logo" width={120} height={50} />
          <button className="bg-[#373737] text-xs sm:text-sm px-4 sm:px-6 py-1 rounded-full">
            Dashboard
          </button>
        </div>
        <h3 className="font-bold text-base sm:text-lg mb-5">Beneficiary</h3>
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-white w-10 h-10 sm:w-12 sm:h-12 rounded-full" />
          <div>
            <p className="font-semibold text-sm">Raditya Azhar</p>
            <p className="text-[10px] sm:text-xs font-semibold text-[#818181]">Indonesia</p>
          </div>
          <span className="ml-auto bg-[#373737] text-[10px] sm:text-xs px-6 sm:px-8 py-1.5 rounded-full">
            IDR
          </span>
        </div>

        {[
          { label: "Currency", value: "USD" },
          { label: "Local Currency", value: "IDR" },
          { label: "Bank", value: "Bank Negara Indonesia" },
          { label: "Bank Account", value: "124245982" },
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
            <button className="text-black rounded-full">&larr; Prev</button>
            <span className="text-black">(2/16)</span>
            <button className="text-black rounded-full">Next &rarr;</button>
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
              { label: "Issued", value: "01/6/2025" },
              { label: "Due Date", value: "26/6/2025" },
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
            { title: "↓ To", name: "Raditya Azhar A.", label: "Local Currency", value: "IDR" },
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
            <p className="text-white">• {description}</p>
            <p className="text-white">1000.00</p>
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
                  0x15E0B363b5aB5e47624Bc...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

}
