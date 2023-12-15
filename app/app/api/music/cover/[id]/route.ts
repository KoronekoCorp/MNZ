import { SongInfo } from "@/Music/NeteaseMusic"

// export const runtime = 'edge' // 'nodejs' is the default

export async function GET(request: Request, { params: { id } }: { params: { id: string } }) {
    const d = await SongInfo(parseInt(id))

    if (d.code === 200) {
        return fetch(d.songs[0].al.picUrl)
        // return new Response("", {
        //     headers: {
        //         "location": d.songs[0].al.picUrl
        //     },
        //     status: 302
        // })
    }
    return new Response("", { status: 500 })
}