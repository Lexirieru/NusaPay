export interface Instance{
    id: number
    name: string
    description: string
    status: string
    statusColor: string
    dateCreated: string
}

export interface NewInstanceData{
    name: string
}