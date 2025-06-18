import { UseAPI } from "@/Data/Use";

export async function GET(request: Request) {
    const url = new URL(request.url);

    const a = await UseAPI()
    const u = a.URL(`/bookcity/get_filter_search_book_list${url.search}`)
    const data = await a.post(u, [url.search])
    return Response.json(JSON.parse(data), {
        headers: {
            // "Vercel-CDN-Cache-Control": "public, max-age=604800, immutable",
            // "CDN-Cache-Control": "public, max-age=604800, immutable",
            // "Cache-Control": "public, max-age=3600, immutable"
        }
    })
}