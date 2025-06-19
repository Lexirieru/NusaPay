"use client"

import { useState } from "react"
import DashboardHeader from "@/components/dashboard/Header"
import RecipientGrid from "@/components/dashboard/RecipientGrid"
import TransferPanel from "@/components/dashboard/TransferPanel"
import type { Recipient } from "@/types/recipient"

export default function Dashboard() {
  // State data yang menerima transfer 
  const [recipients, setRecipients] = useState<Recipient[]>([
    {
      id: "1",
      name: "Diaz A.",
      bank: "Bank Negara Indonesia",
      account: "018534567238",
      amount: 1500,
      currency: "IDR",
    },
    {
      id: "2",
      name: "Diaz A.",
      bank: "Bank Negara Indonesia",
      account: "018534567238",
      amount: 2300,
      currency: "IDR",
    },
    {
      id: "3",
      name: "Diaz A.",
      bank: "Bank Negara Indonesia",
      account: "018534567238",
      amount: 1800,
      currency: "IDR",
    },
    {
      id: "4",
      name: "Diaz A.",
      bank: "Bank Negara Indonesia",
      account: "018534567238",
      amount: 2100,
      currency: "IDR",
    },
    {
      id: "5",
      name: "Diaz A.",
      bank: "Bank Negara Indonesia",
      account: "018534567238",
      amount: 1900,
      currency: "IDR",
    },
  ])

  //state buat nampilin modal
  const [showAddModal, setShowAddModal] = useState(false)
  const [showTransferModal, setShowTransferModal] = useState(false)

  // ngitung total amount dari semua recipients
  const totalAmount = recipients.reduce((sum, recipient) => sum + recipient.amount, 0)

  /**
   * Handler buat menambah recipient baru
   * @param newRecipient - Data recipient baru yang akan ditambahkan
   */
  const handleAddRecipient = (newRecipient: Omit<Recipient, "id">) => {
    const recipient: Recipient = {
      id: Date.now().toString(),
      ...newRecipient,
    }
    setRecipients([...recipients, recipient])
    setShowAddModal(false)
  }

  /**
   * Handler buat menghapus recipient
   * @param id - ID recipient yang akan dihapus
   */
  const handleRemoveRecipient = (id: string) => {
    setRecipients(recipients.filter((recipient) => recipient.id !== id))
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
     
      {/* Main Content */}
      <main className=" relative  z-10 p-6 pb-32 ">
        {/* Header*/}
        <div className="flex items-center justify-center">
          <DashboardHeader />
        </div>

        {/* Grid untuk menampilkan recipient cards */}
        <RecipientGrid
          recipients={recipients}
          onAddClick={() => setShowAddModal(true)}
          onRemoveRecipient={handleRemoveRecipient}
        />

      </main>
      <TransferPanel
        totalAmount={totalAmount}
        totalRecipients={recipients.length}
        onTransferClick={() => setShowTransferModal(true)}
      />

      

    </div>
  )
}
