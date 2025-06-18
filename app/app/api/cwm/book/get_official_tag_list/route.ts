import { UseAPI } from "@/Data/Use";

export async function GET(request: Request) {
    const a = await UseAPI()
    const data = await a.post(a.URL("/book/get_official_tag_list"), ["official_tag_list"])
    return Response.json(JSON.parse(data), {
        headers: {
            "Vercel-CDN-Cache-Control": "public, max-age=604800, immutable",
            "CDN-Cache-Control": "public, max-age=604800, immutable",
            "Cache-Control": "public, max-age=604800, immutable"
        }
    })
}