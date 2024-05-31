
export async function GET(request: Request) {
    return Response.json({ code: 404 }, {
        headers: {
            "Vercel-CDN-Cache-Control": "public, max-age=2592000, immutable",
            "CDN-Cache-Control": "public, max-age=2592000, immutable",
            "Cache-Control": "public, max-age=2592000, immutable",
        }
    })
}

export async function POST(request: Request) {
    return Response.json({ code: 404 })
}
