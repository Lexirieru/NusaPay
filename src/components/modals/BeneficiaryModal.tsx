"use client"

import { useState, useEffect, use } from "react"
import type { Recipient } from "@/types/recipient"
import { Button } from "../ui/button"
import FormField from "./FormField"
import ModalOverlay from "./ModalOverlay"

/**
 * Add Beneficiary Modal Component
 * Fungsi: 
 * - Modal buat nambah penerima
 * - utawa pas dipencet +
 */

interface BeneficiaryModalProps{
    recipient?: Recipient | null 
    onClose:() => void
    onSave: (recipient: Recipient | Omit<Recipient, "id">) => void
}

export default function BeneficiaryModal({recipient= null, onClose, onSave}: BeneficiaryModalProps){
    const isEditMode = recipient !== null
    const submitButtonText = isEditMode? "Edit" : "Save"
    //state default buat form
    const [formData, setFormData] = useState({
        name: "",
        currency: "",
        localCurrency: "",
        bank : "",
        account: "",
        amount: "",
    })
    
    const modalTitle = isEditMode? `${formData.name}` : "Add Beneficiary"

    useEffect(() =>{
        if(isEditMode && recipient){
            setFormData({
                name: recipient.name,
                currency: recipient.currency,
                localCurrency: recipient.localCurrency,
                bank: recipient.bank,
                account: recipient.account,
                amount: recipient.amount.toString(),
            })
        }else{
            setFormData({
                name: "",
                currency: "",
                localCurrency: "",
                bank : "",
                account: "",
                amount: "",
            })
        }
    },[isEditMode, recipient])

    //Handler buat update formfield
    const handelInputChange = (field: string, value: string) =>{
        setFormData((prev) => ({...prev, [field]: value}))
    }

    //Hander buat submit + validasi input + save
    const handleSubmit = () =>{
        //validasi 
        if(!formData.name || !formData.bank || !formData.account || !formData.amount){
            alert("Please fill in all required fields")
            return
        }
        if(isEditMode && recipient){
            const updateRecipient: Recipient = {
                id: recipient.id, // Keep the same ID
                name: formData.name,
                bank: formData.bank,
                account: formData.account,
                amount: Number.parseFloat(formData.amount),
                currency: formData.currency,  
                localCurrency: formData.localCurrency,              
            }
            onSave(updateRecipient)
        } else{
            const newRecipient: Omit<Recipient, "id"> ={
                name: formData.name,
                bank: formData.bank,
                account: formData.account,
                amount: Number.parseInt(formData.amount),
                currency: formData.currency,
                localCurrency: formData.localCurrency,
            }
            onSave(newRecipient)
        }
    }

    return(
        <ModalOverlay onClose={onClose}>
            <div className="relative bg-slate-800/50 border
            border-white/20 rounded-2xl p-8 w-full max-w-md backdrop-blur-sm">
                {/* Header */}
                <div className="flex items-center justify-center mb-6">
                    <h2 className="text-2xl font-bold text-white">{modalTitle}</h2>
                </div>

                {/* Form */}
                <div className="space-y-4">
                    {recipient === null && (
                        <FormField
                            label="Full Name"
                            value={formData.name}
                            onChange={(value) =>handelInputChange("name", value)}
                            placeholder="Type here"
                            
                        />
                    )}
                    <FormField
                        label="Currency"
                        value={formData.currency}
                        onChange={(value) =>handelInputChange("currency", value)}
                        placeholder="Type here"
                        
                    />
                    <FormField
                        label="Local Currency"
                        value={formData.localCurrency}
                        onChange={(value) =>handelInputChange("localCurrency", value)}
                        placeholder="Type here"
                        
                    />
                    <FormField
                        label="Bank"
                        value={formData.bank}
                        onChange={(value) =>handelInputChange("bank", value)}
                        placeholder="Type here"
                        
                    />
                    <FormField
                        label="Bank Account"
                        value={formData.account}
                        onChange={(value) =>handelInputChange("account", value)}
                        placeholder="Type here"
                        
                    />
                    <FormField
                        label="Amount"
                        value={formData.amount}
                        onChange={(value) =>handelInputChange("amount", value)}
                        placeholder="Type here"
                        
                    />
                    

                    {/* Price feed */}
                    <div className=" rounded-lg justify-end flex ">
                        <p className="text-gray-300 text-sm text-center">Display Price Feed Here</p>
                    </div>

                    <div className="flex space-x-3">
                        {/* Reset Button - hanya tampil di edit mode */}
                        {/* {isEditMode && (
                            <Button onClick={handleReset} variant="outline" className="flex-1 btn-secondary" type="button">
                                Reset
                            </Button>
                        )} */}

                        {/* Submit Button */}
                        <Button
                            onClick={handleSubmit}
                            className={`${isEditMode ? "flex-1" : "w-full"} bg-cyan-500 hover:bg-cyan-400 py-3 rounded-lg`}
                        >
                            {submitButtonText}
                        </Button>
                    </div>          
                </div>

            </div>

        </ModalOverlay>
    )
}