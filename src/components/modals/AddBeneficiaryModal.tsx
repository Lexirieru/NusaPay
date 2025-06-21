"use client"

import { X } from "lucide-react"
import { useState } from "react"
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

interface AddBeneficiaryModalProps{
    onClose:() => void
    onSave: (recipient: Omit<Recipient, "id">) => void
}

export default function AddBeneficiaryModal({onClose, onSave}: AddBeneficiaryModalProps){
    //state default buat form
    const [formData, setFormData] = useState({
        name: "",
        currency: "",
        localCurrency: "",
        bank : "",
        account: "",
        amount: "",
    })

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

        //bikin objek recipientnya
        const recipient: Omit<Recipient, "id"> ={
            name: formData.name,
            bank: formData.bank,
            account: formData.account,
            amount: Number.parseFloat(formData.amount),
            currency: formData.currency,
       }
       onSave(recipient)
    }

    return(
        <ModalOverlay onClose={onClose}>
            <div className="relative bg-slate-800/50 border
            border-white/20 rounded-2xl p-8 w-full max-w-md backdrop-blur-sm">
                {/* Header */}
                <div className="flex items-center justify-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Add Benefiery</h2>
                    
                </div>

                {/* Form */}
                <div className="space-y-4">
                    <FormField
                        label="Full Name"
                        value={formData.name}
                        onChange={(value) =>handelInputChange("name", value)}
                        placeholder="Type here"
                        
                    />
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
                    

                    {/* Price feed */}
                    <div className=" rounded-lg justify-end flex ">
                        <p className="text-gray-300 text-sm text-center">Display Price Feed Here</p>
                    </div>

                    <Button onClick={handleSubmit} className="w-full btn-primary bg-blue-400 py-3 rounded-lg">Save</Button>
                </div>

            </div>

        </ModalOverlay>
    )
}