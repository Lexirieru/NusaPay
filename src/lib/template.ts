"use client"

import { Recipient } from "@/types/recipient"

export interface Template{
    id:string
    name:string
    recipients: Recipient[]
    createdAt: Date
    updatedAt: Date
}

export interface TemplateContextType{
    templates: Template[]
    currentTemplate: Template | null
    switchTemplate: (templateId: string) => void
    createTemplate: (name: string) => void
    updateTemplate: (templateId: string, recipients: Recipient[]) => void
    deleteTemplate: (templateId: string) => void
}