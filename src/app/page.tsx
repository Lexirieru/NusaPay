"use client"

import { useState, useEffect, use } from "react"
import DashboardHeader from "@/components/dashboard/Header"
import RecipientGrid from "@/components/dashboard/RecipientGrid"
import TransferPanel from "@/components/dashboard/TransferPanel"
import type { Recipient } from "@/types/recipient"
import BeneficiaryModal from "@/components/modals/BeneficiaryModal"
import AddTemplateModal from "@/components/modals/AddTemplateModal"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import type { Template } from "@/lib/template"
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog"
import ProcessingModal from "@/components/modals/ProcessLoading"
export default function Dashboard() {
  
  //state buat templates
  const [templates, setTemplates] = useState<Template[]>([])
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null)  
    

  //state buat nampilin modal
  const [showBeneficiaryModal, setShowBeneficiaryModal] = useState(false)
  const [editingRecipient, setEditingRecipient] = useState<Recipient | null>(null)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [showTransferAlert, setShowTransferAlert] = useState(false)
  const [showProcessingModal, setShowProcessingModal] = useState(false)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  useEffect(() => {
    const defaultTemplates: Template[] = [
      {
        id: "template-1",
        name: "Template 1",
        recipients: [
          {
            id: "1",
            name: "Diaz A.",
            bank: "Bank Negara Indonesia",
            account: "018534567238",
            amount: 1500,
            currency: "IDR",
            localCurrency: "IDRX"
          },
          {
            id: "2",
            name: "Diaz A.",
            bank: "Bank Negara Indonesia",
            account: "018534567238",
            amount: 2300,
            currency: "IDR",
            localCurrency: "IDRX"
          },
          {
            id: "3",
            name: "Diaz A.",
            bank: "Bank Negara Indonesia",
            account: "018534567238",
            amount: 1800,
            currency: "IDR",
            localCurrency: "IDRX"
          },
        ],
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date(),
      },
      {
        id: "template-2",
        name: "Template 2",
        recipients: [
          {
            id: "4",
            name: "Sarah B.",
            bank: "Bank Central Asia",
            account: "019876543210",
            amount: 2500,
            currency: "IDR",
            localCurrency: "IDRX"
          },
          {
            id: "5",
            name: "John C.",
            bank: "Bank Mandiri",
            account: "020123456789",
            amount: 3000,
            currency: "IDR",
            localCurrency: "IDRX",
            
          },
        ],
        createdAt: new Date("2024-01-02"),
        updatedAt: new Date(),
      },
    ]

    setTemplates(defaultTemplates)
    setCurrentTemplate(defaultTemplates[0]) // Set template pertama sebagai default
  }, [])


  // ngitung total amount dari semua recipients
  // const totalAmount = currentTemplate?.recipients.reduce((sum, recipient) => sum + recipient.amount, 0) || 0

  
  /**
   * Handler untuk switch template
   * @param templateId - ID template yang akan diaktifkan
   */
  const handleTemplateSwitch = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      setCurrentTemplate(template)
    }
  }

  /**
   * Handler untuk create template baru
   * @param templateName - Nama template baru
   */
  const handleCreateTemplate = (templateName: string) => {
    const newTemplate: Template = {
      id: `template-${Date.now()}`,
      name: templateName,
      recipients: [], // Template baru dimulai dengan recipients kosong
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setTemplates([...templates, newTemplate])
    setCurrentTemplate(newTemplate) // Switch ke template baru
    setShowTemplateModal(false)
  }

/**
   * Handler untuk update recipients dalam template saat ini
   * @param newRecipients - Daftar recipients yang baru
   */
  const updateCurrentTemplateRecipients = (newRecipients: Recipient[]) => {
    if (!currentTemplate) return

    const updatedTemplate: Template = {
      ...currentTemplate,
      recipients: newRecipients,
      updatedAt: new Date(),
    }

    setTemplates(templates.map((t) => (t.id === currentTemplate.id ? updatedTemplate : t)))
    setCurrentTemplate(updatedTemplate)
  }

  /**
   * Handler buat menambah recipient baru
   * @param newRecipient - Data recipient baru yang akan ditambahkan
   */
  const handleAddRecipient = (newRecipient: Omit<Recipient, "id">) => {
    if(!currentTemplate) return
    const recipient: Recipient = {
      id: Date.now().toString(),
      ...newRecipient,
    }
    const updatedRecipients = [...currentTemplate.recipients, recipient]
    updateCurrentTemplateRecipients(updatedRecipients)
    setShowBeneficiaryModal(false)
  }

  /**
   * Handler buat menambah recipient baru
   * @param updatedRecipient - Data recipient yang diupdate/edit
   */
  const handleEditRecipient = (updatedRecipient: Recipient) =>{
    if(!currentTemplate) return
    const updatedRecipients = currentTemplate.recipients.map((r) =>
      r.id === updatedRecipient.id? updatedRecipient: r,
    )
    updateCurrentTemplateRecipients(updatedRecipients)
    setShowBeneficiaryModal(false)
    setEditingRecipient(null)
  }

  /**
   * Handler buat menghapus recipient
   * @param id - ID recipient yang akan dihapus
   */
  const handleRemoveRecipient = (id: string) => {
    if(!currentTemplate) return
    const updatedRecipients = currentTemplate.recipients.filter((recipient) => recipient.id !== id)
    updateCurrentTemplateRecipients(updatedRecipients)
  }

  const handleAddClick = () => {
    setEditingRecipient(null)
    setShowBeneficiaryModal(true)
  }

  const handleRecipientClick = (recipient: Recipient) =>{
    setEditingRecipient(recipient)
    setShowBeneficiaryModal(true)
  }

  const handleCloseBeneficiaryModal = () =>{
    setShowBeneficiaryModal(false)
    setEditingRecipient(null)
  }

  const handleSaveBeneficiary = (recipientData: Recipient | Omit<Recipient, "id">) => {
    if("id" in recipientData){
      //ada id = ngedit
      handleEditRecipient(recipientData as Recipient)
    }else{
      handleAddRecipient(recipientData as Omit<Recipient, "id">)
    }
  }

  const handleConfirmTransfer = () => {
    setShowTransferAlert(false)
    setShowProcessingModal(true)
  }

  const handleProcessingComplete = () =>{
    setShowProcessingModal(false)
    setShowInvoiceModal(true)
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
     
      {/* Main Content */}
      <main className=" relative  z-10 p-6 pb-32 ">
        {/* Header*/}
        <div className="flex items-center justify-center">
          <DashboardHeader 
            templates={templates}
            currentTemplate={currentTemplate}
            onTemplateSwitch={handleTemplateSwitch}
            onCreateTemplate={() => setShowTemplateModal(true)}
          />
        </div>

        {/* Grid untuk menampilkan recipient cards */}
        {currentTemplate ? (
          <RecipientGrid
            recipients={currentTemplate.recipients}
            onAddClick={handleAddClick}
            onRemoveRecipient={handleRemoveRecipient}
            onRecipientClick={handleRecipientClick}
          />
        ) :(
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No template seleccted
            </p>
            <button
              onClick={() => setShowTemplateModal(true)}
              className="mt-4 text-cyan-400 hover:text-cyan-300 transition-colors duration-300"
            >
              Create your first template
            </button>

          </div>
        )}
        

      </main>

      {/* Panel transfer floating */}
      {currentTemplate && currentTemplate.recipients.length > 0 && (
        <TransferPanel
          totalRecipients={currentTemplate.recipients.length}
          onTransferClick={() => setShowTransferAlert(true)}
        />
      )}

      {/*Transfer Confirmation Alert */}
      <AlertDialog open={showTransferAlert} onOpenChange={setShowTransferAlert}>
        <AlertDialogContent className="backdrop-blur-sm border-white/55 rounded-2xl bg-transparent">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white justify-center flex font-bold">Are You Sure To Transfer To {currentTemplate?.name}?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter >
            <AlertDialogCancel className="text-cyan-400 ">Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-cyan-400" onClick={handleConfirmTransfer}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Beneficiary Modal */}
      {showBeneficiaryModal && (
        <BeneficiaryModal
          recipient={editingRecipient}
          onClose={handleCloseBeneficiaryModal}
          onSave={handleSaveBeneficiary}  
        />
      )}

      {showTemplateModal && (
        <AddTemplateModal
          onClose={() => setShowTemplateModal(false)}
          onSave={handleCreateTemplate}
        />
      )}

      {/* Processing Loading */}
      {showProcessingModal && currentTemplate && (
        <ProcessingModal
          recepientCount={currentTemplate.recipients.length}
          onComplete={handleProcessingComplete}
        />
      )}
      

    </div>
  )
}
