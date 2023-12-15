import { Un } from '@/Data/Storge'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const key = new URL(request.url).searchParams.get("key")

    if (key) {
        const r = await Un.get(key)
        return new Response(r)
    }
    return NextResponse.json({ 'error': 'missing Sync-key or Sync id' })
}

export async function POST(request: Request) {
    const key = new URL(request.url).searchParams.get("key")

    if (key) {
        const d = await request.text()
        await Un.set(key, d)
        return NextResponse.json({ 'error': false })
    }
    return NextResponse.json({ 'error': 'missing Sync-key or Sync id' })
}