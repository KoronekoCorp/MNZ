import { NextResponse } from 'next/server'
import { API } from '@/Data/Ciweimao'
import { cookies } from 'next/headers'
import { stable as db } from '@/Data/UseDB'
import { unstable_cache } from 'next/cache'

export async function GET(request: Request, { params }: { params: { chapid: string } }) {
    const cookie = cookies()
    const ci_login_token = cookie.get("ci_login_token")
    const ci_account = cookie.get("ci_account")
    const shareUser = cookie.get("shareUser")?.value ?? "Anonymous"
    if (ci_login_token == undefined || ci_account == undefined) {
        return NextResponse.json({ "success": false })
    }
    const a = new API(ci_login_token.value, ci_account?.value)
    const b = await a.chaper(params.chapid)

    if (b.data.chapter_info.auth_access == "1") {
        const d = await unstable_cache(() => db.uploadchap(b, shareUser),
            [`db_uploadchap_${ci_login_token}_${params.chapid}`], { revalidate: 2592000, tags: [`db_uploadchap_${ci_login_token}_${params.chapid}`] }
        )()

        if (d.ok && d.result) {
            await unstable_cache(() => db.addChap(d, b, shareUser),
                [`db_addChap_${ci_login_token}_${params.chapid}`], { revalidate: 2592000, tags: [`db_addChap_${ci_login_token}_${params.chapid}`] }
            )()
            return NextResponse.json({ "success": true })
        }
    }

    return NextResponse.json({ "success": false })
}