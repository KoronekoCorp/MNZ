import { Check } from "@/Data/Turnstile"
import { UseDB } from "@/Data/UseDB"
import { revalidateTag } from "next/cache"

export async function GET(request: Request) {
    return Response.json({ code: 200 }, {
        headers: {
            "Vercel-CDN-Cache-Control": "public, max-age=2592000, immutable",
            "CDN-Cache-Control": "public, max-age=2592000, immutable",
            "Cache-Control": "public, max-age=2592000, immutable",
        }
    })
}

export async function POST(request: Request, props: { params: Promise<{ bookid: string }> }) {
    const params = await props.params;

    const {
        bookid
    } = params;

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