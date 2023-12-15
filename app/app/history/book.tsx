"use server";
import { UseAPI } from "@/Data/Use";
import { bookinfo } from "@/Data/CiweiType";

export interface Bookinfos {
    [ID: string | number]: bookinfo
}

export async function books(ids: string[], bookinfo: Bookinfos) {
    const a = await UseAPI()
    const fin = bookinfo
    for (let i = 0; i < ids.length; ++i) {
        const r = await a.bookinfo(ids[i])
        fin[r.data.book_info.book_id] = r
    }
    return fin
}