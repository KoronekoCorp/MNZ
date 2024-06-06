"use server"

import { UseAPI } from "@/Data/Use"

export async function BookServer(id: string | number) {
    const a = await UseAPI()
    return a.bookinfo(id)
}