import { SongInfo } from "@/Music/NeteaseMusic"

// export const runtime = 'edge' // 'nodejs' is the default

export async function GET(request: Request, { params: { id } }: { params: { id: string } }) {
    return Response.json(await SongInfo(parseInt(id)))
}