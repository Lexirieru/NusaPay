"use client"
import DropdownItem from "./Dropdown"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

export default function DashboardHeader(){
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const handleHeaderClick = () =>{
        setIsDropdownOpen(!isDropdownOpen)
    }
    return(
        <div className="flex items-center justify-between mb-8 relative">
            <button 
                onClick={handleHeaderClick}
                className="flex items-center space-x-3 hover:bg-gray-800/30 p-3 rounded-xl transition-all duration-300 group">
                    <h1 
                        className="text-3xl font-black bg-gradient-to-r
                         from-white to-gray-300 bg-clip-text 
                         text-transparent group-hover:from-cyan-400 group-hover:to-blue-400 
                         transition-all duration-300">
                        Template 1
                    </h1>
                    <div
                        className={`bg-white rounded-full transition-transform duration-300 ${isDropdownOpen? "rotate-180": ""}`}>
                            <ChevronDown className={`w-4 h-4 m-1 text-black group-hover:text-cyan-400 transition-colors duration-300`} />
                    </div>
            </button>

            {/* Pilihan Dropdown / Instansinya apa aja*/}
            {isDropdownOpen && (
    <div 
        className="
          /* --- Positioning & Sizing --- */
          absolute top-full left-1/2 -translate-x-1/2 mt-2 z-10 min-w-full 

          /* --- Background & Effects --- */
          bg-neutral-800/70 backdrop-blur-sm rounded-xl shadow-2xl

          /* --- Corner Border Kiri Atas (::before) --- */
          before:absolute before:content-[''] 
          before:top-0 before:left-0 
          before:w-1/2 before:h-1/2 
          before:border-t before:border-l before:border-neutral-500/50
          before:rounded-tl-xl
          before:pointer-events-none

          /* --- Corner Border Kanan Bawah (::after) --- */
          after:absolute after:content-[''] 
          after:bottom-0 after:right-0 
          after:w-1/2 after:h-1/2 
          after:border-b after:border-r after:border-neutral-500/50
          after:rounded-br-xl
          after:pointer-events-none
        "
    >
        <div className="p-2">
            <DropdownItem text="Template 1" isActive/>
            
            {/* Garis Pemisah */}
            <div className="h-[1px] my-2 w-full bg-gradient-to-r from-transparent via-neutral-600 to-transparent"></div>
            
            <DropdownItem text="Template 2" />
            
            
            <div className="h-[1px] my-2 w-full bg-gradient-to-r from-transparent via-neutral-600 to-transparent"></div>
            
            <DropdownItem text="Template 3" />
            
            
            <div className="h-[1px] my-2 w-full bg-gradient-to-r from-transparent via-neutral-600 to-transparent"></div>
            
            <DropdownItem text="Add new template"/>
        </div>
    </div>
)}
        
        </div>
    )
}

