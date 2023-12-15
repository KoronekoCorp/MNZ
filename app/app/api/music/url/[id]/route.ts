import { SongURL } from "@/Music/NeteaseMusic"
import { SongUrl } from "@/Music/NeteaseType"

// export const runtime = 'edge' // 'nodejs' is the default

export async function GET(request: Request, { params: { id } }: { params: { id: string } }) {
    const _backup = new Promise((r) => {
        fetch(`https://netease-cloud-music-api-psi-woad.vercel.app/song/url?id=${id}`)
            .then((d) => r(d.json()))
    }) as Promise<SongUrl>

    const d = await SongURL(parseInt(id))

    if (d.code === 200) {
        return new Response("", {
            headers: {
                "location": d.data[0].url
            },
            status: 302
        })
    }
    
    const backup = await _backup
    if (backup.code === 200 && backup.data[0].url != null) {
        return new Response("", {
            headers: {
                "location": backup.data[0].url
            },
            status: 302
        })
    }

    return new Response("", {
        status: 500
    })
}