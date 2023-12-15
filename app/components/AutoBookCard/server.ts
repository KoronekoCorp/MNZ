"use server"

import { UseDB } from "@/Data/UseDB"
import { unstable_cache } from "next/cache"

export async function bookChap(bookid: string) {
    const [db, db_n] = UseDB()
    return unstable_cache(async () => db.UserchapInfo(bookid),
        [`UserchapInfo_${bookid}`], { revalidate: 86400, tags: [`UserchapInfo_${bookid}`] })()
}