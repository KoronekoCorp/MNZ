import { Check } from "@/Data/Turnstile"
import { UseDB } from "@/Data/UseDB"
import { revalidateTag } from "next/cache"

export async function POST(request: Request, { params: { bookid } }: { params: { bookid: string } }) {
    try {
        const token = await request.text()
        const r = await Check(token)
        console.log(bookid, token, r)
        if (r.success) {
            const [db, db_n] = UseDB()
            revalidateTag(`${db_n}_UserchapInfo_${bookid}`)
            revalidateTag(`bookinfo_${bookid}`)
            revalidateTag(`${db_n}_Catalog_${bookid}`)
            revalidateTag(`catalog_${bookid}`)
            return Response.json({ code: 200 })
        } else {
            return Response.json({ code: 401 })
        }
    } catch {
        return Response.json({ code: 500 })
    }
}