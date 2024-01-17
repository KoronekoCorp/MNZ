
export async function GET() {
    return Response.json({ "buildid": process.env.BUILD_ID })
}