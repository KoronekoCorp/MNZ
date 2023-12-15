import { NextResponse } from 'next/server'
import { API } from '@/Data/Ciweimao'
import { unstable_cache } from 'next/cache'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
    cookies()
    const a = new API()
    var r = await unstable_cache(async () => a.auto_reg(),
        ["auto_reg_v2"], { revalidate: 3600, tags: ["auto_reg_v2"] })()
    return NextResponse.json(r)
}