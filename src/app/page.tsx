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
import { addGroupName, loadEmployeeData, loadGroupName } from "@/api"

export default function Dashboard() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null)  

  const [showBeneficiaryModal, setShowBeneficiaryModal] = useState(false)
  const [editingRecipient, setEditingRecipient] = useState<Recipient | null>(null)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [showTransferAlert, setShowTransferAlert] = useState(false)
  const [showProcessingModal, setShowProcessingModal] = useState(false)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)

  // Fetch all templates first
  useEffect(() => {
    const fetchTemplatesAndEmployees = async () => {
      try {
        const groupTemplates = await loadGroupName({
          companyId: process.env.NEXT_PUBLIC_COMPANY_ID!,
        });
        console.log(groupTemplates)

        const templatesWithEmptyRecipients: Template[] = groupTemplates.map((group: any) => ({
          id: group._id,
          companyId: group.companyId,
          companyName: group.companyName,
          nameOfGroup: group.nameOfGroup,
          recipients: group.employees, // Recipients diisi setelah template dipilih
          createdAt: new Date(group.createdAt),
          updatedAt: new Date(group.updatedAt),
        }));

        setTemplates(templatesWithEmptyRecipients);

        // Default pilih yang pertama (opsional)
        if (templatesWithEmptyRecipients.length > 0) {
          handleTemplateSwitch(templatesWithEmptyRecipients[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch templates", err);
      }
    };

    fetchTemplatesAndEmployees();
  }, []);

  const handleTemplateSwitch = async (templateId: string) => {
    const selected = templates.find((t) => t.id === templateId);
    if (!selected) return;

    try {
      const response = await loadEmployeeData({
        companyId: selected.companyId,
      });

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
    const newTemplate = {
      id: `template-${Date.now()}`,
      companyId: process.env.NEXT_PUBLIC_COMPANY_ID!,
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
    setTemplates(templates.map((t) => (t.id === currentTemplate.id ? updatedTemplate : t)));
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

  const handleRemoveRecipient = (id: string) => {
    if (!currentTemplate) return;
    const updatedList = currentTemplate.recipients.filter((r) => r._id !== id);
    updateCurrentTemplateRecipients(updatedList);
  };

  const handleSaveBeneficiary = (data: Recipient | Omit<Recipient, "_id">) => {
    if ("_id" in data) handleEditRecipient(data);
    else handleAddRecipient(data);
  };

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
            onRecipientClick={setEditingRecipient}
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
            <AlertDialogAction className="bg-cyan-400" onClick={() => {
              setShowTransferAlert(false);
              setShowProcessingModal(true);
            }}>Confirm</AlertDialogAction>
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
          onComplete={() => {
            setShowProcessingModal(false);
            setShowInvoiceModal(true);
          }}
        />
      )}
    </div>
  );
}
