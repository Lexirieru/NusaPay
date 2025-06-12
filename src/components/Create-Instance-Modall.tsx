"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useInstance } from "@/context/instance-context"
import type { NewInstanceData } from "@/types/instance"
import { resolve } from "path"

export default function CreateInstanceModal(){
    const {isModalOpen, closeModal, addInstance} = useInstance()
    const [instanceName, setInstanceName] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const nameInputRef = useRef<HTMLInputElement>(null)

    useEffect(() =>{
        if(isModalOpen && nameInputRef.current){
            nameInputRef.current.focus()
        }
    }, [isModalOpen])

    useEffect(()=>{
        const handleEscape = (e: KeyboardEvent) =>{
            if(e.key === "Escape" && isModalOpen){
                resetAndClose()
            }

            window.addEventListener("keydown", handleEscape)
            return() => window.removeEventListener("keydown", handleEscape)
        }
    }, [isModalOpen])

    const handleSubmit = async (e: React.FormEvent) =>{
        e.preventDefault()

        if(!instanceName.trim()){
            setError("Please enter the instance name")
            return
        }

        setError("")
        setIsLoading(true)

        try{
            await new Promise((resolve) => setTimeout(resolve, 1500))

            const newInstanceData: NewInstanceData ={
                name: instanceName.trim()
            }

            addInstance(newInstanceData)
            showSuccessNotification(`Instance created successfully!`)
            resetAndClose()
        } catch(error){
            setError("Error!")
        }finally{
            setIsLoading(false)
        }
    }

    const resetAndClose = () =>{
        setInstanceName("")
        setError("")
        closeModal()
    }

    
}