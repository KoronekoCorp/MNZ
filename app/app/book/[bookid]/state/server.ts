"use server"

import { UseAPI } from "@/Data/Use"

export async function getchap(chapid: number) {
    const a = await UseAPI()
    return a.chapter_new(chapid)
}