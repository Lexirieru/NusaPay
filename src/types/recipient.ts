//data penerima

export interface Recipient{
    id: string
    name: string
    bank: string //nama bank
    account: string //no rekening
    amount: number// jumlah tf pengirim
    currency: string //wallet si pengirim 
    localCurrency: string //wallet penerima
}
