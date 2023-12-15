import { lyric } from "@/Music/NeteaseMusic"

// export const runtime = 'edge' // 'nodejs' is the default

export async function GET(request: Request, { params: { id } }: { params: { id: string } }) {
    const d = await lyric(parseInt(id))
    
    if (d.code === 200) {
        return new Response((d.lrc?.lyric ?? "") + (d.tlyric?.lyric ?? ""), {
            status: 200
        })
    }
    return new Response("", { status: 500 })
}