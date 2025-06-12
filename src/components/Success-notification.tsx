"use client"

import { useEffect } from "react"
import React from "react"
interface SuccessNotificationProps{
    message: string
    show: boolean
    onClose: ()=>void
}
const SuccessNotification: React.FC<SuccessNotificationProps> = ({
    message, show, onClose
}) => {

    useEffect(() =>{
        if(show){
            const timer = setTimeout(() =>{
                onClose();
            }, 3000)
            return() =>{
                clearTimeout(timer)
            }

        }
    }, [show, onClose])
    if(!show){
        return null
    }

    return(
        <div 
            className="fixed top-20 right-4 z-50 flex items-center space-x-3 rounded-xl bg-green-500 px-6 py-3 text-white shadow-lg animate-fade-in-down"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
            >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>{message}</span>
        </div>
    )
}

export default SuccessNotification