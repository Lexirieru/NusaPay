//data penerima

export interface Recipient{
    id: string
    name: string
    bank: string //nama bank
    account: string //no rekening
    amount: number// jumlah tf
    currency: string //mata uang (IDR, USD, dll)
}

