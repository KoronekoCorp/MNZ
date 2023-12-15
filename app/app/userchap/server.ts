"use server"

import { UseAPI } from "@/Data/Use"

export async function Bookinfo(bookid: number) {
    const a = await UseAPI()
    return a.bookinfo(bookid)
} 