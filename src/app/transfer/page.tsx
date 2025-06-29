"use client"

import { useState, useEffect } from "react"
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
import { addGroupName, addInvoiceData, deleteEmployeeData, editEmployeeData, loadEmployeeData, loadGroupName } from "@/api"
import { TemplateProvider, useTemplate } from "@/lib/TemplateContext"
import { UserProvider, useUser } from "@/lib/UserContext"
import { useRouter } from "next/navigation"
import { invoiceApi } from "@/lib/invoiceApi"

export default function Dashboard() {
  const router = useRouter()
  const { user, loading } = useUser();

  const [templates, setTemplates] = useState<Template[]>([])
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null)  

  const [showBeneficiaryModal, setShowBeneficiaryModal] = useState(false)
  const [editingRecipient, setEditingRecipient] = useState<Recipient | null>(null)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [showTransferAlert, setShowTransferAlert] = useState(false)
  const [showProcessingModal, setShowProcessingModal] = useState(false)
  
  const [newlyCreatedInvoiceId, setNewlyCreatedInvoiceId] = useState<string|null>(null)

  // Fetch all templates first
  useEffect(() => {
    if (loading || !user?._id) return; // ⛔ jangan fetch dulu kalau loading atau user belum ada
  
    const fetchTemplatesAndEmployees = async () => {
      try {
        console.log( user); // Debug
        const groupTemplates = await loadGroupName({
          companyId: user._id,
        });
  
        const templatesWithEmptyRecipients: Template[] = groupTemplates.map((group: any) => ({
          groupId: group.groupId,
          companyId: group.companyId,
          companyName: group.companyName,
          nameOfGroup: group.nameOfGroup,
          recipients: group.employees,
          createdAt: new Date(group.createdAt),
          updatedAt: new Date(group.updatedAt),
        }));
  
        setTemplates(templatesWithEmptyRecipients);
  
        if (templatesWithEmptyRecipients.length > 0) {
          handleTemplateSwitch(templatesWithEmptyRecipients[0].groupId);
        }
      } catch (err) {
        console.error("Failed to fetch templates", err);
      }
    };
  
    fetchTemplatesAndEmployees();
  }, [loading, user]); // ✅ Tambahkan dependency ke user dan loading

  const handleTemplateSwitch = async (templateId: string) => {
    const selected = templates.find((t) => t.groupId === templateId);
    if (!selected) return;

    try {
      const response = await loadEmployeeData({
        groupId: selected.groupId,
      });

      console.log(response)

      const recipientsFromBackend: Recipient[] = response.map((emp: any) => ({
        _id: emp._id,
        name: emp.name,
        bankCode: emp.bankCode,
        bankAccount: emp.bankAccount,
        bankAccountName: emp.bankAccountName,
        amountTransfer: emp.amountTransfer,
        currency: emp.currency,
        localCurrency: emp.localCurrency,
      }));

      const updatedTemplate: Template = {
        ...selected,
        recipients: recipientsFromBackend,
        updatedAt: new Date(),
      };

      setCurrentTemplate(updatedTemplate);
    } catch (err) {
      console.error("Failed to load employees for group", err);
    }
  };

  const handleCreateTemplate = async (templateName: string) => {
    console.log(user?._id)
    console.log(user)
    const newTemplate = {
      groupId: `${Date.now()}`,
      companyId: user?._id!,
      companyName: process.env.NEXT_PUBLIC_COMPANY_NAME!,
      nameOfGroup: templateName,
      recipients: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await addGroupName(newTemplate);
    setTemplates([...templates, newTemplate]);
    setCurrentTemplate(newTemplate);
    setShowTemplateModal(false);
  };

  const updateCurrentTemplateRecipients = (newRecipients: Recipient[]) => {
    if (!currentTemplate) return;

    const updatedTemplate: Template = {
      ...currentTemplate,
      recipients: newRecipients,
      updatedAt: new Date(),
    };

    setCurrentTemplate(updatedTemplate);
    setTemplates(templates.map((t) => (t.groupId === currentTemplate.groupId ? updatedTemplate : t)));
  };

  const handleAddRecipient = (newRecipient: Omit<Recipient, "_id">) => {
    if (!currentTemplate) return;
    const recipient: Recipient = {
      _id: Date.now().toString(),
      ...newRecipient,
    };
    updateCurrentTemplateRecipients([...currentTemplate.recipients, recipient]);
    setShowBeneficiaryModal(false);
  };

  const handleEditRecipient = (updated: Recipient) => {
    if (!currentTemplate) return;
    const updatedList = currentTemplate.recipients.map((r) =>
      r._id === updated._id ? updated : r
    );
    updateCurrentTemplateRecipients(updatedList);
    setEditingRecipient(null);
    setShowBeneficiaryModal(false);
  };

  const handleRemoveRecipient = async (id: string) => {
    if (!currentTemplate) return;
    const updatedList = currentTemplate.recipients.filter((r) => r._id !== id);
    await deleteEmployeeData(id);
    updateCurrentTemplateRecipients(updatedList);
  };

  const handleSaveBeneficiary = async (data: Recipient | Omit<Recipient, "_id">) => {
    if (!currentTemplate) return;
  
    if ("_id" in data) {
      
      await editEmployeeData({ ...data, _id: data._id }); 
      await handleTemplateSwitch(currentTemplate.groupId);
    } else {
      // Ini tambah baru (tidak perlu fetch ulang kalau hanya local update)
      handleAddRecipient(data);
    }
  
    setShowBeneficiaryModal(false);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white text-lg animate-pulse">Loading user...</p>
      </div>
    );
  }

  const handleConfirmTransfer = async () =>{
    if(!currentTemplate || !user) return

    setShowTransferAlert(false)
    setShowProcessingModal(true)

    try{
      const creationPayload = {
        companyId: user._id,
        templateName: currentTemplate.nameOfGroup,
        recipients: currentTemplate.recipients.map(r =>({
          employeeId: r._id,
          amount: r.amountTransfer,
        }))
      }
      const newInvoice = await addInvoiceData(creationPayload);
      setNewlyCreatedInvoiceId(newInvoice._id)
    }catch (err){
      console.error("Failed to create invoice: ", err)
      setShowProcessingModal(false)
      setNewlyCreatedInvoiceId(null)
    }
  }

  const handleProcessingComplete = () =>{
    setShowProcessingModal(false)
    if(newlyCreatedInvoiceId){
      router.push(`/invoice/${newlyCreatedInvoiceId}`)
    }
  }
  return (
    
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <main className="relative z-10 p-6 pb-32">
        <div className="flex items-center justify-center">
          <DashboardHeader
            templates={templates}
            currentTemplate={currentTemplate}
            onTemplateSwitch={handleTemplateSwitch}
            onCreateTemplate={() => setShowTemplateModal(true)}
          />
        </div>

        {currentTemplate ? (
          <RecipientGrid
            recipients={currentTemplate.recipients}
            onAddClick={() => setShowBeneficiaryModal(true)}
            onRemoveRecipient={handleRemoveRecipient}
            onRecipientClick={(recipient) => {
              setEditingRecipient(recipient);
              setShowBeneficiaryModal(true); 
            }}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No template selected</p>
            <button
              onClick={() => setShowTemplateModal(true)}
              className="mt-4 text-cyan-400 hover:text-cyan-300"
            >
              Create your first template
            </button>
          </div>
        )}
      </main>

      {currentTemplate && currentTemplate.recipients.length > 0 && (
        <TransferPanel
          totalRecipients={currentTemplate.recipients.length}
          onTransferClick={() => setShowTransferAlert(true)}
        />
      )}

      <AlertDialog open={showTransferAlert} onOpenChange={setShowTransferAlert}>
        <AlertDialogContent className="backdrop-blur-sm border-white/55 rounded-2xl bg-transparent">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white text-center font-bold">
              Are You Sure To Transfer To {currentTemplate?.nameOfGroup}?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-cyan-400">Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-cyan-400" onClick={handleConfirmTransfer}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {showBeneficiaryModal && (
        <BeneficiaryModal
          employee={editingRecipient}
          onClose={() => {
            setEditingRecipient(null);
            setShowBeneficiaryModal(false);
          }}
          onSave={handleSaveBeneficiary}
        />
      )}

      {showTemplateModal && (
        <AddTemplateModal
          onClose={() => setShowTemplateModal(false)}
          onSave={handleCreateTemplate}
        />
      )}

      {showProcessingModal && currentTemplate && (
        <ProcessingModal
          recepientCount={currentTemplate.recipients.length}
          onComplete={handleProcessingComplete}
        />
      )}
    </div>

    
  );
}
