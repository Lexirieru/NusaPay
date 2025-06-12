"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { Instance, NewInstanceData } from "@/types/instance"

interface InstanceContextType {
  instances: Instance[]
  addInstance: (data: NewInstanceData) => void
  removeInstance: (id: number) => void
  isModalOpen: boolean
  openModal: () => void
  closeModal: () => void
}

const InstanceContext = createContext<InstanceContextType | undefined>(undefined)

export function InstanceProvider({ children }: { children: ReactNode }) {
  const [instances, setInstances] = useState<Instance[]>([
    {
      id: 1,
      name: "Instance Demo",
      description: "Ini contoh ya gusy",
      status: "Aktif",
      statusColor: "green",
      dateCreated: "2 days ago",
    },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)

  const addInstance = (data: NewInstanceData) => {
    const newInstance: Instance = {
      id: Date.now(),
      name: data.name,
      description: `Instance baru dibuat`,
      status: "Aktif",
      statusColor: "green",
      dateCreated: "Baru saja",
    }

    setInstances((prev) => [newInstance, ...prev])
  }

  const removeInstance = (id: number) => {
    setInstances((prev) => prev.filter((instance) => instance.id !== id))
  }

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <InstanceContext.Provider
      value={{
        instances,
        addInstance,
        removeInstance,
        isModalOpen,
        openModal,
        closeModal,
      }}
    >
      {children}
    </InstanceContext.Provider>
  )
}

export function useInstance() {
  const context = useContext(InstanceContext)
  if (context === undefined) {
    throw new Error("useInstance must be used within an InstanceProvider")
  }
  return context
}
