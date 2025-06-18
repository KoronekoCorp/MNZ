import { UseAPI } from "@/Data/Use";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const book_id = url.searchParams.get("book_id");
    if (!book_id) {
        return Response.json({ error: "book_id is required" }, { status: 400 });
    }

    const a = await UseAPI()
    const data = await a.bookinfo(book_id)
    return Response.json(data, {
        headers: {
            "Vercel-CDN-Cache-Control": "public, max-age=604800, immutable",
            "CDN-Cache-Control": "public, max-age=604800, immutable",
            "Cache-Control": "public, max-age=604800, immutable"
        }
    })
}