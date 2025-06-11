import { GetOauth } from '@/Data/JWE'
import { tos3 } from '@/Data/S3'
import { UseAPI } from '@/Data/Use'
import { UseRedis } from '@/Security/Redis'
import { unstable_cache } from 'next/cache'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request, props: { params: Promise<{ chapid: string }> }) {
    const params = await props.params;
    const cookie = await cookies()
    const a = await UseAPI()
    if (a.is_login === false) {
        return NextResponse.json({ "success": false })
    }
    const shareUser = cookie.get("shareUser")?.value ?? "Anonymous"
    const d = await a.chapter_new(params.chapid)

    if (d.code !== "100000") {
        return NextResponse.json({ "success": false })
    }
    try {
        if (d.data.chapter_info.auth_access === "1" && d.data.chapter_info.is_paid === "1") {
            const now = (Date.now() / 1000) | 0
            await unstable_cache(async () => tos3.upload(`${d.data.chapter_info.book_id}/${params.chapid}.json`, JSON.stringify({
                "chapter_index": d.data.chapter_info.chapter_index,
                "book_id": d.data.chapter_info.book_id,
                "chapter_id": d.data.chapter_info.chapter_id,
                "title": d.data.chapter_info.chapter_title,
                "author_name": shareUser,
                "stime": now,
                "mode": "vip",
                "txt": d.data.chapter_info.txt_content
            })), [`upload_${a.account}_${params.chapid}`], { revalidate: 3600 * 24 * 30, tags: [`upload_${a.account}_${params.chapid}`] })()

            await unstable_cache(async () => fetch("https://capi.koroneko.co/Upload", {
                method: "POST",
                headers: {
                    "api-upload-key": process.env.API_UPLOAD_KEY
                },
                body: JSON.stringify({
                    book_id: d.data.chapter_info.book_id,
                    chapter_id: d.data.chapter_info.chapter_id,
                    title: d.data.chapter_info.chapter_title.split("#")[0],
                    author_name: shareUser,
                    stime: now
                })
            }), [`upload_${a.account}_${params.chapid}_db`], { revalidate: 3600 * 24 * 30, tags: [`upload_${a.account}_${params.chapid}_db`] })()


            const oauth = await GetOauth<{ provider: string, accessToken: string, email: string }>()
            if (oauth) {
                await unstable_cache(async () => {
                    const rs = await UseRedis()
                    const fin = await rs.sendCommand(["FCALL", "OauthV1upload", "0", oauth.email]) as number
                    return fin
                }, [`upload_${a.account}_${params.chapid}_counts`], { revalidate: 3600 * 24 * 30, tags: [`upload_${a.account}_${params.chapid}__counts`] })()
            }
            return NextResponse.json({ "success": true }, {
                headers: {
                    "Vercel-CDN-Cache-Control": "public, max-age=2592000, immutable",
                    "CDN-Cache-Control": "public, max-age=2592000, immutable",
                    "Cache-Control": "public, max-age=2592000, immutable",
                }
            })
        }
    } catch {
        return NextResponse.json({ "success": false })
    }

    return NextResponse.json({ "success": false })
}